import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LandingNavbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center mt-4 px-4 pointer-events-none">
      <div className="bg-background/80 backdrop-blur-md border border-border shadow-sm rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg italic font-heading">S</div>
          <span className="font-bold text-lg tracking-tight uppercase text-ink">SmartBio</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#how-it-works" className="hover:text-ink transition-colors">Produto</a>
          <a href="#pricing" className="hover:text-ink transition-colors">Preços</a>
          <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <a href="/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:flex rounded-full text-ink hover:bg-surface")}>
            Entrar
          </a>
          <a href="/signup" className={cn(buttonVariants({ variant: "default" }), "rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6")}>
            Começar grátis
          </a>
        </div>
      </div>
    </header>
  );
}
