import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, ChevronRight, Edit2, Trash2, Plus, Save, X, Loader2 } from 'lucide-react';
import type { DbRule } from '@/lib/quiz';
import type { DbOffer } from '@/lib/offers';

type RulePayload = Omit<DbRule, 'id' | 'created_at'>;

interface RecommendationRulesPanelProps {
  rules: DbRule[];
  offers: DbOffer[];
  tenantId: string;
  smartbioId: string | null;
  onSave: (payload: RulePayload, existingId?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

type RuleFormData = {
  name: string;
  answer_contains: string;
  recommended_offer_id: string;
  recommendation_reason: string;
  final_cta: string;
  status: 'active' | 'draft';
};

const EMPTY_FORM: RuleFormData = {
  name: '',
  answer_contains: '',
  recommended_offer_id: '',
  recommendation_reason: '',
  final_cta: '',
  status: 'active',
};

function ruleToForm(r: DbRule): RuleFormData {
  const cond = r.condition as { answer_contains?: string };
  return {
    name: r.name,
    answer_contains: cond.answer_contains ?? '',
    recommended_offer_id: r.recommended_offer_id ?? '',
    recommendation_reason: r.recommendation_reason ?? '',
    final_cta: r.final_cta ?? '',
    status: r.status === 'active' ? 'active' : 'draft',
  };
}

export function RecommendationRulesPanel({
  rules, offers, tenantId, smartbioId, onSave, onDelete,
}: RecommendationRulesPanelProps) {
  const [editingId, setEditingId] = useState<string | null | 'new'>(null);
  const [form, setForm] = useState<RuleFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId('new');
    setError(null);
  };

  const openEdit = (rule: DbRule) => {
    setForm(ruleToForm(rule));
    setEditingId(rule.id);
    setError(null);
  };

  const closeForm = () => {
    setEditingId(null);
    setError(null);
  };

  const set = (field: keyof RuleFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Nome da regra é obrigatório.'); return; }
    if (!form.recommended_offer_id) { setError('Selecione uma oferta para recomendar.'); return; }
    setError(null);
    setIsSaving(true);
    try {
      await onSave(
        {
          tenant_id: tenantId,
          smartbio_id: smartbioId,
          name: form.name.trim(),
          description: null,
          condition: form.answer_contains
            ? { answer_contains: form.answer_contains.trim() }
            : {},
          recommended_offer_id: form.recommended_offer_id,
          recommendation_reason: form.recommendation_reason || null,
          final_cta: form.final_cta || null,
          status: form.status,
        },
        editingId === 'new' ? undefined : editingId ?? undefined
      );
      closeForm();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const getOfferName = (id: string | null) =>
    offers.find(o => o.id === id)?.title ?? 'Oferta desconhecida';

  return (
    <div className="bg-surface border border-border rounded-2xl flex flex-col shadow-sm">
      <div className="p-4 border-b border-border bg-background/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-ink font-heading">Regras de Recomendação</h3>
        </div>
        {editingId === null && (
          <Button variant="outline" size="sm" className="rounded-lg text-xs h-7 px-2" onClick={openNew}>
            <Plus className="w-3 h-3 mr-1" /> Nova Regra
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar min-h-[200px]">
        {/* Rule list */}
        {rules.length === 0 && editingId === null && (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Nenhuma regra configurada ainda.
          </div>
        )}

        {rules.map(rule => (
          <div key={rule.id} className="p-3 rounded-xl border border-border bg-background flex flex-col gap-2 group relative">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-ink line-clamp-2 break-words">{rule.name}</span>
                <div className={`mt-0.5 inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                  rule.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                }`}>
                  {rule.status === 'active' ? 'Ativa' : 'Rascunho'}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Button
                  variant="ghost" size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-ink"
                  onClick={() => openEdit(rule)}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost" size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(rule.id)}
                  disabled={deletingId === rule.id}
                >
                  {deletingId === rule.id
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : <Trash2 className="w-3 h-3" />}
                </Button>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-2 text-xs border border-border">
              <div className="flex flex-col gap-1.5">
                {(rule.condition as { answer_contains?: string }).answer_contains && (
                  <div className="flex items-start gap-1.5 text-muted-foreground">
                    <span className="font-bold text-primary mt-[1px] shrink-0">SE</span>
                    <span className="font-mono text-[10px] bg-background px-1 py-0.5 rounded border border-border flex-1 break-words">
                      contém "{(rule.condition as { answer_contains?: string }).answer_contains}"
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ChevronRight className="w-3 h-3 text-success shrink-0" />
                  <span className="font-medium text-ink text-[11px] break-words line-clamp-2">
                    {getOfferName(rule.recommended_offer_id)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Inline form */}
        {editingId !== null && (
          <div className="border-2 border-primary/30 rounded-xl p-4 space-y-3 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {editingId === 'new' ? 'Nova Regra' : 'Editar Regra'}
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={closeForm}>
                <X className="w-3 h-3" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-ink">Nome da Regra *</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={form.name}
                onChange={set('name')}
                placeholder="Ex: Iniciante em busca de consultoria"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-ink">Disparar quando a resposta contém</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={form.answer_contains}
                onChange={set('answer_contains')}
                placeholder="Ex: Iniciante (deixe vazio para regra padrão)"
              />
              <p className="text-[10px] text-muted-foreground">Deixe vazio para ser a regra padrão (fallback).</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-ink">Recomendar oferta *</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={form.recommended_offer_id}
                onChange={set('recommended_offer_id')}
              >
                <option value="">Selecione uma oferta</option>
                {offers.map(o => (
                  <option key={o.id} value={o.id}>{o.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-ink">Motivo da recomendação</label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[52px] resize-none"
                value={form.recommendation_reason}
                onChange={set('recommendation_reason')}
                placeholder="Ex: Esse programa foi criado especialmente para quem está começando…"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-ink">Texto do botão (CTA)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.final_cta}
                  onChange={set('final_cta')}
                  placeholder="Ex: Quero começar agora"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-ink">Status</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={form.status}
                  onChange={set('status')}
                >
                  <option value="active">Ativa</option>
                  <option value="draft">Rascunho</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
            )}

            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="w-full rounded-lg bg-primary text-primary-foreground text-xs h-8"
            >
              {isSaving ? <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> : <Save className="w-3 h-3 mr-1.5" />}
              Salvar Regra
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
