import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { dashboardData } from '@/data/mock';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import type { FormEvent } from 'react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setIsLoading(false);

    if (error) {
      setError('Não foi possível enviar as instruções. Verifique o e-mail e tente novamente.');
      return;
    }

    setMessage('Enviamos as instruções de recuperação para seu e-mail.');
  }

  return (
    <AuthLayout 
      title={dashboardData.auth.forgotPassword.title} 
      subtitle={dashboardData.auth.forgotPassword.subtitle}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">{dashboardData.auth.forgotPassword.emailLabel}</label>
          <input 
            type="email" 
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="seu@email.com"
            autoComplete="email"
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-success">{message}</p>}
        <Button type="submit" disabled={isLoading} className="w-full bg-ink text-surface hover:bg-ink/90 rounded-xl mt-2">
          {isLoading ? 'Enviando...' : dashboardData.auth.forgotPassword.submitButton}
        </Button>
      </form>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        {dashboardData.auth.forgotPassword.remembered} <Link to="/login" className="text-primary hover:underline font-medium">{dashboardData.auth.forgotPassword.loginLink}</Link>
      </p>
    </AuthLayout>
  );
}
