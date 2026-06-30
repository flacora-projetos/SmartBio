import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import { AiSuggestionsPanel } from '@/components/onboarding/AiSuggestionsPanel';
import { SmartBioPreviewMock } from '@/components/dashboard/SmartBioPreviewMock';
import { mockOnboardingSteps, mockAiSuggestions, mockOffers, mockQuizQuestions } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const step = mockOnboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep < mockOnboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigate('/app/preview');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (step.type) {
      case 'identity':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-surface border border-border flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-[10px]">Foto</span>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-ink">Nome da Marca/Profissional</label>
                <input type="text" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="[NOME_DA_MARCA]" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Bio Curta</label>
              <textarea className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]" defaultValue="[BIO_CURTA_GERADA_PELA_IA]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Posicionamento (Nicho)</label>
              <input type="text" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="[NICHO_DO_USUARIO]" />
            </div>
          </div>
        );
      case 'objective':
        return (
          <div className="space-y-3">
            {['Vender uma oferta', 'Captar leads', 'Qualificar interessados', 'Agendar atendimento'].map((obj, i) => (
              <div key={i} className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${i === 1 ? 'border-primary bg-primary/5' : 'border-border bg-surface hover:border-primary/50'}`}>
                <p className={`font-medium ${i === 1 ? 'text-primary' : 'text-ink'}`}>{obj}</p>
              </div>
            ))}
          </div>
        );
      case 'audience':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Visitante Ideal</label>
              <input type="text" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ex: Criadores de conteúdo iniciantes" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Principal Dor</label>
              <input type="text" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ex: Não sabem como captar leads" />
            </div>
          </div>
        );
      case 'offers':
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">{step.description}</p>
            <div className="space-y-4">
              {mockOffers.map((offer, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-surface flex items-center justify-between">
                  <div>
                    <p className="font-bold text-ink">{offer.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{offer.description}</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg text-xs">Editar</Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full rounded-xl border-dashed">
              + Adicionar Nova Oferta
            </Button>
          </div>
        );
      case 'diagnostic':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Título do Diagnóstico</label>
              <input type="text" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="Diagnóstico Inteligente" />
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-ink">Perguntas (Recomendado 3 a 5)</h4>
              {mockQuizQuestions.map((q, i) => (
                <div key={i} className="p-4 rounded-xl border border-border bg-surface space-y-3">
                  <p className="font-medium text-ink text-sm">{q.question}</p>
                  <div className="space-y-2">
                    {q.options?.map((opt, j) => (
                      <div key={j} className="text-xs p-2 rounded-lg bg-background border border-border text-muted-foreground">
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full rounded-xl border-dashed">
              + Adicionar Pergunta
            </Button>
          </div>
        );
      case 'conversion':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-ink">Destino Final (CTA)</label>
              <div className="grid grid-cols-2 gap-3">
                {['WhatsApp', 'Agenda', 'Formulário', 'Checkout'].map((dest, i) => (
                  <div key={i} className={`p-3 rounded-xl border-2 text-center cursor-pointer text-sm font-medium ${i === 0 ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface hover:border-primary/50 text-ink'}`}>
                    {dest}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Texto do Botão</label>
              <input type="text" className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="Falar no WhatsApp" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">Mensagem Pré-definida (Contexto)</label>
              <textarea className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 h-24" defaultValue="Olá! Acabei de fazer o diagnóstico na SmartBio e gostaria de..." />
            </div>
          </div>
        );
      case 'style':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-ink">Tema Visual</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border-2 border-primary bg-background cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-background border border-border shadow-sm" />
                  <span className="text-xs font-bold text-primary">Claro</span>
                </div>
                <div className="p-4 rounded-xl border-2 border-border bg-ink cursor-pointer flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-ink border border-surface" />
                  <span className="text-xs font-bold text-surface">Escuro</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-ink">Cor de Destaque (Accent)</label>
              <div className="flex gap-3">
                {['#000000', '#2563eb', '#16a34a', '#d97706', '#db2777'].map((color, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full cursor-pointer ${i === 0 ? 'ring-2 ring-offset-2 ring-primary' : ''}`} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">{step.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { label: 'Identidade', value: 'Preenchida', status: 'ok' },
                 { label: 'Objetivo', value: 'Captar leads', status: 'ok' },
                 { label: 'Ofertas', value: '2 configuradas', status: 'ok' },
                 { label: 'Diagnóstico', value: '1 pergunta', status: 'ok' },
                 { label: 'Conversão', value: 'WhatsApp', status: 'ok' },
                 { label: 'Estilo', value: 'Claro', status: 'ok' },
               ].map((item, i) => (
                 <div key={i} className="p-3 rounded-xl border border-border bg-surface flex items-center justify-between">
                   <div>
                     <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                     <p className="text-sm font-bold text-ink">{item.value}</p>
                   </div>
                   <div className="w-2 h-2 rounded-full bg-success" />
                 </div>
               ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="mb-8 shrink-0">
          <h1 className="text-3xl font-heading font-bold text-ink">Onboarding IA</h1>
          <p className="text-muted-foreground mt-2">Guie a criação automática da sua SmartBio.</p>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* Main Area */}
          <div className="flex-1 flex flex-col bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* Stepper */}
            <div className="p-6 border-b border-border bg-background/50">
              <OnboardingStepper 
                steps={mockOnboardingSteps.map(s => ({ id: s.id, title: s.title }))} 
                currentStepIndex={currentStep} 
                onStepClick={setCurrentStep}
              />
            </div>

            {/* Current Step Content */}
            <div className="flex-1 p-6 overflow-y-auto hide-scrollbar">
              <h2 className="text-xl font-bold font-heading text-ink mb-2">{step.title}</h2>
              {step.type !== 'review' && step.type !== 'offers' && step.type !== 'diagnostic' && (
                 <p className="text-sm text-muted-foreground mb-6">{step.description}</p>
              )}
              {renderStepContent()}
            </div>

            {/* Footer Navigation */}
            <div className="p-6 border-t border-border bg-background/50 flex items-center justify-between">
              <Button 
                variant="outline" 
                className="rounded-xl px-6" 
                onClick={handlePrev}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
              
              <Button 
                className="rounded-xl px-8 bg-primary text-primary-foreground" 
                onClick={handleNext}
              >
                {currentStep === mockOnboardingSteps.length - 1 ? (
                  'Gerar Preview Final'
                ) : (
                  <>Continuar <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </div>
          </div>

          {/* Right Sidebar: AI Suggestions & Preview */}
          <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-6 overflow-y-auto hide-scrollbar">
            {currentStep < 5 && (
              <div className="flex-1 min-h-[300px]">
                <AiSuggestionsPanel suggestions={mockAiSuggestions} />
              </div>
            )}
            
            <div className="flex flex-col items-center bg-surface border border-border rounded-2xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink mb-4">Preview em Tempo Real</h3>
              <div className="transform scale-[0.8] origin-top h-[480px]">
                <SmartBioPreviewMock />
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
