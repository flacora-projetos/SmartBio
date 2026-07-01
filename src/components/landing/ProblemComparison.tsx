import { landingData } from '@/data/mock';
import { Check, X } from 'lucide-react';

export function ProblemComparison() {
  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-ink mb-4">{landingData.problem.title}</h2>
          <p className="text-lg text-muted-foreground">{landingData.problem.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Before */}
          <div className="bg-surface border border-border p-8 md:p-12 rounded-[2rem] shadow-sm">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-bold tracking-wide uppercase mb-8">
              {landingData.problem.before.title}
            </div>
            <ul className="space-y-6">
              {landingData.problem.before.items.map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-ink/70">
                  <div className="mt-1 bg-destructive/20 p-1 rounded-full shrink-0">
                    <X className="w-4 h-4 text-destructive" />
                  </div>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="bg-primary text-primary-foreground p-8 md:p-12 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary blur-[80px] opacity-20 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-bold tracking-wide uppercase mb-8 relative z-10">
              {landingData.problem.after.title}
            </div>
            <ul className="space-y-6 relative z-10">
              {landingData.problem.after.items.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 bg-success p-1 rounded-full shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
