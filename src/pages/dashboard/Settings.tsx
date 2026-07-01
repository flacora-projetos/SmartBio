import { useEffect, useState } from 'react';
import type { ElementType } from 'react';
import { Save, Loader2, CheckCircle2, Radio, BarChart2, Tag } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getOrCreateWorkspaceSmartBio } from '@/lib/smartbio-flow';

type TrackingFields = {
  pixel_id: string;
  ga4_id: string;
  gtm_id: string;
};

const EMPTY: TrackingFields = { pixel_id: '', ga4_id: '', gtm_id: '' };

function TrackingInput({
  label,
  hint,
  icon: Icon,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint: string;
  icon: ElementType;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
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

export function Settings() {
  const { tenant } = useAuth();
  const [smartbioId, setSmartbioId] = useState<string | null>(null);
  const [fields, setFields] = useState<TrackingFields>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!tenant) return;
    getOrCreateWorkspaceSmartBio(tenant).then(sb => {
      setSmartbioId(sb.id);
      const cfg = (sb as { tracking_config?: Partial<TrackingFields> }).tracking_config ?? {};
      setFields({
        pixel_id: cfg.pixel_id ?? '',
        ga4_id: cfg.ga4_id ?? '',
        gtm_id: cfg.gtm_id ?? '',
      });
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

    await supabase
      .from('smartbios')
      .update({ tracking_config })
      .eq('id', smartbioId);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-8">
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
            <Button
              onClick={handleSave}
              disabled={saving || loading}
              className="rounded-xl h-9 px-5 text-sm font-bold"
            >
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
      </div>
    </DashboardLayout>
  );
}
