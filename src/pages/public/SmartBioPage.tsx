import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Loader2, Phone, Globe, Youtube,
  Music, ExternalLink, Calendar, ShoppingBag, Mic, BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicSmartBioHeader } from '@/components/public/PublicSmartBioHeader';
import { QuizFlowMock } from '@/components/public/QuizFlowMock';
import { RecommendationResult } from '@/components/public/RecommendationResult';
import { SchedulingWidget } from '@/components/public/SchedulingWidget';
import { useTrackingTags } from '@/hooks/useTrackingTags';
import {
  fetchPublicSmartBio,
  findMatchingRule,
  buildCtaUrl,
  offerCtaLabel,
  buildWhatsAppUrl,
  trackEvent,
  insertLead,
  type PublicPageData,
  type PublicOffer,
  type PublicRule,
  type PublicAsset,
} from '@/lib/public-smartbio';

type PageState  = 'loading' | 'not_found' | 'paused' | 'ready';
type QuizState  = 'idle' | 'in_progress' | 'completed';
type QuizOrigin = 'hero' | 'floating_cta' | 'offers_hint';

// ── Asset card helpers ───────────────────────────────────────────────────────

function assetIcon(type: string) {
  switch (type) {
    case 'whatsapp':  return <Phone className="w-5 h-5" />;
    case 'youtube':
    case 'video':     return <Youtube className="w-5 h-5" />;
    case 'spotify':
    case 'podcast':   return <Mic className="w-5 h-5" />;
    case 'music':     return <Music className="w-5 h-5" />;
    case 'calendar':  return <Calendar className="w-5 h-5" />;
    case 'product':   return <ShoppingBag className="w-5 h-5" />;
    case 'post':      return <BookOpen className="w-5 h-5" />;
    case 'site':
    case 'link':
    default:          return <Globe className="w-5 h-5" />;
  }
}

