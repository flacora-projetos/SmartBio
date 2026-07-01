import { landingData } from '@/data/mock';

export function HowItWorks() {
  return (
    <section className="py-24 bg-background" id="how-it-works">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-ink mb-6">
            {landingData.howItWorks.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {landingData.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingData.howItWorks.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-5 bg-surface border border-border p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold font-heading flex items-center justify-center shrink-0 text-sm">
                {step.step}
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-base text-ink mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
