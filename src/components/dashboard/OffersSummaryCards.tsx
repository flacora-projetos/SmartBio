import { List, CheckCircle2, FileEdit, HelpCircle } from 'lucide-react';
import { Offer } from '@/types';

interface OffersSummaryCardsProps {
  offers: Offer[];
}

export function OffersSummaryCards({ offers }: OffersSummaryCardsProps) {
  const activeOffers = offers.filter(o => o.status === 'active' || o.isActive).length;
  const draftOffers = offers.filter(o => o.status === 'draft' || (!o.isActive && o.status !== 'active')).length;
  const ctasConfigured = offers.filter(o => o.recommendedCta).length;
  const usedInRules = offers.filter(o => o.isConnectedToRule).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 text-success mb-2">
          <CheckCircle2 className="w-5 h-5" />
          <h3 className="font-bold text-sm">Ofertas Ativas</h3>
        </div>
        <p className="text-2xl font-bold text-ink font-heading">{activeOffers}</p>
      </div>
      
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 text-muted-foreground mb-2">
          <FileEdit className="w-5 h-5" />
          <h3 className="font-bold text-sm">Em Rascunho</h3>
        </div>
        <p className="text-2xl font-bold text-ink font-heading">{draftOffers}</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 text-primary mb-2">
          <List className="w-5 h-5" />
          <h3 className="font-bold text-sm">CTAs Configurados</h3>
        </div>
        <p className="text-2xl font-bold text-ink font-heading">{ctasConfigured}</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 text-secondary-foreground mb-2">
          <HelpCircle className="w-5 h-5" />
          <h3 className="font-bold text-sm">Usadas na Recomendação</h3>
        </div>
        <p className="text-2xl font-bold text-ink font-heading">{usedInRules}</p>
      </div>
    </div>
  );
}
