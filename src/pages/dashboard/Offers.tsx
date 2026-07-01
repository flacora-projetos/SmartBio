import { useState } from 'react';
import {
  Loader2, Plus, Globe, Phone, Youtube,
  Music, Calendar, ShoppingBag, BookOpen, Pencil,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OffersSummaryCards } from '@/components/dashboard/OffersSummaryCards';
import { OffersTable } from '@/components/dashboard/OffersTable';
import { OfferFormPanel } from '@/components/dashboard/OfferFormPanel';
import { OfferRecommendationUsage } from '@/components/dashboard/OfferRecommendationUsage';
import { AssetFormPanel } from '@/components/dashboard/AssetFormPanel';
import { Button } from '@/components/ui/button';
import { useOffers } from '@/hooks/useOffers';
import { useAssets } from '@/hooks/useAssets';
import { useAuth } from '@/contexts/AuthContext';
import type { DbOffer } from '@/lib/offers';
import type { DbAsset, AssetPayload } from '@/lib/assets';

type OfferPanel = DbOffer | null | undefined;
type AssetPanel = DbAsset | null | undefined;
type Tab = 'ofertas' | 'ativos';

// ── Asset type icon map ──────────────────────────────────────────────────────

const ASSET_ICON: Record<string, React.ElementType> = {
  link:     Globe,
  whatsapp: Phone,
  product:  ShoppingBag,
  video:    Youtube,
  podcast:  Music,
  post:     BookOpen,
  calendar: Calendar,
};

const ASSET_TYPE_LABEL: Record<string, string> = {
  link:     'Link',
  whatsapp: 'WhatsApp',
  product:  'Produto',
  video:    'Vídeo',
  podcast:  'Podcast',
  post:     'Post',
  calendar: 'Calendário',
};

// ── Assets list ───────────────────────────────────────────────────────────────

