import { formatCurrency } from './formatters';

export function cleanPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  // Default to India country code 91 if 10 digits provided
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function buildProductWhatsAppUrl(
  phone: string,
  product: {
    name: string;
    sku: string;
    price: number;
    isPriceIndicative?: boolean;
    category?: string;
  }
): string {
  const cleaned = cleanPhoneNumber(phone);
  const priceText = product.isPriceIndicative
    ? `${formatCurrency(product.price)} (Indicative showroom price)`
    : formatCurrency(product.price);

  const message = `Hello ALISHAN FURNITURES,

I am interested in the *${product.name}* (SKU: ${product.sku}).
• Category: ${product.category || 'Furniture'}
• Listed Price: ${priceText}

Could you please share current showroom floor availability, finish options, and visiting details? Thank you!`;

  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function buildShowroomGeneralWhatsAppUrl(
  phone: string,
  showroomName: string = 'ALISHAN FURNITURES'
): string {
  const cleaned = cleanPhoneNumber(phone);
  const message = `Hello ${showroomName},

I am visiting your digital catalogue and would like to enquire about furniture availability, custom designs, and showroom timings.`;

  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function buildShortlistWhatsAppUrl(
  phone: string,
  products: { name: string; sku: string; price: number }[],
  showroomName: string = 'ALISHAN FURNITURES'
): string {
  const cleaned = cleanPhoneNumber(phone);
  const itemsText = products
    .map((p, idx) => `${idx + 1}. *${p.name}* (${p.sku}) — ${formatCurrency(p.price)}`)
    .join('\n');

  const message = `Hello ${showroomName},

I have shortlisted these ${products.length} furniture piece(s) from your digital catalogue:

${itemsText}

Could you please check floor display status and share further details?`;

  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
