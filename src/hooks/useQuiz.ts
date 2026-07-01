import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  fetchQuestions, createQuestion, updateQuestion, deleteQuestion,
  fetchRules, createRule, updateRule, deleteRule,
  type DbQuestion, type DbRule,
} from '@/lib/quiz';
import { fetchOffers, type DbOffer } from '@/lib/offers';
import { useAuth } from '@/contexts/AuthContext';

export function useQuiz() {
  const { tenant } = useAuth();
  const [questions, setQuestions] = useState<DbQuestion[]>([]);
  const [rules, setRules] = useState<DbRule[]>([]);
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
        const [{ data: sb }, qs, rs, os] = await Promise.all([
          supabase
            .from('smartbios')
            .select('id')
            .eq('tenant_id', tenant!.id)
            .limit(1)
            .maybeSingle(),
          fetchQuestions(tenant!.id),
          fetchRules(tenant!.id),
          fetchOffers(tenant!.id),
        ]);
        if (cancelled) return;
        setSmartbioId(sb?.id ?? null);
        setQuestions(qs);
        setRules(rs);
        setOffers(os);
      } catch {
        if (!cancelled) setError('Erro ao carregar quiz e regras.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tenant?.id]);

  // ── Questions ──────────────────────────────────────────────

  const createQ = useCallback(
    async (payload: Omit<DbQuestion, 'id' | 'created_at'>) => {
      const next = await createQuestion({ ...payload, sort_order: questions.length });
      setQuestions(prev => [...prev, next]);
      return next;
    },
    [questions.length]
  );

  const updateQ = useCallback(
    async (id: string, updates: Partial<Omit<DbQuestion, 'id' | 'created_at'>>) => {
      const next = await updateQuestion(id, updates);
      setQuestions(prev => prev.map(q => (q.id === id ? next : q)));
      return next;
    },
    []
  );

  const removeQ = useCallback(async (id: string) => {
    await deleteQuestion(id);
    setQuestions(prev => prev.filter(q => q.id !== id));
  }, []);

  // ── Rules ──────────────────────────────────────────────────

  const createR = useCallback(
    async (payload: Omit<DbRule, 'id' | 'created_at'>) => {
      const next = await createRule(payload);
      setRules(prev => [...prev, next]);
      // mark offer as connected
      if (next.recommended_offer_id) {
        setOffers(prev =>
          prev.map(o => o.id === next.recommended_offer_id ? { ...o, is_connected_to_rule: true } : o)
        );
      }
      return next;
    },
    []
  );

  const updateR = useCallback(
    async (id: string, updates: Partial<Omit<DbRule, 'id' | 'created_at'>>) => {
      const next = await updateRule(id, updates);
      setRules(prev => prev.map(r => (r.id === id ? next : r)));
      return next;
    },
    []
  );

  const removeR = useCallback(async (id: string) => {
    await deleteRule(id);
    setRules(prev => prev.filter(r => r.id !== id));
  }, []);

  return {
    questions, rules, offers, smartbioId,
    isLoading, error,
    createQ, updateQ, removeQ,
    createR, updateR, removeR,
  };
}
