import { landingData } from '@/data/mock';
import { SmartBioPhoneMock } from './SmartBioPhoneMock';

export function SmartBioCreationDemo() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-ink mb-6">
              {landingData.demo.title}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {landingData.demo.description}
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-ink text-lg">Responda o onboarding</h4>
                  <p className="text-muted-foreground">O cliente responde poucas perguntas.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-ink text-lg">IA monta a estrutura</h4>
                  <p className="text-muted-foreground">A plataforma cria módulos e textos.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-ink text-lg">Aprove e Publique</h4>
                  <p className="text-muted-foreground">O cliente aprova e o SaaS publica o link.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[3rem] blur-xl -z-10"></div>
              <SmartBioPhoneMock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
