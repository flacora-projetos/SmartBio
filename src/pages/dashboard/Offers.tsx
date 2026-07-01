import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OffersSummaryCards } from '@/components/dashboard/OffersSummaryCards';
import { OffersTable } from '@/components/dashboard/OffersTable';
import { OfferFormPanel } from '@/components/dashboard/OfferFormPanel';
import { OfferRecommendationUsage } from '@/components/dashboard/OfferRecommendationUsage';
import { Button } from '@/components/ui/button';
import { useOffers } from '@/hooks/useOffers';
import { useAuth } from '@/contexts/AuthContext';
import type { DbOffer } from '@/lib/offers';

// undefined = panel closed | null = new offer | DbOffer = editing existing
type PanelState = DbOffer | null | undefined;

export function Offers() {
  const { tenant } = useAuth();
  const { offers, smartbioId, isLoading, error, create, update, remove } = useOffers();
  const [panel, setPanel] = useState<PanelState>(undefined);

  const closePanel = () => setPanel(undefined);

  const handleSave = async (payload: Omit<DbOffer, 'id' | 'created_at' | 'is_connected_to_rule'>) => {
    if (panel) {
      await update(panel.id, payload);
    } else {
      await create(payload);
    }
    closePanel();
  };

  const handleDelete = async () => {
    if (!panel) return;
    await remove(panel.id);
    closePanel();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] relative">
        <div className="flex flex-col lg:flex-row gap-6 min-h-0 h-full">
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-6">
            <div className="flex items-center justify-between shrink-0">
              <div>
                <h1 className="text-3xl font-heading font-bold text-ink">Ofertas</h1>
                <p className="text-muted-foreground mt-2">
                  Estruture as ofertas que a SmartBio poderá recomendar ao visitante.
                </p>
              </div>
              <Button
                onClick={() => setPanel(null)}
                className="rounded-xl bg-primary text-primary-foreground hidden sm:flex"
              >
                <Plus className="w-4 h-4 mr-2" /> Nova Oferta
              </Button>
            </div>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                {error}
              </div>
            ) : (
              <>
                <OffersSummaryCards offers={offers} />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 space-y-6">
                    <OffersTable offers={offers} onSelectOffer={o => setPanel(o)} />
                    <Button
                      onClick={() => setPanel(null)}
                      className="w-full rounded-xl bg-primary text-primary-foreground sm:hidden"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Nova Oferta
                    </Button>
                  </div>
                  <div className="xl:col-span-1">
                    <OfferRecommendationUsage />
                  </div>
                </div>
              </>
            )}
          </div>

          {panel !== undefined && tenant && (
            <div className="absolute inset-0 z-50 flex">
              <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={closePanel} />
              <OfferFormPanel
                offer={panel}
                smartbioId={smartbioId}
                tenantId={tenant.id}
                onSave={handleSave}
                onDelete={handleDelete}
                onClose={closePanel}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
