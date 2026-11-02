import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Sparkles, ChevronRight } from 'lucide-react';
import { useShowroom } from '../context/ShowroomContext';
import { ProductCard } from '../components/product/ProductCard';
import { SafeImage } from '../components/common/SafeImage';
import { RoomCollection } from '../types';

export const RoomCollectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useShowroom();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const roomData: Record<
    string,
    {
      title: string;
      roomKey: RoomCollection;
      tagline: string;
      description: string;
      heroImage: string;
      tips: string[];
    }
  > = {
    living: {
      title: 'Living Room Collection',
      roomKey: 'living',
      tagline: 'Warm conversational spaces crafted for hospitality and unwinding',
      description:
        'From deep-tufted Chesterfields to architectural nesting travertine coffee tables, our living collection harmonizes solid timber integrity with relaxed contemporary comfort.',
      heroImage:
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80',
      tips: [
        'Leave at least 18 inches between coffee table and sofa for comfortable legroom.',
        'Pair warm cognac leatherette with textured oatmeal boucles for textural depth.',
        'Choose floating TV units to keep floor pathways airy and unobstructed.',
      ],
    },
    bedroom: {
      title: 'Bedroom Suite Collection',
      roomKey: 'bedroom',
      tagline: 'Quiet timber sanctuaries prioritizing restorative rest and organization',
      description:
        'Solid Sheesham platform beds with Japanese joinery and hydraulic storage solutions engineered for calm master bedrooms.',
      heroImage:
        'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1400&q=80',
      tips: [
        'Ensure 24-30 inches on both sides of a king bed for ease of movement and nightstand access.',
        'Use hydraulic gas-lift platforms to store seasonal quilts without requiring external closets.',
        'Select matte natural wood polishes to promote a calming, sleep-friendly environment.',
      ],
    },
    dining: {
      title: 'Dining Room Collection',
      roomKey: 'dining',
      tagline: 'Solid timber dining tables and chairs built for shared family occasions',
      description:
        'Gather around Grade-A plantation teak and honed stone round tables designed to endure decades of dinner conversations and celebrations.',
      heroImage:
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80',
      tips: [
        'Allow 36 inches between dining chairs and walls so seated guests can stand up effortlessly.',
        'Round pedestal tables eliminate corner leg collisions in compact dining corners.',
        'Solid teak breadboard ends prevent tabletop warping across seasonal humidity shifts.',
      ],
    },
    office: {
      title: 'Home Office & Study',
      roomKey: 'office',
      tagline: 'Thoughtful, distraction-free work tables and ergonomic studio chairs',
      description:
        'Executive walnut desks with hidden cable management paired with bentwood ergonomic chairs that respect both your posture and interior aesthetics.',
      heroImage:
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1400&q=80',
      tips: [
        'Position work desk perpendicular to windows to minimize screen glare.',
        'Utilize built-in magnetic cable pass-throughs to eliminate messy cord clutter.',
        'Pair breathable weave fabrics with solid timber backing for executive comfort.',
      ],
    },
    storage: {
      title: 'Storage & Wardrobes',
      roomKey: 'storage',
      tagline: 'Modular sliding wardrobes, display partitions, and organizational craft',
      description:
        'Engineered teak full-height wardrobes with whisper-glide tracks and staggered open bookshelves serving as architectural room dividers.',
      heroImage:
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1400&q=80',
      tips: [
        'Sliding wardrobes eliminate clearance issues in bedrooms with tight bed distances.',
        'Combine open display shelving with concealed lower drawers for balanced aesthetics.',
        'Select moisture-resistant HDMR core boards for durable coastal Indian climates.',
      ],
    },
  };

  const current = slug ? roomData[slug] : null;

  if (!current) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-sans">
        <h2 className="font-serif text-3xl font-bold text-walnut-950 mb-3">
          Room Collection Not Found
        </h2>
        <p className="text-sm text-charcoal-600 mb-6">
          Please select from our available room collections.
        </p>
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 bg-walnut-900 text-white px-5 py-2.5 rounded-md text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue</span>
        </Link>
      </div>
    );
  }

  const roomProducts = products.filter((p) => p.room === current.roomKey);

  return (
    <div className="space-y-12 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-walnut-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner with Curated Room Visual (Strictly Non-Living) */}
      <div className="relative bg-walnut-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <SafeImage
            src={current.heroImage}
            alt={current.title}
            aspectRatioClass="w-full h-full"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-walnut-950 via-walnut-950/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-4">
          <nav className="flex items-center gap-1.5 text-xs text-sand-300">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/catalogue" className="hover:text-white">
              Catalogue
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-sand-100 font-semibold">{current.title}</span>
          </nav>

          <span className="text-xs uppercase tracking-widest text-sand-300 font-semibold block">
            Room Architecture
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl">
            {current.title}
          </h1>
          <p className="text-sand-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            {current.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Interior Styling Suggestions Box */}
        <div className="bg-sand-100/80 rounded-xl border border-sand-300 p-6 space-y-3">
          <div className="flex items-center gap-2 text-walnut-900 font-serif font-bold text-base">
            <Sparkles className="w-4 h-4 text-walnut-700" />
            <span>Showroom Space Planning Advice</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-charcoal-700">
            {current.tips.map((tip, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-lg border border-sand-200 space-y-1">
                <span className="font-bold text-walnut-800 text-[11px] block">Tip #{idx + 1}</span>
                <p className="leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Room Products Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-sand-200 pb-3">
            <h2 className="font-serif text-2xl font-bold text-walnut-950">
              {current.title} Pieces ({roomProducts.length})
            </h2>
            <Link
              to="/catalogue"
              className="text-xs font-semibold text-walnut-800 hover:text-walnut-950"
            >
              View Full Showroom Catalogue →
            </Link>
          </div>

          {roomProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomProducts.map((p) => (
                <ProductCard key={p.id} product={p} onCompareAlert={showToast} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-10 text-center rounded-xl border border-sand-200 text-charcoal-600">
              No products assigned to this room yet. Check back soon or visit our showroom.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
