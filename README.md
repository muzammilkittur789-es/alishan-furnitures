# ALISHAN FURNITURES — Digital Showroom & Owner Management Platform

> **A luxury, editorial digital catalogue and discovery platform for furniture showrooms.**  
> Built as a sales demonstration to showcase how local furniture showrooms can exhibit authentic craftsmanship, guide home spatial discovery, and convert customer product interest into direct WhatsApp enquiries.

---

## 🏛️ Brand & Visual Direction

- **Brand Name**: ALISHAN FURNITURES
- **Tagline**: *Furniture for Every Corner of Your Home.*
- **Aesthetic**: Premium, editorial, minimalist furniture retail experience.
- **Palette**:
  - Warm Ivory & Sand surfaces (`#FAF8F5`, `#F5F0E8`, `#EBE3D5`)
  - Deep Walnut Brown branding & prominent CTAs (`#4A3324`, `#26170E`)
  - Charcoal typography (`#1C1917`, `#2A2928`)
  - Subtle Moss Green accents (`#526053`, `#E6EAE5`)
- **Typography Pairing**: Refined Editorial Serif (`Cormorant Garamond`) + Clean High-Legibility Sans (`Plus Jakarta Sans`).
- **Image Policy**: **100% Non-Living Objects & Architectural Spaces Only.** All assets depict handcrafted furniture, empty minimalist interiors, and timber textures. Includes built-in SVG/CSS fallback placeholders to prevent broken links.

---

## 🌟 Key Functional Capabilities

### 1. Customer-Facing Website

- **A. Homepage (`/`)**
  - Hero Section: *"Furniture for Every Corner of Your Home"* with primary CTA *Explore Furniture* and secondary CTA *Find My Furniture*.
  - Shop by Category: Visual cards for Sofas & Seating, Beds, Dining, Wardrobes, TV Units, and Office.
  - Shop by Room: Collections for Living Room, Bedroom Suite, Dining Space, Home Office, and Storage.
  - Featured Showroom Showcase: Standout furniture pieces with availability tags, pricing, and 1-tap WhatsApp enquiries.
  - Showroom Experience Pillars: Solid hardwoods, custom dimensions, transparent pricing, and walk-in consultation.
  - Footer: Comprehensive showroom address, phone, WhatsApp concierge, visiting hours, and demo data reset.

- **B. Furniture Catalogue (`/catalogue`)**
  - Real-time search by product name, SKU, timber (teak, sheesham, walnut), and style.
  - Multi-faceted filters: Room, Category, Budget range (under ₹25k, ₹25k-₹50k, ₹50k-₹75k, above ₹75k), Showroom Availability (`Available to View`, `Made to Order`, `Confirm Availability`), and Design Style.
  - Sorting: Featured, Price Low-to-High, Price High-to-Low, Name A-Z, and Recently Added.
  - Active filter chips with one-click removal and "Clear All".

- **C. Smart Furniture Finder (`/find-furniture`)**
  - Interactive rule-based discovery wizard.
  - Questions: Room type, furniture category, maximum budget ceiling slider, preferred style, material preference, and maximum width constraint.
  - Live dynamic matching products counter that updates instantly as preferences change.
  - "Broaden Search Criteria" fallback when strict filters yield no match.

- **D. Product Detail Page (`/product/:slug`)**
  - Breadcrumbs navigation.
  - Multi-angle gallery with thumbnail switcher and safe image rendering.
  - Indicative price badge with showroom customization disclaimer.
  - Availability status with clear explanations.
  - Dimension breakdown (W × D × H in inches) and seating capacities.
  - Finish & upholstery swatches.
  - Primary actions:
    1. **Enquire on WhatsApp** (Opens `https://wa.me/...` with pre-filled product details, SKU, and indicative price).
    2. **Save to Favourites**.
    3. **Add to Compare** (up to 3 products).
    4. **Share Product** (native Web Share API + clipboard fallback).
  - Craftsmanship notes, warranty terms, and white-glove delivery specifications.
  - Showroom pairings and related furniture recommendations.

- **E. Room Collections (`/collections/:slug`)**
  - Dedicated pages for `living`, `bedroom`, `dining`, `office`, and `storage`.
  - Room-specific styling advice and interior space planning tips.
  - Filtered showcase of room pieces.

