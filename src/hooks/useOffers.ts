import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchOffers, createOffer, updateOffer, deleteOffer, type DbOffer } from '@/lib/offers';
import { useAuth } from '@/contexts/AuthContext';

export function useOffers() {
  const { tenant } = useAuth();
  const [offers, setOffers] = useState<DbOffer[]>([]);
  const [smartbioId, setSmartbioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenant?.id) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [{ data: sb }, data] = await Promise.all([
          supabase
            .from('smartbios')
            .select('id')
            .eq('tenant_id', tenant!.id)
            .limit(1)
            .maybeSingle(),
          fetchOffers(tenant!.id),
        ]);
        if (cancelled) return;
        setSmartbioId(sb?.id ?? null);
        setOffers(data);
      } catch {
        if (!cancelled) setError('Erro ao carregar ofertas.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tenant?.id]);

  const create = useCallback(
    async (input: Omit<DbOffer, 'id' | 'created_at' | 'is_connected_to_rule'>) => {
      const next = await createOffer({ ...input, sort_order: offers.length });
      setOffers(prev => [...prev, next]);
      return next;
    },
    [offers.length]
  );

  const update = useCallback(
    async (id: string, updates: Partial<Omit<DbOffer, 'id' | 'created_at' | 'is_connected_to_rule'>>) => {
      const next = await updateOffer(id, updates);
      setOffers(prev => prev.map(o => (o.id === id ? next : o)));
      return next;
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    await deleteOffer(id);
    setOffers(prev => prev.filter(o => o.id !== id));
  }, []);

  return { offers, smartbioId, isLoading, error, create, update, remove };
}
