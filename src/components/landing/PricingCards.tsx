import { landingData } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PricingCards() {
  return (
    <section className="py-24 bg-surface" id="pricing">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-ink mb-4">Planos Simples e Claros</h2>
          <p className="text-xl text-muted-foreground">Sem taxas ocultas. Cancele quando quiser.</p>
        </div>

        <p className="text-center text-sm text-primary font-medium mb-12">
          7 dias grátis sem cartão de crédito — produto completo desde o primeiro acesso
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {landingData.pricing.map((plan, i) => {
            const isHighlighted = i === 1;
            return (
              <div
                key={plan.id}
                className={`flex flex-col p-8 rounded-[2rem] border ${
                  isHighlighted
                    ? 'bg-primary text-primary-foreground border-primary shadow-2xl'
                    : 'bg-card border-border text-ink'
                }`}
              >
                {isHighlighted && (
                  <div className="text-center mb-6">
                    <span className="bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-heading font-bold mb-1">{plan.name}</h3>
                  <p className={`text-sm ${isHighlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-2">
                  <div className="flex items-end gap-1">
                    <span className={`text-sm font-medium ${isHighlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {plan.currency}
                    </span>
                    <span className="text-5xl font-bold leading-none">{plan.priceLabel}</span>
                    <span className={`text-sm mb-1 ${isHighlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      /mês
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${isHighlighted ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                    ou R${plan.priceAnnual}/mês no plano anual
                  </p>
                </div>

                <div className={`h-px my-6 ${isHighlighted ? 'bg-primary-foreground/20' : 'bg-border'}`} />

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isHighlighted ? 'text-secondary' : 'text-primary'}`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full rounded-full h-12 font-semibold ${
                    isHighlighted
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <Link to="/signup">Começar 7 dias grátis</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
