import { landingData } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function FinalCTA() {
  return (
    <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary rounded-full blur-[100px] opacity-20"></div>

      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-10 leading-tight">
          {landingData.footer.cta}
        </h2>
        <Button asChild size="lg" className="rounded-full px-12 text-lg h-16 bg-white text-primary hover:bg-surface">
          <Link to="/signup">{landingData.footer.ctaButton}</Link>
        </Button>
      </div>
    </section>
  );
}
