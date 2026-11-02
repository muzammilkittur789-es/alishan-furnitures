import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Mail,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useShowroom } from '../context/ShowroomContext';
import { buildShowroomGeneralWhatsAppUrl } from '../utils/whatsapp';

export const ContactPage: React.FC = () => {
  const { settings, recordEvent } = useShowroom();

  const handleWhatsApp = () => {
    recordEvent('whatsapp_click', {
      metadata: { context: 'contact_page_button' },
    });
    const url = buildShowroomGeneralWhatsAppUrl(settings.whatsapp, settings.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const faqs = [
    {
      q: 'Can I visit the showroom without a prior appointment?',
      a: 'Yes, walk-ins are warmly welcome during standard showroom hours (Monday to Saturday 10:30 AM – 8:30 PM, Sunday 11:00 AM – 7:00 PM). For extensive full-home architectural planning, sending a prior WhatsApp message helps us assign a dedicated furniture consultant.',
    },
    {
      q: 'Do you offer customized sizes and fabrics for catalogue models?',
      a: 'Yes, most of our solid wood dining tables, sofas, and wardrobes can be customized in length, wood stain, and upholstery fabrics (linen, boucle, velvet, or vegan leatherette). Discuss your exact room dimensions with our showroom team.',
    },
    {
      q: 'What does "Available to View" versus "Made to Order" mean?',
      a: '"Available to View" indicates a physical display piece is present on our showroom floor today for tactile inspection. "Made to Order" signifies that the design is custom handcrafted in our workshop upon order confirmation (standard 14 to 21 working days).',
    },
    {
      q: 'How does delivery and assembly work?',
      a: 'We provide complimentary white-glove delivery, room placement, and professional carpenter installation within city limits. Long-distance and interstate deliveries are handled via specialized padded logistics.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 font-sans">
      {/* Header */}
      <div className="border-b border-sand-200 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-walnut-600 block mb-1">
          Visit Us in Person
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-walnut-950">
          Showroom Location & Contact
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-2xl leading-relaxed">
          Experience the tactile warmth of solid timber, test sofa foam densities, and explore
          timber finishes at our physical showroom.
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-sand-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded bg-walnut-900 text-sand-100 flex items-center justify-center font-serif font-bold text-base">
                {settings.initials || 'AF'}
              </span>
              <div>
                <h2 className="font-serif text-2xl font-bold text-walnut-950">{settings.name}</h2>
                <span className="text-xs text-walnut-700 font-medium">{settings.tagline}</span>
              </div>
            </div>

            <div className="space-y-4 pt-2 text-sm text-charcoal-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-walnut-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-charcoal-900 block">Showroom Address:</span>
                  <p className="leading-relaxed">
                    {settings.address}, {settings.city}
                  </p>
                  {settings.landmark && (
                    <span className="text-xs text-charcoal-500 block mt-0.5">
                      Landmark: {settings.landmark}
                    </span>
                  )}
                  <a
                    href={settings.mapDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-walnut-800 hover:text-walnut-950 underline mt-1.5"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-sand-200">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-walnut-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-charcoal-900 block text-xs">Direct Phone:</span>
                    <a href={`tel:${settings.phone}`} className="text-xs hover:underline">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-walnut-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-charcoal-900 block text-xs">Email Desk:</span>
                    <a href={`mailto:${settings.email}`} className="text-xs hover:underline">
                      {settings.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-sand-200">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-walnut-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold text-charcoal-900 block text-xs">
                      Showroom Visiting Hours:
                    </span>
                    {settings.openingHours.map((h, i) => (
                      <div key={i} className="text-xs flex gap-2">
                        <span className="font-medium text-charcoal-800 w-36">{h.days}:</span>
                        <span className="text-charcoal-600">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Call to Action */}
            <div className="pt-4 border-t border-sand-200">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm py-3 px-4 rounded-lg shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Showroom Concierge on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Fictional Demo Note Banner */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Demonstration Notice:</strong> ALISHAN FURNITURES is an interactive digital
              catalogue demonstration for sales presentations. The address, phone numbers, and staff
              are fictional sample configurations.
            </p>
          </div>
        </div>

        {/* Right: Showroom Visual & Map Placeholder */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-xs">
            <div className="aspect-[16/10] bg-sand-200 relative">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"
                alt="Showroom Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                <div className="text-white space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-sand-300 font-semibold">
                    Showroom Experience
                  </span>
                  <h3 className="font-serif text-lg font-bold">5,000 Sq. Ft. Display Gallery</h3>
                  <p className="text-xs text-sand-200">
                    Featuring authentic living sets, dining arrangements, and timber swatches.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-sand-50/70 border-t border-sand-200 space-y-2 text-xs text-charcoal-700">
              <div className="font-bold text-walnut-900">Visiting Checklist:</div>
              <ul className="space-y-1 list-disc list-inside text-charcoal-600">
                <li>Bring approximate room dimensions or floor plan sketches.</li>
                <li>Photos of your room wall paint and floor tiles help match wood tones.</li>
                <li>Test sitting depths and cushion firmness on showroom display pieces.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="pt-6 border-t border-sand-200 space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-walnut-700" />
          <h2 className="font-serif text-2xl font-bold text-walnut-950">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-sand-200 shadow-xs space-y-2"
            >
              <h3 className="font-serif text-base font-bold text-walnut-950">{faq.q}</h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
