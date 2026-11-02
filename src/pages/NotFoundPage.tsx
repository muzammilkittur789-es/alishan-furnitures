import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Layers } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center font-sans space-y-6">
      <div className="w-16 h-16 rounded-full bg-sand-200 text-walnut-800 flex items-center justify-center mx-auto font-serif text-2xl font-bold">
        404
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-bold text-walnut-950">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
          The showroom page or collection you are looking for does not exist or may have been moved.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 bg-walnut-900 hover:bg-walnut-800 text-white px-5 py-2.5 rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Go to Home</span>
        </Link>
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-1.5 bg-sand-200 hover:bg-sand-300 text-walnut-950 px-5 py-2.5 rounded-md text-xs font-semibold transition-colors"
        >
          <Layers className="w-4 h-4" />
          <span>Browse Catalogue</span>
        </Link>
      </div>
    </div>
  );
};
