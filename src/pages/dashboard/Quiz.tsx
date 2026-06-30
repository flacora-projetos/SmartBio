import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { QuizSummaryCards } from '@/components/dashboard/QuizSummaryCards';
import { QuestionList } from '@/components/dashboard/QuestionList';
import { QuestionEditor } from '@/components/dashboard/QuestionEditor';
import { RecommendationRulesPanel } from '@/components/dashboard/RecommendationRulesPanel';
import { RecommendationPreview } from '@/components/dashboard/RecommendationPreview';
import { RecommendationLogicExplainer } from '@/components/dashboard/RecommendationLogicExplainer';
import { mockQuizQuestions, mockRecommendationRules, mockRecommendationPreview, mockOffers } from '@/data/mock';
import { QuizQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function Quiz() {
  const [selectedQuestion, setSelectedQuestion] = useState<QuizQuestion | null>(null);

  const handleCreateNew = () => {
    setSelectedQuestion({
      id: `new_${Date.now()}`,
      tenantId: 'tnt_01',
      question: '',
      type: 'choice',
      options: ['Opção 1', 'Opção 2'],
      order: mockQuizQuestions.length + 1,
      isRequired: true,
      intention: 'Entender objetivo',
      status: 'draft'
    } as QuizQuestion);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-6">
          
          {/* Header */}
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-3xl font-heading font-bold text-ink">Quiz e recomendação</h1>
              <p className="text-muted-foreground mt-2">Configure perguntas e regras para conduzir o visitante ao próximo passo certo.</p>
            </div>
            <Button onClick={handleCreateNew} className="rounded-xl bg-primary text-primary-foreground hidden sm:flex">
              <Plus className="w-4 h-4 mr-2" /> Nova Pergunta
            </Button>
          </div>

          <QuizSummaryCards questions={mockQuizQuestions} rules={mockRecommendationRules} />

          {/* Main Content Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
            
            {/* Left Column: Questions List */}
            <div className="lg:col-span-4 flex flex-col gap-4">
               <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Perguntas do Diagnóstico</h3>
               <QuestionList 
                 questions={mockQuizQuestions} 
                 selectedQuestionId={selectedQuestion?.id || null}
                 onSelectQuestion={setSelectedQuestion}
               />
               <Button onClick={handleCreateNew} variant="outline" className="w-full rounded-xl border-dashed">
                 <Plus className="w-4 h-4 mr-2" /> Adicionar Pergunta
               </Button>
            </div>

            {/* Center Column: Question Editor */}
            <div className="lg:col-span-5 h-[500px] lg:h-auto">
               <QuestionEditor question={selectedQuestion} />
            </div>

            {/* Right Column: Rules & Preview */}
            <div className="lg:col-span-3 flex flex-col gap-6">
               <RecommendationRulesPanel rules={mockRecommendationRules} offers={mockOffers} />
               <RecommendationPreview previewData={mockRecommendationPreview} />
            </div>

          </div>

          <RecommendationLogicExplainer />
          
        </div>
      </div>
    </DashboardLayout>
  );
}
