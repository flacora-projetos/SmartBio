import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SmartBioPreviewMock } from '@/components/dashboard/SmartBioPreviewMock';
import { PublishChecklist } from '@/components/dashboard/PublishChecklist';
import { PublishApprovalPanel } from '@/components/dashboard/PublishApprovalPanel';
import { PreviewSummary } from '@/components/dashboard/PreviewSummary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { publishWorkspaceSmartBio, readWorkspaceState, type WorkspaceState } from '@/lib/smartbio-flow';

export function Preview() {
  const navigate = useNavigate();
  const { tenant } = useAuth();
  const [workspace, setWorkspace] = useState<WorkspaceState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<'pending' | 'publishing' | 'published'>('pending');

  useEffect(() => {
    let isMounted = true;

    async function loadWorkspace() {
      if (!tenant) return;

      try {
        setIsLoading(true);
        setErrorMessage(null);
        const nextWorkspace = await readWorkspaceState(tenant);
        if (!isMounted) return;
        setWorkspace(nextWorkspace);
        setPublishStatus(nextWorkspace.status === 'published' ? 'published' : 'pending');
      } catch (error) {
        console.error(error);
        if (isMounted) setErrorMessage('Nao foi possivel carregar o preview desta SmartBio.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadWorkspace();

    return () => {
      isMounted = false;
    };
  }, [tenant]);

  const handleApprove = async () => {
    if (!workspace?.readiness.canApprove || !tenant) return;

    setPublishStatus('publishing');
    try {
      await publishWorkspaceSmartBio(workspace.smartbio.id);
      const nextWorkspace = await readWorkspaceState(tenant);
      setWorkspace(nextWorkspace);
      setPublishStatus('published');
    } catch (error) {
      console.error(error);
      setPublishStatus('pending');
      setErrorMessage('Nao foi possivel publicar agora. Tente novamente em instantes.');
    }
  };

  const handleCopyLink = () => {
    if (!workspace?.publicUrl) return;
    navigator.clipboard.writeText(workspace.publicUrl);
  };

  const checklist = [
    { id: 'identity', label: 'Identidade revisada', isComplete: Boolean(workspace?.readiness.hasIdentity) },
    { id: 'offers', label: 'Ofertas estruturadas', isComplete: Boolean(workspace?.readiness.hasOffers) },
    { id: 'quiz', label: 'Quiz configurado', isComplete: Boolean(workspace?.readiness.hasQuiz) },
    { id: 'rules', label: 'Regras de recomendacao conectadas', isComplete: Boolean(workspace?.readiness.hasRules) },
    { id: 'preview', label: 'Preview gerado pelo fluxo guiado', isComplete: Boolean(workspace?.readiness.hasPreview) },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="bg-surface border border-border rounded-2xl p-6 text-sm text-muted-foreground">
          Carregando preview real da SmartBio...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-heading font-bold text-ink">Preview e aprovacao</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                publishStatus === 'published' ? 'bg-success/20 text-success' :
                publishStatus === 'publishing' ? 'bg-primary/20 text-primary' :
                'bg-surface border border-border text-muted-foreground'
              }`}>
                {publishStatus === 'published' ? 'Publicada' : publishStatus === 'publishing' ? 'Publicando...' : 'Aguardando aprovacao'}
              </span>
            </div>
            <p className="text-muted-foreground">Revise a SmartBio gerada. A publicacao so fica disponivel quando o fluxo real estiver completo.</p>
            {errorMessage && <p className="text-sm text-destructive mt-2">{errorMessage}</p>}
          </div>
          <Button variant="outline" onClick={() => navigate('/app/onboarding')} className="rounded-xl hidden sm:flex">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para editar
          </Button>
        </div>

        {!workspace?.readiness.canApprove && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-5 text-sm text-ink flex items-start gap-3 mb-6">
            <Lock className="w-5 h-5 mt-0.5 text-warning-foreground shrink-0" />
            <div>
              <p className="font-bold">Preview ainda nao esta pronto para aprovacao.</p>
              <p className="text-muted-foreground mt-1">
                Complete o onboarding, tenha pelo menos uma oferta ativa, uma pergunta de diagnostico e uma regra de recomendacao antes de publicar.
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col xl:flex-row gap-6 mb-6">
          <div className="xl:flex-1 bg-surface border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center py-10 px-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-surface to-background/50 pointer-events-none" />
            <div className="relative z-10">
              <div className="transform scale-[0.9] sm:scale-100 origin-top">
                <SmartBioPreviewMock data={workspace?.previewData} />
              </div>
            </div>
          </div>

          <div className="xl:w-[400px] flex flex-col gap-6 shrink-0">
            <PublishApprovalPanel
              status={publishStatus}
              publicUrl={workspace?.publicUrl ?? ''}
              onApprove={handleApprove}
              onCopyLink={handleCopyLink}
              onOpenLink={() => workspace && navigate(`/s/${workspace.smartbio.slug}`)}
              canApprove={Boolean(workspace?.readiness.canApprove)}
            />

            <PublishChecklist items={checklist} />
          </div>
        </div>

        <PreviewSummary
          questionsCount={workspace?.counts.questions ?? 0}
          rulesCount={workspace?.counts.rules ?? 0}
          offersCount={workspace?.counts.offers ?? 0}
        />

        <div className="mt-6 sm:hidden">
          <Button variant="outline" onClick={() => navigate('/app/onboarding')} className="w-full rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para editar
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
