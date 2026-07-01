import { useState } from 'react';
import { Loader2, Plus, MessageSquare, Zap } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { QuizSummaryCards } from '@/components/dashboard/QuizSummaryCards';
import { QuestionList } from '@/components/dashboard/QuestionList';
import { QuestionEditor } from '@/components/dashboard/QuestionEditor';
import { RecommendationRulesPanel } from '@/components/dashboard/RecommendationRulesPanel';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/hooks/useQuiz';
import { useAuth } from '@/contexts/AuthContext';
import type { DbQuestion, DbRule } from '@/lib/quiz';

type Tab = 'questions' | 'rules';

export function Quiz() {
  const { tenant } = useAuth();
  const {
    questions, rules, offers, smartbioId,
    isLoading, error,
    createQ, updateQ, removeQ,
    createR, updateR, removeR,
  } = useQuiz();

  const [activeTab, setActiveTab] = useState<Tab>('questions');
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

  const handleSaveRule = async (payload: Omit<DbRule, 'id' | 'created_at'>, existingId?: string) => {
    if (existingId) {
      await updateR(existingId, payload);
    } else {
      await createR(payload);
    }
  };

  const editorQuestion = isNewQuestion ? null : selectedQuestion;
  const showEditor = isNewQuestion || selectedQuestion !== null;

  const activeQuestions = questions.filter(q => q.status === 'active').length;
  const activeRules = rules.filter(r => r.status === 'active').length;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-ink">Quiz e recomendação</h1>
            <p className="text-muted-foreground mt-1">
              Configure perguntas para qualificar visitantes e regras para recomendar a oferta certa.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
            {error}
          </div>
        ) : (
          <>
            <QuizSummaryCards questions={questions} rules={rules} />

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('questions')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'questions'
                    ? 'bg-surface shadow-sm text-ink'
                    : 'text-muted-foreground hover:text-ink'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Perguntas
                {activeQuestions > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === 'questions' ? 'bg-primary/10 text-primary' : 'bg-border text-muted-foreground'
                  }`}>
                    {activeQuestions}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rules')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'rules'
                    ? 'bg-surface shadow-sm text-ink'
                    : 'text-muted-foreground hover:text-ink'
                }`}
              >
                <Zap className="w-4 h-4" />
                Regras
                {activeRules > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === 'rules' ? 'bg-success/10 text-success' : 'bg-border text-muted-foreground'
                  }`}>
                    {activeRules}
                  </span>
                )}
              </button>
            </div>

            {/* Aba: Perguntas */}
            {activeTab === 'questions' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[480px]">

                {/* Coluna esquerda: lista */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Perguntas do diagnóstico
                    </p>
                    <Button onClick={openNew} size="sm" className="rounded-xl bg-primary text-primary-foreground text-xs h-8">
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Nova pergunta
                    </Button>
                  </div>

                  <QuestionList
                    questions={questions}
                    selectedQuestionId={selectedQuestion?.id ?? null}
                    onSelectQuestion={q => { setSelectedQuestion(q); setIsNewQuestion(false); }}
                  />

                  {questions.length === 0 && !isNewQuestion && (
                    <div
                      className="flex flex-col items-center justify-center gap-3 py-12 border-2 border-dashed border-border rounded-2xl text-center cursor-pointer hover:border-primary/40 transition-colors"
                      onClick={openNew}
                    >
                      <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
                      <div>
                        <p className="text-sm font-semibold text-ink">Nenhuma pergunta ainda</p>
                        <p className="text-xs text-muted-foreground mt-1">Clique para criar a primeira pergunta do diagnóstico</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Coluna direita: editor */}
                <div className="h-[480px] lg:h-auto">
                  {showEditor && tenant ? (
                    <QuestionEditor
                      question={editorQuestion}
                      smartbioId={smartbioId}
                      tenantId={tenant.id}
                      onSave={handleSaveQuestion}
                      onDelete={handleDeleteQuestion}
                    />
                  ) : (
                    <div
                      className="h-full flex flex-col items-center justify-center gap-3 text-center border-2 border-dashed border-border rounded-2xl p-8 cursor-pointer hover:border-primary/40 transition-colors"
                      onClick={openNew}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Plus className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {questions.length > 0 ? 'Selecione uma pergunta para editar' : 'Crie a primeira pergunta'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Perguntas qualificam o visitante para a recomendação certa
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Aba: Regras */}
            {activeTab === 'rules' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 p-4 bg-success/5 border border-success/20 rounded-2xl">
                  <Zap className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <p className="text-sm text-ink leading-relaxed">
                    <span className="font-semibold">Como funciona:</span> cada regra mapeia uma resposta do visitante para uma oferta recomendada. Se nenhuma regra casar, a primeira regra da lista é usada como padrão.
                  </p>
                </div>

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

                {offers.length === 0 && (
                  <div className="p-4 bg-warning/5 border border-warning/20 rounded-2xl text-sm text-ink">
                    <span className="font-semibold">Atenção:</span> cadastre pelo menos uma oferta na aba Ofertas antes de criar regras.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
