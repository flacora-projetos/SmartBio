import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BarChart2, Eye, PlayCircle, CheckCircle2, MousePointerClick, Loader2, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type Period = '7d' | '30d' | 'all';

type Counts = {
  page_view: number;
  quiz_start: number;
  quiz_complete: number;
  cta_click: number;
};

const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 dias',
  '30d': '30 dias',
  all: 'Todo período',
};

function sinceDate(period: Period): string | null {
  if (period === 'all') return null;
  const d = new Date();
  d.setDate(d.getDate() - (period === '7d' ? 7 : 30));
  return d.toISOString();
}

function pct(num: number, denom: number): string {
  if (!denom) return '—';
  return `${Math.round((num / denom) * 100)}%`;
}

function FunnelBar({ value, max, color }: { value: number; max: number; color: string }) {
  const width = max ? Math.max((value / max) * 100, value > 0 ? 4 : 0) : 0;
  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function Analytics() {
  const { tenant } = useAuth();
  const [period, setPeriod] = useState<Period>('30d');
  const [counts, setCounts] = useState<Counts>({ page_view: 0, quiz_start: 0, quiz_complete: 0, cta_click: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenant?.id) return;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      const since = sinceDate(period);

      try {
        const events: Array<keyof Counts> = ['page_view', 'quiz_start', 'quiz_complete', 'cta_click'];
        const results = await Promise.all(
          events.map(evt => {
            let q = supabase
              .from('analytics_events')
              .select('id', { count: 'exact', head: true })
              .eq('tenant_id', tenant!.id)
              .eq('event_type', evt);
            if (since) q = q.gte('created_at', since);
            return q;
          })
        );

        if (cancelled) return;
        setCounts({
          page_view:     results[0].count ?? 0,
          quiz_start:    results[1].count ?? 0,
          quiz_complete: results[2].count ?? 0,
          cta_click:     results[3].count ?? 0,
        });
      } catch {
        if (!cancelled) setError('Erro ao carregar analytics.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tenant?.id, period]);

  const metrics = [
    {
      label: 'Visitantes',
      value: counts.page_view,
      icon: Eye,
      color: 'text-primary',
      bg: 'bg-primary/10',
      bar: 'bg-primary',
    },
    {
      label: 'Iniciaram Quiz',
      value: counts.quiz_start,
      icon: PlayCircle,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      bar: 'bg-blue-500',
      rate: pct(counts.quiz_start, counts.page_view),
      rateLabel: 'dos visitantes',
    },
    {
      label: 'Completaram Quiz',
      value: counts.quiz_complete,
      icon: CheckCircle2,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      bar: 'bg-yellow-500',
      rate: pct(counts.quiz_complete, counts.quiz_start),
      rateLabel: 'dos que iniciaram',
    },
    {
      label: 'Cliques no CTA',
      value: counts.cta_click,
      icon: MousePointerClick,
      color: 'text-success',
      bg: 'bg-success/10',
      bar: 'bg-success',
      rate: pct(counts.cta_click, counts.quiz_complete),
      rateLabel: 'dos que completaram',
    },
  ];

  const maxValue = Math.max(...metrics.map(m => m.value), 1);
  const overallRate = pct(counts.cta_click, counts.page_view);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-ink">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Funil de conversão da sua SmartBio.
            </p>
          </div>
          <div className="flex bg-surface border border-border rounded-xl p-1 gap-1 shadow-sm self-start">
            {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  period === p
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-ink'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="px-4 py-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
            {error}
          </div>
        ) : (
          <>
            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map(m => (
                <div key={m.label} className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
                  <div className={`flex items-center gap-2 mb-3 ${m.color}`}>
                    <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                      <m.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-ink">{m.label}</span>
                  </div>
                  <p className="text-3xl font-bold font-heading text-ink mb-1">
                    {m.value.toLocaleString('pt-BR')}
                  </p>
                  {'rate' in m && m.rate !== '—' && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-bold text-ink">{m.rate}</span> {m.rateLabel}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Funil */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h2 className="font-bold text-ink font-heading">Funil de Conversão</h2>
                {overallRate !== '—' && (
                  <span className="ml-auto text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                    {overallRate} conversão geral
                  </span>
                )}
              </div>

              <div className="space-y-5">
                {metrics.map((m, i) => (
                  <div key={m.label} className="flex items-center gap-4">
                    <div className={`w-7 h-7 rounded-full ${m.bg} ${m.color} flex items-center justify-center shrink-0`}>
                      <m.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-ink">{m.label}</span>
                        <div className="flex items-center gap-3">
                          {'rate' in m && m.rate !== '—' && (
                            <span className="text-xs text-muted-foreground hidden sm:block">{m.rate}</span>
                          )}
                          <span className="text-sm font-bold text-ink w-12 text-right">
                            {m.value.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <FunnelBar value={m.value} max={maxValue} color={m.bar} />
                    </div>
                    {i < metrics.length - 1 && (
                      <div className="w-5 shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {counts.page_view === 0 && (
                <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
                  <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  Nenhum evento registrado ainda neste período.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
