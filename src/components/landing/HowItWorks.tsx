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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {landingData.howItWorks.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-6 bg-surface border border-border p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold font-heading flex items-center justify-center shrink-0">
                {step.step}
              </div>
              <div>
                <h3 className="font-bold text-lg text-ink mt-1.5">{step.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
