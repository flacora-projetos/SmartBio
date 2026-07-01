import type { PublicSmartBio } from '@/lib/public-smartbio';

interface PublicSmartBioHeaderProps {
  smartbio: PublicSmartBio;
}

export function PublicSmartBioHeader({ smartbio }: PublicSmartBioHeaderProps) {
  const initials = smartbio.title
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="w-full pt-12 pb-6 px-6 flex flex-col items-center bg-surface border-b border-border">
      <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-background overflow-hidden mb-4 shadow-sm flex items-center justify-center">
        <span className="text-2xl font-bold font-heading text-primary">{initials}</span>
      </div>

      <h1 className="text-2xl font-heading font-bold text-ink mb-2 text-center">
        {smartbio.title}
      </h1>

      {smartbio.short_bio && (
        <p className="text-sm text-muted-foreground text-center mb-2 max-w-sm leading-relaxed">
          {smartbio.short_bio}
        </p>
      )}
    </div>
  );
}
