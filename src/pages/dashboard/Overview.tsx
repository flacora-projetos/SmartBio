import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SmartBioPreviewMock } from '@/components/dashboard/SmartBioPreviewMock';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  Pencil,
  Sparkles,
  Users,
  BarChart2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { readWorkspaceState, type WorkspaceState } from '@/lib/smartbio-flow';
import type { SmartBioStatus } from '@/types';

type Metrics = {
  pageViews: number;
  quizStarts: number;
  quizCompletes: number;
  ctaClicks: number;
  leads: number;
};

async function fetchMetrics(smartbioId: string): Promise<Metrics> {
  const countEvents = (eventType: string) =>
    supabase
      .from('analytics_events')
      .select('id', { count: 'exact', head: true })
      .eq('smartbio_id', smartbioId)
      .eq('event_type', eventType);

  const [views, starts, completes, clicks, leads] = await Promise.all([
    countEvents('page_view'),
    countEvents('quiz_start'),
    countEvents('quiz_complete'),
    countEvents('cta_click'),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('smartbio_id', smartbioId),
  ]);

  return {
    pageViews: views.count ?? 0,
    quizStarts: starts.count ?? 0,
    quizCompletes: completes.count ?? 0,
    ctaClicks: clicks.count ?? 0,
    leads: leads.count ?? 0,
  };
}

