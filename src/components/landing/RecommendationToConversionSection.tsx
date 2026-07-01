import { landingData } from '@/data/mock';
import { MessageCircle, Calendar, ShoppingBag } from 'lucide-react';

export function RecommendationToConversionSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-ink mb-6">
            {landingData.recommendation.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {landingData.recommendation.description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-surface border border-border p-8 rounded-3xl text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-6 border border-border shadow-sm">
              <Calendar className="w-8 h-8 text-ink" />
            </div>
            <h3 className="font-bold text-xl mb-2">Agendamento</h3>
            <p className="text-muted-foreground text-sm">Consulta, visita, procedimento ou atendimento — redireciona para sua ferramenta de agenda.</p>
          </div>
          <div className="bg-primary text-primary-foreground border border-primary p-8 rounded-3xl text-center flex flex-col items-center shadow-xl transform md:-translate-y-4">
            <div className="w-16 h-16 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-xl mb-2">WhatsApp</h3>
            <p className="text-primary-foreground/80 text-sm">Direciona o lead qualificado direto para o seu número com mensagem pré-definida.</p>
          </div>
          <div className="bg-surface border border-border p-8 rounded-3xl text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-6 border border-border shadow-sm">
              <ShoppingBag className="w-8 h-8 text-ink" />
            </div>
            <h3 className="font-bold text-xl mb-2">Página de Venda</h3>
            <p className="text-muted-foreground text-sm">Envia o lead qualificado direto para o produto, loja ou LP certa para o perfil dele.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