- **F. Favourites Shortlist (`/favourites`)**
  - Client-side saved wishlist persisting across browser sessions.
  - **"Enquire Shortlist on WhatsApp"**: Consolidated multi-item WhatsApp enquiry message.
  - Combined indicative total calculation.

- **G. Side-by-Side Product Comparison (`/compare`)**
  - Compares up to 3 pieces side by side.
  - Comparative matrix: Dimensions, seating, timber/materials, finishes, warranty, and availability.
  - Difference highlighting and individual product WhatsApp triggers.

- **H. Showroom Location & Contact (`/contact`)**
  - Full address, landmark, phone, email, and Google Maps directions link.
  - Monday–Saturday and Sunday opening hours.
  - Frequently Asked Questions regarding walk-ins, custom orders, and delivery.

---

### 2. Showroom Owner Dashboard (`/admin`)

- **A. Performance Overview (`/admin`)**
  - Live KPIs: Product Views, WhatsApp Enquiry Clicks, Active Catalogue Items, Finder Runs.
  - Date Range Filtering: Today, Last 7 Days, Last 30 Days, All Time.
  - Most Viewed Pieces and Top WhatsApp Enquiry Drivers.
  - Real-time customer discovery activity stream.
  - Commercial distinction note: WhatsApp clicks indicate interest initiated; orders are finalized in-person.

- **B. Product Management (`/admin/products`)**
  - Searchable, filterable catalogue inventory table.
  - Quick inline availability status switcher (`Available to View`, `Made to Order`, `Confirm Availability`).
  - Featured product toggle.
  - Safe deletion with confirmation modal.
  - Add New Product (`/admin/products/new`) & Edit (`/admin/products/:id/edit`).
  - Curated 1-click photo preset gallery of non-living furniture pieces.

- **C. Showroom Settings (`/admin/settings`)**
  - Edit Showroom Name, Brand Initials, Tagline, Announcement text.
  - Configure Showroom WhatsApp Number (instantly updates all customer CTAs).
  - Edit address, landmark, maps link, and visiting hours.
  - Edit indicative price legal disclaimer.

- **D. Customer Interest Analytics (`/admin/analytics`)**
  - WhatsApp conversion ratio (clicks vs product views).
  - Search keyword frequency audit.
  - Category interest breakdown.
  - Full event audit log with type filters.
  - Export audit stream as JSON file.

- **E. Demo Data Reset**
  - Available in both Owner Admin and Customer Footer.
  - Reverts custom edits back to rich default seeds with confirmation.

---

## 🛠️ Technology Architecture

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 with custom warm ivory & walnut design tokens
- **Routing**: React Router v6 with scroll restoration
- **Icons**: Lucide React
- **Data Layer**: Centralized `ShowroomContext` with safe, versioned `localStorage` abstraction designed to be replaced by a REST/GraphQL backend in production.
- **Testing**: Playwright test suite (`test_suite.cjs`) running against system Edge/Chrome.

---

## 🚀 Running the Project

### Development Server
```bash
cd C:\Users\Lenovo\.gemini\antigravity\scratch\alishan-furnitures
npm run dev
```

### Production Build & Preview
```bash
# Build
npm run build

# Preview built application
npm run preview
```
The application will be accessible at `http://localhost:4173` (or `http://localhost:5173` for dev server).

---

## 🧪 Automated Test Verification

All 26 functional tests passed with 100% success rate:
- ✅ Homepage headline, brand name, and featured product rendering
- ✅ Catalogue keyword search, room filter, and clear filters
- ✅ Smart Furniture Finder guided discovery & matching algorithm
- ✅ Product detail specifications, dimensions, and WhatsApp CTA formatting
- ✅ Favourites shortlist persistence and multi-item WhatsApp enquiry
- ✅ Side-by-side 2-item & 3-item comparison matrix
- ✅ Room collections (`living`, `bedroom`, `dining`, `office`, `storage`)
- ✅ Contact showroom hours and map link
- ✅ Owner dashboard KPIs and date-range filters
- ✅ Product creation, catalogue persistence, and modal deletion
- ✅ Showroom settings propagation to customer-facing pages
- ✅ Customer discovery event audit logging
- ✅ Mobile viewport responsiveness (375px) & navigation drawer
- ✅ Demo data reset to original seed state
