import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Users, Loader2, MessageSquare, Calendar, ExternalLink, CheckSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

type Lead = {
  id: string;
  created_at: string;
  status: LeadStatus;
  cta_clicked: string | null;
  answers: { quiz_answers?: string[] } | null;
  recommended_offer_id: string | null;
  offers: { title: string } | null;
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Novo',
  contacted: 'Contactado',
  qualified: 'Qualificado',
  converted: 'Convertido',
  lost: 'Perdido',
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-primary/10 text-primary',
  contacted: 'bg-blue-500/10 text-blue-600',
  qualified: 'bg-yellow-500/10 text-yellow-600',
  converted: 'bg-success/10 text-success',
  lost: 'bg-destructive/10 text-destructive',
};

function CtaIcon({ type }: { type: string | null }) {
  switch (type) {
    case 'whatsapp': return <MessageSquare className="w-3 h-3" />;
    case 'agenda':   return <Calendar className="w-3 h-3" />;
    case 'formulario': return <CheckSquare className="w-3 h-3" />;
    default:         return <ExternalLink className="w-3 h-3" />;
  }
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `há ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `há ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;
  return new Date(iso).toLocaleDateString('pt-BR');
}

export function Leads() {
  const { tenant } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenant?.id) return;
    let cancelled = false;

    supabase
      .from('leads')
      .select('id, created_at, status, cta_clicked, answers, recommended_offer_id, offers(title)')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) { setError('Erro ao carregar leads.'); }
        else { setLeads((data ?? []) as Lead[]); }
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [tenant?.id]);

  const updateStatus = async (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    await supabase.from('leads').update({ status }).eq('id', id);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-ink">Leads</h1>
            <p className="text-muted-foreground mt-2">
              Visitantes que completaram o diagnóstico e clicaram no CTA.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-2 shadow-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xl font-bold font-heading text-ink">{leads.length}</span>
            <span className="text-xs text-muted-foreground">total</span>
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
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Users className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-medium text-ink">Nenhum lead ainda</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Quando um visitante completar o diagnóstico e clicar no CTA, ele aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-background/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Oferta Recomendada</th>
                    <th className="px-6 py-4">Respostas</th>
                    <th className="px-6 py-4">Canal</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map(lead => {
                    const answers = lead.answers?.quiz_answers ?? [];
                    return (
                      <tr key={lead.id} className="hover:bg-background/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs text-muted-foreground">
                            {relativeTime(lead.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-ink text-sm">
                            {lead.offers?.title ?? '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[240px]">
                            {answers.length > 0 ? (
                              answers.map((a, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-background border border-border px-2 py-0.5 rounded-full text-muted-foreground font-medium truncate max-w-[120px]"
                                  title={a}
                                >
                                  {a}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 capitalize text-xs text-muted-foreground font-medium">
                            <CtaIcon type={lead.cta_clicked} />
                            {lead.cta_clicked ?? '—'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={lead.status}
                            onChange={e => updateStatus(lead.id, e.target.value as LeadStatus)}
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 ${STATUS_COLORS[lead.status]}`}
                          >
                            {(Object.entries(STATUS_LABELS) as [LeadStatus, string][]).map(([val, label]) => (
                              <option key={val} value={val}>{label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
