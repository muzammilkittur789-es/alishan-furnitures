import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle,
  Star,
  RotateCcw,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useShowroom } from '../../context/ShowroomContext';
import { SafeImage } from '../../components/common/SafeImage';
import { formatCurrency, formatAvailability } from '../../utils/formatters';
import { AvailabilityStatus, Product } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const { products, updateProduct, deleteProduct } = useShowroom();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [deleteModalProduct, setDeleteModalProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filterCategory !== 'all' && p.category !== filterCategory) {
        return false;
      }
      if (filterAvailability !== 'all' && p.availability !== filterAvailability) {
        return false;
      }
      return true;
    });
  }, [products, searchTerm, filterCategory, filterAvailability]);

  const handleToggleFeatured = (product: Product) => {
    updateProduct(product.id, { featured: !product.featured });
    showToast(
      `Product "${product.name}" ${!product.featured ? 'marked as featured' : 'removed from featured'}.`
    );
  };

  const handleQuickAvailabilityChange = (product: Product, newStatus: AvailabilityStatus) => {
    updateProduct(product.id, { availability: newStatus });
    showToast(`Updated "${product.name}" status to ${newStatus.replace(/_/g, ' ')}.`);
  };

  const confirmDelete = () => {
    if (!deleteModalProduct) return;
    deleteProduct(deleteModalProduct.id);
    showToast(`Product "${deleteModalProduct.name}" deleted successfully.`);
    setDeleteModalProduct(null);
  };

  const categories = [
    'all',
    'Sofas & Seating',
    'Beds & Bedroom Furniture',
    'Dining Tables & Chairs',
    'Wardrobes & Storage',
    'TV Units & Entertainment',
    'Office Furniture',
    'Coffee & Accent Tables',
  ];

  return (
    <div className="space-y-6 font-sans">
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
            Catalogue Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-950">
            Showroom Products ({products.length})
          </h1>
          <p className="text-xs text-charcoal-600 mt-0.5">
            Configure product specifications, floor availability status, indicative rates, and featured showcases.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 bg-walnut-900 hover:bg-walnut-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-sand-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, SKU..."
            className="w-full pl-9 pr-4 py-2 bg-sand-50 border border-sand-300 rounded-md text-xs placeholder:text-charcoal-400 focus:outline-hidden focus:border-walnut-700"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-sand-50 border border-sand-300 rounded-md py-2 px-3 text-xs text-charcoal-800 focus:outline-hidden focus:border-walnut-700"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'all' ? 'All Categories' : c}
            </option>
          ))}
        </select>

        <select
          value={filterAvailability}
          onChange={(e) => setFilterAvailability(e.target.value)}
          className="bg-sand-50 border border-sand-300 rounded-md py-2 px-3 text-xs text-charcoal-800 focus:outline-hidden focus:border-walnut-700"
        >
          <option value="all">All Availability Statuses</option>
          <option value="available_to_view">Available to View</option>
          <option value="made_to_order">Made to Order</option>
          <option value="confirm_availability">Confirm Availability</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-sand-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-sand-100/70 border-b border-sand-200 text-walnut-900 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Category / Room</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Availability Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200 text-charcoal-800">
              {filteredProducts.map((p) => {
                const avail = formatAvailability(p.availability);
                return (
                  <tr key={p.id} className="hover:bg-sand-50/70 transition-colors">
                    {/* Item Thumbnail & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded overflow-hidden shrink-0 bg-sand-100 border border-sand-200">
                          <SafeImage
                            src={p.primaryImage}
                            alt={p.name}
                            aspectRatioClass="w-full h-full"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-serif font-bold text-sm text-walnut-950 block line-clamp-1">
                            {p.name}
                          </span>
                          <span className="font-mono text-[10px] text-charcoal-400">
                            {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Room */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-charcoal-900">{p.category}</div>
                      <div className="text-[11px] text-walnut-600 capitalize">
                        {p.room} room
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-sans font-bold text-walnut-950">
                      <div>{formatCurrency(p.price)}</div>
                      {p.isPriceIndicative && (
                        <span className="text-[10px] font-normal text-charcoal-400">
                          (Indicative)
                        </span>
                      )}
                    </td>

                    {/* Availability Status Dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={p.availability}
                        onChange={(e) =>
                          handleQuickAvailabilityChange(p, e.target.value as AvailabilityStatus)
                        }
                        className={`text-[11px] font-medium py-1 px-2 rounded border focus:outline-hidden ${avail.badgeClass}`}
                      >
                        <option value="available_to_view">Available to View</option>
                        <option value="made_to_order">Made to Order</option>
                        <option value="confirm_availability">Confirm Availability</option>
                      </select>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded-full transition-colors ${
                          p.featured
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-charcoal-300 hover:text-charcoal-500'
                        }`}
                        title={p.featured ? 'Featured on homepage' : 'Mark as featured'}
                      >
                        <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-charcoal-500 hover:text-walnut-900 rounded hover:bg-sand-100"
                          title="View on live website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-walnut-800 hover:text-walnut-950 rounded hover:bg-sand-100"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeleteModalProduct(p)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-charcoal-500">
                    No products match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-charcoal-900 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold">Delete Catalogue Product?</h3>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Are you sure you want to delete <strong>{deleteModalProduct.name}</strong> (SKU:{' '}
              {deleteModalProduct.sku})? This product will be removed from customer catalogue and
              room collections.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalProduct(null)}
                className="px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-sand-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-md"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
