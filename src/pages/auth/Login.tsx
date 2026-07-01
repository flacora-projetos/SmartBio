import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardData } from '@/data/mock';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import type { FormEvent } from 'react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setError('Não foi possível entrar. Verifique seu e-mail e senha.');
      return;
    }

    setMessage('Login realizado. Redirecionando...');
    navigate('/app');
  }

  return (
    <AuthLayout 
      title={dashboardData.auth.login.title} 
      subtitle={dashboardData.auth.login.subtitle}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">{dashboardData.auth.login.emailLabel}</label>
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">{dashboardData.auth.login.passwordLabel}</label>
          <input 
            type="password" 
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-success">{message}</p>}
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            {dashboardData.auth.login.forgotPasswordLink}
          </Link>
        </div>
        <Button type="submit" disabled={isLoading} className="w-full bg-ink text-surface hover:bg-ink/90 rounded-xl">
          {isLoading ? 'Entrando...' : dashboardData.auth.login.submitButton}
        </Button>
      </form>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        {dashboardData.auth.login.noAccount} <Link to="/signup" className="text-primary hover:underline font-medium">{dashboardData.auth.login.createAccountLink}</Link>
      </p>
    </AuthLayout>
  );
}
