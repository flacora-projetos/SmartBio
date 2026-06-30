import { Users, Instagram, Linkedin } from 'lucide-react';
import { PublicSmartBioData } from '@/types';

interface PublicSmartBioHeaderProps {
  data: PublicSmartBioData;
}

export function PublicSmartBioHeader({ data }: PublicSmartBioHeaderProps) {
  return (
    <div className="w-full pt-12 pb-6 px-6 flex flex-col items-center bg-surface border-b border-border">
      <div className="w-24 h-24 rounded-full bg-border border-4 border-background overflow-hidden mb-4 relative shadow-sm">
        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
          {data.avatarUrl ? (
            <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <Users className="w-8 h-8 text-primary/40" />
          )}
        </div>
      </div>
      
      <h1 className="text-2xl font-heading font-bold text-ink mb-2 text-center">{data.title}</h1>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
        {data.bio}
      </p>
      
      {/* Social Icons */}
      <div className="flex gap-4 text-muted-foreground">
        {data.socialLinks?.instagram && (
          <a href={data.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-surface transition-colors hover:text-ink">
            <Instagram className="w-5 h-5" />
          </a>
        )}
        {data.socialLinks?.linkedin && (
          <a href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-surface transition-colors hover:text-ink">
            <Linkedin className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
}
