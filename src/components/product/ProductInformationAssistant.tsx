import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  MessageCircle,
  Ruler,
  Layers,
  Store,
  ShieldCheck,
  Truck,
  Sparkle,
  Send,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Product, ShowroomSettings } from '../../types';
import { formatCurrency, formatAvailability, formatDimensions } from '../../utils/formatters';
import { buildProductWhatsAppUrl } from '../../utils/whatsapp';

interface ProductInformationAssistantProps {
  product: Product;
  settings: ShowroomSettings;
}

interface PredefinedQuestion {
  id: string;
  question: string;
  icon: React.ComponentType<{ className?: string }>;
  getAnswer: (p: Product, s: ShowroomSettings) => {
    title: string;
    content: string[];
    highlight?: string;
  };
}

export const ProductInformationAssistant: React.FC<ProductInformationAssistantProps> = ({
  product,
  settings,
}) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('dimensions');
  const [userQuery, setUserQuery] = useState('');
  const [customAnswer, setCustomAnswer] = useState<{
    query: string;
    title: string;
    content: string[];
    highlight?: string;
  } | null>(null);

  const avail = formatAvailability(product.availability);
  const formattedDims = formatDimensions(
    product.dimensions.width,
    product.dimensions.depth,
    product.dimensions.height,
    product.dimensions.unit
  );

  const predefinedQuestions: PredefinedQuestion[] = [
    {
      id: 'dimensions',
      question: 'Will this fit in my space? (Exact Dimensions)',
      icon: Ruler,
      getAnswer: (p) => ({
        title: `Dimensions Breakdown for ${p.name}`,
        content: [
          `Overall dimensions: ${formattedDims} (${p.dimensions.unit.toUpperCase()}).`,
          p.dimensions.seatingCapacity
            ? `Seating capacity: Comfortably accommodates ${p.dimensions.seatingCapacity} people.`
            : `Design footprint: Suitable for standard room clearances; maintain 2 to 3 feet walkway clearance around the piece.`,
          p.customizationNotes
            ? `Custom sizing: ${p.customizationNotes}`
            : 'Custom dimensions can be ordered upon request at our showroom.',
        ],
        highlight: `Ensure a minimum doorway width of ${Math.min(p.dimensions.width, p.dimensions.height)} ${p.dimensions.unit} for delivery access.`,
      }),
    },
    {
      id: 'materials',
      question: 'What wood, materials, and construction are used?',
      icon: Layers,
      getAnswer: (p) => ({
        title: `Materials & Build Standards`,
        content: [
          `Primary Materials: ${p.materials.join(', ')}.`,
          p.craftsmanshipNotes
            ? `Craftsmanship: ${p.craftsmanshipNotes}`
            : 'Handcrafted utilizing kiln-dried seasoned hardwood with traditional joinery.',
          p.colors && p.colors.length > 0
            ? `Available Palette: ${p.colors.map((c) => c.name).join(', ')}.`
            : 'Finished in organic oils and clear protective topcoats.',
        ],
        highlight: '100% genuine hardwood framework designed to resist warping and seasonal moisture expansion.',
      }),
    },
    {
      id: 'availability',
      question: 'Can I inspect this piece in the showroom today?',
      icon: Store,
      getAnswer: (p, s) => ({
        title: `Current Showroom Status: ${avail.label}`,
        content: [
          avail.description,
          `Our showroom is located at ${s.address}, ${s.city}.`,
          `Visiting hours: Monday to Saturday 10:30 AM – 8:30 PM, Sunday 11:00 AM – 7:00 PM.`,
        ],
        highlight:
          p.availability === 'available_to_view'
            ? 'Physical piece is available for tactile inspection, seating comfort test, and finish matching.'
            : 'Sample timber finishes, cushion density swatches, and fabric samples are available to view in-person.',
      }),
    },
    {
      id: 'finishes',
      question: 'Can I customize finishes, fabrics, or sizes?',
      icon: Sparkles,
      getAnswer: (p) => ({
        title: `Customization & Finishes`,
        content: [
          p.finishes && p.finishes.length > 0
            ? `Available Polish & Timber Finishes: ${p.finishes.join(', ')}.`
            : 'Available in Teak, Walnut, and Natural Matte finishes.',
          p.customizationNotes ||
            'We offer bespoke sizing, custom fabric swatches (boucle, velvet, linen), and wood stains.',
          p.variants && p.variants.length > 0
            ? `Standard variants offered: ${p.variants.map((v) => v.name).join(', ')}.`
            : 'Made to order with personalized specifications.',
        ],
        highlight: 'Bespoke customization takes approximately 14 to 21 working days for master artisan production.',
      }),
    },
    {
      id: 'delivery',
      question: 'What are the delivery and warranty terms?',
      icon: Truck,
      getAnswer: (p) => ({
        title: `Delivery, Assembly & Warranty`,
        content: [
          `Warranty: ${p.warranty || 'Comprehensive showroom structural warranty included.'}`,
          `Delivery: ${p.delivery || 'Local white-glove delivery and doorstep assembly included within city limits.'}`,
          'Professional carpenters will unbox, assemble, and position the piece in your desired room.',
        ],
        highlight: 'Zero delivery transit damage guarantee with verified pre-delivery quality inspection.',
      }),
    },
    {
      id: 'care',
      question: 'How do I clean and care for this furniture?',
      icon: ShieldCheck,
      getAnswer: (p) => ({
        title: `Care & Maintenance Guidelines`,
        content: [
          'Dust regularly with a dry, lint-free microfiber cloth along the wood grain.',
          'Keep away from prolonged direct harsh sunlight and continuous air conditioning vents to preserve natural moisture.',
          'Always use coasters, trivets, or placemats for warm dishes and cold drinks.',
          'For fabric/upholstery: vacuum with a soft brush attachment and treat liquid spills immediately with blotting.',
        ],
        highlight: 'Periodic conditioning with natural beeswax once every 6 months enhances timber luster and moisture resistance.',
      }),
    },
  ];

  const currentPredefined = predefinedQuestions.find((q) => q.id === selectedQuestionId);
  const activeAnswer = customAnswer || (currentPredefined ? currentPredefined.getAnswer(product, settings) : null);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const q = userQuery.toLowerCase();
    let title = `Assistant Inquiry: "${userQuery}"`;
    let content: string[] = [];
    let highlight = '';

    if (q.includes('size') || q.includes('dimension') || q.includes('fit') || q.includes('height') || q.includes('width')) {
      title = `Dimensions & Sizing for ${product.name}`;
      content = [
        `The exact dimensions are ${formattedDims} (${product.dimensions.unit}).`,
        product.dimensions.seatingCapacity ? `Seating capacity: ${product.dimensions.seatingCapacity} people.` : `Space planning: suitable for standard residential rooms.`,
        product.customizationNotes || 'Custom dimensions can be crafted to match your exact room floor plan.',
      ];
      highlight = 'Need a custom size? Contact our showroom via WhatsApp for bespoke dimension quotation.';
    } else if (q.includes('price') || q.includes('cost') || q.includes('discount') || q.includes('offer')) {
      title = `Pricing & Offers for ${product.name}`;
      content = [
        `Showroom Indicative Price: ${formatCurrency(product.price)}.`,
        'Prices include premium hardware and showroom quality finishing.',
        'Showroom offers, package discounts, and seasonal promotions can be confirmed with our sales team.',
      ];
      highlight = 'Special pricing is available when furnishing multiple rooms or complete bedroom/living packages.';
    } else if (q.includes('wood') || q.includes('material') || q.includes('quality') || q.includes('fabric')) {
      title = `Materials & Quality for ${product.name}`;
      content = [
        `Materials: ${product.materials.join(', ')}.`,
        product.craftsmanshipNotes || 'Masterfully built using kiln-dried solid hardwoods.',
        'High density foams and premium grade upholstery fabrics used throughout.',
      ];
      highlight = 'All wood is sustainably sourced, properly seasoned, and chemically treated against pests and termites.';
    } else {
      title = `Inquiry regarding ${product.name}`;
      content = [
        `For specific inquiries regarding "${userQuery}", our showroom furniture specialists can provide tailored recommendations, live floor photographs, and fabric swatch options.`,
        `Current Status: ${avail.label} (${avail.description}).`,
        `Direct Showroom Desk: ${settings.phone} / ${settings.whatsapp}`,
      ];
      highlight = 'Click below to transfer this inquiry directly to our showroom WhatsApp concierge.';
    }

    setCustomAnswer({ query: userQuery, title, content, highlight });
  };

  const handleAskWhatsAppWithQuery = () => {
    const questionText = customAnswer ? customAnswer.query : currentPredefined?.question || 'Product Inquiry';
    const msg = `Hello ${settings.name}, I was reviewing "${product.name}" (SKU: ${product.sku}) on your digital catalogue and had a question:\n\n"${questionText}"\n\nCould you please help me with details and availability?`;
    const cleanNumber = settings.whatsapp.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl border border-sand-300 p-6 sm:p-8 shadow-xs space-y-6 font-sans">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sand-100 text-walnut-800 text-[11px] font-semibold mb-1 border border-sand-200">
            <Sparkles className="w-3.5 h-3.5 text-walnut-600" />
            <span>Interactive Assistant</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-walnut-950">
            Product Information Assistant
          </h3>
          <p className="text-xs text-charcoal-600 mt-0.5">
            Get instant, verified answers about dimensions, materials, finishes, availability, and care from our catalogue data.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAskWhatsAppWithQuery}
          className="inline-flex items-center gap-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-2 rounded-lg transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Ask Staff on WhatsApp</span>
        </button>
      </div>

      {/* Quick Question Chips */}
      <div>
        <label className="text-[11px] font-bold text-walnut-900 uppercase tracking-wider block mb-2.5">
          Select a common question:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {predefinedQuestions.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedQuestionId === item.id && !customAnswer;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedQuestionId(item.id);
                  setCustomAnswer(null);
                }}
                className={`p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'border-walnut-800 bg-sand-200/80 text-walnut-950 ring-1 ring-walnut-800 font-semibold shadow-xs'
                    : 'border-sand-200 bg-sand-50 hover:bg-sand-100 text-charcoal-700'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-walnut-900' : 'text-walnut-700'}`} />
                <span className="leading-snug">{item.question}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Display Card */}
      {activeAnswer && (
        <div className="bg-sand-50 rounded-xl p-5 sm:p-6 border border-sand-200 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-sand-200/80 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <h4 className="font-serif text-base font-bold text-walnut-950">
                {activeAnswer.title}
              </h4>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-mono text-charcoal-500 bg-white px-2 py-0.5 rounded border border-sand-200">
              Verified Data
            </span>
          </div>

          <div className="space-y-2 text-xs text-charcoal-700">
            {activeAnswer.content.map((point, idx) => (
              <p key={idx} className="leading-relaxed flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-walnut-700 shrink-0 mt-1.5" />
                <span>{point}</span>
              </p>
            ))}
          </div>

          {activeAnswer.highlight && (
            <div className="bg-white rounded-lg p-3 border border-sand-200 text-xs text-walnut-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-walnut-700 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{activeAnswer.highlight}</span>
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-charcoal-500">
              Need more clarification on this answer?
            </span>
            <button
              type="button"
              onClick={handleAskWhatsAppWithQuery}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask Showroom Concierge on WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Custom Question Ask Box */}
      <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-sand-200 space-y-2">
        <label className="text-[11px] font-bold text-charcoal-700 block">
          Or type your specific question about {product.name}:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="e.g. Will this fit a 12x10 living room? Can I get walnut stain? What is the warranty?"
            className="flex-1 bg-sand-50 border border-sand-300 rounded-lg px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-walnut-800 focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-walnut-900 hover:bg-walnut-800 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </div>
      </form>
    </div>
  );
};
