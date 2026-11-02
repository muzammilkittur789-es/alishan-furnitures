import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useShowroom } from '../../context/ShowroomContext';
import { buildShowroomGeneralWhatsAppUrl } from '../../utils/whatsapp';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Can I visit the showroom without a prior appointment?',
    answer:
      'Yes, walk-ins are warmly welcome during showroom hours (Monday to Saturday 10:30 AM – 8:30 PM, Sunday 11:00 AM – 7:00 PM). If you are planning an extensive full-home interior setup, sending us a quick WhatsApp message helps us assign a dedicated furniture consultant to assist you.',
  },
  {
    id: 'faq-2',
    question: 'Do you offer customized sizes, wood finishes, and fabrics?',
    answer:
      'Absolutely. Nearly all our solid wood dining tables, beds, living room sofas, and modular wardrobes can be tailored to your room dimensions. You can choose from seasoned Teak, Sheesham, Oak, or Walnut timber finishes, and select from linen, velvet, bouclé, or vegan leatherette upholstery swatches.',
  },
  {
    id: 'faq-3',
    question: 'What is the difference between "Available to View" and "Made to Order"?',
    answer:
      '"Available to View" indicates a physical display piece is present on our showroom floor today for tactile inspection, comfort testing, and finish verification. "Made to Order" pieces are handcrafted in our workshop upon order confirmation (standard 14 to 21 working days).',
  },
  {
    id: 'faq-4',
    question: 'How do delivery and on-site assembly work?',
    answer:
      'We provide complimentary white-glove delivery, room placement, and professional carpenter installation across the city. All furniture arrives in padded protective wrapping with pre-delivery leveling adjustments included.',
  },
  {
    id: 'faq-5',
    question: 'What warranties and material guarantees do you provide?',
    answer:
      'All our solid timber products carry a 5 to 10-year structural warranty against termite infestation and joinery defects. Sofa cushioning, foam resilience, and hardware mechanisms (such as German hydraulic storage lifts and soft-close runners) include up to a 5-year guarantee.',
  },
  {
    id: 'faq-6',
    question: 'Can I place an enquiry or get price estimates via WhatsApp?',
    answer:
      'Yes! Every product on this website includes a direct WhatsApp enquiry button. When clicked, it automatically attaches the product name, SKU, and specifications so our showroom staff can respond with live floor photos, video walkthroughs, and custom quotes.',
  },
];

export const FaqSection: React.FC = () => {
  const { settings, recordEvent } = useShowroom();
  const { ref, isRevealed } = useScrollReveal(0.06);
  // All FAQ items closed by default; users can tap any item to expand its answer
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleWhatsAppHelp = () => {
    recordEvent('whatsapp_click', {
      metadata: { context: 'faq_section_cta' },
    });
    const url = buildShowroomGeneralWhatsAppUrl(settings.whatsapp, settings.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      ref={ref}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-sand-200/80 font-sans"
    >
      <div className={`text-center max-w-2xl mx-auto mb-8 sm:mb-12 reveal-fade-up ${isRevealed ? 'is-revealed' : ''}`}>
        <span className="text-xs font-semibold uppercase tracking-widest text-walnut-600 block mb-1">
          Questions & Answers
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-walnut-950">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-2">
          Everything you need to know about visiting our showroom, custom craftsmanship, delivery, and guarantees.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIds.includes(faq.id);

          return (
            <div
              key={faq.id}
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden shadow-xs reveal-fade-up ${
                isOpen ? 'border-walnut-900/30 shadow-sm' : 'border-sand-200/90 hover:border-sand-300'
              } ${isRevealed ? 'is-revealed' : ''}`}
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                aria-expanded={isOpen}
                className="w-full px-5 py-4 sm:px-6 sm:py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
              >
                <span className="font-serif text-sm sm:text-base font-bold text-walnut-950 select-none">
                  {faq.question}
                </span>
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen
                      ? 'bg-walnut-950 text-white rotate-180'
                      : 'bg-sand-100 text-walnut-800 hover:bg-sand-200'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-5 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                  <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed border-t border-sand-100 pt-3">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct WhatsApp help card below FAQs */}
      <div
        className={`max-w-3xl mx-auto mt-8 p-4 sm:p-5 bg-sand-50/80 rounded-2xl border border-sand-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left reveal-fade-up ${
          isRevealed ? 'is-revealed' : ''
        }`}
        style={{ transitionDelay: '280ms' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-walnut-950">
              Have a question not listed here?
            </h4>
            <p className="text-xs text-charcoal-600 mt-0.5">
              Our showroom consultants are available on WhatsApp to assist you in real time.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleWhatsAppHelp}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-semibold shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Ask on WhatsApp</span>
        </button>
      </div>
    </section>
  );
};
