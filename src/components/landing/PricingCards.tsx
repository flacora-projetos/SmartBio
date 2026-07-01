import { landingData } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PricingCards() {
  return (
    <section className="py-24 bg-surface" id="pricing">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-ink mb-4">Planos Simples e Claros</h2>
          <p className="text-xl text-muted-foreground">Escolha o plano ideal para a sua necessidade.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {landingData.pricing.map((plan, i) => {
            const isPopular = i === 1;
            return (
              <div 
                key={plan.id} 
                className={`flex flex-col p-8 rounded-[2rem] border ${isPopular ? 'bg-primary text-primary-foreground border-primary shadow-xl scale-105' : 'bg-card border-border text-ink'}`}
              >
                {isPopular && (
                  <div className="text-center mb-6">
                    <span className="bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Mais Popular
                    </span>
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-heading font-bold mb-2">{plan.name}</h3>
                  <p className={`text-sm ${isPopular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{plan.description}</p>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-bold">{plan.currency} {plan.priceLabel}</span>
                  <span className={`text-sm ${isPopular ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>/mês</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 shrink-0 ${isPopular ? 'text-secondary' : 'text-primary'}`} />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full rounded-full h-12 ${isPopular ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                >
                  <Link to="/signup">Começar com {plan.name}</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
