import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  CheckCircle,
  ArrowLeft,
  Ruler,
  ShieldCheck,
  Truck,
  Wrench,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react';
import { useShowroom } from '../context/ShowroomContext';
import { SafeImage } from '../components/common/SafeImage';
import { formatCurrency, formatAvailability, formatDimensions } from '../utils/formatters';
import { buildProductWhatsAppUrl } from '../utils/whatsapp';
import { ProductCard } from '../components/product/ProductCard';
import { ProductInformationAssistant } from '../components/product/ProductInformationAssistant';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    products,
    settings,
    isFavourite,
    toggleFavourite,
    recordEvent,
  } = useShowroom();

  const product = products.find((p) => p.slug === slug || p.id === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Record product view analytics
  useEffect(() => {
    if (product) {
      recordEvent('product_view', {
        productId: product.id,
        productName: product.name,
        category: product.category,
      });
      // Set initial variant
      if (product.variants && product.variants.length > 0) {
        setSelectedVariantId(product.variants[0].id);
      }
      setActiveImageIndex(0);
    }
  }, [product, recordEvent]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-sans">
        <h2 className="font-serif text-3xl font-bold text-walnut-950 mb-3">
          Furniture Piece Not Found
        </h2>
        <p className="text-sm text-charcoal-600 mb-6">
          The requested furniture product may have been archived or updated.
        </p>
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 bg-walnut-900 text-white px-5 py-2.5 rounded-md text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalogue</span>
        </Link>
      </div>
    );
  }

  const fav = isFavourite(product.id);
  const avail = formatAvailability(product.availability);

  // Compute active price with variant difference
  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const activePrice = product.price + (selectedVariant?.priceDelta || 0);

  const handleWhatsApp = () => {
    recordEvent('whatsapp_click', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      metadata: {
        variant: selectedVariant?.name,
        color: product.colors[selectedColorIndex]?.name,
      },
    });

    const url = buildProductWhatsAppUrl(settings.whatsapp, {
      name: product.name + (selectedVariant ? ` (${selectedVariant.name})` : ''),
      sku: selectedVariant ? selectedVariant.sku : product.sku,
      price: activePrice,
      isPriceIndicative: product.isPriceIndicative,
      category: product.category,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    recordEvent('share_action', {
      productId: product.id,
      productName: product.name,
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | ${settings.name}`,
          text: `Check out ${product.name} at ${settings.name}:`,
          url: window.location.href,
        });
        showToast('Link shared successfully!');
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    } catch (e) {
      showToast('Copy link: ' + window.location.href);
    }
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.room === product.room))
    .slice(0, 3);

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.primaryImage];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-walnut-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-charcoal-500 overflow-x-auto whitespace-nowrap pb-1">
        <Link to="/" className="hover:text-walnut-900">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
        <Link to="/catalogue" className="hover:text-walnut-900">
          Catalogue
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
        <Link
          to={`/catalogue?category=${encodeURIComponent(product.category)}`}
          className="hover:text-walnut-900"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-400" />
        <span className="text-walnut-950 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-sand-100 rounded-2xl overflow-hidden border border-sand-300 shadow-xs relative">
            <SafeImage
              src={imagesList[activeImageIndex] || product.primaryImage}
              alt={`${product.name} view ${activeImageIndex + 1}`}
              aspectRatioClass="aspect-[4/3] sm:aspect-[16/11]"
              className="w-full h-full object-cover"
            />

            {/* Availability Pill on Image */}
            <div className="absolute top-4 left-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border shadow-xs backdrop-blur-md ${avail.badgeClass}`}
              >
                <span className={`w-2 h-2 rounded-full ${avail.dotClass}`} />
                {avail.label}
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-walnut-800 ring-2 ring-walnut-800/20'
                      : 'border-sand-300 hover:border-walnut-400 opacity-80'
                  }`}
                >
                  <SafeImage
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    aspectRatioClass="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Craftsmanship Note */}
          {product.craftsmanshipNotes && (
            <div className="bg-sand-100/70 p-4 rounded-xl border border-sand-200 text-xs text-charcoal-700 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-walnut-900 uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-walnut-600" />
                <span>Craftsmanship & Timber Origin</span>
              </div>
              <p className="leading-relaxed">{product.craftsmanshipNotes}</p>
            </div>
          )}
        </div>

        {/* Right Column: Specifications & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-walnut-700 mb-1.5">
              <span className="font-semibold uppercase tracking-wider">{product.category}</span>
              <span className="font-mono text-charcoal-400 bg-sand-100 px-2 py-0.5 rounded">
                SKU: {selectedVariant ? selectedVariant.sku : product.sku}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-walnut-950 leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-charcoal-600 mt-2 leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-sand-100/80 p-4 rounded-xl border border-sand-300 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-walnut-950 font-sans tracking-tight">
                {formatCurrency(activePrice)}
              </span>
              {product.isPriceIndicative && (
                <span className="text-xs bg-sand-200 text-walnut-900 px-2 py-0.5 rounded font-medium border border-sand-300">
                  Indicative Showroom Rate
                </span>
              )}
            </div>
            <p className="text-[11px] text-charcoal-500 leading-snug">
              {settings.indicativePriceDisclaimer}
            </p>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-walnut-900 uppercase tracking-wider block">
                Select Configuration / Size
              </label>
              <div className="grid grid-cols-1 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                      selectedVariantId === v.id
                        ? 'border-walnut-800 bg-sand-200/80 text-walnut-950 ring-1 ring-walnut-800 font-medium'
                        : 'border-sand-300 bg-white text-charcoal-700 hover:border-walnut-400'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{v.name}</div>
                      {v.specNotes && (
                        <div className="text-[11px] text-charcoal-500">{v.specNotes}</div>
                      )}
                    </div>
                    {v.priceDelta !== undefined && v.priceDelta !== 0 && (
                      <span className="text-xs font-bold text-walnut-800">
                        {v.priceDelta > 0 ? `+${formatCurrency(v.priceDelta)}` : `-${formatCurrency(Math.abs(v.priceDelta))}`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color & Finish Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-walnut-900 uppercase tracking-wider">
                  Finish / Upholstery:
                </span>
                <span className="font-semibold text-charcoal-800">
                  {product.colors[selectedColorIndex]?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColorIndex(i)}
                    className={`group relative p-1 rounded-full border transition-all ${
                      selectedColorIndex === i
                        ? 'border-walnut-900 ring-2 ring-walnut-800/30'
                        : 'border-transparent hover:border-sand-400'
                    }`}
                    title={c.name}
                  >
                    <span
                      className="block w-6 h-6 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm py-3.5 px-6 rounded-lg shadow-md transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enquire on WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => toggleFavourite(product.id)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border transition-colors ${
                  fav
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : 'border-sand-300 bg-white text-charcoal-700 hover:bg-sand-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${fav ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>{fav ? 'Saved to Favourites' : 'Save to Favourites'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-sand-300 bg-white text-charcoal-700 hover:bg-sand-100 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Piece</span>
              </button>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="border-t border-sand-200 pt-5 space-y-3">
            <h4 className="font-serif text-sm font-bold text-walnut-950 uppercase tracking-wider">
              Product Dimensions & Build
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-sand-50 p-2.5 rounded border border-sand-200">
                <span className="text-charcoal-400 block text-[11px]">Dimensions:</span>
                <span className="font-semibold text-charcoal-900">
                  {formatDimensions(
                    product.dimensions.width,
                    product.dimensions.depth,
                    product.dimensions.height,
                    product.dimensions.unit
                  )}
                </span>
              </div>

              {product.dimensions.seatingCapacity && (
                <div className="bg-sand-50 p-2.5 rounded border border-sand-200">
                  <span className="text-charcoal-400 block text-[11px]">Seating:</span>
                  <span className="font-semibold text-charcoal-900">
                    {product.dimensions.seatingCapacity} Persons
                  </span>
                </div>
              )}

              <div className="bg-sand-50 p-2.5 rounded border border-sand-200 col-span-2">
                <span className="text-charcoal-400 block text-[11px]">Primary Materials:</span>
                <span className="font-semibold text-charcoal-900">
                  {product.materials.join(' • ')}
                </span>
              </div>
            </div>
          </div>

          {/* Showroom Assurances */}
          <div className="border-t border-sand-200 pt-4 space-y-2 text-xs text-charcoal-600">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-walnut-700 shrink-0 mt-0.5" />
              <span>{product.warranty || 'Comprehensive showroom structural warranty.'}</span>
            </div>
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-walnut-700 shrink-0 mt-0.5" />
              <span>{product.delivery || 'Local white-glove floor placement available.'}</span>
            </div>
            <div className="flex items-start gap-2">
              <Wrench className="w-4 h-4 text-walnut-700 shrink-0 mt-0.5" />
              <span>{product.customizationNotes || 'Custom dimensions available on request.'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Assistant */}
      <ProductInformationAssistant product={product} settings={settings} />

      {/* Product Description Narrative */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-sand-200 shadow-xs space-y-4">
        <h3 className="font-serif text-2xl font-bold text-walnut-950">
          Design & Functional Details
        </h3>
        <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed max-w-4xl">
          {product.description}
        </p>

        {product.finishes && product.finishes.length > 0 && (
          <div className="pt-4 border-t border-sand-200">
            <span className="text-xs font-bold text-walnut-800 uppercase tracking-wider block mb-2">
              Available Polish & Timber Finishes:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {product.finishes.map((f) => (
                <span key={f} className="bg-sand-100 text-charcoal-800 px-3 py-1 rounded-md border border-sand-200 font-medium">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related / Pairing Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-walnut-600 block mb-1">
                Showroom Pairings
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-950">
                You May Also Consider
              </h3>
            </div>
            <Link
              to="/catalogue"
              className="text-xs font-semibold text-walnut-800 hover:text-walnut-950 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
