import { landingData } from '@/data/mock';

export function ConversionBlocks() {
  return (
    <section className="py-24 bg-surface">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {landingData.blocks.map((block, i) => (
            <div key={i} className="bg-card border border-border p-8 rounded-3xl shadow-sm relative overflow-hidden group hover:border-primary/20 transition-colors">
              <div className="text-6xl font-serif font-black text-ink/5 absolute -top-4 -right-4 transition-transform group-hover:scale-110">
                0{i + 1}
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
                  {i + 1}
                </div>
                <h3 className="text-xl font-heading font-bold text-ink mb-3">{block.title}</h3>
                <p className="text-muted-foreground">{block.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
