import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { dashboardData } from '@/data/mock';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import type { FormEvent } from 'react';

export function Signup() {
  const [fullName, setFullName] = useState('');
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

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/app`,
      },
    });

    setIsLoading(false);

    if (error) {
      setError('Não foi possível criar a conta. Verifique os dados e tente novamente.');
      return;
    }

    setMessage('Conta criada. Verifique seu e-mail para confirmar o acesso.');
  }

  return (
    <AuthLayout 
      title={dashboardData.auth.signup.title} 
      subtitle={dashboardData.auth.signup.subtitle}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">{dashboardData.auth.signup.nameLabel}</label>
          <input 
            type="text" 
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Seu nome"
            autoComplete="name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">{dashboardData.auth.signup.emailLabel}</label>
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
          <label className="text-sm font-medium text-ink">{dashboardData.auth.signup.passwordLabel}</label>
          <PasswordInput
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            minLength={6}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {message && <p className="text-sm text-success">{message}</p>}
        <Button type="submit" disabled={isLoading} className="w-full bg-ink text-surface hover:bg-ink/90 rounded-xl mt-2">
          {isLoading ? 'Criando conta...' : dashboardData.auth.signup.submitButton}
        </Button>
      </form>
      
      <p className="text-center text-sm text-muted-foreground mt-6">
        {dashboardData.auth.signup.hasAccount} <Link to="/login" className="text-primary hover:underline font-medium">{dashboardData.auth.signup.loginLink}</Link>
      </p>
    </AuthLayout>
  );
}
