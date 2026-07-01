import { List, CheckCircle2, FileEdit, Zap } from 'lucide-react';
import type { DbOffer } from '@/lib/offers';

interface OffersSummaryCardsProps {
  offers: DbOffer[];
}

export function OffersSummaryCards({ offers }: OffersSummaryCardsProps) {
  const active = offers.filter(o => o.status === 'active').length;
  const draft = offers.filter(o => o.status === 'draft').length;
  const withCta = offers.filter(o => o.recommended_cta).length;
  const inRules = offers.filter(o => o.is_connected_to_rule).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 text-success mb-2">
          <CheckCircle2 className="w-5 h-5" />
          <h3 className="font-bold text-sm">Ofertas Ativas</h3>
        </div>
        <p className="text-2xl font-bold text-ink font-heading">{active}</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 text-muted-foreground mb-2">
          <FileEdit className="w-5 h-5" />
          <h3 className="font-bold text-sm">Em Rascunho</h3>
        </div>
        <p className="text-2xl font-bold text-ink font-heading">{draft}</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 text-primary mb-2">
          <List className="w-5 h-5" />
          <h3 className="font-bold text-sm">CTAs Configurados</h3>
        </div>
        <p className="text-2xl font-bold text-ink font-heading">{withCta}</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 text-warning mb-2">
          <Zap className="w-5 h-5" />
          <h3 className="font-bold text-sm">Usadas na Recomendação</h3>
        </div>
        <p className="text-2xl font-bold text-ink font-heading">{inRules}</p>
      </div>
    </div>
  );
}
