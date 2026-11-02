import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useShowroom } from '../../context/ShowroomContext';
import { buildShowroomGeneralWhatsAppUrl } from '../../utils/whatsapp';
import { Logo } from '../common/Logo';

export const Footer: React.FC = () => {
  const { settings } = useShowroom();

  const handleWhatsApp = () => {
    const url = buildShowroomGeneralWhatsAppUrl(settings.whatsapp, settings.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-walnut-950 text-sand-200 pt-16 pb-12 border-t border-walnut-900 mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-walnut-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group">
              <Logo variant="dark" size="lg" />
            </Link>
            <p className="text-sand-300 text-sm leading-relaxed max-w-sm">
              {settings.tagline} Discover handcrafted sofas, solid timber dining tables, platform
              beds, and modular wardrobe storage.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-md transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire via WhatsApp ({settings.whatsapp})</span>
              </button>
            </div>
          </div>

          {/* Quick Category Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase">
              Furniture Categories
            </h4>
            <ul className="space-y-2 text-xs text-sand-300">
              <li>
                <Link to="/catalogue?category=Sofas%20%26%20Seating" className="hover:text-white transition-colors">
                  Sofas & Seating
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=Beds%20%26%20Bedroom%20Furniture" className="hover:text-white transition-colors">
                  Beds & Bedroom
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=Dining%20Tables%20%26%20Chairs" className="hover:text-white transition-colors">
                  Dining Tables & Chairs
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=Wardrobes%20%26%20Storage" className="hover:text-white transition-colors">
                  Wardrobes & Storage
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=TV%20Units%20%26%20Entertainment" className="hover:text-white transition-colors">
                  TV Units & Entertainment
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=Office%20Furniture" className="hover:text-white transition-colors">
                  Office Furniture
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Tools */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase">
              Discovery & Service
            </h4>
            <ul className="space-y-2 text-xs text-sand-300">
              <li>
                <Link to="/catalogue" className="hover:text-white font-medium text-sand-100 transition-colors">
                  Browse All Furniture →
                </Link>
              </li>
              <li>
                <Link to="/find-furniture" className="hover:text-white transition-colors">
                  Smart Furniture Finder
                </Link>
              </li>
              <li>
                <Link to="/favourites" className="hover:text-white transition-colors">
                  Saved Shortlist
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Showroom Timings & Directions
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom Visiting Info */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase">
              Showroom Location
            </h4>
            <div className="space-y-2.5 text-xs text-sand-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sand-400 shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.city}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sand-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sand-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-walnut-900">
                <Clock className="w-4 h-4 text-sand-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  {settings.openingHours.map((h, i) => (
                    <div key={i} className="text-[11px]">
                      <span className="text-sand-400">{h.days}:</span> {h.hours}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Public Copyright & Clean Disclaimer (NO Admin or Reset Links) */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sand-400">
          <div className="flex items-center gap-2 text-center md:text-left">
            <ShieldCheck className="w-4 h-4 text-sand-300 shrink-0" />
            <span>
              &copy; {new Date().getFullYear()} {settings.name}. All product designs, timber finishes, and specifications presented for digital customer discovery.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-sand-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/catalogue" className="text-sand-300 hover:text-white transition-colors">
              Catalogue
            </Link>
            <Link to="/contact" className="text-sand-300 hover:text-white transition-colors">
              Contact & Directions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
