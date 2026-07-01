import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicSmartBioHeader } from '@/components/public/PublicSmartBioHeader';
import { QuizFlowMock } from '@/components/public/QuizFlowMock';
import { RecommendationResult } from '@/components/public/RecommendationResult';
import {
  fetchPublicSmartBio,
  findMatchingRule,
  buildCtaUrl,
  trackEvent,
  insertLead,
  type PublicPageData,
  type PublicOffer,
  type PublicRule,
} from '@/lib/public-smartbio';

type PageState = 'loading' | 'not_found' | 'paused' | 'start' | 'quiz' | 'result';

export function SmartBioPage() {
  const { slug } = useParams<{ slug: string }>();
  const [pageState, setPageState] = useState<PageState>('loading');
  const [pageData, setPageData] = useState<PublicPageData | null>(null);
  const [pausedTitle, setPausedTitle] = useState<string>('');
  const [matchedOffer, setMatchedOffer] = useState<PublicOffer | null>(null);
  const [matchedRule, setMatchedRule] = useState<PublicRule | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (!slug) { setPageState('not_found'); return; }

    fetchPublicSmartBio(slug).then(data => {
      if (!data) { setPageState('not_found'); return; }
      if ('paused' in data) {
        setPausedTitle(data.title);
        setPageState('paused');
        return;
      }
      setPageData(data);
      setPageState('start');
      trackEvent(data.smartbio.tenant_id, data.smartbio.id, 'page_view', { slug });
    });
  }, [slug]);

  const handleStartQuiz = () => {
    if (!pageData) return;
    setPageState('quiz');
    trackEvent(pageData.smartbio.tenant_id, pageData.smartbio.id, 'quiz_start', {});
  };

  const handleQuizComplete = (answers: string[]) => {
    if (!pageData) return;
    setQuizAnswers(answers);

    const rule = findMatchingRule(pageData.rules, answers);
    const offer = rule?.recommended_offer_id
      ? pageData.offers.find(o => o.id === rule.recommended_offer_id) ?? pageData.offers[0]
      : pageData.offers[0];

    setMatchedRule(rule);
    setMatchedOffer(offer ?? null);
    setPageState('result');

    trackEvent(pageData.smartbio.tenant_id, pageData.smartbio.id, 'quiz_complete', {
      answers,
      matched_rule_id: rule?.id ?? null,
      matched_offer_id: offer?.id ?? null,
    });
  };

  const handleCtaClick = () => {
    if (!pageData || !matchedOffer) return;

    const destination = buildCtaUrl(matchedOffer.recommended_cta, matchedOffer.cta_destination);

    insertLead(
      pageData.smartbio.tenant_id,
      pageData.smartbio.id,
      matchedOffer.id,
      quizAnswers,
      matchedOffer.recommended_cta ?? 'url'
    );
    trackEvent(pageData.smartbio.tenant_id, pageData.smartbio.id, 'cta_click', {
      offer_id: matchedOffer.id,
      destination,
    });

    if (destination !== '#') window.open(destination, '_blank', 'noopener,noreferrer');
  };

  const diagnosticTitle =
    (pageData?.smartbio.public_config?.diagnosticTitle as string | undefined) ??
    'Descubra o próximo passo ideal';

  // ── Loading ──────────────────────────────────────────────────────────────
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────
  if (pageState === 'not_found') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center flex flex-col items-center gap-4 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold font-heading text-ink">Página não encontrada</h2>
          <p className="text-sm text-muted-foreground">
            Esta SmartBio não existe ou ainda não foi publicada.
          </p>
        </div>
      </div>
    );
  }

  // ── Pausada (trial expirado) ──────────────────────────────────────────────
  if (pageState === 'paused') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center flex flex-col items-center gap-5 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">SB</div>
          </div>
          {pausedTitle && (
            <p className="text-sm font-semibold text-muted-foreground">{pausedTitle}</p>
          )}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-heading text-ink">SmartBio pausada</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O período de trial desta página encerrou.<br />
              Se você é o dono, acesse o painel para reativar.
            </p>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mt-4">
            Criado com SmartBio
          </div>
        </div>
      </div>
    );
  }

  if (!pageData) return null;

  // ── Interactive content (shared between mobile & desktop) ────────────────
  const interactiveContent = (
    <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto pb-10">
      {pageState === 'start' && (
        <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-background border border-border p-6 rounded-3xl text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-heading text-ink mb-3">
              {diagnosticTitle}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Responda algumas perguntas rápidas e receba uma recomendação personalizada.
            </p>
            <Button
              onClick={handleStartQuiz}
              className="w-full bg-primary text-primary-foreground rounded-xl h-12 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              Começar Diagnóstico <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {pageData.offers.length > 0 && (
            <p className="text-center text-xs text-muted-foreground mt-6">
              {pageData.offers.length} opção{pageData.offers.length > 1 ? 'ões' : ''} disponível{pageData.offers.length > 1 ? 'eis' : ''}
            </p>
          )}
        </div>
      )}

      {pageState === 'quiz' && pageData.questions.length > 0 && (
        <div className="flex-1 flex flex-col justify-center">
          <QuizFlowMock
            questions={pageData.questions}
            onComplete={handleQuizComplete}
          />
        </div>
      )}

      {pageState === 'result' && matchedOffer && (
        <div className="flex-1 flex flex-col justify-center">
          <RecommendationResult
            offer={matchedOffer}
            rule={matchedRule}
            onCtaClick={handleCtaClick}
          />
        </div>
      )}
    </div>
  );

  // ── Page ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Background orb */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl absolute -top-[300px] left-1/2 -translate-x-1/2" />
      </div>

      {/* ── DESKTOP layout (lg+) ── */}
      <div className="hidden lg:flex min-h-screen">

        {/* Left profile panel — sticky */}
        <div className="w-[360px] xl:w-[420px] shrink-0 sticky top-0 h-screen">
          <PublicSmartBioHeader smartbio={pageData.smartbio} side />
        </div>

        {/* Right content area */}
        <div className="flex-1 flex items-center justify-center p-12 bg-surface/40">
          <div className="w-full max-w-[500px] flex flex-col bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden">
            {interactiveContent}

            {/* Branding inside card */}
            <div className="flex justify-center py-4 border-t border-border">
              <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                Criado com SmartBio
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── MOBILE layout (< lg) ── */}
      <div className="lg:hidden flex flex-col items-center">
        <div className="w-full max-w-[480px] min-h-screen flex flex-col relative z-10 shadow-2xl bg-surface sm:border-x sm:border-border">

          <PublicSmartBioHeader smartbio={pageData.smartbio} />

          {interactiveContent}

          {/* Branding bottom fade */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-surface via-surface to-transparent flex justify-center pb-6 pointer-events-none">
            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
              Criado com SmartBio
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
