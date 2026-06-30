import { AuthLayout } from '@/components/auth/AuthLayout';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { dashboardData } from '@/data/mock';

export function Signup() {
  return (
    <AuthLayout 
      title={dashboardData.auth.signup.title} 
      subtitle={dashboardData.auth.signup.subtitle}
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Placeholder: Supabase Auth integration */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">{dashboardData.auth.signup.nameLabel}</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Seu nome"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">{dashboardData.auth.signup.emailLabel}</label>
          <input 
            type="email" 
            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="seu@email.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">{dashboardData.auth.signup.passwordLabel}</label>
          <input 
            type="password" 
            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="••••••••"
          />
        </div>
        
        <Link to="/app" className={cn(buttonVariants({ variant: "default" }), "w-full bg-ink text-surface hover:bg-ink/90 rounded-xl mt-2")}>
          {dashboardData.auth.signup.submitButton}
        </Link>
      </form>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        {dashboardData.auth.signup.hasAccount} <Link to="/login" className="text-primary hover:underline font-medium">{dashboardData.auth.signup.loginLink}</Link>
      </p>
    </AuthLayout>
  );
}
