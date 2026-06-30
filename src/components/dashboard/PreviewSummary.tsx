import { FileText, MessageSquare, Zap, Target } from 'lucide-react';

interface PreviewSummaryProps {
  questionsCount: number;
  rulesCount: number;
  mainOffer: string;
  finalCta: string;
}

export function PreviewSummary({ questionsCount, rulesCount, mainOffer, finalCta }: PreviewSummaryProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-ink font-heading mb-4 text-sm uppercase tracking-wider">Resumo da SmartBio</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1 p-3 bg-background rounded-xl border border-border">
          <div className="flex items-center gap-2 text-primary mb-1">
            <Target className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Oferta Principal</span>
          </div>
          <span className="text-sm font-bold text-ink line-clamp-1">{mainOffer}</span>
        </div>

        <div className="flex flex-col gap-1 p-3 bg-background rounded-xl border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Perguntas</span>
          </div>
          <span className="text-sm font-bold text-ink">{questionsCount} configuradas</span>
        </div>

        <div className="flex flex-col gap-1 p-3 bg-background rounded-xl border border-border">
          <div className="flex items-center gap-2 text-secondary-foreground mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Regras</span>
          </div>
          <span className="text-sm font-bold text-ink">{rulesCount} ativas</span>
        </div>

        <div className="flex flex-col gap-1 p-3 bg-background rounded-xl border border-border">
          <div className="flex items-center gap-2 text-success mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">CTA Final</span>
          </div>
          <span className="text-sm font-bold text-ink capitalize">{finalCta}</span>
        </div>
      </div>
    </div>
  );
}
