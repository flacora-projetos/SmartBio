import { Info, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export function OfferRecommendationUsage() {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <Info className="w-5 h-5" />
        <h3 className="font-bold font-heading">Como a SmartBio usa suas ofertas</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        A SmartBio cruza as respostas do visitante com os atributos das ofertas para recomendar o próximo passo mais adequado, aumentando a conversão.
      </p>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[10px] font-bold text-ink">1</span>
          </div>
          <div>
            <p className="text-sm font-bold text-ink flex items-center gap-2">Visitante responde o diagnóstico <HelpCircleIcon className="w-3.5 h-3.5 text-muted-foreground" /></p>
            <p className="text-xs text-muted-foreground mt-1">Perguntas pré-configuradas mapeiam o momento do usuário.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[10px] font-bold text-ink">2</span>
          </div>
          <div>
            <p className="text-sm font-bold text-ink flex items-center gap-2">SmartBio identifica o contexto <Filter className="w-3.5 h-3.5 text-primary" /></p>
            <p className="text-xs text-muted-foreground mt-1">O sistema cruza as dores e objetivos mapeados com os atributos de cada oferta.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[10px] font-bold text-ink">3</span>
          </div>
          <div>
            <p className="text-sm font-bold text-ink flex items-center gap-2">Oferta mais adequada é recomendada <Sparkles className="w-3.5 h-3.5 text-secondary-foreground" /></p>
            <p className="text-xs text-muted-foreground mt-1">A recomendação é feita com base nas regras ativas configuradas.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[10px] font-bold text-ink">4</span>
          </div>
          <div>
            <p className="text-sm font-bold text-ink flex items-center gap-2">Visitante segue para o CTA certo <CheckCircle2 className="w-3.5 h-3.5 text-success" /></p>
            <p className="text-xs text-muted-foreground mt-1">Conversão direcionada para o checkout, agenda ou WhatsApp apropriado.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  )
}
