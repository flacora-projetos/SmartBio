import { RecommendationRule, Offer } from '@/types';
import { RuleStatusBadge } from './RuleStatusBadge';
import { Zap, ChevronRight, Edit2, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendationRulesPanelProps {
  rules: RecommendationRule[];
  offers: Offer[];
}

export function RecommendationRulesPanel({ rules, offers }: RecommendationRulesPanelProps) {
  const getOfferName = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    return offer ? offer.title : 'Oferta Desconhecida';
  };

  return (
    <div className="bg-surface border border-border rounded-2xl flex flex-col shadow-sm">
      <div className="p-4 border-b border-border bg-background/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-ink font-heading">Regras de Recomendação</h3>
        </div>
        <Button variant="outline" size="sm" className="rounded-lg text-xs h-7 px-2">Nova Regra</Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar min-h-[250px] max-h-[400px]">
        {rules.map((rule) => (
          <div key={rule.id} className="p-3 rounded-xl border border-border bg-background flex flex-col gap-3 relative group">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <RuleStatusBadge status={rule.status} isActive={rule.isActive} />
                  <span className="text-xs font-bold text-ink line-clamp-1">{rule.name}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">{rule.description}</p>
              </div>
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-ink">
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Power className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Condition & Result */}
            <div className="bg-surface rounded-lg p-2 text-xs border border-border">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-start gap-1.5 text-muted-foreground">
                  <span className="font-bold text-primary mt-[1px]">SE</span>
                  <span className="font-mono text-[10px] bg-background px-1 py-0.5 rounded border border-border flex-1">{rule.condition}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground ml-1">
                  <ChevronRight className="w-3 h-3 text-success shrink-0" />
                  <span className="font-medium text-ink truncate">Rec. {getOfferName(rule.recommendedOfferId || rule.offerId)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {rules.length === 0 && (
           <div className="py-8 text-center text-muted-foreground text-sm flex flex-col items-center justify-center">
              <p>Nenhuma regra configurada ainda.</p>
           </div>
        )}
      </div>
    </div>
  );
}
