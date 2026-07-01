import { useState } from 'react';
import { Globe, Phone, Youtube, Music, Camera, Video } from 'lucide-react';
import type { PublicSmartBio } from '@/lib/public-smartbio';

interface PublicSmartBioHeaderProps {
  smartbio: PublicSmartBio;
  side?: boolean;
}

const SOCIAL_META: Record<string, { label: string; Icon: React.ElementType; buildUrl: (v: string) => string }> = {
  instagram: { label: 'Instagram', Icon: Camera,  buildUrl: v => `https://instagram.com/${v.replace('@','')}` },
  tiktok:    { label: 'TikTok',    Icon: Video,   buildUrl: v => `https://tiktok.com/@${v.replace('@','')}` },
  youtube:   { label: 'YouTube',   Icon: Youtube, buildUrl: v => v.startsWith('http') ? v : `https://youtube.com/@${v}` },
  spotify:   { label: 'Spotify',   Icon: Music,   buildUrl: v => v.startsWith('http') ? v : `https://open.spotify.com/${v}` },
  whatsapp:  { label: 'WhatsApp',  Icon: Phone,   buildUrl: v => `https://wa.me/${v.replace(/\D/g,'')}` },
  site:      { label: 'Site',      Icon: Globe,   buildUrl: v => v.startsWith('http') ? v : `https://${v}` },
};

function SocialLinks({ links, light = false }: { links: Record<string, string>; light?: boolean }) {
  const entries = Object.entries(links).filter(([k, v]) => SOCIAL_META[k] && v);
  if (entries.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {entries.map(([key, value]) => {
        const meta = SOCIAL_META[key];
        if (!meta) return null;
        const { Icon, buildUrl, label } = meta;
        return (
          <a
            key={key}
            href={buildUrl(value)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              light
                ? 'bg-primary-foreground/15 hover:bg-primary-foreground/30 text-primary-foreground'
                : 'bg-muted hover:bg-border text-muted-foreground hover:text-ink'
            }`}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}

export function PublicSmartBioHeader({ smartbio, side = false }: PublicSmartBioHeaderProps) {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = (smartbio.public_config?.avatarUrl as string | undefined) || undefined;
  const socialLinks = smartbio.social_links ?? {};

  const initials = smartbio.title
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  if (side) {
    return (
      <div className="h-full flex flex-col bg-primary text-primary-foreground relative overflow-hidden px-10 py-12">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-20 pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-secondary rounded-full blur-[120px] opacity-10 pointer-events-none" />

        <div className="w-28 h-28 rounded-full bg-primary-foreground/10 border-4 border-primary-foreground/20 overflow-hidden flex items-center justify-center shadow-2xl relative z-10 shrink-0">
          {avatarUrl && !imgError ? (
            <img src={avatarUrl} alt={smartbio.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <span className="text-3xl font-bold font-heading text-primary-foreground">{initials}</span>
          )}
        </div>

        <div className="relative z-10 mt-6 flex-1">
          <h1 className="text-3xl font-heading font-bold text-primary-foreground leading-tight">
            {smartbio.title}
          </h1>
          {smartbio.short_bio && (
            <p className="text-primary-foreground/65 mt-3 text-sm leading-relaxed">
              {smartbio.short_bio}
            </p>
          )}
          {Object.keys(socialLinks).length > 0 && (
            <div className="mt-6">
              <SocialLinks links={socialLinks} light />
            </div>
          )}
        </div>

        <div className="relative z-10 mt-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/30">
            Criado com SmartBio
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-10 pb-6 px-6 flex flex-col items-center bg-surface border-b border-border">
      <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-background overflow-hidden mb-4 shadow-sm flex items-center justify-center shrink-0">
        {avatarUrl && !imgError ? (
          <img src={avatarUrl} alt={smartbio.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <span className="text-2xl font-bold font-heading text-primary">{initials}</span>
        )}
      </div>

      <h1 className="text-2xl font-heading font-bold text-ink mb-2 text-center leading-tight">
        {smartbio.title}
      </h1>

      {smartbio.short_bio && (
        <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm leading-relaxed">
          {smartbio.short_bio}
        </p>
      )}

      {Object.keys(socialLinks).length > 0 && (
        <SocialLinks links={socialLinks} />
      )}
    </div>
  );
}
