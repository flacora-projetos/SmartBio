import { landingData } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export function AiOnboardingSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2 order-2 lg:order-1">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-xl relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              
              <div className="mb-6">
                <h3 className="font-heading font-bold text-xl text-ink mb-2">Interface do Concierge IA</h3>
                <p className="text-sm text-muted-foreground">Respondendo ao onboarding gerador</p>
              </div>

              <div className="bg-surface rounded-2xl p-6 border border-border mb-6">
                <p className="font-bold text-ink text-lg mb-4">{landingData.onboarding.question}</p>
                <div className="space-y-3">
                  {landingData.onboarding.options.map((opt, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${i === 3 ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/30 cursor-pointer'} transition-all flex items-center justify-between`}>
                      <span className="font-medium">{opt}</span>
                      {i === 3 && <div className="w-4 h-4 rounded-full border-2 border-primary-foreground flex items-center justify-center"><div className="w-2 h-2 bg-primary-foreground rounded-full"></div></div>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">A IA sugere automaticamente:</p>
                <div className="flex flex-wrap gap-2">
                  {landingData.onboarding.aiSuggestions.map((sug, i) => (
                    <span key={i} className="px-3 py-1 bg-surface border border-border rounded-full text-xs font-medium text-ink">
                      {sug}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-ink mb-6">
              {landingData.onboarding.title}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {landingData.onboarding.description}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
