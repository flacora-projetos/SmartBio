import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockPublicSmartBioData, mockRecommendationPreview, mockRecommendationRules } from '@/data/mock';
import { PublicSmartBioHeader } from '@/components/public/PublicSmartBioHeader';
import { QuizFlowMock } from '@/components/public/QuizFlowMock';
import { RecommendationResult } from '@/components/public/RecommendationResult';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SmartBioPage() {
  const { slug } = useParams();
  const [flowState, setFlowState] = useState<'start' | 'quiz' | 'result'>('start');
  
  const data = mockPublicSmartBioData;
  const questions = data.quizQuestions || [];
  
  // Find the active rule to get the finalCta type
  const activeRule = mockRecommendationRules[0];
  const finalCta = activeRule?.finalCta || 'whatsapp';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none flex justify-center overflow-hidden">
        <div className="w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl absolute -top-[400px] -z-10" />
      </div>

      <div className="w-full max-w-[480px] min-h-screen flex flex-col relative z-10 shadow-2xl bg-surface sm:border-x sm:border-border">
        
        <PublicSmartBioHeader data={data} />
        
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto hide-scrollbar pb-24">
          
          {flowState === 'start' && (
            <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-background border border-border p-6 rounded-3xl text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold font-heading text-ink mb-3">Descubra o próximo passo ideal</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Responda algumas perguntas rápidas para receber uma recomendação personalizada.
                </p>
                <Button 
                  onClick={() => setFlowState('quiz')}
                  className="w-full bg-primary text-primary-foreground rounded-xl h-12 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  Começar Diagnóstico <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {flowState === 'quiz' && (
            <div className="flex-1 flex flex-col justify-center">
               <QuizFlowMock 
                 questions={questions} 
                 onComplete={() => setFlowState('result')} 
               />
            </div>
          )}

          {flowState === 'result' && (
            <div className="flex-1 flex flex-col justify-center">
              <RecommendationResult 
                title={mockRecommendationPreview.title}
                offerName={mockRecommendationPreview.offerName}
                reason={mockRecommendationPreview.reason}
                nextSteps={mockRecommendationPreview.nextSteps}
                buttonText={mockRecommendationPreview.buttonText}
                finalCta={finalCta}
              />
            </div>
          )}

        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-surface via-surface to-transparent flex justify-center pb-6">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Criado com SmartBio
          </span>
        </div>

      </div>
    </div>
  );
}