function AssetCard({ asset }: { asset: PublicAsset }) {
  const isWhatsApp = asset.type === 'whatsapp';

  const href = isWhatsApp && asset.phone
    ? buildWhatsAppUrl(asset.phone, asset.message_template)
    : (asset.url ?? '#');

  const accentClass = isWhatsApp
    ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20'
    : 'bg-primary/10 text-primary border-primary/20';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 p-4 bg-surface border border-border rounded-2xl hover:border-primary/40 hover:shadow-md transition-all duration-200"
    >
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${accentClass}`}>
        {assetIcon(asset.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink text-sm leading-tight truncate">{asset.title}</p>
        {asset.subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{asset.subtitle}</p>
        )}
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
    </a>
  );
}

function OfferCard({ offer, onCtaClick }: { offer: PublicOffer; onCtaClick: (offer: PublicOffer) => void }) {
  return (
    <div className="flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-200">
      {offer.image_url && (
        <div className="w-full h-36 overflow-hidden">
          <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-ink text-sm font-heading leading-tight mb-1">{offer.title}</h4>
        {offer.price_label && (
          <p className="text-primary font-bold text-sm mb-2">{offer.price_label}</p>
        )}
        {offer.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-3">{offer.description}</p>
        )}
        <Button
          onClick={() => onCtaClick(offer)}
          size="sm"
          className="w-full bg-primary text-primary-foreground rounded-xl font-bold text-xs h-9 hover:scale-[1.01] transition-transform mt-auto"
        >
          {offerCtaLabel(offer)}
        </Button>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function SmartBioPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  // Modo preview (iframe do dashboard): mostra a página real antes da
  // publicação, sem registrar analytics, leads ou disparar pixels.
  const isPreview = searchParams.get('preview') === '1';
  const [pageState, setPageState]   = useState<PageState>('loading');
  const [quizState, setQuizState]   = useState<QuizState>('idle');
  const [pageData, setPageData]     = useState<PublicPageData | null>(null);
  const [pausedTitle, setPausedTitle] = useState('');
  const [matchedOffer, setMatchedOffer] = useState<PublicOffer | null>(null);
  const [matchedRule, setMatchedRule]   = useState<PublicRule | null>(null);
  const [quizAnswers, setQuizAnswers]   = useState<string[]>([]);
  // Barra flutuante do quiz: aparece quando o hero sai da tela sem resposta
  const [heroVisible, setHeroVisible]   = useState(true);
  const [quizBarDismissed, setQuizBarDismissed] = useState(false);
  const quizHeroRef = useRef<HTMLElement>(null);

  // Em preview, pixels de tracking não são carregados
  const { fireEvent } = useTrackingTags(isPreview ? {} : (pageData?.smartbio.tracking_config ?? {}));

  useEffect(() => {
    if (!slug) { setPageState('not_found'); return; }

    fetchPublicSmartBio(slug, { preview: isPreview }).then(data => {
      if (!data) { setPageState('not_found'); return; }
      if ('paused' in data) {
        setPausedTitle(data.title);
        setPageState('paused');
        return;
      }
      setPageData(data);
      setPageState('ready');
      if (!isPreview) trackEvent(data.smartbio.tenant_id, data.smartbio.id, 'page_view', { slug });
    });
  }, [slug, isPreview]);

  useEffect(() => {
    if (pageState === 'ready' && pageData && !isPreview) {
      fireEvent('page_view', { content_name: pageData.smartbio.title });
    }
  }, [pageState, pageData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Observa o hero do quiz: quando ele sai da tela sem resposta, a barra
  // flutuante reapresenta a promessa no momento em que o visitante está
  // comparando as ofertas.
  useEffect(() => {
    const el = quizHeroRef.current;
    if (!el || pageState !== 'ready') return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pageState, quizState]);

  const handleStartQuiz = (origin: QuizOrigin = 'hero') => {
    if (!pageData) return;
    setQuizState('in_progress');
    if (origin !== 'hero') {
      quizHeroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (!isPreview) {
      trackEvent(pageData.smartbio.tenant_id, pageData.smartbio.id, 'quiz_start', { origin });
      fireEvent('quiz_start');
    }
  };

  const handleQuizComplete = (answers: string[]) => {
    if (!pageData) return;
    setQuizAnswers(answers);

    const rule  = findMatchingRule(pageData.rules, answers);
    const offer = rule?.recommended_offer_id
      ? pageData.offers.find(o => o.id === rule.recommended_offer_id) ?? pageData.offers[0]
      : pageData.offers[0];

    setMatchedRule(rule);
    setMatchedOffer(offer ?? null);
    setQuizState('completed');

    if (!isPreview) {
      trackEvent(pageData.smartbio.tenant_id, pageData.smartbio.id, 'quiz_complete', {
        answers,
        matched_rule_id: rule?.id ?? null,
        matched_offer_id: offer?.id ?? null,
      });
      fireEvent('quiz_complete', { num_items: pageData.questions.length });
    }
  };

  const handleResetQuiz = () => {
    setQuizState('idle');
    setMatchedOffer(null);
    setMatchedRule(null);
    setQuizAnswers([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOfferCtaClick = (offer: PublicOffer) => {
    if (!pageData) return;
    const destination = buildCtaUrl(offer.recommended_cta, offer.cta_destination, offer.cta_url);
    if (!isPreview) {
      insertLead(pageData.smartbio.tenant_id, pageData.smartbio.id, offer.id, quizAnswers, offer.recommended_cta ?? 'url');
      trackEvent(pageData.smartbio.tenant_id, pageData.smartbio.id, 'cta_click', { offer_id: offer.id, destination });
      fireEvent('cta_click', { content_name: offer.title });
    }
    if (destination !== '#') window.open(destination, '_blank', 'noopener,noreferrer');
  };

  const handleRecommendedCtaClick = () => {
    if (!pageData || !matchedOffer) return;
    handleOfferCtaClick(matchedOffer);
  };

  const diagnosticTitle =
    (pageData?.smartbio.public_config?.diagnosticTitle as string | undefined)
    ?? 'Não sabe por onde começar?';

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

  // ── Pausada ──────────────────────────────────────────────────────────────
  if (pageState === 'paused') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center flex flex-col items-center gap-5 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">SB</div>
          </div>
          {pausedTitle && <p className="text-sm font-semibold text-muted-foreground">{pausedTitle}</p>}
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

  const hasOffers  = pageData.offers.length > 0;
  const hasAssets  = pageData.assets.length > 0;
  const hasQuiz    = pageData.questions.length > 0;
  const agendaCfg  = pageData.smartbio.agenda_config;
  const hasAgenda  = agendaCfg?.enabled === true;
  const accentColor = (pageData.smartbio.theme_config?.accentColor as string | undefined) ?? '#000000';

  // ── Conteúdo central scrollável (compartilhado entre mobile e desktop) ────
  const mainContent = (
    <div className="flex flex-col gap-8 pb-12">

      {/* Quiz section */}
      {hasQuiz && (
        <section ref={quizHeroRef}>
          {quizState === 'idle' && (
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 text-center animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold font-heading text-ink mb-2">{diagnosticTitle}</h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Responda {pageData.questions.length === 1 ? '1 pergunta rápida' : `${pageData.questions.length} perguntas rápidas`} — leva
                menos de 1 minuto — e veja a opção certa para o seu caso.
              </p>
              <Button
                onClick={() => handleStartQuiz('hero')}
                className="bg-primary text-primary-foreground rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                Quero minha recomendação <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {quizState === 'in_progress' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <QuizFlowMock questions={pageData.questions} onComplete={handleQuizComplete} />
            </div>
          )}

          {quizState === 'completed' && matchedOffer && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <RecommendationResult
                offer={matchedOffer}
                rule={matchedRule}
                onCtaClick={handleRecommendedCtaClick}
                onReset={handleResetQuiz}
              />
            </div>
          )}
        </section>
      )}

      {/* Ofertas */}
      {hasOffers && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 px-1">
            {quizState === 'completed' ? 'Veja todas as opções' : 'O que posso fazer por você'}
          </h3>
          {hasQuiz && quizState === 'idle' && (
            <button
              type="button"
              onClick={() => handleStartQuiz('offers_hint')}
              className="block text-xs text-primary font-medium hover:underline mb-3 px-1 text-left"
            >
              Em dúvida? Responda o quiz e receba uma indicação →
            </button>
          )}
          {!(hasQuiz && quizState === 'idle') && <div className="mb-2" />}
          <div className={`grid gap-4 ${pageData.offers.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {pageData.offers.map(offer => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onCtaClick={handleOfferCtaClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Ativos */}
      {hasAssets && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">
            Mais recursos
          </h3>
          <div className="flex flex-col gap-3">
            {pageData.assets.map(asset => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </section>
      )}

      {/* Agenda */}
      {hasAgenda && agendaCfg && (
        <section>
          <SchedulingWidget
            smartbioId={pageData.smartbio.id}
            tenantId={pageData.smartbio.tenant_id}
            config={agendaCfg}
            accentColor={accentColor}
          />
        </section>
      )}

      {/* Branding */}
      <div className="flex justify-center pt-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          Criado com SmartBio
        </span>
      </div>
    </div>
  );

  // ── Page layout ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {isPreview && (
        <div className="fixed top-0 inset-x-0 z-50 bg-warning text-white text-center text-[11px] font-bold uppercase tracking-widest py-1.5">
          Modo preview — esta página ainda não está publicada
        </div>
      )}
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="w-[700px] h-[700px] bg-primary/4 rounded-full blur-3xl absolute -top-[350px] left-1/2 -translate-x-1/2" />
      </div>

      {/* ── DESKTOP (lg+) — painel lateral fixo + scroll direita ── */}
      <div className="hidden lg:flex min-h-screen">

        <div className="w-[360px] xl:w-[400px] shrink-0 sticky top-0 h-screen">
          <PublicSmartBioHeader smartbio={pageData.smartbio} side />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[640px] mx-auto px-10 py-12">
            {mainContent}
          </div>
        </div>

      </div>

      {/* ── MOBILE (< lg) — coluna única ── */}
      <div className="lg:hidden flex flex-col items-center">
        <div className="w-full max-w-[480px] min-h-screen flex flex-col sm:border-x sm:border-border">
          <PublicSmartBioHeader smartbio={pageData.smartbio} />
          <div className="flex-1 px-5 py-7">
            {mainContent}
          </div>
        </div>
      </div>

      {/* ── Barra flutuante do quiz: resgata quem rolou sem responder ── */}
      {hasQuiz && quizState === 'idle' && !heroVisible && !quizBarDismissed && (
        <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 animate-in slide-in-from-bottom-4 fade-in duration-300 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 bg-ink text-background rounded-full shadow-2xl pl-4 pr-2 py-2 max-w-full">
            <Sparkles className="w-4 h-4 shrink-0 opacity-80" />
            <button
              type="button"
              onClick={() => handleStartQuiz('floating_cta')}
              className="text-sm font-bold whitespace-nowrap truncate"
            >
              Em dúvida? Deixa que eu te indico
            </button>
            <button
              type="button"
              onClick={() => setQuizBarDismissed(true)}
              aria-label="Dispensar"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors"
            >
              <span className="text-sm leading-none">×</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
