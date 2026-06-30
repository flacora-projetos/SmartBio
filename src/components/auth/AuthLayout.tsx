import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <Link to="/" className="absolute top-8 left-8 text-muted-foreground hover:text-ink transition-colors flex items-center gap-2 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>
      
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-heading font-bold text-2xl tracking-tight text-ink mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              SB
            </div>
            SmartBio
          </div>
          <h1 className="text-2xl font-bold text-ink mt-6">{title}</h1>
          <p className="text-muted-foreground text-sm mt-2">{subtitle}</p>
        </div>
        
        {children}
      </div>
    </div>
  );
}
