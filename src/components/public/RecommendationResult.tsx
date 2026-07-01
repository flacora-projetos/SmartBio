import { Sparkles, MessageSquare, Calendar, CheckSquare, ExternalLink, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PublicOffer, PublicRule } from '@/lib/public-smartbio';

interface RecommendationResultProps {
  offer: PublicOffer;
  rule: PublicRule | null;
  onCtaClick: () => void;
  onReset: () => void;
}

function CtaIcon({ type }: { type: string | null }) {
  switch (type) {
    case 'whatsapp':   return <MessageSquare className="w-5 h-5 mr-2 shrink-0" />;
    case 'agenda':     return <Calendar className="w-5 h-5 mr-2 shrink-0" />;
    case 'formulario': return <CheckSquare className="w-5 h-5 mr-2 shrink-0" />;
    default:           return <ExternalLink className="w-5 h-5 mr-2 shrink-0" />;
  }
}

export function RecommendationResult({ offer, rule, onCtaClick, onReset }: RecommendationResultProps) {
  const reason = rule?.recommendation_reason
    ?? `${offer.title} parece o melhor próximo passo para o seu momento atual.`;
  const buttonText = rule?.final_cta ?? offer.recommended_cta ?? 'Quero esse';

  return (
    <div className="border-2 border-primary rounded-3xl overflow-hidden bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-500">
      {offer.image_url && (
        <div className="w-full h-44 overflow-hidden">
          <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-6 relative">
        <div className="absolute top-4 right-4 text-primary/10 pointer-events-none">
          <Sparkles className="w-20 h-20" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-lg mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Indicação ideal para você
          </div>

          <h3 className="text-2xl font-bold font-heading text-ink mb-2 pr-6">{offer.title}</h3>

          {offer.price_label && (
            <p className="text-lg font-bold text-primary mb-3">{offer.price_label}</p>
          )}

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{reason}</p>

          {offer.description && (
            <div className="bg-background border border-border rounded-2xl p-4 mb-6 text-sm text-muted-foreground leading-relaxed">
              {offer.description}
            </div>
          )}

          <Button
            onClick={onCtaClick}
            className="w-full bg-primary text-primary-foreground rounded-xl h-14 text-base font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
          >
            <CtaIcon type={offer.recommended_cta} />
            {buttonText}
          </Button>

          <button
            type="button"
            onClick={onReset}
            className="w-full mt-4 text-xs text-muted-foreground hover:text-ink transition-colors text-center flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Refazer diagnóstico
          </button>
        </div>
      </div>
    </div>
  );
}
