import { AvailabilityStatus } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAvailability(status: AvailabilityStatus): {
  label: string;
  badgeClass: string;
  dotClass: string;
  description: string;
} {
  switch (status) {
    case 'available_to_view':
      return {
        label: 'Available to View',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotClass: 'bg-emerald-600',
        description: 'Currently displayed on the showroom floor for live demonstration.',
      };
    case 'made_to_order':
      return {
        label: 'Made to Order',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
        dotClass: 'bg-amber-600',
        description: 'Handcrafted upon order. Standard crafting timeline: 14 to 21 working days.',
      };
    case 'confirm_availability':
    default:
      return {
        label: 'Confirm Availability',
        badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
        dotClass: 'bg-stone-500',
        description: 'Floor piece availability varies. Please confirm with showroom staff.',
      };
  }
}

export function formatDimensions(w: number, d: number, h: number, unit: 'inches' | 'cm'): string {
  return `${w}" W × ${d}" D × ${h}" H (${unit})`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
