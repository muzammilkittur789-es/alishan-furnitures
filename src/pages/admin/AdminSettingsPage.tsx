import React, { useState } from 'react';
import {
  Save,
  CheckCircle,
  Building2,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { useShowroom } from '../../context/ShowroomContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllDemoData } = useShowroom();

  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [initials, setInitials] = useState(settings.initials);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [city, setCity] = useState(settings.city);
  const [landmark, setLandmark] = useState(settings.landmark);
  const [mapDirectionsUrl, setMapDirectionsUrl] = useState(settings.mapDirectionsUrl);
  const [monSatHours, setMonSatHours] = useState(
    settings.openingHours[0]?.hours || '10:30 AM – 08:30 PM'
  );
  const [sunHours, setSunHours] = useState(
    settings.openingHours[1]?.hours || '11:00 AM – 07:00 PM'
  );
  const [announcementText, setAnnouncementText] = useState(settings.announcementText || '');
  const [indicativePriceDisclaimer, setIndicativePriceDisclaimer] = useState(
    settings.indicativePriceDisclaimer
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      name: name.trim(),
      tagline: tagline.trim(),
      initials: initials.trim().toUpperCase(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      landmark: landmark.trim(),
      mapDirectionsUrl: mapDirectionsUrl.trim(),
      openingHours: [
        { days: 'Monday – Saturday', hours: monSatHours.trim() },
        { days: 'Sunday', hours: sunHours.trim() },
      ],
      announcementText: announcementText.trim(),
      indicativePriceDisclaimer: indicativePriceDisclaimer.trim(),
    });

    showToast('Showroom settings updated! Changes immediately active across all pages.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-walnut-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-5">
        <div>
          <span className="text-[11px] font-bold text-walnut-600 uppercase tracking-wider block">
            Showroom Configuration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-950">
            Showroom Settings & Branding
          </h1>
          <p className="text-xs text-charcoal-600 mt-0.5">
            Configure showroom brand name, WhatsApp enquiry number, physical address, and visiting hours.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 bg-walnut-900 hover:bg-walnut-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Showroom Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Identity */}
        <div className="bg-white rounded-xl border border-sand-200 p-6 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-walnut-900 border-b border-sand-200 pb-2">
            1. Brand Identity & Header
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Showroom Brand Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Brand Monogram / Initials
              </label>
              <input
                type="text"
                maxLength={3}
                value={initials}
                onChange={(e) => setInitials(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900 uppercase font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Top Announcement Bar Notice
              </label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Notice displayed in the top banner of customer website"
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Contact */}
        <div className="bg-white rounded-xl border border-sand-200 p-6 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-walnut-900 border-b border-sand-200 pb-2">
            2. Customer Contact & WhatsApp Routing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Showroom WhatsApp Number *
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 98200 12345"
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900 font-mono font-bold"
              />
              <span className="text-[11px] text-charcoal-500 mt-1 block">
                All product enquiry buttons route to this number.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Showroom Landline / Mobile
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">Email Desk</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>
          </div>
        </div>

        {/* Physical Address & Timings */}
        <div className="bg-white rounded-xl border border-sand-200 p-6 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-walnut-900 border-b border-sand-200 pb-2">
            3. Showroom Location & Timings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Showroom Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Nearest Landmark
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Google Maps Directions URL
              </label>
              <input
                type="url"
                value={mapDirectionsUrl}
                onChange={(e) => setMapDirectionsUrl(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Mon – Sat Visiting Hours
              </label>
              <input
                type="text"
                value={monSatHours}
                onChange={(e) => setMonSatHours(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Sunday Visiting Hours
              </label>
              <input
                type="text"
                value={sunHours}
                onChange={(e) => setSunHours(e.target.value)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>
          </div>
        </div>

        {/* Indicative Pricing Disclaimer */}
        <div className="bg-white rounded-xl border border-sand-200 p-6 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-walnut-900 border-b border-sand-200 pb-2">
            4. Pricing & Legal Disclaimers
          </h2>

          <div>
            <label className="text-xs font-bold text-charcoal-800 block mb-1">
              Indicative Price Disclaimer
            </label>
            <textarea
              rows={2}
              value={indicativePriceDisclaimer}
              onChange={(e) => setIndicativePriceDisclaimer(e.target.value)}
              className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900 leading-relaxed"
            />
            <span className="text-[11px] text-charcoal-500 mt-1 block">
              Displayed under price tags on product cards and product detail pages.
            </span>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-walnut-900 hover:bg-walnut-800 text-white px-6 py-2.5 rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Showroom Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
