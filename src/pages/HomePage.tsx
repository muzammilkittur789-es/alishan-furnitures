import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Compass,
  CheckCircle,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  PackageOpen,
} from 'lucide-react';
import { useShowroom } from '../context/ShowroomContext';
import { ProductCard } from '../components/product/ProductCard';
import { HeroOfferSlideshow } from '../components/home/HeroOfferSlideshow';
import { CircularCategories, CATEGORIES } from '../components/home/CircularCategories';
import { HomeSmartFinder } from '../components/home/HomeSmartFinder';
import { FaqSection } from '../components/home/FaqSection';
import { buildShowroomGeneralWhatsAppUrl } from '../utils/whatsapp';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const HomePage: React.FC = () => {
  const { products, settings, recordEvent } = useShowroom();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { ref: catalogueRef, isRevealed: isCatalogueRevealed } = useScrollReveal(0.06);
  const { ref: showroomRef, isRevealed: isShowroomRevealed } = useScrollReveal(0.06);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter existing featured products based on interactive homepage category selection
  const displayedProducts = useMemo(() => {
    const allFeatured = products.filter((p) => p.featured);
    switch (selectedCategory) {
      case 'sofas':
        return allFeatured.filter((p) => p.category === 'Sofas & Seating');
      case 'beds':
        return allFeatured.filter(
          (p) => p.category === 'Beds & Bedroom Furniture' || p.name.toLowerCase().includes('bed')
        );
      case 'dining':
        return allFeatured.filter((p) => p.category === 'Dining Tables & Chairs');
      case 'wardrobes':
        return allFeatured.filter(
          (p) => p.category === 'Wardrobes & Storage' && p.name.toLowerCase().includes('wardrobe')
        );
      case 'tv':
        return allFeatured.filter((p) => p.category === 'TV Units & Entertainment');
      case 'office':
        return allFeatured.filter((p) => p.category === 'Office Furniture');
      case 'all':
      default:
        return allFeatured;
    }
  }, [products, selectedCategory]);

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  const categoryCatalogueTarget: Record<string, string> = {
    all: '',
    sofas: 'Sofas & Seating',
    beds: 'Beds & Bedroom Furniture',
    dining: 'Dining Tables & Chairs',
    wardrobes: 'Wardrobes & Storage',
    tv: 'TV Units & Entertainment',
    office: 'Office Furniture',
  };

  const handleGeneralWhatsApp = () => {
    recordEvent('whatsapp_click', {
      metadata: { context: 'home_whatsapp_cta' },
    });
    const url = buildShowroomGeneralWhatsAppUrl(settings.whatsapp, settings.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-walnut-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 2: HERO OFFERS SLIDESHOW */}
      <section className="relative pt-2 sm:pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroOfferSlideshow />
      </section>

      {/* SECTION 3 & 4: CIRCULAR CATEGORIES DIRECTLY FOLLOWED BY FEATURED PRODUCTS */}
      <div className="space-y-4 sm:space-y-6">
        <CircularCategories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* FEATURED PRODUCTS HEADING AND PRODUCT CARDS - DIRECTLY BELOW CATEGORY ICONS */}
        <section ref={catalogueRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          {/* Section Heading directly below icons */}
          <div className={`flex items-center justify-between mb-4 sm:mb-6 reveal-fade-up ${isCatalogueRevealed ? 'is-revealed' : ''}`}>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-950">
                Featured Products
              </h2>
              <p className="text-xs text-charcoal-600 mt-0.5">
                {selectedCategory === 'all'
                  ? 'Explore handcrafted signature highlights available in our showroom'
                  : `Showing featured ${currentCategoryObj.name.toLowerCase()} ready for touch-and-feel viewing`}
              </p>
            </div>
            <span className="text-xs font-semibold text-walnut-800 bg-sand-100 px-3 py-1 rounded-full border border-sand-200 shrink-0">
              {displayedProducts.length} {displayedProducts.length === 1 ? 'Product' : 'Products'}
            </span>
          </div>

          {/* Product Cards Grid or Empty State with subtle smooth transition */}
          {displayedProducts.length > 0 ? (
            <div
              key={selectedCategory}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6 animate-in fade-in duration-300"
            >
              {displayedProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className={`reveal-fade-up ${isCatalogueRevealed ? 'is-revealed' : ''}`}
                  style={{ transitionDelay: `${idx * 45}ms` }}
                >
                  <ProductCard
                    product={product}
                    onCompareAlert={showToast}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-sand-50/80 border border-dashed border-sand-300 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto my-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-sand-200/60 text-walnut-700 flex items-center justify-center mx-auto mb-3.5">
                <PackageOpen className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-walnut-950 mb-1.5">
                No Featured Items in {currentCategoryObj.name}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 mb-6 leading-relaxed">
                Our showroom currently features display pieces in other categories, but our complete collection includes custom modular storage, credenzas, and sideboards.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-walnut-950 hover:bg-walnut-900 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  View All Featured Products
                </button>
                <Link
                  to={`/catalogue?category=${encodeURIComponent(categoryCatalogueTarget[selectedCategory] || '')}`}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-walnut-800 text-walnut-900 hover:bg-sand-100 active:scale-95 text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5"
                >
                  <span>Browse Complete Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Explore Complete Catalogue Button - Positioned DIRECTLY AFTER the furniture catalogue cards */}
          <div
            className={`mt-8 sm:mt-12 text-center reveal-fade-up ${isCatalogueRevealed ? 'is-revealed' : ''}`}
            style={{ transitionDelay: '150ms' }}
          >
            <Link
              to={
                selectedCategory === 'all'
                  ? '/catalogue'
                  : `/catalogue?category=${encodeURIComponent(categoryCatalogueTarget[selectedCategory] || '')}`
              }
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-walnut-950 hover:bg-walnut-900 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              <span>
                {selectedCategory === 'all'
                  ? 'Explore Complete Catalogue'
                  : `Explore Complete ${currentCategoryObj.name} Catalogue`}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </section>
      </div>

      {/* SECTION 5: SMART FURNITURE FINDER (EMBEDDED) */}
      <HomeSmartFinder />

      {/* SECTION 6: FREQUENTLY ASKED QUESTIONS */}
      <FaqSection />

      {/* SECTION 7: VISIT / CONTACT SHOWROOM (IN-PERSON EXPERIENCE) */}
      <section ref={showroomRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-white rounded-2xl border border-sand-200 p-6 sm:p-10 shadow-xs space-y-8 reveal-fade-up ${isShowroomRevealed ? 'is-revealed' : ''}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand-200 pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-walnut-600 block mb-1">
                In-Person Experience
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-950">
                Visit Our Physical Showroom
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-xl leading-relaxed">
                Touch seasoned hardwoods, test sofa cushion densities, and view timber finish samples with our design consultants.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGeneralWhatsApp}
              className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Showroom on WhatsApp</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-sand-100 flex items-center justify-center text-walnut-800 border border-sand-200 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-charcoal-900 text-xs block">Showroom Address:</span>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {settings.address}, {settings.city}
                </p>
                {settings.landmark && (
                  <span className="text-[11px] text-charcoal-500 block">
                    Landmark: {settings.landmark}
                  </span>
                )}
                <a
                  href={settings.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-walnut-800 hover:text-walnut-950 underline pt-0.5"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-sand-100 flex items-center justify-center text-walnut-800 border border-sand-200 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-charcoal-900 text-xs block">Showroom Hours:</span>
                {settings.openingHours.map((h, i) => (
                  <div key={i} className="text-xs text-charcoal-600">
                    <span className="font-medium text-charcoal-800 block text-[11px]">{h.days}:</span>
                    <span>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-sand-100 flex items-center justify-center text-walnut-800 border border-sand-200 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-charcoal-900 text-xs block">Direct Contact:</span>
                <div className="text-xs">
                  <span className="text-charcoal-500 text-[11px] block">Showroom Call Desk:</span>
                  <a href={`tel:${settings.phone}`} className="font-semibold text-charcoal-800 hover:underline">
                    {settings.phone}
                  </a>
                </div>
                <div className="text-xs pt-1">
                  <span className="text-charcoal-500 text-[11px] block">WhatsApp Support:</span>
                  <span className="font-medium text-emerald-800">{settings.whatsapp}</span>
                </div>
              </div>
            </div>

            {/* Email & Directions */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-sand-100 flex items-center justify-center text-walnut-800 border border-sand-200 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-charcoal-900 text-xs block">Email & Guidance:</span>
                <div className="text-xs">
                  <span className="text-charcoal-500 text-[11px] block">Showroom Enquiries:</span>
                  <a href={`mailto:${settings.email}`} className="font-medium text-charcoal-800 hover:underline">
                    {settings.email}
                  </a>
                </div>
                <div className="pt-2">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-walnut-900 hover:text-walnut-700 underline"
                  >
                    <span>Full Contact & FAQ Guide</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
