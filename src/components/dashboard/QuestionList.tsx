import { QuizQuestion } from '@/types';
import { QuestionStatusBadge } from './QuestionStatusBadge';

interface QuestionListProps {
  questions: QuizQuestion[];
  selectedQuestionId: string | null;
  onSelectQuestion: (question: QuizQuestion) => void;
}

export function QuestionList({ questions, selectedQuestionId, onSelectQuestion }: QuestionListProps) {
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
            <QuestionStatusBadge status={q.status} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-background px-2 py-0.5 rounded-md border border-border">
              {q.type.replace('_', ' ')}
            </span>
            {q.options && (
              <span className="text-[10px] font-medium text-muted-foreground">
                {q.options.length} opções
              </span>
            )}
            {q.isRequired && (
              <span className="text-[10px] text-destructive font-medium ml-auto">Obrigatória</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
