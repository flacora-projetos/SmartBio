import { useState } from 'react';
import { QuizQuestion } from '@/types';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizFlowMockProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

export function QuizFlowMock({ questions, onComplete }: QuizFlowMockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      onComplete();
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="bg-primary text-primary-foreground p-6 rounded-3xl shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-4 right-4 text-primary-foreground/30">
        <Sparkles className="w-8 h-8" />
      </div>
      
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-primary-foreground/80">
          Pergunta {currentIndex + 1} de {questions.length}
        </p>
        <h2 className="text-xl font-bold font-heading leading-snug pr-8">
          {currentQuestion.question}
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {currentQuestion.options?.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelectedOption(opt)}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-colors border-2 ${
              selectedOption === opt 
                ? 'bg-primary-foreground text-primary border-primary-foreground' 
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
          disabled={!selectedOption && currentQuestion.isRequired}
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold rounded-xl"
        >
          {currentIndex < questions.length - 1 ? 'Próxima' : 'Ver Resultado'} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
