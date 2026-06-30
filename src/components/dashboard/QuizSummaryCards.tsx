import { MessageSquare, CheckSquare, Zap, Link } from 'lucide-react';
import { QuizQuestion, RecommendationRule } from '@/types';

interface QuizSummaryCardsProps {
  questions: QuizQuestion[];
  rules: RecommendationRule[];
}

export function QuizSummaryCards({ questions, rules }: QuizSummaryCardsProps) {
  const activeQuestions = questions.filter(q => q.status === 'active' || !q.status).length;
  const configuredAnswers = questions.reduce((acc, q) => acc + (q.options?.length || 0), 0);
  const activeRules = rules.filter(r => r.status === 'active' || r.isActive).length;
  const connectedOffers = new Set(rules.map(r => r.recommendedOfferId || r.offerId)).size;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 text-primary mb-2">
          <MessageSquare className="w-5 h-5" />
          <h3 className="font-bold text-sm">Perguntas Ativas</h3>
        </div>
        <p className="text-2xl font-bold text-ink font-heading">{activeQuestions}</p>
      </div>
      
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 text-muted-foreground mb-2">
          <CheckSquare className="w-5 h-5" />
          <h3 className="font-bold text-sm">Opções Configuradas</h3>
        </div>
        <p className="text-2xl font-bold text-ink font-heading">{configuredAnswers}</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 text-success mb-2">
          <Zap className="w-5 h-5" />
          <h3 className="font-bold text-sm">Regras Ativas</h3>
        </div>
        <p className="text-2xl font-bold text-ink font-heading">{activeRules}</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 text-secondary-foreground mb-2">
          <Link className="w-5 h-5" />
          <h3 className="font-bold text-sm">Ofertas Conectadas</h3>
        </div>
        <p className="text-2xl font-bold text-ink font-heading">{connectedOffers}</p>
      </div>
    </div>
  );
}
