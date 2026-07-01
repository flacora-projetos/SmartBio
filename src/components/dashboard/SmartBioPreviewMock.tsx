import { MessageSquare, Calendar, Users, Sparkles } from 'lucide-react';
import { PublicSmartBioData } from '@/types';
import { mockPublicSmartBioData } from '@/data/mock';

interface SmartBioPreviewMockProps {
  data?: PublicSmartBioData;
}

export function SmartBioPreviewMock({ data = mockPublicSmartBioData }: SmartBioPreviewMockProps) {
  return (
    <div className="w-[300px] h-[600px] bg-background rounded-[3rem] border-[10px] border-ink shadow-2xl overflow-hidden relative flex flex-col items-center">
      {/* Notch */}
      <div className="h-6 w-1/3 bg-ink absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20"></div>
      
      {/* Bio Header */}
      <div className="w-full pt-12 pb-6 px-6 flex flex-col items-center bg-surface border-b border-border">
        <div className="w-20 h-20 rounded-full bg-border border-4 border-background overflow-hidden mb-4 relative shadow-sm">
          {/* Avatar Placeholder */}
          <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
            {data.avatarUrl ? (
              <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Users className="w-6 h-6 text-primary/40" />
            )}
          </div>
        </div>
        <h3 className="text-lg font-heading font-bold text-ink mb-1">{data.title}</h3>
        <p className="text-xs text-muted-foreground text-center line-clamp-2 mb-4">
          {data.bio}
        </p>
        
      </div>

      {/* Interactive Module */}
      <div className="flex-1 w-full bg-background p-6 flex flex-col gap-4 overflow-y-auto hide-scrollbar">
        
        {/* Recommendation Quiz Starter */}
        {data.quizQuestions && data.quizQuestions.length > 0 && (
          <div className="bg-primary text-primary-foreground p-5 rounded-2xl shadow-md relative overflow-hidden">
            <div className="absolute top-2 right-2 text-primary-foreground/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1 text-primary-foreground/80">Diagnóstico Inteligente</p>
            <p className="text-sm font-medium mb-3">{data.quizQuestions[0].question}</p>
            <div className="space-y-2">
              {data.quizQuestions[0].options?.map((opt, i) => (
                <div key={i} className="bg-primary-foreground/10 py-2 px-3 rounded-lg text-xs cursor-pointer hover:bg-primary-foreground/20 transition-colors">
                  {opt}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation & CTA Module */}
        <div className="space-y-3">
          {data.offers && data.offers.length > 0 && (
            <div className="bg-surface border border-border p-4 rounded-2xl">
              <p className="text-xs font-bold uppercase tracking-wider mb-2 text-success">Recomendado para você</p>
              <div className="flex items-center gap-4">
                <div className="bg-background p-2 rounded-xl shadow-sm border border-border shrink-0">
                  <Calendar className="w-5 h-5 text-ink" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink">{data.offers[0].title}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-1">{data.offers[0].description}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-surface border border-border p-4 rounded-2xl flex items-center gap-4">
            <div className="bg-background p-2 rounded-xl shadow-sm border border-border shrink-0">
              <MessageSquare className="w-5 h-5 text-ink" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-ink">Falar no WhatsApp</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-1">Dúvidas rápidas? Fale com a equipe.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="w-full py-3 bg-surface border-t border-border flex justify-center items-center gap-2">
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Criado com SmartBio</span>
      </div>
      
      {/* Home Indicator */}
      <div className="h-1 w-24 bg-border absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full"></div>
    </div>
  );
}
