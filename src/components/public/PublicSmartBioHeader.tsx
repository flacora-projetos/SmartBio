import { useState } from 'react';
import type { PublicSmartBio } from '@/lib/public-smartbio';

interface PublicSmartBioHeaderProps {
  smartbio: PublicSmartBio;
  side?: boolean;
}

export function PublicSmartBioHeader({ smartbio, side = false }: PublicSmartBioHeaderProps) {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = smartbio.public_config?.avatarUrl as string | undefined;

  const initials = smartbio.title
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  if (side) {
    return (
      <div className="h-full flex flex-col bg-primary text-primary-foreground relative overflow-hidden px-10 py-12">
        {/* Decorative orbs */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-20 pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-secondary rounded-full blur-[120px] opacity-10 pointer-events-none" />

        {/* Avatar */}
        <div className="w-28 h-28 rounded-full bg-primary-foreground/10 border-4 border-primary-foreground/20 overflow-hidden flex items-center justify-center shadow-2xl relative z-10">
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={smartbio.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-3xl font-bold font-heading text-primary-foreground">{initials}</span>
          )}
        </div>

        {/* Name + bio */}
        <div className="relative z-10 mt-6">
          <h1 className="text-3xl font-heading font-bold text-primary-foreground leading-tight">
            {smartbio.title}
          </h1>
          {smartbio.short_bio && (
            <p className="text-primary-foreground/65 mt-3 text-sm leading-relaxed">
              {smartbio.short_bio}
            </p>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Branding */}
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/30">
            Criado com SmartBio
          </span>
        </div>
      </div>
    );
  }

  // Mobile compact top header
  return (
    <div className="w-full pt-12 pb-6 px-6 flex flex-col items-center bg-surface border-b border-border">
      <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-background overflow-hidden mb-4 shadow-sm flex items-center justify-center">
        {avatarUrl && !imgError ? (
          <img
            src={avatarUrl}
            alt={smartbio.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-2xl font-bold font-heading text-primary">{initials}</span>
        )}
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
