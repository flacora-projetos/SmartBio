import { Radio, BarChart2, Tag } from 'lucide-react';

const PLATFORMS = [
  { label: 'Meta Pixel ID', value: '1234567890123456', icon: Radio, color: 'text-blue-600' },
  { label: 'GA4 Measurement ID', value: 'G-XKWR82NPA3', icon: BarChart2, color: 'text-orange-500' },
  { label: 'GTM Container ID', value: 'GTM-K9XWP7R', icon: Tag, color: 'text-green-600' },
];

const EVENTS = [
  { step: '1', label: 'Visitante chega na SmartBio', pixel: 'ViewContent', ga4: 'page_view' },
  { step: '2', label: 'Inicia o quiz de diagnóstico', pixel: 'InitiateCheckout', ga4: 'begin_checkout' },
  { step: '3', label: 'Conclui o quiz, recebe indicação', pixel: 'Lead', ga4: 'generate_lead' },
  { step: '4', label: 'Clica no CTA da oferta indicada', pixel: 'Contact', ga4: 'conversion' },
];

export function TrackingIntegrationSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Cabeçalho */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
            Para quem usa tráfego pago
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-ink mb-6">
            Cole o ID do Pixel.<br className="hidden md:block" /> A SmartBio rastreia todo o funil.
          </h2>
          <p className="text-xl text-muted-foreground">
            Meta Pixel, GA4 e GTM conectados em segundos — sem uma linha de código. Os eventos certos disparam automaticamente em cada etapa da jornada.
          </p>
        </div>

        {/* Layout dois colunas */}
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Coluna esquerda — mock do painel de configurações */}
          <div className="w-full lg:w-1/2">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
              {/* Barra de título falsa */}
              <div className="flex items-center gap-1.5 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <span className="ml-2 text-xs text-muted-foreground">Configurações → Rastreamento</span>
              </div>

              {/* Campos de ID */}
              <div className="space-y-4">
                {PLATFORMS.map(({ label, value, icon: Icon, color }) => (
                  <div key={label}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
                    </div>
                    <div className="h-9 px-3 bg-surface border border-border rounded-xl flex items-center">
                      <span className={`text-sm font-mono font-medium ${color}`}>{value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão salvo */}
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Scripts carregados apenas na página pública</p>
                <div className="h-8 px-4 bg-primary rounded-lg flex items-center">
                  <span className="text-xs font-bold text-primary-foreground">Salvo ✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna direita — fluxo de eventos */}
          <div className="w-full lg:w-1/2 space-y-3">
            {EVENTS.map(({ step, label, pixel, ga4 }) => (
              <div key={step} className="flex items-center gap-4 bg-surface border border-border rounded-2xl p-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {step}
                </div>
                <p className="flex-1 text-sm font-medium text-ink">{label}</p>
                <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
                  <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-mono whitespace-nowrap">
                    {pixel}
                  </span>
                  <span className="text-[11px] bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-mono whitespace-nowrap">
                    {ga4}
                  </span>
                </div>
              </div>
            ))}

            <p className="text-xs text-muted-foreground text-center pt-2">
              Todos os eventos também chegam ao GTM via{' '}
              <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded border border-border">dataLayer</code>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
