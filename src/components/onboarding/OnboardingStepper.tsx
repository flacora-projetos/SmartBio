import { Check } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface OnboardingStepperProps {
  steps: { id: string; title: string }[];
  currentStepIndex: number;
  onStepClick: (index: number) => void;
}

export function OnboardingStepper({ steps, currentStepIndex, onStepClick }: OnboardingStepperProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
  }, [currentStepIndex]);

  return (
    <div className="flex items-center w-full overflow-x-auto hide-scrollbar pb-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <div
            key={step.id}
            className="flex items-center min-w-max"
            ref={isCurrent ? activeRef : undefined}
          >
            <div
              className={`flex flex-col items-center cursor-pointer transition-colors ${
                isCompleted ? 'text-success' : isCurrent ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => onStepClick(index)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 transition-colors ${
                  isCompleted
                    ? 'bg-success/20 border-success text-success'
                    : isCurrent
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-background border-border text-muted-foreground'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
              </div>
              <span className={`text-xs font-medium ${isCurrent ? 'font-bold' : ''}`}>{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-0.5 mx-2 -translate-y-3 transition-colors shrink-0 ${
                  isCompleted ? 'bg-success/40' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
