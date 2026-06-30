import { Sparkles, Check, X } from 'lucide-react';
import { AiSuggestion } from '@/types';

interface AiSuggestionsPanelProps {
  suggestions: AiSuggestion[];
}

export function AiSuggestionsPanel({ suggestions }: AiSuggestionsPanelProps) {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <Sparkles className="w-5 h-5" />
        <h3 className="font-bold font-heading">Sugestões da IA</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        A IA sugere estrutura, textos e perguntas. Você revisa tudo antes da publicação.
      </p>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2 hide-scrollbar">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-background rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {suggestion.type === 'bio' ? 'Texto sugerido' : suggestion.type === 'quiz' ? 'Pergunta sugerida' : 'Sugestão'}
              </span>
              {suggestion.isAccepted ? (
                <span className="text-[10px] bg-success/20 text-success px-2 py-0.5 rounded-full font-medium">Aceito</span>
              ) : (
                <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-medium">Pendente</span>
              )}
            </div>
            
            {typeof suggestion.content === 'string' ? (
              <p className="text-sm text-ink font-medium">{suggestion.content}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-ink font-bold">{suggestion.content.question}</p>
                {suggestion.content.options?.map((opt: string, i: number) => (
                  <div key={i} className="text-xs bg-surface p-2 rounded-lg border border-border text-muted-foreground">
                    {opt}
                  </div>
                ))}
              </div>
            )}

            {!suggestion.isAccepted && (
              <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                  <Check className="w-3 h-3" /> Aceitar
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-border text-muted-foreground text-xs font-medium hover:bg-surface transition-colors">
                  <X className="w-3 h-3" /> Recusar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
