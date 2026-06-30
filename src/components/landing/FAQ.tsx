import { landingData } from '@/data/mock';

export function FAQ() {
  return (
    <section className="py-24 bg-background" id="faq">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-ink mb-4">
            {landingData.faq.title}
          </h2>
        </div>

        <div className="space-y-4">
          {landingData.faq.items.map((item, i) => (
            <div key={i} className="bg-surface border border-border p-6 rounded-2xl">
              <h3 className="font-bold text-lg text-ink mb-2">{item.question}</h3>
              <p className="text-muted-foreground text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
