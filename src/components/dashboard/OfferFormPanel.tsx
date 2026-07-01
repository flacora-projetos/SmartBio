import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Save, Trash2, Zap, Loader2 } from 'lucide-react';
import type { DbOffer } from '@/lib/offers';

type OfferPayload = Omit<DbOffer, 'id' | 'created_at' | 'is_connected_to_rule'>;

interface OfferFormPanelProps {
  offer: DbOffer | null;
  smartbioId: string | null;
  tenantId: string;
  onSave: (payload: OfferPayload) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

type FormData = {
  title: string;
  description: string;
  objective: string;
  target_pain: string;
  ideal_audience: string;
  maturity_level: string;
  format: string;
  price_label: string;
  recommended_cta: string;
  cta_destination: string;
  status: 'active' | 'draft' | 'paused';
};

const EMPTY: FormData = {
  title: '',
  description: '',
  objective: '',
  target_pain: '',
  ideal_audience: '',
  maturity_level: 'Todos',
  format: 'consultoria',
  price_label: '',
  recommended_cta: 'link',
  cta_destination: '',
  status: 'draft',
};

function offerToForm(o: DbOffer): FormData {
  return {
    title: o.title,
    description: o.description ?? '',
    objective: o.objective ?? '',
    target_pain: o.target_pain ?? '',
    ideal_audience: o.ideal_audience ?? '',
    maturity_level: o.maturity_level ?? 'Todos',
    format: o.format ?? 'consultoria',
    price_label: o.price_label ?? '',
    recommended_cta: o.recommended_cta ?? 'link',
    cta_destination: o.cta_destination ?? '',
    status: o.status,
  };
}

export function OfferFormPanel({
  offer,
  smartbioId,
  tenantId,
  onSave,
  onDelete,
  onClose,
}: OfferFormPanelProps) {
  const isNew = !offer;

  const [form, setForm] = useState<FormData>(offer ? offerToForm(offer) : EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setForm(offer ? offerToForm(offer) : EMPTY);
    setConfirmDelete(false);
    setSaveError(null);
  }, [offer?.id]);

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.title.trim()) { setSaveError('Nome da oferta é obrigatório.'); return; }
    setSaveError(null);
    setIsSaving(true);
    try {
      await onSave({
        tenant_id: tenantId,
        smartbio_id: smartbioId,
        title: form.title.trim(),
        description: form.description || null,
        objective: form.objective || null,
        target_pain: form.target_pain || null,
        ideal_audience: form.ideal_audience || null,
        maturity_level: form.maturity_level || null,
        format: form.format || null,
        price_label: form.price_label || null,
        recommended_cta: form.recommended_cta || null,
        cta_destination: form.cta_destination || null,
        image_url: offer?.image_url ?? null,
        status: form.status,
        sort_order: offer?.sort_order ?? 0,
      });
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Erro ao salvar.');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setIsDeleting(true);
    try {
      await onDelete();
    } catch {
      setSaveError('Erro ao excluir oferta.');
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="bg-surface border-l border-border h-full flex flex-col w-full max-w-md ml-auto shadow-xl relative z-10">
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
        <h3 className="font-bold text-ink font-heading">{isNew ? 'Nova Oferta' : 'Editar Oferta'}</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-muted-foreground hover:text-ink">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        {/* Identificação */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Identificação
          </h4>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Nome da Oferta *</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={form.title}
              onChange={set('title')}
              placeholder="Ex: Consultoria Estratégica"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Descrição Curta</label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[60px] resize-none"
              value={form.description}
              onChange={set('description')}
              placeholder="Descreva brevemente esta oferta"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Formato</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={form.format}
                onChange={set('format')}
              >
                {['consultoria', 'mentoria', 'produto_digital', 'servico', 'agenda', 'diagnostico', 'comunidade', 'outro'].map(f => (
                  <option key={f} value={f}>{f.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Preço</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={form.price_label}
                onChange={set('price_label')}
                placeholder="Ex: R$ 197 ou Grátis"
              />
            </div>
          </div>
        </div>

        {/* Atributos de Recomendação */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Atributos para Recomendação
            </h4>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Objetivo Principal</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={form.objective}
              onChange={set('objective')}
              placeholder="Ex: Agendamento de consultoria"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Qual dor resolve?</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={form.target_pain}
              onChange={set('target_pain')}
              placeholder="Ex: Dificuldade em organizar processos"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Público Ideal</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={form.ideal_audience}
                onChange={set('ideal_audience')}
                placeholder="Ex: Empreendedores"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Maturidade</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={form.maturity_level}
                onChange={set('maturity_level')}
              >
                {['Iniciante', 'Intermediário', 'Avançado', 'Todos'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Conversão */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            Conversão (CTA)
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Tipo de Destino</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={form.recommended_cta}
                onChange={set('recommended_cta')}
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="agenda">Agenda (ex: Cal.com)</option>
                <option value="formulario">Formulário</option>
                <option value="checkout">Checkout</option>
                <option value="link">Link Direto</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Status</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={form.status}
                onChange={set('status')}
              >
                <option value="active">Ativa</option>
                <option value="draft">Rascunho</option>
                <option value="paused">Pausada</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Link / Destino Final</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={form.cta_destination}
              onChange={set('cta_destination')}
              placeholder="https:// ou número do WhatsApp"
            />
          </div>
        </div>
      </div>

      {saveError && (
        <div className="mx-4 mb-2 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">
          {saveError}
        </div>
      )}

      <div className="p-4 border-t border-border bg-background/50 flex items-center justify-between gap-3">
        <div>
          {!isNew && (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-destructive font-medium">Confirmar exclusão?</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-xl text-xs h-8 px-2"
                >
                  Não
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-xl text-xs h-8 px-2"
                >
                  {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Excluir'}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={handleDelete}
                className="rounded-xl border-border text-muted-foreground hover:text-destructive hover:border-destructive/30"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose} className="rounded-xl">Cancelar</Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-primary text-primary-foreground"
          >
            {isSaving
              ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              : <Save className="w-4 h-4 mr-2" />}
            Salvar Oferta
          </Button>
        </div>
      </div>
    </div>
  );
}
