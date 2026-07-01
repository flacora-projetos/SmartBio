import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PublishChecklist } from '@/components/dashboard/PublishChecklist';
import { PublishApprovalPanel } from '@/components/dashboard/PublishApprovalPanel';
import { PreviewSummary } from '@/components/dashboard/PreviewSummary';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Lock, ExternalLink, Info, Smartphone, RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { publishWorkspaceSmartBio, readWorkspaceState, type WorkspaceState } from '@/lib/smartbio-flow';

// ── Iframe live preview ───────────────────────────────────────────────────────

function PhoneIframe({ slug }: { slug: string }) {
  const [key, setKey] = useState(0);
  const src = `/s/${slug}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Smartphone className="w-3.5 h-3.5" />
        <span>Pré-visualização ao vivo</span>
        <button
          type="button"
          onClick={() => setKey(k => k + 1)}
          className="ml-1 hover:text-ink transition-colors"
          title="Recarregar preview"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="w-[300px] h-[600px] bg-background rounded-[3rem] border-[10px] border-ink shadow-2xl overflow-hidden relative">
        <div className="h-6 w-1/3 bg-ink absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20 pointer-events-none" />
        <iframe
          key={key}
          src={src}
          className="w-full h-full border-0"
          title="Preview da SmartBio ao vivo"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
        />
        <div className="h-1 w-20 bg-border/60 absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full z-20 pointer-events-none" />
      </div>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
      >
        <ExternalLink className="w-3 h-3" />
        Abrir página completa
      </a>
    </div>
  );
}

// ── Non-published placeholder ─────────────────────────────────────────────────

function PreviewPlaceholder({ workspace }: { workspace: WorkspaceState }) {
  const { smartbio, previewData } = workspace;
  const initials = smartbio.title.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();
  const avatarUrl = previewData.avatarUrl;
  const hasSocialLinks = Object.keys(previewData.socialLinks).length > 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Smartphone className="w-3.5 h-3.5" />
        <span>Pré-visualização</span>
      </div>
      <div className="w-[300px] h-[600px] bg-background rounded-[3rem] border-[10px] border-ink shadow-2xl overflow-hidden relative flex flex-col">
        <div className="h-6 w-1/3 bg-ink absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20" />

        {/* Header */}
        <div className="w-full pt-12 pb-4 px-5 flex flex-col items-center bg-surface border-b border-border shrink-0">
          <div className="w-14 h-14 rounded-full bg-primary/10 border-4 border-background overflow-hidden mb-3 flex items-center justify-center shadow-sm shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={smartbio.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold font-heading text-primary">{initials}</span>
            )}
          </div>
          <h3 className="text-sm font-heading font-bold text-ink text-center leading-tight mb-1">
            {smartbio.title}
          </h3>
          {smartbio.short_bio && (
            <p className="text-[10px] text-muted-foreground text-center line-clamp-2 leading-relaxed">
              {smartbio.short_bio}
            </p>
          )}
          {hasSocialLinks && (
            <div className="flex gap-1.5 mt-2 flex-wrap justify-center">
              {Object.keys(previewData.socialLinks).slice(0, 4).map((k: string) => (
                <div key={k} className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-primary uppercase">{k.slice(0, 2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">
              Diagnóstico inteligente
            </p>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Suas perguntas de quiz aparecerão aqui para qualificar o visitante.
            </p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-success mb-2">
              Suas ofertas
            </p>
            <p className="text-[11px] text-muted-foreground leading-snug">
              As ofertas ativas aparecerão aqui como cards de recomendação.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="py-2 border-t border-border flex justify-center shrink-0">
          <span className="text-[8px] text-muted-foreground uppercase tracking-widest">Criado com SmartBio</span>
        </div>
        <div className="h-1 w-20 bg-border absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full" />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

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
        if (isMounted) setErrorMessage('Não foi possível carregar o preview desta SmartBio.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadWorkspace();
    return () => { isMounted = false; };
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
      setErrorMessage('Não foi possível publicar agora. Tente novamente em instantes.');
    }
  };

  const handleCopyLink = () => {
    if (!workspace?.publicUrl) return;
    navigator.clipboard.writeText(workspace.publicUrl);
  };

  const checklist = [
    { id: 'identity', label: 'Identidade revisada',               isComplete: Boolean(workspace?.readiness.hasIdentity) },
    { id: 'offers',   label: 'Ofertas estruturadas',              isComplete: Boolean(workspace?.readiness.hasOffers) },
    { id: 'quiz',     label: 'Quiz configurado',                  isComplete: Boolean(workspace?.readiness.hasQuiz) },
    { id: 'rules',    label: 'Regras de recomendação conectadas', isComplete: Boolean(workspace?.readiness.hasRules) },
    { id: 'preview',  label: 'Preview gerado pelo fluxo guiado', isComplete: Boolean(workspace?.readiness.hasPreview) },
  ];

  const socialLinks = workspace?.smartbio?.social_links ?? {};
  const hasSocialNetworks = Object.keys(socialLinks).some(k => k !== 'whatsapp');
  const isPublished = publishStatus === 'published';

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="bg-surface border border-border rounded-2xl p-6 text-sm text-muted-foreground">
          Carregando preview da SmartBio...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-[calc(100vh-8rem)]">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-heading font-bold text-ink">Preview e aprovação</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                publishStatus === 'published'  ? 'bg-success/20 text-success' :
                publishStatus === 'publishing' ? 'bg-primary/20 text-primary' :
                'bg-surface border border-border text-muted-foreground'
              }`}>
                {publishStatus === 'published'  ? 'Publicada' :
                 publishStatus === 'publishing' ? 'Publicando...' :
                 'Aguardando aprovação'}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {isPublished
                ? 'O preview abaixo é ao vivo — exatamente o que seus visitantes estão vendo agora.'
                : 'Complete o onboarding e tenha ao menos uma oferta, pergunta e regra para aprovar.'}
            </p>
            {errorMessage && <p className="text-sm text-destructive mt-2">{errorMessage}</p>}
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/app/onboarding')}
            className="rounded-xl hidden sm:flex"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isPublished ? 'Editar onboarding' : 'Voltar para editar'}
          </Button>
        </div>

        {/* Alerta: aprovação bloqueada */}
        {!workspace?.readiness.canApprove && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-5 text-sm text-ink flex items-start gap-3 mb-5">
            <Lock className="w-5 h-5 mt-0.5 text-warning shrink-0" />
            <div>
              <p className="font-bold">Aprovação ainda não disponível</p>
              <p className="text-muted-foreground mt-1">
                Complete o onboarding, tenha pelo menos uma oferta ativa, uma pergunta de diagnóstico e uma regra de recomendação.
              </p>
            </div>
          </div>
        )}

        {/* Alerta: redes sociais ausentes */}
        {isPublished && !hasSocialNetworks && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-sm flex items-start gap-3 mb-5">
            <Info className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            <div>
              <p className="font-semibold text-ink">Redes sociais não aparecem na SmartBio</p>
              <p className="text-muted-foreground mt-0.5">
                Instagram, TikTok, YouTube e site não estão salvos no banco.{' '}
                <button
                  type="button"
                  onClick={() => navigate('/app/onboarding')}
                  className="text-primary underline"
                >
                  Acesse o Onboarding Guiado
                </button>
                , preencha seus perfis sociais no passo Identidade e clique em "Gerar preview" para atualizar.
              </p>
            </div>
          </div>
        )}

        {/* Layout principal */}
        <div className="flex-1 flex flex-col xl:flex-row gap-6 mb-6">

          {/* Painel de preview */}
          <div className="xl:flex-1 bg-surface border border-border rounded-2xl shadow-sm flex flex-col items-center justify-center py-10 px-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-surface to-background/50 pointer-events-none" />
            <div className="relative z-10 transform scale-[0.9] sm:scale-100 origin-top">
              {isPublished && workspace?.smartbio?.slug ? (
                <PhoneIframe slug={workspace.smartbio.slug} />
              ) : workspace ? (
                <PreviewPlaceholder workspace={workspace} />
              ) : null}
            </div>
          </div>

          {/* Painel direito */}
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
          <Button
            variant="outline"
            onClick={() => navigate('/app/onboarding')}
            className="w-full rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para editar
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
