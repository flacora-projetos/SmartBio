import { HelpCircle, Network, SearchCheck, ArrowRight, Zap } from 'lucide-react';

export function RecommendationLogicExplainer() {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <HelpCircle className="w-5 h-5" />
        <h3 className="font-bold font-heading">Como a recomendação funciona</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        As regras são revisáveis. A IA pode sugerir, mas a decisão precisa ser explicável. 
        A SmartBio cruza as respostas do visitante com as regras configuradas para recomendar a melhor oferta.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="flex flex-col gap-2">
          <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
            <SearchCheck className="w-4 h-4 text-ink" />
          </div>
          <p className="text-xs font-bold text-ink">1. Visitante responde</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            O visitante responde perguntas rápidas que mapeiam seu momento atual.
          </p>
        </div>

        <div className="flex flex-col gap-2 relative">
          <div className="hidden md:block absolute top-4 left-[-15px] text-muted-foreground/30">
            <ArrowRight className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
            <Network className="w-4 h-4 text-ink" />
          </div>
          <p className="text-xs font-bold text-ink">2. Identificação de Contexto</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            A SmartBio identifica dor, intenção e maturidade baseada nas respostas.
          </p>
        </div>

        <div className="flex flex-col gap-2 relative">
          <div className="hidden md:block absolute top-4 left-[-15px] text-muted-foreground/30">
             <ArrowRight className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs font-bold text-primary">3. Regras e Conexão</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            As regras ativas conectam as respostas às ofertas correspondentes.
          </p>
        </div>

        <div className="flex flex-col gap-2 relative">
          <div className="hidden md:block absolute top-4 left-[-15px] text-muted-foreground/30">
             <ArrowRight className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-full bg-success/20 border border-success/30 flex items-center justify-center shrink-0 shadow-sm">
            <ArrowRight className="w-4 h-4 text-success" />
          </div>
          <p className="text-xs font-bold text-success">4. Recomendação Direta</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            O visitante recebe uma recomendação clara com um CTA focado em conversão.
          </p>
        </div>

      </div>
    </div>
  );
}