function AssetsList({ assets, onSelect }: { assets: DbAsset[]; onSelect: (a: DbAsset) => void }) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center border border-dashed border-border rounded-2xl">
        <Globe className="w-10 h-10 text-muted-foreground/40" />
        <div>
          <p className="font-semibold text-ink">Nenhum ativo ainda</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Adicione links, publicações, vídeos, podcasts ou botões de WhatsApp que aparecerão na seção "Mais recursos" da sua SmartBio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {assets.map(asset => {
        const Icon = ASSET_ICON[asset.type] ?? Globe;
        return (
          <div
            key={asset.id}
            className="flex items-center gap-4 p-4 bg-surface border border-border rounded-2xl hover:border-primary/30 transition-colors cursor-pointer group"
            onClick={() => onSelect(asset)}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink text-sm truncate">{asset.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {ASSET_TYPE_LABEL[asset.type] ?? asset.type}
                {asset.subtitle && ` · ${asset.subtitle}`}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                asset.status === 'active'
                  ? 'bg-success/10 text-success'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {asset.status === 'active' ? 'Ativo' : 'Rascunho'}
              </span>
              <Pencil className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function Offers() {
  const { tenant } = useAuth();
  const [tab, setTab] = useState<Tab>('ofertas');

  // Ofertas
  const {
    offers, smartbioId, isLoading: offersLoading, error: offersError,
    create: createOffer, update: updateOffer, remove: removeOffer,
  } = useOffers();
  const [offerPanel, setOfferPanel] = useState<OfferPanel>(undefined);

  // Ativos
  const {
    assets, isLoading: assetsLoading, error: assetsError,
    create: createAsset, update: updateAsset, remove: removeAsset,
  } = useAssets();
  const [assetPanel, setAssetPanel] = useState<AssetPanel>(undefined);

  // ── Offer handlers ──────────────────────────────────────────────────────────
  const closeOfferPanel = () => setOfferPanel(undefined);

  const handleSaveOffer = async (payload: Omit<DbOffer, 'id' | 'created_at' | 'is_connected_to_rule'>) => {
    if (offerPanel) {
      await updateOffer(offerPanel.id, payload);
    } else {
      await createOffer(payload);
    }
    closeOfferPanel();
  };

  const handleDeleteOffer = async () => {
    if (!offerPanel) return;
    await removeOffer(offerPanel.id);
    closeOfferPanel();
  };

  // ── Asset handlers ──────────────────────────────────────────────────────────
  const closeAssetPanel = () => setAssetPanel(undefined);

  const handleSaveAsset = async (payload: Omit<AssetPayload, 'smartbio_id'>) => {
    if (assetPanel) {
      await updateAsset(assetPanel.id, payload);
    } else {
      await createAsset(payload);
    }
    closeAssetPanel();
  };

  const handleDeleteAsset = async () => {
    if (!assetPanel) return;
    await removeAsset(assetPanel.id);
    closeAssetPanel();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] relative">

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div>
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1 w-fit mb-2">
              {(['ofertas', 'ativos'] as Tab[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize ${
                    tab === t
                      ? 'bg-surface text-ink shadow-sm'
                      : 'text-muted-foreground hover:text-ink'
                  }`}
                >
                  {t === 'ofertas' ? 'Ofertas' : 'Ativos'}
                  {t === 'ofertas' && offers.length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-full">
                      {offers.length}
                    </span>
                  )}
                  {t === 'ativos' && assets.length > 0 && (
                    <span className="ml-1.5 text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-full">
                      {assets.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            {tab === 'ofertas' && (
              <p className="text-muted-foreground text-sm">
                Estruture as ofertas que a SmartBio poderá recomendar ao visitante.
              </p>
            )}
            {tab === 'ativos' && (
              <p className="text-muted-foreground text-sm">
                Links, publicações, vídeos e outros recursos que aparecem na seção "Mais recursos".
              </p>
            )}
          </div>

          {tab === 'ofertas' && (
            <Button
              onClick={() => setOfferPanel(null)}
              className="rounded-xl bg-primary text-primary-foreground hidden sm:flex"
            >
              <Plus className="w-4 h-4 mr-2" /> Nova Oferta
            </Button>
          )}
          {tab === 'ativos' && (
            <Button
              onClick={() => setAssetPanel(null)}
              className="rounded-xl bg-primary text-primary-foreground hidden sm:flex"
            >
              <Plus className="w-4 h-4 mr-2" /> Novo Ativo
            </Button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 min-h-0 flex-1">
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-6">

            {/* ── Tab Ofertas ── */}
            {tab === 'ofertas' && (
              <>
                {offersLoading ? (
                  <div className="flex-1 flex items-center justify-center py-24">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : offersError ? (
                  <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                    {offersError}
                  </div>
                ) : (
                  <>
                    <OffersSummaryCards offers={offers} />
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                      <div className="xl:col-span-2 space-y-6">
                        <OffersTable offers={offers} onSelectOffer={o => setOfferPanel(o)} />
                        <Button
                          onClick={() => setOfferPanel(null)}
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
              </>
            )}

            {/* ── Tab Ativos ── */}
            {tab === 'ativos' && (
              <>
                {assetsLoading ? (
                  <div className="flex-1 flex items-center justify-center py-24">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : assetsError ? (
                  <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                    {assetsError}
                  </div>
                ) : (
                  <>
                    <AssetsList assets={assets} onSelect={a => setAssetPanel(a)} />
                    <Button
                      onClick={() => setAssetPanel(null)}
                      className="w-full rounded-xl bg-primary text-primary-foreground sm:hidden"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Novo Ativo
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Offer panel overlay ── */}
        {offerPanel !== undefined && tenant && (
          <div className="absolute inset-0 z-50 flex">
            <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={closeOfferPanel} />
            <OfferFormPanel
              offer={offerPanel}
              smartbioId={smartbioId}
              tenantId={tenant.id}
              onSave={handleSaveOffer}
              onDelete={handleDeleteOffer}
              onClose={closeOfferPanel}
            />
          </div>
        )}

        {/* ── Asset panel overlay ── */}
        {assetPanel !== undefined && tenant && (
          <div className="absolute inset-0 z-50 flex">
            <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={closeAssetPanel} />
            <AssetFormPanel
              asset={assetPanel}
              smartbioId={smartbioId ?? ''}
              tenantId={tenant.id}
              onSave={handleSaveAsset}
              onDelete={handleDeleteAsset}
              onClose={closeAssetPanel}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
