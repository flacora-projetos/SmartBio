import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { dashboardData } from '@/data/mock';

export function ForgotPassword() {
  return (
    <AuthLayout 
      title={dashboardData.auth.forgotPassword.title} 
      subtitle={dashboardData.auth.forgotPassword.subtitle}
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Placeholder: Supabase Auth reset password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">{dashboardData.auth.forgotPassword.emailLabel}</label>
          <input 
            type="email" 
            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="seu@email.com"
          />
        </div>
        
        <Button className="w-full bg-ink text-surface hover:bg-ink/90 rounded-xl mt-2">
          {dashboardData.auth.forgotPassword.submitButton}
        </Button>
      </form>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        {dashboardData.auth.forgotPassword.remembered} <Link to="/login" className="text-primary hover:underline font-medium">{dashboardData.auth.forgotPassword.loginLink}</Link>
      </p>
    </AuthLayout>
  );
}
