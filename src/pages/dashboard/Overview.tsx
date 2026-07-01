import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { 
  mockDashboardMetrics,
  mockSubscription,
  dashboardData
} from '@/data/mock';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SmartBioPreviewMock } from '@/components/dashboard/SmartBioPreviewMock';
import { 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Copy, 
  ExternalLink,
  Eye,
  Lock,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { readWorkspaceState, type WorkspaceState } from '@/lib/smartbio-flow';
import type { SmartBioStatus } from '@/types';

export function Overview() {
  const { tenant } = useAuth();
  const [workspace, setWorkspace] = useState<WorkspaceState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWorkspace() {
      if (!tenant) return;

      try {
        setIsLoading(true);
        setErrorMessage(null);
        const nextWorkspace = await readWorkspaceState(tenant);
        if (isMounted) setWorkspace(nextWorkspace);
      } catch (error) {
        console.error(error);
        if (isMounted) setErrorMessage('Nao foi possivel carregar o progresso da SmartBio.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadWorkspace();

    return () => {
      isMounted = false;
    };
  }, [tenant]);

  const status: SmartBioStatus = workspace?.status ?? 'onboarding_pending';

  const creationFlowSteps = useMemo(() => {
    const readiness = workspace?.readiness;
    return [
      { step: 1, title: 'Conta criada', status: 'complete' },
      { step: 2, title: 'Onboarding Guiado', status: readiness?.hasIdentity ? 'complete' : 'current' },
      { step: 3, title: 'Ofertas estruturadas', status: readiness?.hasOffers ? 'complete' : readiness?.hasIdentity ? 'current' : 'pending' },
      { step: 4, title: 'Quiz configurado', status: readiness?.hasQuiz ? 'complete' : readiness?.hasOffers ? 'current' : 'pending' },
      { step: 5, title: 'Regras de recomendacao', status: readiness?.hasRules ? 'complete' : readiness?.hasQuiz ? 'current' : 'pending' },
      { step: 6, title: 'Preview gerado', status: readiness?.hasPreview ? 'complete' : readiness?.hasRules ? 'current' : 'pending' },
      { step: 7, title: 'Aprovacao do cliente', status: status === 'published' ? 'complete' : readiness?.canApprove ? 'current' : 'pending' },
      { step: 8, title: 'Publicacao automatica', status: status === 'published' ? 'complete' : 'pending' },
      { step: 9, title: 'Link pronto para copiar', status: status === 'published' ? 'complete' : 'pending' },
    ];
  }, [workspace, status]);

  const getStatusBadge = () => {
    switch(status) {
      case 'onboarding_pending':
      case 'draft':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground"><Circle className="w-4 h-4" /> {dashboardData.overview.statusCard.badges.onboarding_pending}</span>;
      case 'generating':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary"><Sparkles className="w-4 h-4" /> {dashboardData.overview.statusCard.badges.generating}</span>;
      case 'preview_pending_approval':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-warning/20 text-warning-foreground"><Eye className="w-4 h-4" /> {dashboardData.overview.statusCard.badges.preview_pending_approval}</span>;
      case 'published':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-success/20 text-success"><CheckCircle2 className="w-4 h-4" /> {dashboardData.overview.statusCard.badges.published}</span>;
    }
  };

  const getActionContent = () => {
    switch(status) {
      case 'onboarding_pending':
      case 'draft':
        return (
          <Link to="/app/onboarding" className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto bg-primary text-primary-foreground rounded-xl")}>
            {dashboardData.overview.statusCard.actions.continueOnboarding} <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        );
      case 'generating':
        return (
          <Button className="w-full sm:w-auto bg-primary text-primary-foreground rounded-xl" disabled>
            <Sparkles className="w-4 h-4 mr-2" /> {dashboardData.overview.statusCard.actions.generating}
          </Button>
        );
      case 'preview_pending_approval':
        return (
          <Link to="/app/preview" className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto bg-primary text-primary-foreground rounded-xl")}>
            <Eye className="w-4 h-4 mr-2" /> {dashboardData.overview.statusCard.actions.viewPreview}
          </Link>
        );
      case 'published':
        return (
          <Button className="w-full sm:w-auto bg-ink text-surface rounded-xl">
            <Copy className="w-4 h-4 mr-2" /> {dashboardData.overview.statusCard.actions.copyLink}
          </Button>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">{dashboardData.overview.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{dashboardData.overview.subtitle}</p>
          {errorMessage && <p className="text-destructive text-sm mt-2">{errorMessage}</p>}
        </div>

        {isLoading && (
          <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm text-sm text-muted-foreground">
            Carregando progresso real da sua SmartBio...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status & Next Action */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-ink mb-2">{dashboardData.overview.statusCard.title}</h2>
                  <p className="text-sm text-muted-foreground">{dashboardData.overview.statusCard.subtitle}</p>
                </div>
                <div>
                  {getStatusBadge()}
                </div>
              </div>
              <div className="pt-6 border-t border-border flex justify-end">
                {getActionContent()}
              </div>
            </div>

            {/* Creation Flow */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-ink mb-6">{dashboardData.overview.flowCard.title}</h2>
              <div className="space-y-4">
                {creationFlowSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        step.status === 'complete' ? 'bg-success/20 border-success text-success' :
                        step.status === 'current' ? 'bg-primary border-primary text-primary-foreground' :
                        'bg-background border-border text-muted-foreground'
                      }`}>
                        {step.status === 'complete' ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{step.step}</span>}
                      </div>
                      {index < creationFlowSteps.length - 1 && (
                        <div className={`w-0.5 h-6 my-1 ${step.status === 'complete' ? 'bg-success/40' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className={cn('flex-1', index < creationFlowSteps.length - 1 ? 'mb-7' : 'mb-0')}>
                      <p className={`font-medium ${
                        step.status === 'complete' ? 'text-ink' :
                        step.status === 'current' ? 'text-primary font-bold' :
                        'text-muted-foreground'
                      }`}>{step.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface border border-border p-4 rounded-xl">
                <p className="text-xs text-muted-foreground font-medium mb-1">{dashboardData.overview.metricsCard.views}</p>
                <p className="text-2xl font-bold text-ink">{mockDashboardMetrics.views}</p>
              </div>
              <div className="bg-surface border border-border p-4 rounded-xl">
                <p className="text-xs text-muted-foreground font-medium mb-1">{dashboardData.overview.metricsCard.diagnosticsStarted}</p>
                <p className="text-2xl font-bold text-ink">{mockDashboardMetrics.diagnosticsStarted}</p>
              </div>
              <div className="bg-surface border border-border p-4 rounded-xl">
                <p className="text-xs text-muted-foreground font-medium mb-1">{dashboardData.overview.metricsCard.diagnosticsCompleted}</p>
                <p className="text-2xl font-bold text-ink">{mockDashboardMetrics.diagnosticsCompleted}</p>
              </div>
              <div className="bg-surface border border-border p-4 rounded-xl">
                <p className="text-xs text-muted-foreground font-medium mb-1">{dashboardData.overview.metricsCard.ctaClicks}</p>
                <p className="text-2xl font-bold text-ink">{mockDashboardMetrics.ctaClicks}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Preview & Links */}
          <div className="space-y-6">
            {/* Public Link Card */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-sm font-bold text-ink mb-4 uppercase tracking-wider">{dashboardData.overview.publicLinkCard.title}</h2>
              {status === 'published' && workspace ? (
                <div className="space-y-3">
                  <div className="bg-background border border-border px-3 py-2 rounded-lg text-sm text-ink truncate font-mono">
                    {workspace.publicUrl}
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-ink text-surface hover:bg-ink/90 rounded-lg text-xs" size="sm">
                      <Copy className="w-3 h-3 mr-2" /> {dashboardData.overview.publicLinkCard.copy}
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-lg text-xs" size="sm">
                      <ExternalLink className="w-3 h-3 mr-2" /> {dashboardData.overview.publicLinkCard.open}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center bg-background border border-border border-dashed rounded-xl">
                  <Lock className="w-8 h-8 text-muted-foreground/50 mb-2" />
                  <p className="text-xs text-muted-foreground px-4">{dashboardData.overview.publicLinkCard.lockedText}</p>
                </div>
              )}
            </div>

            {/* Preview Card */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-bold text-ink uppercase tracking-wider">{dashboardData.overview.previewCard.title}</h2>
                {status === 'onboarding_pending' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    Exemplo
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {status === 'onboarding_pending'
                  ? 'Conclua o onboarding para ver seu preview real aqui.'
                  : dashboardData.overview.previewCard.subtitle}
              </p>

              {isLoading ? (
                <div className="h-[300px] bg-muted/40 rounded-2xl animate-pulse" />
              ) : (
                <div className="relative mx-auto overflow-hidden rounded-2xl" style={{ maxWidth: '240px', height: '300px' }}>
                  <div className="transform scale-[0.65] origin-top-left" style={{ width: '300px' }}>
                    <SmartBioPreviewMock data={workspace?.previewData ?? null} />
                  </div>
                  {status === 'onboarding_pending' && (
                    <div className="absolute inset-0 bg-background/60 rounded-2xl flex items-end justify-center pb-6 pointer-events-none">
                      <p className="text-xs font-medium text-muted-foreground text-center px-4">
                        Este é um exemplo de como sua SmartBio vai ficar
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 space-y-2 flex flex-col">
                {workspace?.readiness.canApprove ? (
                  <Link to="/app/preview" className={cn(buttonVariants({ variant: "default" }), "w-full bg-primary text-primary-foreground rounded-xl")}>
                    <Eye className="w-4 h-4 mr-2" /> {dashboardData.overview.previewCard.viewFull}
                  </Link>
                ) : (
                  <Link to="/app/onboarding" className={cn(buttonVariants({ variant: "default" }), "w-full bg-primary text-primary-foreground rounded-xl")}>
                    <Sparkles className="w-4 h-4 mr-2" /> Continuar onboarding
                  </Link>
                )}
                <Link to="/app/onboarding" className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl")}>
                  {dashboardData.overview.previewCard.continueConfig}
                </Link>
              </div>
            </div>

            {/* Current Plan */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-sm font-bold text-ink mb-4 uppercase tracking-wider">{dashboardData.overview.planCard.title}</h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-primary">{mockSubscription.planName}</span>
                <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full uppercase">{dashboardData.overview.planCard.active}</span>
              </div>
              <Button variant="outline" className="w-full rounded-xl text-xs">
                {dashboardData.overview.planCard.manage}
              </Button>
              <p className="text-[10px] text-muted-foreground text-center mt-2">{dashboardData.overview.planCard.stripeNote}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
