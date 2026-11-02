import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Trash2,
  ArrowRight,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { useShowroom } from '../context/ShowroomContext';
import { ProductCard } from '../components/product/ProductCard';
import { buildShortlistWhatsAppUrl } from '../utils/whatsapp';
import { formatCurrency } from '../utils/formatters';

export const FavouritesPage: React.FC = () => {
  const { products, favourites, settings, toggleFavourite, recordEvent } = useShowroom();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const favouriteProducts = products.filter((p) => favourites.includes(p.id));

  const handleShareShortlistWhatsApp = () => {
    if (favouriteProducts.length === 0) return;

    recordEvent('whatsapp_click', {
      metadata: {
        context: 'favourites_shortlist_share',
        count: favouriteProducts.length,
      },
    });

    const url = buildShortlistWhatsAppUrl(
      settings.whatsapp,
      favouriteProducts.map((p) => ({
        name: p.name,
        sku: p.sku,
        price: p.price,
      })),
      settings.name
    );

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const totalIndicativePrice = favouriteProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-walnut-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-sand-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-600" />
            <span>Customer Shortlist</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-walnut-950">
            Saved Favourites ({favouriteProducts.length})
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-xl">
            Pieces you have earmarked for your home. You can enquire about the entire shortlist
            together with our showroom team on WhatsApp.
          </p>
        </div>

        {favouriteProducts.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleShareShortlistWhatsApp}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2.5 rounded-md shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enquire Shortlist on WhatsApp</span>
            </button>
          </div>
        )}
      </div>

      {/* Favourites Grid or Empty State */}
      {favouriteProducts.length > 0 ? (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="bg-sand-100 p-4 rounded-xl border border-sand-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-charcoal-700">
              <span className="font-semibold text-walnut-950">Combined Indicative Total: </span>
              <span className="font-bold text-base text-walnut-950 font-sans ml-1">
                {formatCurrency(totalIndicativePrice)}
              </span>
              <span className="text-charcoal-500 block text-[11px] mt-0.5">
                (Subject to showroom floor discounts, finishes, and dimensions)
              </span>
            </div>

            <div className="text-xs text-charcoal-500">
              Stored locally on your browser. No login required.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favouriteProducts.map((p) => (
              <ProductCard key={p.id} product={p} onCompareAlert={showToast} />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-sand-200 p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100">
            <Heart className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-walnut-950">
              Your Shortlist is Empty
            </h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Explore our furniture catalogue and tap the heart icon on pieces you love to build a
              custom shortlist.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 bg-walnut-900 hover:bg-walnut-800 text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors shadow-xs"
            >
              <Layers className="w-4 h-4" />
              <span>Explore Furniture Catalogue</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
