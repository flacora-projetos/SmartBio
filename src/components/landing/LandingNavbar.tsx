import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export function LandingNavbar() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <>
      {/* ── Desktop & mobile top bar ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            to={isLoggedIn ? '/app' : '/'}
            className="flex items-center gap-2.5 shrink-0"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg italic font-heading">
              S
            </div>
            <span className="font-bold text-lg tracking-tight uppercase text-ink">SmartBio</span>
          </Link>

          {/* Nav central — só desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-ink transition-colors">Produto</a>
            <a href="#pricing" className="hover:text-ink transition-colors">Preços</a>
            <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                to="/app"
                className={cn(buttonVariants({ variant: 'default' }), 'rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-5 h-9 text-sm font-bold')}
              >
                Acessar painel
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={cn(buttonVariants({ variant: 'ghost' }), 'hidden sm:flex rounded-full text-ink hover:bg-surface h-9 text-sm')}
                >
                  Entrar
                </Link>
                <Link
                  to="/signup"
                  className={cn(buttonVariants({ variant: 'default' }), 'rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-5 h-9 text-sm font-bold hidden md:flex')}
                >
                  Começar grátis
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile bottom CTA bar ─────────────────────────────────────────── */}
      {!isLoggedIn && (
        <div className="fixed bottom-0 inset-x-0 z-50 p-4 pb-safe bg-background/95 backdrop-blur-md border-t border-border md:hidden">
          <Link
            to="/signup"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'w-full rounded-2xl h-12 text-base font-bold shadow-lg shadow-primary/20',
            )}
          >
            Começar grátis — 7 dias sem cartão
          </Link>
        </div>
      )}
    </>
  );
}
