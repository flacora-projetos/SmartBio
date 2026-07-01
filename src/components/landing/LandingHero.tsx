import { landingData } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingHero() {
  return (
    <section className="relative pt-16 pb-20 md:pt-32 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-heading font-bold text-black/[0.03] select-none pointer-events-none whitespace-nowrap z-0 tracking-tighter">
        {landingData.hero.backgroundTypography}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-ink mb-6 leading-[1.1]">
          {landingData.hero.title}
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          {landingData.hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8 text-base h-14 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/signup">{landingData.hero.primaryCta}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 text-base h-14 border-border text-ink hover:bg-surface">
            <a href="#how-it-works">{landingData.hero.secondaryCta}</a>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-5">
          7 dias grátis · sem cartão de crédito · cancele quando quiser
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <div className="bg-surface px-6 py-4 rounded-2xl border border-border flex items-center gap-4 shadow-sm">
            <div className="bg-primary/10 p-2 rounded-full shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-bold text-ink text-sm">Onboarding Guiado</p>
              <p className="text-xs text-muted-foreground">SmartBio pronta em minutos</p>
            </div>
          </div>
          <div className="bg-surface px-6 py-4 rounded-2xl border border-border flex items-center gap-4 shadow-sm">
            <div className="bg-success/10 p-2 rounded-full shrink-0">
              <ArrowRight className="w-5 h-5 text-success" />
            </div>
            <div className="text-left">
              <p className="font-bold text-ink text-sm">Foco em Conversão</p>
              <p className="text-xs text-muted-foreground">Recomendação personalizada por perfil</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
