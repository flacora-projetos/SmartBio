import { Offer } from '@/types';
import { Button } from '@/components/ui/button';
import { X, Save, Copy, Power, Zap } from 'lucide-react';

interface OfferFormPanelProps {
  offer: Offer | null;
  onClose: () => void;
}

export function OfferFormPanel({ offer, onClose }: OfferFormPanelProps) {
  if (!offer) return null;

  return (
    <div className="bg-surface border-l border-border h-full flex flex-col w-full max-w-md ml-auto shadow-xl">
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
        <h3 className="font-bold text-ink font-heading">{offer.id.startsWith('new') ? 'Nova Oferta' : 'Editar Oferta'}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-muted-foreground hover:text-ink">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        {/* Identificação */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Identificação</h4>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Nome da Oferta</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue={offer.title} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Descrição Curta</label>
            <textarea className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[60px]" defaultValue={offer.description || ''} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Formato</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 capitalize" defaultValue={offer.format || 'consultoria'}>
                {['consultoria', 'mentoria', 'produto_digital', 'servico', 'agenda', 'diagnostico', 'comunidade', 'outro'].map(f => (
                  <option key={f} value={f}>{f.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Preço Estimado (R$)</label>
              <input type="number" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue={offer.price || 0} />
            </div>
          </div>
        </div>

        {/* Atributos de Recomendação */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Atributos para Recomendação</h4>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Objetivo Principal</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue={offer.objective || ''} placeholder="Ex: Agendamento de consultoria" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Qual dor resolve?</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue={offer.targetPain || ''} placeholder="Ex: Dificuldade em organizar processos" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Público Ideal</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue={offer.idealAudience || ''} placeholder="Ex: Empreendedores" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Maturidade</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue={offer.maturityLevel || 'Iniciante'}>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Todos">Todos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conversão */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Conversão (CTA)</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Tipo de Destino</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 capitalize" defaultValue={offer.recommendedCta || 'link'}>
                <option value="whatsapp">WhatsApp</option>
                <option value="agenda">Agenda (ex: Cal.com)</option>
                <option value="formulario">Formulário</option>
                <option value="checkout">Checkout</option>
                <option value="link">Link Direto</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Status</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue={offer.status || (offer.isActive ? 'active' : 'draft')}>
                <option value="active">Ativa</option>
                <option value="draft">Rascunho</option>
                <option value="paused">Pausada</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Link / Destino Final</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue={offer.ctaDestination || offer.url} placeholder="https://" />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-background/50 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {!offer.id.startsWith('new') && (
            <>
              <Button variant="outline" size="icon" className="rounded-xl border-border text-muted-foreground hover:text-ink">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-xl border-border text-muted-foreground hover:text-destructive">
                <Power className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose} className="rounded-xl">Cancelar</Button>
          <Button className="rounded-xl bg-primary text-primary-foreground">
            <Save className="w-4 h-4 mr-2" /> Salvar Oferta
          </Button>
        </div>
      </div>
    </div>
  );
}
