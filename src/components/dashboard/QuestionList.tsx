import type { DbQuestion } from '@/lib/quiz';

interface QuestionListProps {
  questions: DbQuestion[];
  selectedQuestionId: string | null;
  onSelectQuestion: (question: DbQuestion) => void;
}

export function QuestionList({ questions, selectedQuestionId, onSelectQuestion }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        Nenhuma pergunta ainda.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {questions.map((q, index) => (
        <div
          key={q.id}
          onClick={() => onSelectQuestion(q)}
          className={`p-4 rounded-2xl border transition-colors cursor-pointer flex flex-col gap-2 ${
            selectedQuestionId === q.id
              ? 'border-primary bg-primary/5'
              : 'border-border bg-surface hover:border-primary/50'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-bold text-muted-foreground shrink-0">{index + 1}.</span>
            <p className="text-sm font-bold text-ink flex-1 leading-snug line-clamp-2">{q.question}</p>
          </div>

          <div className="flex items-center gap-2 mt-1 ml-5 flex-wrap">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
              q.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
            }`}>
              {q.status === 'active' ? 'Ativa' : 'Rascunho'}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-background px-2 py-0.5 rounded-md border border-border">
              {q.type.replace('_', ' ')}
            </span>
            {q.options?.length > 0 && (
              <span className="text-[10px] font-medium text-muted-foreground">
                {q.options.length} opções
              </span>
            )}
            {q.is_required && (
              <span className="text-[10px] text-destructive font-medium ml-auto">Obrigatória</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
