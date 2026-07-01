import { useEffect, useState } from 'react';
import type { ElementType } from 'react';
import {
  Save, Loader2, CheckCircle2, Radio, BarChart2, Tag,
  AlertTriangle, RefreshCw, Trash2, X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getOrCreateWorkspaceSmartBio, resetSmartBio } from '@/lib/smartbio-flow';

type TrackingFields = { pixel_id: string; ga4_id: string; gtm_id: string };
const EMPTY: TrackingFields = { pixel_id: '', ga4_id: '', gtm_id: '' };

function TrackingInput({
  label, hint, icon: Icon, value, onChange, placeholder,
}: {
  label: string; hint: string; icon: ElementType;
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <label className="text-sm font-semibold text-ink">{label}</label>
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value.trim())}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

type DangerAction = 'reset' | 'delete' | null;

function ConfirmDialog({
  action,
  onConfirm,
  onCancel,
  loading,
}: {
  action: DangerAction;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [typed, setTyped] = useState('');

  if (!action) return null;

  const isReset = action === 'reset';
  const keyword = isReset ? 'REINICIAR' : 'EXCLUIR';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-ink font-heading">
              {isReset ? 'Reiniciar SmartBio?' : 'Excluir conta permanentemente?'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {isReset
                ? 'Todas as ofertas, perguntas, regras e respostas do onboarding serão removidas. Você poderá refazer o onboarding do zero com um novo nome de marca e slug.'
                : 'Sua conta, todos os dados e a SmartBio publicada serão excluídos permanentemente. Esta ação não pode ser desfeita.'}
            </p>
          </div>
          <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-ink mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ink">
            Digite <span className="font-mono font-bold text-destructive">{keyword}</span> para confirmar
          </label>
          <input
            type="text"
            value={typed}
            onChange={e => setTyped(e.target.value)}
            placeholder={keyword}
            autoFocus
            className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-destructive/30"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="flex-1 rounded-xl"
            onClick={onConfirm}
            disabled={typed !== keyword || loading}
          >
            {loading
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Aguarde...</>
              : isReset
              ? <><RefreshCw className="w-4 h-4 mr-2" />Reiniciar</>
              : <><Trash2 className="w-4 h-4 mr-2" />Excluir conta</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Settings() {
  const { tenant, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [smartbioId, setSmartbioId] = useState<string | null>(null);
  const [fields, setFields] = useState<TrackingFields>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Danger zone
  const [dangerAction, setDangerAction] = useState<DangerAction>(null);
  const [dangerLoading, setDangerLoading] = useState(false);
  const [dangerError, setDangerError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenant) return;
    getOrCreateWorkspaceSmartBio(tenant).then(sb => {
      setSmartbioId(sb.id);
      const cfg = (sb as { tracking_config?: Partial<TrackingFields> }).tracking_config ?? {};
      setFields({ pixel_id: cfg.pixel_id ?? '', ga4_id: cfg.ga4_id ?? '', gtm_id: cfg.gtm_id ?? '' });
      setLoading(false);
    });
  }, [tenant]);

  const set = (key: keyof TrackingFields) => (value: string) =>
    setFields(prev => ({ ...prev, [key]: value }));

  async function handleSave() {
    if (!smartbioId) return;
    setSaving(true);
    setSaved(false);
    const tracking_config: Partial<TrackingFields> = {};
    if (fields.pixel_id) tracking_config.pixel_id = fields.pixel_id;
    if (fields.ga4_id) tracking_config.ga4_id = fields.ga4_id;
    if (fields.gtm_id) tracking_config.gtm_id = fields.gtm_id;
    await supabase.from('smartbios').update({ tracking_config }).eq('id', smartbioId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleConfirmDanger() {
    if (!tenant || !user) return;
    setDangerLoading(true);
    setDangerError(null);

    try {
      if (dangerAction === 'reset') {
        await resetSmartBio(tenant);
        setDangerAction(null);
        navigate('/app/onboarding');
      } else if (dangerAction === 'delete') {
        const { error } = await supabase.rpc('delete_my_account');
        if (error) throw error;
        await signOut();
        navigate('/');
      }
    } catch (err) {
      setDangerError(err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.');
      setDangerLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-8 pb-12">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ink">Configurações</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie integrações e preferências da sua SmartBio.
          </p>
        </div>

        {/* Rastreamento */}
        <section className="bg-surface border border-border rounded-2xl p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-ink">Rastreamento e analytics</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Insira os IDs das suas plataformas. A SmartBio injeta os scripts automaticamente
              e dispara os eventos certos em cada etapa do funil.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Carregando configurações...</span>
            </div>
          ) : (
            <div className="space-y-5">
              <TrackingInput
                label="Meta Pixel ID"
                hint="Eventos disparados automaticamente: ViewContent, InitiateCheckout, Lead, Contact."
                icon={Radio}
                value={fields.pixel_id}
                onChange={set('pixel_id')}
                placeholder="Ex: 1234567890123456"
              />
              <TrackingInput
                label="Google Analytics 4 — Measurement ID"
                hint="Eventos disparados automaticamente: page_view, begin_checkout, generate_lead, conversion."
                icon={BarChart2}
                value={fields.ga4_id}
                onChange={set('ga4_id')}
                placeholder="Ex: G-XXXXXXXXXX"
              />
              <TrackingInput
                label="Google Tag Manager — Container ID"
                hint="O GTM recebe todos os eventos via dataLayer (smartbio_page_view, smartbio_quiz_start etc.)."
                icon={Tag}
                value={fields.gtm_id}
                onChange={set('gtm_id')}
                placeholder="Ex: GTM-XXXXXXX"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Os scripts são carregados apenas na página pública — nunca no painel.
            </p>
            <Button onClick={handleSave} disabled={saving || loading} className="rounded-xl h-9 px-5 text-sm font-bold">
              {saving ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Salvando...</>
              ) : saved ? (
                <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />Salvo!</>
              ) : (
                <><Save className="w-3.5 h-3.5 mr-1.5" />Salvar</>
              )}
            </Button>
          </div>
        </section>

        {/* Zona de perigo */}
        <section className="border-2 border-destructive/25 rounded-2xl overflow-hidden">
          <div className="bg-destructive/5 px-6 py-4 border-b border-destructive/20 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
            <div>
              <h2 className="text-base font-bold text-destructive">Zona de perigo</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Ações irreversíveis — leia com atenção antes de prosseguir.</p>
            </div>
          </div>

          <div className="p-6 divide-y divide-border space-y-0">

            {/* Reiniciar SmartBio */}
            <div className="flex items-start justify-between gap-6 pb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold text-ink text-sm">Reiniciar SmartBio do zero</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Remove todas as ofertas, perguntas, regras e respostas do onboarding.
                  O slug será regenerado a partir do nome da marca que você informar no próximo onboarding.
                </p>
              </div>
              <Button
                variant="outline"
                className="border-destructive/40 text-destructive hover:bg-destructive/10 shrink-0 rounded-xl"
                onClick={() => { setDangerError(null); setDangerAction('reset'); }}
              >
                Reiniciar
              </Button>
            </div>

            {/* Excluir conta */}
            <div className="flex items-start justify-between gap-6 pt-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trash2 className="w-4 h-4 text-destructive" />
                  <h3 className="font-semibold text-destructive text-sm">Excluir minha conta</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Exclui permanentemente sua conta, todos os dados e a SmartBio publicada.
                  A URL pública deixa de funcionar imediatamente. Esta ação não pode ser desfeita.
                </p>
              </div>
              <Button
                variant="destructive"
                className="shrink-0 rounded-xl"
                onClick={() => { setDangerError(null); setDangerAction('delete'); }}
              >
                Excluir conta
              </Button>
            </div>

            {dangerError && (
              <div className="pt-4 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 mt-4">
                {dangerError}
              </div>
            )}
          </div>
        </section>
      </div>

      <ConfirmDialog
        action={dangerAction}
        onConfirm={handleConfirmDanger}
        onCancel={() => { setDangerAction(null); setDangerError(null); }}
        loading={dangerLoading}
      />
    </DashboardLayout>
  );
}
