import { AuthLayout } from '@/components/auth/AuthLayout';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { dashboardData } from '@/data/mock';

export function Login() {
  return (
    <AuthLayout 
      title={dashboardData.auth.login.title} 
      subtitle={dashboardData.auth.login.subtitle}
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Placeholder: Supabase Auth integration */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">{dashboardData.auth.login.emailLabel}</label>
          <input 
            type="email" 
            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="seu@email.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">{dashboardData.auth.login.passwordLabel}</label>
          <input 
            type="password" 
            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="••••••••"
          />
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            {dashboardData.auth.login.forgotPasswordLink}
          </Link>
        </div>
        <Link to="/app" className={cn(buttonVariants({ variant: "default" }), "w-full bg-ink text-surface hover:bg-ink/90 rounded-xl")}>
          {dashboardData.auth.login.submitButton}
        </Link>
      </form>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        {dashboardData.auth.login.noAccount} <Link to="/signup" className="text-primary hover:underline font-medium">{dashboardData.auth.login.createAccountLink}</Link>
      </p>
    </AuthLayout>
  );
}
