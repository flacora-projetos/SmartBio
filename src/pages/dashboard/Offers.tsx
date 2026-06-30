import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OffersSummaryCards } from '@/components/dashboard/OffersSummaryCards';
import { OffersTable } from '@/components/dashboard/OffersTable';
import { OfferFormPanel } from '@/components/dashboard/OfferFormPanel';
import { OfferRecommendationUsage } from '@/components/dashboard/OfferRecommendationUsage';
import { mockOffers } from '@/data/mock';
import { Offer } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function Offers() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleCreateNew = () => {
    setSelectedOffer({
      id: `new_${Date.now()}`,
      tenantId: 'tnt_01',
      title: '',
      description: '',
      url: '',
      price: 0,
      isActive: true,
      status: 'draft',
      order: mockOffers.length + 1,
      createdAt: new Date().toISOString(),
      isConnectedToRule: false
    } as Offer);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] relative">
        <div className="flex flex-col lg:flex-row gap-6 min-h-0 h-full">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-6">
            <div className="flex items-center justify-between shrink-0">
              <div>
                <h1 className="text-3xl font-heading font-bold text-ink">Ofertas</h1>
                <p className="text-muted-foreground mt-2">Estruture as ofertas que a SmartBio poderá recomendar ao visitante.</p>
              </div>
              <Button onClick={handleCreateNew} className="rounded-xl bg-primary text-primary-foreground hidden sm:flex">
                <Plus className="w-4 h-4 mr-2" /> Nova Oferta
              </Button>
            </div>

            <OffersSummaryCards offers={mockOffers} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <OffersTable offers={mockOffers} onSelectOffer={setSelectedOffer} />
                
                {/* Mobile Create Button */}
                <Button onClick={handleCreateNew} className="w-full rounded-xl bg-primary text-primary-foreground sm:hidden">
                  <Plus className="w-4 h-4 mr-2" /> Nova Oferta
                </Button>
              </div>
              
              <div className="xl:col-span-1">
                <OfferRecommendationUsage />
              </div>
            </div>
          </div>

          {/* Form Panel Overlay (Simulated sidebar for editing) */}
          {selectedOffer && (
            <div className="absolute inset-0 z-50 flex">
              <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={() => setSelectedOffer(null)} />
              <OfferFormPanel offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

