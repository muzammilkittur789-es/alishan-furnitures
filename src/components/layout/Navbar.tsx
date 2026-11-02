import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Heart,
  Search,
  MessageCircle,
  Menu,
  X,
  Compass,
  Layers,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useShowroom } from '../../context/ShowroomContext';
import { buildShowroomGeneralWhatsAppUrl } from '../../utils/whatsapp';
import { Logo } from '../common/Logo';

export const Navbar: React.FC = () => {
  const { settings, favourites, recordEvent } = useShowroom();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleGeneralWhatsApp = () => {
    recordEvent('whatsapp_click', {
      metadata: { context: 'navbar_general_concierge' },
    });
    const url = buildShowroomGeneralWhatsAppUrl(settings.whatsapp, settings.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      recordEvent('search', { metadata: { query: searchQuery.trim(), source: 'navbar_search' } });
      navigate(`/catalogue?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const rooms = [
    { name: 'Living Room', slug: 'living', desc: 'Sofas, coffee tables & lounges' },
    { name: 'Bedroom', slug: 'bedroom', desc: 'Platform beds & luxury storage' },
    { name: 'Dining Room', slug: 'dining', desc: 'Solid wood tables & chairs' },
    { name: 'Home Office', slug: 'office', desc: 'Desks & ergonomic swivel chairs' },
    { name: 'Storage Solutions', slug: 'storage', desc: 'Wardrobes & display shelves' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-sand-50/95 backdrop-blur-md border-b border-sand-200/80 transition-all font-sans">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2">
          {/* Brand Logo - Minimal architectural mark + brand typography */}
          <Link
            to="/"
            className="flex items-center group py-1 min-w-0 shrink-0"
            onClick={() => {
              setMobileMenuOpen(false);
              setMobileSearchOpen(false);
            }}
          >
            <Logo variant="light" />
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-xs xl:max-w-sm mx-4 relative"
          >
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sofas, dining, teak..."
              className="w-full pl-9 pr-3 py-1.5 bg-sand-100/80 hover:bg-white focus:bg-white border border-sand-300 focus:border-walnut-700 rounded-full text-xs text-charcoal-800 placeholder:text-charcoal-400 focus:outline-hidden transition-all"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-walnut-900 bg-sand-200/60 font-semibold'
                  : 'text-charcoal-700 hover:text-walnut-900 hover:bg-sand-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/catalogue"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/catalogue')
                  ? 'text-walnut-900 bg-sand-200/60 font-semibold'
                  : 'text-charcoal-700 hover:text-walnut-900 hover:bg-sand-100'
              }`}
            >
              Catalogue
            </Link>

            {/* Room Dropdown */}
            <div className="relative" onMouseLeave={() => setRoomDropdownOpen(false)}>
              <button
                type="button"
                onMouseEnter={() => setRoomDropdownOpen(true)}
                onClick={() => setRoomDropdownOpen(!roomDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname.startsWith('/collections')
                    ? 'text-walnut-900 bg-sand-200/60 font-semibold'
                    : 'text-charcoal-700 hover:text-walnut-900 hover:bg-sand-100'
                }`}
                aria-expanded={roomDropdownOpen}
              >
                <span>Collections</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {roomDropdownOpen && (
                <div
                  className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-sand-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseEnter={() => setRoomDropdownOpen(true)}
                >
                  {rooms.map((room) => (
                    <Link
                      key={room.slug}
                      to={`/collections/${room.slug}`}
                      onClick={() => setRoomDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-sand-100 transition-colors"
                    >
                      <div className="text-sm font-medium text-charcoal-900">{room.name}</div>
                      <div className="text-xs text-charcoal-500">{room.desc}</div>
                    </Link>
                  ))}
                  <div className="border-t border-sand-200 my-1 pt-1">
                    <Link
                      to="/catalogue"
                      onClick={() => setRoomDropdownOpen(false)}
                      className="block px-4 py-1.5 text-xs font-semibold text-walnut-700 hover:underline"
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/find-furniture"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/find-furniture')
                  ? 'text-walnut-900 bg-sand-200/60 font-semibold'
                  : 'text-charcoal-700 hover:text-walnut-900 hover:bg-sand-100'
              }`}
            >
              <Compass className="w-4 h-4 text-walnut-600" />
              <span>Smart Finder</span>
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive('/contact')
                  ? 'text-walnut-900 bg-sand-200/60 font-semibold'
                  : 'text-charcoal-700 hover:text-walnut-900 hover:bg-sand-100'
              }`}
            >
              Visit Showroom
            </Link>
          </nav>

          {/* Desktop Right Quick Actions */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Favourites Button */}
            <Link
              to="/favourites"
              className="relative p-2.5 rounded-full text-charcoal-700 hover:text-rose-600 hover:bg-sand-100 transition-colors"
              title="Saved Favourites"
            >
              <Heart className="w-5 h-5" />
              {favourites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favourites.length}
                </span>
              )}
            </Link>

            {/* WhatsApp Showroom Quick CTA */}
            <button
              type="button"
              onClick={handleGeneralWhatsApp}
              className="ml-1 inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-md text-xs font-semibold shadow-xs transition-colors"
              title="Message showroom on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden xl:inline">WhatsApp Showroom</span>
              <span className="xl:hidden">WhatsApp</span>
            </button>
          </div>

          {/* Mobile Actions: Search, Favourites, Menu Toggle (Strictly Non-Overlapping) */}
          <div className="flex sm:hidden items-center gap-1 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-1.5 rounded-full text-charcoal-700 hover:bg-sand-200/60"
              aria-label="Search furniture"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Favourites */}
            <Link
              to="/favourites"
              className="relative p-1.5 text-charcoal-700"
              aria-label="Favourites"
            >
              <Heart className="w-5 h-5" />
              {favourites.length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {favourites.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-charcoal-700 hover:text-walnut-900 hover:bg-sand-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer (When Search button tapped on mobile) */}
        {mobileSearchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="sm:hidden pb-3 pt-1 border-t border-sand-200 animate-in fade-in"
          >
            <div className="relative">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sofas, dining tables, beds..."
                className="w-full pl-9 pr-10 py-2 bg-white border border-sand-300 rounded-md text-xs text-charcoal-800 placeholder:text-charcoal-400 focus:outline-hidden focus:border-walnut-700"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-charcoal-400 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Mobile Drawer (Clean Public Navigation - NO Admin Links) */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-sand-200 bg-sand-50 px-4 pt-3 pb-6 space-y-3 animate-in fade-in">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-sand-200">
            <Link
              to="/catalogue"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 bg-walnut-900 text-white py-2.5 px-3 rounded-md text-xs font-semibold text-center"
            >
              <Layers className="w-4 h-4" />
              Explore Catalogue
            </Link>
            <Link
              to="/find-furniture"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 bg-sand-200 text-walnut-900 py-2.5 px-3 rounded-md text-xs font-semibold text-center"
            >
              <Sparkles className="w-4 h-4" />
              Smart Finder
            </Link>
          </div>

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-charcoal-800 hover:bg-sand-100"
            >
              Home
            </Link>
            <Link
              to="/favourites"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-charcoal-800 hover:bg-sand-100 flex items-center justify-between"
            >
              <span>Saved Shortlist</span>
              {favourites.length > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {favourites.length}
                </span>
              )}
            </Link>

            {/* Room Collections in Mobile Drawer */}
            <div className="pt-2 pb-1 px-3 text-[11px] font-bold text-walnut-600 uppercase tracking-wider">
              Explore by Room
            </div>
            {rooms.map((room) => (
              <Link
                key={room.slug}
                to={`/collections/${room.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-6 pr-3 py-1.5 text-xs font-medium text-charcoal-700 hover:bg-sand-100 rounded"
              >
                {room.name}
              </Link>
            ))}

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-charcoal-800 hover:bg-sand-100"
            >
              Showroom Location & Visiting Hours
            </Link>
          </div>

          <div className="pt-3 border-t border-sand-200">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleGeneralWhatsApp();
              }}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-md text-xs font-semibold active:scale-95 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Showroom
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
