import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getOrCreateTenant, type AppTenant } from '@/lib/tenant';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  tenant: AppTenant | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshTenant: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [tenant, setTenant] = useState<AppTenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadTenant(user: User | null) {
    if (!user) {
      setTenant(null);
      return;
    }

    const nextTenant = await getOrCreateTenant(user);
    setTenant(nextTenant);
  }

  async function refreshTenant() {
    await loadTenant(session?.user ?? null);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (error) {
        setSession(null);
        setTenant(null);
        setIsLoading(false);
        return;
      }

      setSession(data.session);

      try {
        await loadTenant(data.session?.user ?? null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      // TOKEN_REFRESHED é silencioso (renovação de token em background).
      // Ignorar para não desmontar páginas e resetar estado de formulários.
      if (event === 'TOKEN_REFRESHED') return;
      setIsLoading(true);
      loadTenant(nextSession?.user ?? null).finally(() => setIsLoading(false));
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    tenant,
    isLoading,
    signOut: async () => {
      await supabase.auth.signOut();
      setSession(null);
      setTenant(null);
    },
    refreshTenant,
  }), [session, tenant, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
}
