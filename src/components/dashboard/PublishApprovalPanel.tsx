import { Button } from '@/components/ui/button';
import { Rocket, Copy, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';

interface PublishApprovalPanelProps {
  status: 'pending' | 'publishing' | 'published';
  publicUrl: string;
  onApprove: () => void;
  onCopyLink: () => void;
  onOpenLink?: () => void;
}

export function PublishApprovalPanel({ status, publicUrl, onApprove, onCopyLink, onOpenLink }: PublishApprovalPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      <div>
        <h3 className="font-bold text-ink font-heading text-lg mb-1">Publicação</h3>
        <p className="text-sm text-muted-foreground">
          {status === 'pending' && 'O link será liberado após aprovação e publicação automática.'}
          {status === 'publishing' && 'Gerando e publicando sua SmartBio...'}
          {status === 'published' && 'Sua SmartBio está no ar!'}
        </p>
      </div>

      <div className="bg-background rounded-xl p-4 border border-border flex flex-col gap-3">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">URL Pública</span>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm font-medium text-ink overflow-hidden text-ellipsis whitespace-nowrap">
            {status === 'published' ? publicUrl : 'smartbio.app/s/...'}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {status === 'pending' && (
          <Button onClick={onApprove} className="w-full rounded-xl bg-primary text-primary-foreground font-bold h-12">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Aprovar e Publicar
          </Button>
        )}
        
        {status === 'publishing' && (
          <Button disabled className="w-full rounded-xl bg-primary/70 text-primary-foreground font-bold h-12">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publicando...
          </Button>
        )}

        {status === 'published' && (
          <>
            <Button onClick={onCopyLink} className="w-full rounded-xl bg-primary text-primary-foreground font-bold h-12">
              <Copy className="w-4 h-4 mr-2" /> Copiar Link Publicado
            </Button>
            <Button onClick={onOpenLink} variant="outline" className="w-full rounded-xl font-bold h-12">
              <ExternalLink className="w-4 h-4 mr-2" /> Abrir SmartBio Pública
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
