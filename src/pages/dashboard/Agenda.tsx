import { useState, useEffect } from 'react';
import {
  Calendar, Plus, Trash2, Save, Loader2, CheckCircle2,
  Clock, Users, CheckSquare, XSquare, ChevronDown,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getOrCreateWorkspaceSmartBio } from '@/lib/smartbio-flow';
import type { AgendaConfig, AgendaService } from '@/lib/public-smartbio';

type Tab = 'config' | 'requests';

type Request = {
  id: string;
  visitor_name: string;
  visitor_phone: string;
  visitor_email: string | null;
  service_name: string | null;
  preferred_date: string;
  preferred_time: string;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};

const DOW_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const DEFAULT_CONFIG: AgendaConfig = {
  enabled: false,
  services: [{ name: 'Atendimento', duration_minutes: 60 }],
  available_days: [1, 2, 3, 4, 5],
  start_time: '09:00',
  end_time: '18:00',
  slot_duration_minutes: 60,
  advance_days: 30,
};

function ptDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function StatusBadge({ status }: { status: Request['status'] }) {
  const map = {
    pending:   'bg-warning/10 text-warning border-warning/20',
    confirmed: 'bg-success/10 text-success border-success/20',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  };
  const label = { pending: 'Pendente', confirmed: 'Confirmado', cancelled: 'Cancelado' };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${map[status]}`}>
      {label[status]}
    </span>
  );
}

export function Agenda() {
  const { tenant } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('config');
  const [smartbioId, setSmartbioId] = useState<string | null>(null);
  const [config, setConfig] = useState<AgendaConfig>(DEFAULT_CONFIG);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | Request['status']>('all');

  useEffect(() => {
    if (!tenant) return;
    getOrCreateWorkspaceSmartBio(tenant).then(sb => {
      setSmartbioId(sb.id);
      const cfg = (sb as unknown as { agenda_config?: AgendaConfig }).agenda_config;
      if (cfg && typeof cfg === 'object') {
        setConfig({ ...DEFAULT_CONFIG, ...cfg });
      }
      setLoadingConfig(false);
    });
  }, [tenant]);

  useEffect(() => {
    if (activeTab !== 'requests' || !smartbioId) return;
    setLoadingRequests(true);
    supabase
      .from('scheduling_requests')
      .select('id, visitor_name, visitor_phone, visitor_email, service_name, preferred_date, preferred_time, notes, status, created_at')
      .eq('smartbio_id', smartbioId)
      .order('preferred_date', { ascending: true })
      .order('preferred_time', { ascending: true })
      .then(({ data }) => {
        setRequests((data as Request[]) ?? []);
        setLoadingRequests(false);
      });
  }, [activeTab, smartbioId]);

  const handleSave = async () => {
    if (!smartbioId) return;
    setSaving(true);
    await supabase.from('smartbios').update({ agenda_config: config }).eq('id', smartbioId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateStatus = async (id: string, status: Request['status']) => {
    await supabase.from('scheduling_requests').update({ status }).eq('id', id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const addService = () => {
    setConfig(prev => ({
      ...prev,
      services: [...prev.services, { name: '', duration_minutes: 60 }],
    }));
  };

  const updateService = (i: number, field: keyof AgendaService, value: string | number) => {
    setConfig(prev => {
      const next = [...prev.services];
      next[i] = { ...next[i], [field]: value };
      return { ...prev, services: next };
    });
  };

  const removeService = (i: number) => {
    setConfig(prev => ({ ...prev, services: prev.services.filter((_, idx) => idx !== i) }));
  };

  const toggleDay = (dow: number) => {
    setConfig(prev => {
      const days = prev.available_days.includes(dow)
        ? prev.available_days.filter(d => d !== dow)
        : [...prev.available_days, dow].sort();
      return { ...prev, available_days: days };
    });
  };

  const filtered = statusFilter === 'all' ? requests : requests.filter(r => r.status === statusFilter);

  const inputCls = 'w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30';

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-ink">Agenda</h1>
            <p className="text-muted-foreground mt-1">
              Configure seus horários disponíveis e acompanhe as solicitações de atendimento.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
          {([['config', 'Configuração', Calendar], ['requests', 'Agendamentos', Users]] as const).map(([t, label, Icon]) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === t ? 'bg-surface shadow-sm text-ink' : 'text-muted-foreground hover:text-ink'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* TAB: Configuração */}
        {activeTab === 'config' && (
          loadingConfig ? (
            <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="space-y-6 max-w-2xl">

              {/* Ativar agenda */}
              <section className="bg-surface border border-border rounded-2xl p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-ink">Ativar agenda na SmartBio</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Quando ativada, aparece uma seção de agendamento na sua página pública.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${config.enabled ? 'bg-primary' : 'bg-border'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${config.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </section>

              {config.enabled && (
                <>
                  {/* Serviços */}
                  <section className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-ink">Serviços oferecidos</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Cada serviço pode ter duração diferente.</p>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-xl h-8 text-xs" onClick={addService}>
                        <Plus className="w-3.5 h-3.5 mr-1.5" />Adicionar
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {config.services.map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <input
                            className={`${inputCls} flex-1`}
                            placeholder="Nome do serviço"
                            value={s.name}
                            onChange={e => updateService(i, 'name', e.target.value)}
                          />
                          <div className="relative">
                            <select
                              value={s.duration_minutes}
                              onChange={e => updateService(i, 'duration_minutes', Number(e.target.value))}
                              className="h-10 pl-3 pr-8 rounded-xl border border-border bg-background text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
                            >
                              {[15, 30, 45, 60, 90, 120].map(m => (
                                <option key={m} value={m}>{m} min</option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 text-muted-foreground pointer-events-none" />
                          </div>
                          {config.services.length > 1 && (
                            <button type="button" onClick={() => removeService(i)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Disponibilidade */}
                  <section className="bg-surface border border-border rounded-2xl p-6 space-y-5">
                    <div>
                      <p className="font-semibold text-ink">Disponibilidade</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Dias e horários em que você atende.</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-ink">Dias da semana</p>
                      <div className="flex gap-2 flex-wrap">
                        {DOW_LABELS.map((label, dow) => (
                          <button
                            key={dow}
                            type="button"
                            onClick={() => toggleDay(dow)}
                            className={`w-12 h-10 rounded-xl border-2 text-xs font-bold transition-colors ${
                              config.available_days.includes(dow)
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border text-muted-foreground hover:border-primary/40'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-ink">Início dos atendimentos</label>
                        <input
                          type="time"
                          value={config.start_time}
                          onChange={e => setConfig(prev => ({ ...prev, start_time: e.target.value }))}
                          className={inputCls}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-ink">Fim dos atendimentos</label>
                        <input
                          type="time"
                          value={config.end_time}
                          onChange={e => setConfig(prev => ({ ...prev, end_time: e.target.value }))}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-ink">Duração padrão dos slots</label>
                        <div className="relative">
                          <select
                            value={config.slot_duration_minutes}
                            onChange={e => setConfig(prev => ({ ...prev, slot_duration_minutes: Number(e.target.value) }))}
                            className={`${inputCls} appearance-none pr-8`}
                          >
                            {[15, 30, 45, 60, 90, 120].map(m => (
                              <option key={m} value={m}>{m} min por horário</option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-ink">Prazo máximo para agendar</label>
                        <div className="relative">
                          <select
                            value={config.advance_days}
                            onChange={e => setConfig(prev => ({ ...prev, advance_days: Number(e.target.value) }))}
                            className={`${inputCls} appearance-none pr-8`}
                          >
                            {[7, 15, 30, 60, 90].map(d => (
                              <option key={d} value={d}>{d} dias à frente</option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {/* Save */}
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="rounded-xl px-6 h-10">
                  {saving
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
                    : saved
                    ? <><CheckCircle2 className="w-4 h-4 mr-2" />Salvo!</>
                    : <><Save className="w-4 h-4 mr-2" />Salvar configurações</>}
                </Button>
              </div>
            </div>
          )
        )}

        {/* TAB: Agendamentos */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {/* Filtros de status */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(s => {
                const labels = { all: 'Todos', pending: 'Pendentes', confirmed: 'Confirmados', cancelled: 'Cancelados' };
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                      statusFilter === s
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {labels[s]}
                    {s !== 'all' && (
                      <span className="ml-1.5 opacity-60">
                        ({requests.filter(r => s === 'all' || r.status === s).length})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {loadingRequests ? (
              <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-center border-2 border-dashed border-border rounded-2xl">
                <Clock className="w-8 h-8 text-muted-foreground/30" />
                <p className="text-sm font-semibold text-ink">Nenhum agendamento ainda</p>
                <p className="text-xs text-muted-foreground">Quando visitantes solicitarem horários, eles aparecem aqui.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(r => (
                  <div key={r.id} className="bg-surface border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-ink">{r.visitor_name}</p>
                        <StatusBadge status={r.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">{r.visitor_phone}</p>
                      <div className="flex items-center gap-3 text-sm text-ink pt-1 flex-wrap">
                        <span className="font-medium">
                          📅 {ptDate(r.preferred_date)} às {r.preferred_time}
                        </span>
                        {r.service_name && (
                          <span className="text-muted-foreground">· {r.service_name}</span>
                        )}
                      </div>
                      {r.notes && (
                        <p className="text-xs text-muted-foreground italic">"{r.notes}"</p>
                      )}
                    </div>

                    {r.status === 'pending' && (
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl border-success/40 text-success hover:bg-success/10 h-8 text-xs"
                          onClick={() => updateStatus(r.id, 'confirmed')}
                        >
                          <CheckSquare className="w-3.5 h-3.5 mr-1.5" />Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 h-8 text-xs"
                          onClick={() => updateStatus(r.id, 'cancelled')}
                        >
                          <XSquare className="w-3.5 h-3.5 mr-1.5" />Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
