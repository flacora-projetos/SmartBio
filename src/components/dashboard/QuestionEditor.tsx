import { QuizQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import { Copy, Save, Trash2, GripVertical, Plus } from 'lucide-react';

interface QuestionEditorProps {
  question: QuizQuestion | null;
}

export function QuestionEditor({ question }: QuestionEditorProps) {
  if (!question) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center border-2 border-dashed border-border rounded-2xl">
        <p className="font-medium text-sm">Selecione uma pergunta para editar ou crie uma nova.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl flex flex-col h-full shadow-sm">
      <div className="p-4 border-b border-border bg-background/50 flex items-center justify-between">
        <h3 className="font-bold text-ink font-heading">{question.id.startsWith('new') ? 'Nova Pergunta' : 'Editar Pergunta'}</h3>
        <div className="flex gap-2">
          {!question.id.startsWith('new') && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-ink">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Texto da Pergunta</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue={question.question} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Tipo de Resposta</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue={question.type}>
                <option value="choice">Escolha Única</option>
                <option value="multiple_choice">Múltipla Escolha</option>
                <option value="text">Texto Livre</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Intenção da Pergunta</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue={question.intention || 'Entender objetivo'}>
                <option value="Entender objetivo">Entender objetivo</option>
                <option value="Identificar maturidade">Identificar maturidade</option>
                <option value="Mapear dor">Mapear dor</option>
                <option value="Definir urgência">Definir urgência</option>
                <option value="Escolher formato ideal">Escolher formato ideal</option>
              </select>
            </div>
          </div>
        </div>

        {question.type !== 'text' && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-ink flex justify-between items-center">
              Opções de Resposta
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Arraste para reordenar</span>
            </label>
            
            <div className="space-y-2">
              {question.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="p-2 cursor-grab text-muted-foreground hover:text-ink">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <input type="text" className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue={opt} />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="w-full rounded-lg border-dashed mt-2">
              <Plus className="w-4 h-4 mr-2" /> Adicionar Opção
            </Button>
          </div>
        )}

        <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
           <div className="space-y-1">
             <label className="flex items-center gap-2 cursor-pointer">
               <input type="checkbox" defaultChecked={question.isRequired} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
               <span className="text-sm font-medium text-ink">Pergunta Obrigatória</span>
             </label>
             <p className="text-xs text-muted-foreground ml-6">O visitante não pode pular esta pergunta.</p>
           </div>
        </div>

      </div>

      <div className="p-4 border-t border-border bg-background/50 flex justify-end">
        <Button className="rounded-xl bg-primary text-primary-foreground">
          <Save className="w-4 h-4 mr-2" /> Salvar Pergunta
        </Button>
      </div>
    </div>
  );
}
