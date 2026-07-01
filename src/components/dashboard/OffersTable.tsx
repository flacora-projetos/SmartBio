import { Button } from '@/components/ui/button';
import { MoreHorizontal, Link as LinkIcon, Zap } from 'lucide-react';
import { OfferStatusBadge } from './OfferStatusBadge';
import type { DbOffer } from '@/lib/offers';

interface OffersTableProps {
  offers: DbOffer[];
  onSelectOffer: (offer: DbOffer) => void;
}

export function OffersTable({ offers, onSelectOffer }: OffersTableProps) {
  if (offers.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-12 text-center shadow-sm">
        <p className="text-muted-foreground text-sm">Nenhuma oferta criada ainda.</p>
        <p className="text-muted-foreground/60 text-xs mt-1">Clique em "Nova Oferta" para começar.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-background/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Oferta</th>
              <th className="px-6 py-4">Formato & Preço</th>
              <th className="px-6 py-4">CTA Destino</th>
              <th className="px-6 py-4">Recomendação</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {offers.map(offer => (
              <tr
                key={offer.id}
                className="hover:bg-background/50 transition-colors cursor-pointer"
                onClick={() => onSelectOffer(offer)}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-ink">{offer.title}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {offer.objective ?? offer.description ?? '—'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="capitalize font-medium text-ink">
                      {offer.format?.replace('_', ' ') ?? 'Padrão'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {offer.price_label ?? 'Não informado'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-ink">
                    <LinkIcon className="w-3 h-3 text-muted-foreground" />
                    <span className="capitalize text-xs font-medium">
                      {offer.recommended_cta ?? 'Link direto'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {offer.is_connected_to_rule ? (
                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                      <Zap className="w-3.5 h-3.5" /> Conectada
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Não conectada</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <OfferStatusBadge status={offer.status} isActive={offer.status === 'active'} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-ink"
                    onClick={e => { e.stopPropagation(); onSelectOffer(offer); }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
