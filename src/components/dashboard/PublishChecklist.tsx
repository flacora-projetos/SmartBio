import { PreviewChecklistItem } from '@/types';
import { CheckCircle2, Circle } from 'lucide-react';

interface PublishChecklistProps {
  items: PreviewChecklistItem[];
}

export function PublishChecklist({ items }: PublishChecklistProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-ink font-heading mb-4 text-sm uppercase tracking-wider">Checklist de Prontidão</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {item.isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
            <span className={`text-sm font-medium ${item.isComplete ? 'text-ink' : 'text-muted-foreground'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
