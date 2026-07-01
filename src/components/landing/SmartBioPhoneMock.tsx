import { ArrowRight, CheckCircle, Sparkles, Calendar } from 'lucide-react';
import { landingData } from '@/data/mock';

export function SmartBioPhoneMock() {
  return (
    <div className="w-[300px] h-[600px] bg-background rounded-[3rem] border-[10px] border-ink shadow-2xl overflow-hidden relative flex flex-col">
      {/* Notch */}
      <div className="h-6 w-1/3 bg-ink absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20" />

      {/* Profile Header */}
      <div className="w-full pt-10 pb-5 px-6 flex flex-col items-center bg-surface border-b border-border">
        <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-background mb-3 shadow-sm flex items-center justify-center">
          <span className="text-xl font-bold font-heading text-primary">TP</span>
        </div>
        <h3 className="text-base font-heading font-bold text-ink">{landingData.mockBio.name}</h3>
        <p className="text-[11px] text-muted-foreground text-center mt-0.5">
          Consultora de negócios · e-commerce
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 w-full bg-background px-4 py-4 flex flex-col gap-3 overflow-hidden">

        {/* Quiz card — mostra pergunta em progresso com opção selecionada */}
        <div className="bg-surface border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Pergunta 1 de 2
            </span>
            <div className="flex gap-1">
              <div className="w-8 h-1 rounded-full bg-primary" />
              <div className="w-8 h-1 rounded-full bg-border" />
            </div>
          </div>

          <p className="text-[13px] font-bold text-ink mb-3 leading-snug">
            Qual é o seu maior desafio hoje?
          </p>

          <div className="space-y-2">
            {/* Opção selecionada */}
            <div className="bg-primary text-primary-foreground py-2 px-3 rounded-xl text-[11px] font-semibold flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              Preciso de mais vendas
            </div>
            {/* Opção não selecionada */}
            <div className="border border-border py-2 px-3 rounded-xl text-[11px] text-muted-foreground flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border border-border shrink-0" />
              Quero organizar meus processos
            </div>
          </div>
        </div>

        {/* Resultado da recomendação — card destacado com borda primary */}
        <div className="border-2 border-primary rounded-2xl overflow-hidden bg-surface">
          <div className="bg-primary/8 px-4 py-2.5 border-b border-primary/10 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
              Indicação ideal para você
            </span>
          </div>
          <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-ink leading-tight">Consultoria Estratégica</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                  Ideal para quem quer crescer nas vendas pelo Instagram.
                </p>
              </div>
            </div>
            <button className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm">
              Agendar agora <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer branding */}
      <div className="w-full py-2.5 bg-surface border-t border-border flex justify-center">
        <span className="text-[9px] text-muted-foreground/70 font-bold uppercase tracking-wider">
          Criado com SmartBio
        </span>
      </div>

      {/* Home indicator */}
      <div className="h-1 w-20 bg-border absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full" />
    </div>
  );
}