export function Overview() {
  const { tenant } = useAuth();
  const [workspace, setWorkspace] = useState<WorkspaceState | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

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

        if (nextWorkspace.smartbio.status === 'published') {
          const nextMetrics = await fetchMetrics(nextWorkspace.smartbio.id);
          if (isMounted) setMetrics(nextMetrics);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) setErrorMessage('Não foi possível carregar o progresso da sua página.');
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
  const isPublished = workspace?.smartbio.status === 'published';

  const handleCopyLink = () => {
    if (!workspace?.publicUrl) return;
    navigator.clipboard.writeText(workspace.publicUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  // Jornada resumida — 4 passos que o usuário entende
  const journeySteps = useMemo(() => {
    const readiness = workspace?.readiness;
    const hasContent = Boolean(readiness?.hasIdentity && readiness?.hasOffers && readiness?.hasQuiz);
    return [
      {
        title: 'Responder as perguntas',
        desc: 'Você conta sobre seu negócio e a plataforma monta a página.',
        done: hasContent,
        current: !hasContent,
        to: '/app/onboarding',
      },
      {
        title: 'Ver como ficou',
        desc: 'Confira a página pronta antes de qualquer pessoa ver.',
        done: isPublished,
        current: hasContent && !isPublished,
        to: '/app/preview',
      },
      {
        title: 'Aprovar e publicar',
        desc: 'Um clique e sua página entra no ar.',
        done: isPublished,
        current: false,
        to: '/app/preview',
      },
      {
        title: 'Copiar o link para a bio',
        desc: 'Cole o link no seu Instagram e comece a receber contatos.',
        done: false,
        current: isPublished,
        to: '/app',
      },
    ];
  }, [workspace, isPublished]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm text-sm text-muted-foreground">
          Carregando sua página...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Visão geral</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isPublished
              ? 'Sua página está no ar. Acompanhe os resultados por aqui.'
              : 'Vamos colocar sua página no ar — falta pouco.'}
          </p>
          {errorMessage && <p className="text-destructive text-sm mt-2">{errorMessage}</p>}
        </div>

        {/* ── HERO: página publicada ── */}
        {isPublished && workspace && (
          <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-success/15 text-success">
                  <CheckCircle2 className="w-3.5 h-3.5" /> No ar
                </span>
              </div>
              <h2 className="text-xl font-heading font-bold text-ink mb-1">Sua página está publicada</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Este é o link para colocar na bio do seu Instagram:
              </p>

              <div className="flex flex-col sm:flex-row gap-2 mb-5">
                <div className="flex-1 bg-background border border-border px-4 py-3 rounded-xl text-sm text-ink truncate font-mono">
                  {workspace.publicUrl}
                </div>
                <Button
                  onClick={handleCopyLink}
                  className={`rounded-xl h-auto py-3 px-5 font-bold ${linkCopied ? 'bg-success text-white hover:bg-success' : 'bg-ink text-surface hover:bg-ink/90'}`}
                >
                  {linkCopied ? (<><Check className="w-4 h-4 mr-2" /> Copiado!</>) : (<><Copy className="w-4 h-4 mr-2" /> Copiar link</>)}
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to="/app/onboarding"
                  className={cn(buttonVariants({ variant: 'default' }), 'flex-1 bg-primary text-primary-foreground rounded-xl h-11 font-bold')}
                >
                  <Pencil className="w-4 h-4 mr-2" /> Editar minha página
                </Link>
                <a
                  href={workspace.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'outline' }), 'flex-1 rounded-xl h-11')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Ver como visitante
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── HERO: ainda criando ── */}
        {!isPublished && (
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-heading font-bold text-ink mb-1">
              {workspace?.readiness.canApprove
                ? 'Sua página está pronta para você revisar'
                : 'Crie sua página em poucos minutos'}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {workspace?.readiness.canApprove
                ? 'Veja como ficou e aprove para colocar no ar.'
                : 'Responda algumas perguntas simples e a plataforma monta tudo para você.'}
            </p>
            {workspace?.readiness.canApprove ? (
              <Link
                to="/app/preview"
                className={cn(buttonVariants({ variant: 'default' }), 'w-full sm:w-auto bg-primary text-primary-foreground rounded-xl h-12 px-8 font-bold text-base')}
              >
                <Eye className="w-4 h-4 mr-2" /> Ver e aprovar minha página
              </Link>
            ) : (
              <Link
                to="/app/onboarding"
                className={cn(buttonVariants({ variant: 'default' }), 'w-full sm:w-auto bg-primary text-primary-foreground rounded-xl h-12 px-8 font-bold text-base')}
              >
                <Sparkles className="w-4 h-4 mr-2" /> Começar a criar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* ── Métricas reais (só quando publicada) ── */}
            {isPublished && (
              <div>
                <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-3">Resultados da sua página</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Visitas', value: metrics?.pageViews ?? 0 },
                    { label: 'Começaram o quiz', value: metrics?.quizStarts ?? 0 },
                    { label: 'Terminaram o quiz', value: metrics?.quizCompletes ?? 0 },
                    { label: 'Cliques no botão', value: metrics?.ctaClicks ?? 0 },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-surface border border-border p-4 rounded-xl">
                      <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
                      <p className="text-2xl font-bold text-ink">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <Link to="/app/leads" className={cn(buttonVariants({ variant: 'outline' }), 'flex-1 rounded-xl text-xs')}>
                    <Users className="w-3.5 h-3.5 mr-2" /> Ver contatos recebidos ({metrics?.leads ?? 0})
                  </Link>
                  <Link to="/app/analytics" className={cn(buttonVariants({ variant: 'outline' }), 'flex-1 rounded-xl text-xs')}>
                    <BarChart2 className="w-3.5 h-3.5 mr-2" /> Ver relatório completo
                  </Link>
                </div>
              </div>
            )}

            {/* ── Jornada em 4 passos ── */}
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-ink mb-5">
                {isPublished ? 'Sua jornada' : 'Como funciona'}
              </h2>
              <div className="space-y-1">
                {journeySteps.map((step, index) => (
                  <Link
                    key={index}
                    to={step.to}
                    className={`flex items-start gap-4 p-3 rounded-xl transition-colors ${step.current ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 mt-0.5 ${
                      step.done ? 'bg-success/15 border-success text-success' :
                      step.current ? 'bg-primary border-primary text-primary-foreground' :
                      'bg-background border-border text-muted-foreground'
                    }`}>
                      {step.done ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold ${step.current ? 'text-primary' : step.done ? 'text-ink' : 'text-muted-foreground'}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                    {step.current && <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-2" />}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Coluna direita: preview ── */}
          <div className="space-y-6">
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Sua página</h2>
                {status === 'onboarding_pending' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    Exemplo
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {status === 'onboarding_pending'
                  ? 'Assim que você criar, sua página real aparece aqui.'
                  : 'É assim que os visitantes veem sua página.'}
              </p>

              <div className="relative mx-auto overflow-hidden rounded-2xl" style={{ maxWidth: '240px', height: '300px' }}>
                <div className="transform scale-[0.65] origin-top-left" style={{ width: '300px' }}>
                  <SmartBioPreviewMock data={workspace?.previewData ?? null} />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {isPublished ? (
                  <Link to="/app/onboarding" className={cn(buttonVariants({ variant: 'default' }), 'w-full bg-primary text-primary-foreground rounded-xl')}>
                    <Pencil className="w-4 h-4 mr-2" /> Editar minha página
                  </Link>
                ) : workspace?.readiness.canApprove ? (
                  <Link to="/app/preview" className={cn(buttonVariants({ variant: 'default' }), 'w-full bg-primary text-primary-foreground rounded-xl')}>
                    <Eye className="w-4 h-4 mr-2" /> Ver e aprovar
                  </Link>
                ) : (
                  <Link to="/app/onboarding" className={cn(buttonVariants({ variant: 'default' }), 'w-full bg-primary text-primary-foreground rounded-xl')}>
                    <Sparkles className="w-4 h-4 mr-2" /> Criar minha página
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
