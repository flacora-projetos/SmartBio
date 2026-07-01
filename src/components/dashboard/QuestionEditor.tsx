import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Trash2, Plus, GripVertical, Loader2 } from 'lucide-react';
import type { DbQuestion } from '@/lib/quiz';

type QuestionPayload = Omit<DbQuestion, 'id' | 'created_at'>;

interface QuestionEditorProps {
  question: DbQuestion | null;
  smartbioId: string | null;
  tenantId: string;
  onSave: (payload: QuestionPayload) => Promise<void>;
  onDelete: () => Promise<void>;
}

type FormData = {
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'text';
  options: string[];
  intention: string;
  status: string;
  is_required: boolean;
};

const EMPTY: FormData = {
  question: '',
  type: 'single_choice',
  options: ['', ''],
  intention: 'Entender objetivo',
  status: 'active',
  is_required: true,
};

function questionToForm(q: DbQuestion): FormData {
  return {
    question: q.question,
    type: q.type,
    options: q.options?.length ? q.options : ['', ''],
    intention: q.intention ?? 'Entender objetivo',
    status: q.status ?? 'active',
    is_required: q.is_required,
  };
}

export function QuestionEditor({
  question,
  smartbioId,
  tenantId,
  onSave,
  onDelete,
}: QuestionEditorProps) {
  const isNew = !question;

  const [form, setForm] = useState<FormData>(question ? questionToForm(question) : EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setForm(question ? questionToForm(question) : EMPTY);
    setConfirmDelete(false);
    setSaveError(null);
  }, [question?.id]);

  const setField = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const updateOption = (i: number, val: string) =>
    setForm(prev => {
      const opts = [...prev.options];
      opts[i] = val;
      return { ...prev, options: opts };
    });

  const addOption = () =>
    setForm(prev => ({ ...prev, options: [...prev.options, ''] }));

  const removeOption = (i: number) =>
    setForm(prev => ({ ...prev, options: prev.options.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    if (!form.question.trim()) { setSaveError('Texto da pergunta é obrigatório.'); return; }
    setSaveError(null);
    setIsSaving(true);
    try {
      const cleanOptions = form.type !== 'text'
        ? form.options.map(o => o.trim()).filter(Boolean)
        : [];
      await onSave({
        tenant_id: tenantId,
        smartbio_id: smartbioId,
        question: form.question.trim(),
        type: form.type,
        options: cleanOptions,
        intention: form.intention || null,
        status: form.status,
        is_required: form.is_required,
        sort_order: question?.sort_order ?? 0,
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
      setSaveError('Erro ao excluir pergunta.');
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (!question && !isNew) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center border-2 border-dashed border-border rounded-2xl">
        <p className="font-medium text-sm">Selecione uma pergunta para editar ou crie uma nova.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl flex flex-col h-full shadow-sm">
      <div className="p-4 border-b border-border bg-background/50 flex items-center justify-between">
        <h3 className="font-bold text-ink font-heading">
          {isNew ? 'Nova Pergunta' : 'Editar Pergunta'}
        </h3>
        {!isNew && (
          confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-destructive font-medium">Confirmar?</span>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)} className="h-7 px-2 text-xs rounded-lg">
                Não
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting} className="h-7 px-2 text-xs rounded-lg">
                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Excluir'}
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Texto da Pergunta *</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={form.question}
              onChange={e => setField('question', e.target.value)}
              placeholder="Ex: Qual é o seu principal objetivo agora?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Tipo de Resposta</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={form.type}
                onChange={e => setField('type', e.target.value as FormData['type'])}
              >
                <option value="single_choice">Escolha Única</option>
                <option value="multiple_choice">Múltipla Escolha</option>
                <option value="text">Texto Livre</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Intenção</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={form.intention}
                onChange={e => setField('intention', e.target.value)}
              >
                {['Entender objetivo', 'Identificar maturidade', 'Mapear dor', 'Definir urgência', 'Escolher formato ideal'].map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {form.type !== 'text' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-ink">Opções de Resposta</label>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                {form.options.length} opção{form.options.length !== 1 ? 'ões' : ''}
              </span>
            </div>

            <div className="space-y-2">
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="p-2 text-muted-foreground cursor-grab">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={opt}
                    onChange={e => updateOption(i, e.target.value)}
                    placeholder={`Opção ${i + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => removeOption(i)}
                    disabled={form.options.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-lg border-dashed"
              onClick={addOption}
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar Opção
            </Button>
          </div>
        )}

        <div className="pt-4 border-t border-border space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_required}
              onChange={e => setField('is_required', e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-ink">Pergunta Obrigatória</span>
          </label>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Status</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={form.status}
              onChange={e => setField('status', e.target.value)}
            >
              <option value="active">Ativa</option>
              <option value="draft">Rascunho</option>
            </select>
          </div>
        </div>
      </div>

      {saveError && (
        <div className="mx-4 mb-2 px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive">
          {saveError}
        </div>
      )}

      <div className="p-4 border-t border-border bg-background/50 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-primary text-primary-foreground"
        >
          {isSaving
            ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            : <Save className="w-4 h-4 mr-2" />}
          Salvar Pergunta
        </Button>
      </div>
    </div>
  );
}
