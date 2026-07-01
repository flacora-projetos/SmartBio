import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PublicQuestion } from '@/lib/public-smartbio';

interface QuizFlowProps {
  questions: PublicQuestion[];
  onComplete: (answers: string[]) => void;
}

export function QuizFlowMock({ questions, onComplete }: QuizFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    const collected = [...answers, selectedOption ?? ''];
    if (currentIndex < questions.length - 1) {
      setAnswers(collected);
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      onComplete(collected);
    }
  };

  if (!currentQuestion) return null;

  const isLast = currentIndex === questions.length - 1;
  const canAdvance = selectedOption !== null || !currentQuestion.is_required;

  return (
    <div className="bg-primary text-primary-foreground p-6 rounded-3xl shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-4 right-4 text-primary-foreground/20 pointer-events-none">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-primary-foreground/70">
          Pergunta {currentIndex + 1} de {questions.length}
        </p>
        <div className="w-full bg-primary-foreground/20 rounded-full h-1 mb-4">
          <div
            className="bg-primary-foreground rounded-full h-1 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <h2 className="text-xl font-bold font-heading leading-snug pr-8">
          {currentQuestion.question}
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {(currentQuestion.options as string[]).map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedOption(opt)}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
              selectedOption === opt
                ? 'bg-primary-foreground text-primary border-primary-foreground scale-[1.01]'
                : 'bg-primary-foreground/10 border-transparent hover:bg-primary-foreground/20'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!canAdvance}
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold rounded-xl disabled:opacity-40"
        >
          {isLast ? 'Ver Resultado' : 'Próxima'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
