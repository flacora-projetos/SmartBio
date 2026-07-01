import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { QuizSummaryCards } from '@/components/dashboard/QuizSummaryCards';
import { QuestionList } from '@/components/dashboard/QuestionList';
import { QuestionEditor } from '@/components/dashboard/QuestionEditor';
import { RecommendationRulesPanel } from '@/components/dashboard/RecommendationRulesPanel';
import { RecommendationPreview } from '@/components/dashboard/RecommendationPreview';
import { RecommendationLogicExplainer } from '@/components/dashboard/RecommendationLogicExplainer';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/hooks/useQuiz';
import { useAuth } from '@/contexts/AuthContext';
import type { DbQuestion } from '@/lib/quiz';
import type { DbRule } from '@/lib/quiz';

export function Quiz() {
  const { tenant } = useAuth();
  const {
    questions, rules, offers, smartbioId,
    isLoading, error,
    createQ, updateQ, removeQ,
    createR, updateR, removeR,
  } = useQuiz();

  // null = editor empty | DbQuestion = editing existing | 'new' = creating
  const [selectedQuestion, setSelectedQuestion] = useState<DbQuestion | null>(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);

  const openNew = () => {
    setSelectedQuestion(null);
    setIsNewQuestion(true);
  };

  const handleSaveQuestion = async (payload: Omit<DbQuestion, 'id' | 'created_at'>) => {
    if (isNewQuestion) {
      const created = await createQ(payload);
      setSelectedQuestion(created);
      setIsNewQuestion(false);
    } else if (selectedQuestion) {
      const updated = await updateQ(selectedQuestion.id, payload);
      setSelectedQuestion(updated);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestion) return;
    await removeQ(selectedQuestion.id);
    setSelectedQuestion(null);
    setIsNewQuestion(false);
  };

  const handleSaveRule = async (
    payload: Omit<DbRule, 'id' | 'created_at'>,
    existingId?: string
  ) => {
    if (existingId) {
      await updateR(existingId, payload);
    } else {
      await createR(payload);
    }
  };

  const editorQuestion = isNewQuestion ? null : selectedQuestion;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-6">

          <div className="flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-3xl font-heading font-bold text-ink">Quiz e recomendação</h1>
              <p className="text-muted-foreground mt-2">
                Configure perguntas e regras para conduzir o visitante ao próximo passo certo.
              </p>
            </div>
            <Button onClick={openNew} className="rounded-xl bg-primary text-primary-foreground hidden sm:flex">
              <Plus className="w-4 h-4 mr-2" /> Nova Pergunta
            </Button>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
              {error}
            </div>
          ) : (
            <>
              <QuizSummaryCards questions={questions} rules={rules} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">

                {/* Left: Question list */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Perguntas do Diagnóstico
                  </h3>
                  <QuestionList
                    questions={questions}
                    selectedQuestionId={selectedQuestion?.id ?? null}
                    onSelectQuestion={q => { setSelectedQuestion(q); setIsNewQuestion(false); }}
                  />
                  <Button onClick={openNew} variant="outline" className="w-full rounded-xl border-dashed">
                    <Plus className="w-4 h-4 mr-2" /> Adicionar Pergunta
                  </Button>
                </div>

                {/* Center: Question editor */}
                <div className="lg:col-span-5 h-[500px] lg:h-auto">
                  {tenant && (
                    <QuestionEditor
                      question={editorQuestion}
                      smartbioId={smartbioId}
                      tenantId={tenant.id}
                      onSave={handleSaveQuestion}
                      onDelete={handleDeleteQuestion}
                    />
                  )}
                </div>

                {/* Right: Rules & Preview */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                  {tenant && (
                    <RecommendationRulesPanel
                      rules={rules}
                      offers={offers}
                      tenantId={tenant.id}
                      smartbioId={smartbioId}
                      onSave={handleSaveRule}
                      onDelete={removeR}
                    />
                  )}
                  <RecommendationPreview previewData={null} />
                </div>

              </div>

              <RecommendationLogicExplainer />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
