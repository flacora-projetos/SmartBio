import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendationPreviewProps {
  previewData: {
    title: string;
    offerName: string;
    reason: string;
    nextSteps: string[];
    buttonText: string;
  };
}

export function RecommendationPreview({ previewData }: RecommendationPreviewProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl flex flex-col shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border bg-background/50 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-secondary-foreground" />
        <h3 className="font-bold text-ink font-heading text-sm">Preview da Recomendação</h3>
      </div>
      
      <div className="p-6 bg-background">
        <p className="text-xs text-muted-foreground mb-4">Essa recomendação será exibida após o visitante concluir o diagnóstico.</p>
        
        {/* Mocked Recommendation Card */}
        <div className="border border-border rounded-2xl p-5 bg-surface shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-secondary-foreground/10">
            <Sparkles className="w-16 h-16" />
          </div>
          
          <div className="relative z-10">
            <span className="inline-block px-2 py-1 bg-success/20 text-success text-[10px] font-bold uppercase tracking-wider rounded-md mb-3">
              {previewData.title}
            </span>
            
            <h4 className="text-xl font-bold font-heading text-ink mb-2">{previewData.offerName}</h4>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {previewData.reason}
            </p>
            
            <div className="space-y-2 mb-6">
              <p className="text-xs font-bold text-ink uppercase tracking-wider mb-2">Próximos Passos:</p>
              {previewData.nextSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {step}
                </div>
              ))}
            </div>
            
            <Button className="w-full bg-primary text-primary-foreground rounded-xl h-12 text-sm font-bold shadow-md shadow-primary/20">
              {previewData.buttonText} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
