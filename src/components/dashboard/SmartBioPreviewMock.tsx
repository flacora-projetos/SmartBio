import { MessageSquare, Users, Sparkles } from 'lucide-react';
import { PublicSmartBioData } from '@/types';
import { mockPublicSmartBioData } from '@/data/mock';

interface SmartBioPreviewMockProps {
  data?: PublicSmartBioData | null;
}

export function SmartBioPreviewMock({ data }: SmartBioPreviewMockProps) {
  const d = data ?? mockPublicSmartBioData;
  const title = d.title || 'Sua SmartBio';
  const bio = d.bio || 'Sua bio vai aparecer aqui após o onboarding.';
  const offer = d.offers?.find((o) => o.isActive) ?? d.offers?.[0];
  const firstQuestion = d.quizQuestions?.[0];

  return (
    <div className="w-[300px] h-[600px] bg-background rounded-[3rem] border-[10px] border-ink shadow-2xl overflow-hidden relative flex flex-col items-center">
      {/* Notch */}
      <div className="h-6 w-1/3 bg-ink absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20" />

      {/* Bio Header */}
      <div className="w-full pt-12 pb-5 px-6 flex flex-col items-center bg-surface border-b border-border">
        <div className="w-16 h-16 rounded-full bg-primary/10 border-4 border-background overflow-hidden mb-3 flex items-center justify-center shadow-sm">
          {d.avatarUrl ? (
            <img src={d.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <Users className="w-6 h-6 text-primary/40" />
          )}
        </div>
        <h3 className="text-base font-heading font-bold text-ink mb-1 text-center leading-tight">
          {title}
        </h3>
        <p className="text-[11px] text-muted-foreground text-center line-clamp-2 leading-relaxed">
          {bio}
        </p>
      </div>

      {/* Interactive Module */}
      <div className="flex-1 w-full bg-background p-4 flex flex-col gap-3 overflow-hidden">

        {/* Quiz starter */}
        {firstQuestion && (
          <div className="bg-ink text-background p-4 rounded-2xl shadow-md relative overflow-hidden shrink-0">
            <div className="absolute top-2 right-2 opacity-20">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60">
              Diagnóstico Inteligente
            </p>
            <p className="text-[12px] font-semibold mb-3 leading-snug">
              {firstQuestion.question}
            </p>
            <div className="flex flex-col gap-1.5">
              {(firstQuestion.options ?? []).slice(0, 3).map((opt, i) => (
                <div
                  key={i}
                  className="bg-white/10 py-1.5 px-3 rounded-lg text-[10px] font-medium leading-snug"
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offer card */}
        {offer && (
          <div className="bg-surface border border-border p-3 rounded-2xl shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-wider mb-2 text-success">
              Recomendado para você
            </p>
            <div className="flex items-start gap-3">
              <div className="bg-background p-1.5 rounded-xl shadow-sm border border-border shrink-0 mt-0.5">
                <MessageSquare className="w-4 h-4 text-ink" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-ink leading-tight truncate">
                  {offer.title}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                  {offer.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="bg-surface border border-border p-3 rounded-2xl flex items-center gap-3 shrink-0">
          <div className="bg-background p-1.5 rounded-xl shadow-sm border border-border shrink-0">
            <MessageSquare className="w-4 h-4 text-ink" />
          </div>
          <div className="flex-1">
            <p className="text-[12px] font-bold text-ink">Falar no WhatsApp</p>
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
              Dúvidas rápidas? Fale direto.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="w-full py-2.5 bg-surface border-t border-border flex justify-center items-center">
        <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">
          Criado com SmartBio
        </span>
      </div>

      {/* Home Indicator */}
      <div className="h-1 w-20 bg-border absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full" />
    </div>
  );
}
