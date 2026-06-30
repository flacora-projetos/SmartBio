interface OfferStatusBadgeProps {
  status?: string;
  isActive?: boolean;
}

export function OfferStatusBadge({ status, isActive }: OfferStatusBadgeProps) {
  const effectiveStatus = status || (isActive ? 'active' : 'draft');
  
  if (effectiveStatus === 'active') {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/20 text-success">
        Ativa
      </span>
    );
  }
  
  if (effectiveStatus === 'paused') {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-destructive/10 text-destructive">
        Pausada
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface border border-border text-muted-foreground">
      Rascunho
    </span>
  );
}
