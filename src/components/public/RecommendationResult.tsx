import { Sparkles, ArrowRight, Calendar, MessageSquare, CheckSquare, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendationResultProps {
  title: string;
  offerName: string;
  reason: string;
  nextSteps: string[];
  buttonText: string;
  finalCta: string; // whatsapp, agenda, formulario, checkout, etc
}

export function RecommendationResult({ title, offerName, reason, nextSteps, buttonText, finalCta }: RecommendationResultProps) {
  const getIcon = () => {
    switch (finalCta) {
      case 'whatsapp': return <MessageSquare className="w-5 h-5 mr-2" />;
      case 'agenda': return <Calendar className="w-5 h-5 mr-2" />;
      case 'formulario': return <CheckSquare className="w-5 h-5 mr-2" />;
      default: return <LinkIcon className="w-5 h-5 mr-2" />;
    }
  };

  return (
    <div className="border-2 border-primary rounded-3xl p-6 bg-surface shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="absolute top-0 right-0 p-4 text-primary/10">
        <Sparkles className="w-24 h-24" />
      </div>
      
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-lg mb-4">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          {title}
        </div>
        
        <h3 className="text-2xl font-bold font-heading text-ink mb-3 pr-8">{offerName}</h3>
        <p className="text-base text-muted-foreground mb-6 leading-relaxed">
          {reason}
        </p>
        
        <div className="bg-background border border-border rounded-2xl p-4 mb-6">
          <p className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Próximos Passos</p>
          <div className="space-y-3">
            {nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold">{i + 1}</span>
                </div>
                <span className="pt-0.5 leading-snug">{step}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Button className="w-full bg-primary text-primary-foreground rounded-xl h-14 text-base font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
          {getIcon()}
          {buttonText} 
        </Button>
      </div>
    </div>
  );
}
