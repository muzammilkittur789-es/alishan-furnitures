import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Package,
  Layers,
  Image as ImageIcon,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useShowroom } from '../../context/ShowroomContext';
import { Product, FurnitureCategory, RoomCollection, AvailabilityStatus } from '../../types';
import { SafeImage } from '../../components/common/SafeImage';

export const AdminProductEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useShowroom();

  const isEditing = Boolean(id);
  const existingProduct = isEditing ? products.find((p) => p.id === id) : null;

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<FurnitureCategory>('Sofas & Seating');
  const [room, setRoom] = useState<RoomCollection>('living');
  const [price, setPrice] = useState<number>(25000);
  const [isPriceIndicative, setIsPriceIndicative] = useState(true);
  const [availability, setAvailability] = useState<AvailabilityStatus>('available_to_view');
  const [featured, setFeatured] = useState(false);
  const [badge, setBadge] = useState('');
  const [style, setStyle] = useState<Product['style']>('Contemporary Warm');
  const [description, setDescription] = useState('');
  const [craftsmanshipNotes, setCraftsmanshipNotes] = useState('');
  const [width, setWidth] = useState<number>(60);
  const [depth, setDepth] = useState<number>(30);
  const [height, setHeight] = useState<number>(30);
  const [seatingCapacity, setSeatingCapacity] = useState<number | undefined>(undefined);
  const [materialsText, setMaterialsText] = useState('Solid Seasoned Teak Wood, PU Matte Finish');
  const [finishesText, setFinishesText] = useState('Natural Honey Polish, Smoked Walnut');
  const [warranty, setWarranty] = useState('5-Year Structural Frame Warranty');
  const [delivery, setDelivery] = useState('Delivered and assembled within 4-7 business days.');
  const [customizationNotes, setCustomizationNotes] = useState('Custom dimensions and fabric selection available on showroom visit.');
  const [primaryImage, setPrimaryImage] = useState(
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Preset curated non-living furniture images for 1-click selection
  const imagePresets = [
    { label: 'Green Lounge Chair', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Oatmeal Minimal Armchair', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Solid Timber Bed Platform', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Warm Wooden Headboard Bed', url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Teak Dining Ensemble', url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Round Stone Dining Set', url: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Architectural Teak Wardrobe', url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Sliding Bedroom Storage', url: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Executive Walnut Study Desk', url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Ergonomic Studio Workstation', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Modular Boucle Sectional Sofa', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Nesting Coffee Table Pair', url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Acoustic Slat TV Console', url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Open Display Bookcase Divider', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80' },
  ];

  // Populate when editing
  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setSku(existingProduct.sku);
      setTagline(existingProduct.tagline || '');
      setCategory(existingProduct.category);
      setRoom(existingProduct.room);
      setPrice(existingProduct.price);
      setIsPriceIndicative(existingProduct.isPriceIndicative);
      setAvailability(existingProduct.availability);
      setFeatured(existingProduct.featured);
      setBadge(existingProduct.badge || '');
      setStyle(existingProduct.style);
      setDescription(existingProduct.description);
      setCraftsmanshipNotes(existingProduct.craftsmanshipNotes || '');
      setWidth(existingProduct.dimensions.width);
      setDepth(existingProduct.dimensions.depth);
      setHeight(existingProduct.dimensions.height);
      setSeatingCapacity(existingProduct.dimensions.seatingCapacity);
      setMaterialsText(existingProduct.materials.join(', '));
      setFinishesText(existingProduct.finishes.join(', '));
      setWarranty(existingProduct.warranty);
      setDelivery(existingProduct.delivery);
      setCustomizationNotes(existingProduct.customizationNotes || '');
      setPrimaryImage(existingProduct.primaryImage);
    }
  }, [existingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!sku.trim()) newErrors.sku = 'SKU is required';
    if (!price || price <= 0) newErrors.price = 'Valid price is required';
    if (!description.trim()) newErrors.description = 'Product description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const materialsArray = materialsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const finishesArray = finishesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      tagline: tagline.trim(),
      category,
      room,
      price: Number(price),
      isPriceIndicative,
      availability,
      featured,
      badge: badge.trim() || undefined,
      style,
      description: description.trim(),
      craftsmanshipNotes: craftsmanshipNotes.trim() || undefined,
      dimensions: {
        width: Number(width),
        depth: Number(depth),
        height: Number(height),
        unit: 'inches' as const,
        seatingCapacity: seatingCapacity ? Number(seatingCapacity) : undefined,
      },
      materials: materialsArray.length > 0 ? materialsArray : ['Solid Hardwood'],
      finishes: finishesArray.length > 0 ? finishesArray : ['Natural Matte'],
      colors: existingProduct?.colors || [
        { name: 'Natural Timber', hex: '#8B5A2B' },
        { name: 'Warm Charcoal', hex: '#2A2928' },
      ],
      variants: existingProduct?.variants || [
        { id: 'v1', name: 'Standard Showroom Spec', sku: sku.trim().toUpperCase() },
      ],
      warranty: warranty.trim(),
      delivery: delivery.trim(),
      customizationNotes: customizationNotes.trim() || undefined,
      primaryImage: primaryImage.trim(),
      images: [primaryImage.trim()],
      tags: [category, room, style],
    };

    if (isEditing && id) {
      updateProduct(id, payload);
    } else {
      addProduct(payload);
    }

    navigate('/admin/products');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-sand-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-1.5 rounded-md hover:bg-sand-200 text-charcoal-600 transition-colors"
            title="Return to product list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-walnut-950">
              {isEditing ? `Edit Product: ${existingProduct?.name}` : 'Add New Showroom Product'}
            </h1>
            <p className="text-xs text-charcoal-600">
              Changes persist locally in browser storage and immediately display on the catalogue.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center gap-1.5 bg-walnut-900 hover:bg-walnut-800 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Product</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details Box */}
        <div className="bg-white rounded-xl border border-sand-200 p-6 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-walnut-900 border-b border-sand-200 pb-2">
            1. Core Identification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royale 3-Seater Chesterfield Sofa"
                className={`w-full bg-sand-50 border rounded-md p-2.5 text-xs text-charcoal-900 ${
                  errors.name ? 'border-rose-500' : 'border-sand-300'
                }`}
              />
              {errors.name && <span className="text-[11px] text-rose-600 mt-1">{errors.name}</span>}
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">SKU Code *</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. AF-SF-101"
                className={`w-full bg-sand-50 border rounded-md p-2.5 text-xs font-mono text-charcoal-900 ${
                  errors.sku ? 'border-rose-500' : 'border-sand-300'
                }`}
              />
              {errors.sku && <span className="text-[11px] text-rose-600 mt-1">{errors.sku}</span>}
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Short Tagline / Summary
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Deep-buttoned craftsmanship in vintage warm cognac upholstery"
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>
          </div>
        </div>

        {/* Categorization & Pricing */}
        <div className="bg-white rounded-xl border border-sand-200 p-6 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-walnut-900 border-b border-sand-200 pb-2">
            2. Category, Room & Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Furniture Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FurnitureCategory)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              >
                <option value="Sofas & Seating">Sofas & Seating</option>
                <option value="Beds & Bedroom Furniture">Beds & Bedroom Furniture</option>
                <option value="Dining Tables & Chairs">Dining Tables & Chairs</option>
                <option value="Wardrobes & Storage">Wardrobes & Storage</option>
                <option value="TV Units & Entertainment">TV Units & Entertainment</option>
                <option value="Office Furniture">Office Furniture</option>
                <option value="Coffee & Accent Tables">Coffee & Accent Tables</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">Room Collection</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value as RoomCollection)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              >
                <option value="living">Living Room</option>
                <option value="bedroom">Bedroom</option>
                <option value="dining">Dining Room</option>
                <option value="office">Home Office</option>
                <option value="storage">Storage & Closets</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">Design Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as Product['style'])}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              >
                <option value="Modern Minimalist">Modern Minimalist</option>
                <option value="Contemporary Warm">Contemporary Warm</option>
                <option value="Mid-Century Nordic">Mid-Century Nordic</option>
                <option value="Classic Architectural">Classic Architectural</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Price (in ₹ Indian Rupees) *
              </label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs font-sans font-bold text-charcoal-900"
              />
              {errors.price && <span className="text-[11px] text-rose-600 mt-1">{errors.price}</span>}
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-xs font-medium text-charcoal-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPriceIndicative}
                  onChange={(e) => setIsPriceIndicative(e.target.checked)}
                  className="rounded text-walnut-800 focus:ring-walnut-700 w-4 h-4"
                />
                <span>Price is Indicative Showroom Rate</span>
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Availability Status
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as AvailabilityStatus)}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900 font-medium"
              >
                <option value="available_to_view">Available to View on Floor</option>
                <option value="made_to_order">Made to Order (14-21 Days)</option>
                <option value="confirm_availability">Confirm Availability with Staff</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Showroom Badge (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Showroom Highlight, Bestseller, Teak Special"
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-xs font-medium text-charcoal-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-walnut-800 focus:ring-walnut-700 w-4 h-4"
                />
                <span>Feature on Homepage Showcase</span>
              </label>
            </div>
          </div>
        </div>

        {/* Dimensions & Specifications */}
        <div className="bg-white rounded-xl border border-sand-200 p-6 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-walnut-900 border-b border-sand-200 pb-2">
            3. Dimensions & Materials
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">Width (Inches)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">Depth (Inches)</label>
              <input
                type="number"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">Height (Inches)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Seating Capacity
              </label>
              <input
                type="number"
                value={seatingCapacity || ''}
                onChange={(e) => setSeatingCapacity(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 3 or 6"
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Materials Used (Comma separated)
              </label>
              <input
                type="text"
                value={materialsText}
                onChange={(e) => setMaterialsText(e.target.value)}
                placeholder="e.g. Grade-A Teak Wood, High-Density Foam, Textured Linen"
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Finishes Available (Comma separated)
              </label>
              <input
                type="text"
                value={finishesText}
                onChange={(e) => setFinishesText(e.target.value)}
                placeholder="e.g. Natural Teak Polish, Smoked Walnut, Espresso"
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>
          </div>
        </div>

        {/* Image Selection with 1-Click Presets */}
        <div className="bg-white rounded-xl border border-sand-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-sand-200 pb-2">
            <h2 className="font-serif font-bold text-base text-walnut-900">
              4. Product Imagery (Strictly Non-Living)
            </h2>
            <span className="text-[11px] text-charcoal-500">Pick from curated catalog photos</span>
          </div>

          <div>
            <label className="text-xs font-bold text-charcoal-800 block mb-1">
              Primary Image URL
            </label>
            <input
              type="url"
              value={primaryImage}
              onChange={(e) => setPrimaryImage(e.target.value)}
              className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
            />
          </div>

          {/* Preset Image Thumbnails */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-walnut-700 uppercase tracking-wider block">
              Quick Preset Gallery (Click any image to select):
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {imagePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrimaryImage(preset.url)}
                  className={`relative rounded-md overflow-hidden aspect-[4/3] border-2 transition-all ${
                    primaryImage === preset.url
                      ? 'border-walnut-900 ring-2 ring-walnut-800/30'
                      : 'border-sand-200 hover:border-walnut-400 opacity-80 hover:opacity-100'
                  }`}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Active Preview */}
          <div className="pt-2 flex items-center gap-4">
            <div className="w-24 h-20 rounded-lg overflow-hidden border border-sand-300 shrink-0">
              <SafeImage
                src={primaryImage}
                alt="Selected preview"
                aspectRatioClass="w-full h-full"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs text-charcoal-600">
              <span className="font-semibold block text-charcoal-900">Live Image Preview</span>
              <span>Images are verified non-living furniture or empty room interiors.</span>
            </div>
          </div>
        </div>

        {/* Narrative & Craftsmanship */}
        <div className="bg-white rounded-xl border border-sand-200 p-6 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-walnut-900 border-b border-sand-200 pb-2">
            5. Descriptions & Policies
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Full Product Description *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive description of structure, cushioning, and space styling."
                className={`w-full bg-sand-50 border rounded-md p-2.5 text-xs text-charcoal-900 ${
                  errors.description ? 'border-rose-500' : 'border-sand-300'
                }`}
              />
              {errors.description && (
                <span className="text-[11px] text-rose-600 mt-1">{errors.description}</span>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-800 block mb-1">
                Craftsmanship & Joinery Notes
              </label>
              <input
                type="text"
                value={craftsmanshipNotes}
                onChange={(e) => setCraftsmanshipNotes(e.target.value)}
                placeholder="e.g. Mortise and tenon joinery throughout with kiln-dried timber."
                className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-charcoal-800 block mb-1">Warranty Term</label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal-800 block mb-1">Delivery Time</label>
                <input
                  type="text"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal-800 block mb-1">
                  Customization Advice
                </label>
                <input
                  type="text"
                  value={customizationNotes}
                  onChange={(e) => setCustomizationNotes(e.target.value)}
                  className="w-full bg-sand-50 border border-sand-300 rounded-md p-2.5 text-xs text-charcoal-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 text-xs font-medium text-charcoal-700 hover:bg-sand-200 rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-walnut-900 hover:bg-walnut-800 text-white px-6 py-2.5 rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Product Changes' : 'Create Catalogue Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
