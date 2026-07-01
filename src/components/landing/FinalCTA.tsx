import { landingData } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function FinalCTA() {
  return (
    <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-secondary rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-secondary rounded-full blur-[120px] opacity-10 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-6">
          7 dias grátis · sem cartão de crédito
        </p>
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 leading-tight">
          {landingData.footer.cta}
        </h2>
        <Button asChild size="lg" className="rounded-full px-12 text-lg h-16 bg-white text-primary hover:bg-surface font-semibold">
          <Link to="/signup">{landingData.footer.ctaButton}</Link>
        </Button>
        <p className="text-primary-foreground/40 text-sm mt-6">
          Cancele quando quiser. Sem fidelidade.
        </p>
      </div>
    </section>
  );
}
