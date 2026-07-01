import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { landingData } from '@/data/mock';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-background" id="faq">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-ink mb-4">
            {landingData.faq.title}
          </h2>
        </div>

        <div className="space-y-3">
          {landingData.faq.items.map((item, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-semibold text-ink">{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 border-t border-border">
                  <p className="text-muted-foreground text-sm leading-relaxed pt-4">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
