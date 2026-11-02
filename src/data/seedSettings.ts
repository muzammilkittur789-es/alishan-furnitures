import { ShowroomSettings } from '../types';

export const initialShowroomSettings: ShowroomSettings = {
  name: 'ALISHAN FURNITURES',
  tagline: 'Furniture for Every Corner of Your Home.',
  initials: 'AF',
  phone: '+91 98200 12345',
  whatsapp: '+91 98200 12345',
  email: 'enquiry@alishanfurnitures.demo',
  address: 'Plot 42, Timber & Design Enclave, Near Metro Pillar 118, S.V. Road',
  city: 'Mumbai',
  landmark: 'Opposite Design Arcade, Near Metro Pillar 118',
  mapDirectionsUrl: 'https://maps.google.com/?q=Furniture+Showroom+Mumbai',
  openingHours: [
    { days: 'Monday – Saturday', hours: '10:30 AM – 08:30 PM' },
    { days: 'Sunday', hours: '11:00 AM – 07:00 PM' },
  ],
  announcementText: 'Showroom Demo Mode: Live catalogue with instant WhatsApp enquiry routing & owner management.',
  currencySymbol: '₹',
  indicativePriceDisclaimer: 'Prices shown are indicative showroom display rates. Custom dimensions, bespoke upholstery selection, taxes, and delivery/assembly may adjust final quote upon showroom consultation.',
  updatedAt: new Date().toISOString(),
};
