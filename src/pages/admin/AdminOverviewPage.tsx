import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  MessageCircle,
  Package,
  Heart,
  TrendingUp,
  Search,
  Calendar,
  Layers,
  ArrowUpRight,
  RotateCcw,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useShowroom } from '../../context/ShowroomContext';
import { formatCurrency } from '../../utils/formatters';

export const AdminOverviewPage: React.FC = () => {
  const { products, analytics, settings } = useShowroom();
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'all'>('30days');

  // Filter analytics by date range
  const filteredAnalytics = useMemo(() => {
    const now = Date.now();
    return analytics.filter((evt) => {
      if (dateRange === 'all') return true;
      const evtTime = new Date(evt.timestamp).getTime();
      const diffMs = now - evtTime;
      if (dateRange === 'today') return diffMs <= 1000 * 60 * 60 * 24;
      if (dateRange === '7days') return diffMs <= 1000 * 60 * 60 * 24 * 7;
      if (dateRange === '30days') return diffMs <= 1000 * 60 * 60 * 24 * 30;
      return true;
    });
  }, [analytics, dateRange]);

  // Aggregate Metrics
  const totalViews = filteredAnalytics.filter((e) => e.type === 'product_view').length;
  const whatsappClicks = filteredAnalytics.filter((e) => e.type === 'whatsapp_click').length;
  const favouriteEvents = filteredAnalytics.filter((e) => e.type === 'favourite_toggle').length;
  const finderRuns = filteredAnalytics.filter((e) => e.type === 'finder_use').length;

  // Most Viewed Products
  const productViewCounts = useMemo(() => {
    const counts: Record<string, { name: string; views: number; id: string }> = {};
    filteredAnalytics
      .filter((e) => e.type === 'product_view' && e.productId)
      .forEach((e) => {
        const id = e.productId!;
        if (!counts[id]) {
          counts[id] = { name: e.productName || 'Unknown Product', views: 0, id };
        }
        counts[id].views += 1;
      });
    return Object.values(counts).sort((a, b) => b.views - a.views).slice(0, 5);
  }, [filteredAnalytics]);

  // Top WhatsApp Enquired Products
  const whatsappProductCounts = useMemo(() => {
    const counts: Record<string, { name: string; clicks: number; id: string }> = {};
    filteredAnalytics
      .filter((e) => e.type === 'whatsapp_click' && e.productId)
      .forEach((e) => {
        const id = e.productId!;
        if (!counts[id]) {
          counts[id] = { name: e.productName || 'Unknown Product', clicks: 0, id };
        }
        counts[id].clicks += 1;
      });
    return Object.values(counts).sort((a, b) => b.clicks - a.clicks).slice(0, 5);
  }, [filteredAnalytics]);

  // Popular Search Terms
  const popularSearches = useMemo(() => {
    const queries: Record<string, number> = {};
    filteredAnalytics
      .filter((e) => e.type === 'search' && e.metadata?.query)
      .forEach((e) => {
        const q = String(e.metadata!.query).toLowerCase().trim();
        queries[q] = (queries[q] || 0) + 1;
      });
    return Object.entries(queries)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredAnalytics]);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-5">
        <div>
          <span className="text-[11px] font-bold text-walnut-600 uppercase tracking-wider block">
            Executive Summary
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-950">
            Showroom Performance Overview
          </h1>
          <p className="text-xs text-charcoal-600 mt-0.5">
            Real-time customer discovery signals, floor piece demand, and WhatsApp enquiry initiation.
          </p>
        </div>

        {/* Date Filter & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-sand-200/80 p-1 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setDateRange('today')}
              className={`px-2.5 py-1 rounded transition-colors ${
                dateRange === 'today' ? 'bg-white text-walnut-950 shadow-xs' : 'text-charcoal-700'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDateRange('7days')}
              className={`px-2.5 py-1 rounded transition-colors ${
                dateRange === '7days' ? 'bg-white text-walnut-950 shadow-xs' : 'text-charcoal-700'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setDateRange('30days')}
              className={`px-2.5 py-1 rounded transition-colors ${
                dateRange === '30days' ? 'bg-white text-walnut-950 shadow-xs' : 'text-charcoal-700'
              }`}
            >
              30 Days
            </button>
            <button
              type="button"
              onClick={() => setDateRange('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                dateRange === 'all' ? 'bg-white text-walnut-950 shadow-xs' : 'text-charcoal-700'
              }`}
            >
              All Time
            </button>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 bg-walnut-900 hover:bg-walnut-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="bg-white p-5 rounded-xl border border-sand-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Product Views</span>
            <div className="w-7 h-7 rounded bg-sand-100 flex items-center justify-center text-walnut-700">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-sans text-walnut-950">{totalViews}</div>
          <div className="text-[11px] text-charcoal-500">Active catalog impressions</div>
        </div>

        {/* WhatsApp Enquiries */}
        <div className="bg-white p-5 rounded-xl border border-sand-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-800">
            <span className="font-semibold uppercase tracking-wider text-[10px]">WhatsApp Clicks</span>
            <div className="w-7 h-7 rounded bg-emerald-100 flex items-center justify-center text-emerald-700">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-sans text-emerald-900">{whatsappClicks}</div>
          <div className="text-[11px] text-emerald-700">Initiated showroom chat requests</div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-xl border border-sand-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Active Products</span>
            <div className="w-7 h-7 rounded bg-sand-100 flex items-center justify-center text-walnut-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-sans text-walnut-950">{products.length}</div>
          <div className="text-[11px] text-charcoal-500">In digital showroom catalogue</div>
        </div>

        {/* Finder & Engagement */}
        <div className="bg-white p-5 rounded-xl border border-sand-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-charcoal-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Finder Runs</span>
            <div className="w-7 h-7 rounded bg-sand-100 flex items-center justify-center text-walnut-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-sans text-walnut-950">{finderRuns}</div>
          <div className="text-[11px] text-charcoal-500">Guided discovery sessions</div>
        </div>
      </div>

      {/* Clarification Note Banner */}
      <div className="bg-sand-100/70 p-3.5 rounded-lg border border-sand-300 text-xs text-charcoal-600 flex items-center gap-2">
        <span className="font-bold text-walnut-900">Commercial Metric Notice:</span>
        <span>
          WhatsApp enquiry clicks represent customer interest initiated through the website.
          Actual orders and payments are finalized in-person or directly within WhatsApp conversations.
        </span>
      </div>

      {/* Two Column Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed Products */}
        <div className="bg-white rounded-xl border border-sand-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-sand-200 pb-3">
            <div className="flex items-center gap-2 font-serif font-bold text-base text-walnut-950">
              <Eye className="w-4 h-4 text-walnut-700" />
              <span>Most Viewed Pieces</span>
            </div>
            <Link to="/admin/products" className="text-xs text-walnut-700 hover:underline">
              View All Catalogue →
            </Link>
          </div>

          {productViewCounts.length > 0 ? (
            <div className="space-y-3">
              {productViewCounts.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sand-100 font-bold text-[10px] text-charcoal-600 flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-charcoal-800 line-clamp-1 max-w-[240px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-walnut-900 font-sans">
                    {item.views} view{item.views === 1 ? '' : 's'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-charcoal-500 py-4 text-center">
              No view events recorded in this date range.
            </div>
          )}
        </div>

        {/* Top WhatsApp Enquiry Drivers */}
        <div className="bg-white rounded-xl border border-sand-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-sand-200 pb-3">
            <div className="flex items-center gap-2 font-serif font-bold text-base text-walnut-950">
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>Top WhatsApp Enquiry Clicks</span>
            </div>
            <Link to="/admin/analytics" className="text-xs text-walnut-700 hover:underline">
              Deep Analytics →
            </Link>
          </div>

          {whatsappProductCounts.length > 0 ? (
            <div className="space-y-3">
              {whatsappProductCounts.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-charcoal-800 line-clamp-1 max-w-[240px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-emerald-800 font-sans">
                    {item.clicks} enquiry click{item.clicks === 1 ? '' : 's'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-charcoal-500 py-4 text-center">
              No WhatsApp clicks recorded in this range.
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="bg-white rounded-xl border border-sand-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-sand-200 pb-3">
          <div className="flex items-center gap-2 font-serif font-bold text-base text-walnut-950">
            <Clock className="w-4 h-4 text-walnut-700" />
            <span>Recent Customer Discovery Activity</span>
          </div>
          <span className="text-[11px] text-charcoal-400">Live Browser Session Events</span>
        </div>

        <div className="space-y-2.5">
          {filteredAnalytics.slice(0, 8).map((evt) => {
            const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            const getEventBadge = () => {
              switch (evt.type) {
                case 'whatsapp_click':
                  return { label: 'WhatsApp Enquiry', badge: 'bg-emerald-100 text-emerald-800' };
                case 'product_view':
                  return { label: 'Product View', badge: 'bg-blue-100 text-blue-800' };
                case 'search':
                  return { label: 'Search Query', badge: 'bg-purple-100 text-purple-800' };
                case 'favourite_toggle':
                  return { label: 'Shortlist Action', badge: 'bg-rose-100 text-rose-800' };
                case 'finder_use':
                  return { label: 'Smart Finder', badge: 'bg-amber-100 text-amber-800' };
                case 'compare_action':
                  return { label: 'Compare Action', badge: 'bg-stone-200 text-stone-800' };
                default:
                  return { label: evt.type, badge: 'bg-sand-200 text-charcoal-800' };
              }
            };

            const eb = getEventBadge();

            return (
              <div
                key={evt.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-sand-50 border border-sand-200/60 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${eb.badge}`}>
                    {eb.label}
                  </span>
                  <span className="text-charcoal-800 font-medium">
                    {evt.productName || (evt.metadata?.query ? `"${evt.metadata.query}"` : 'Catalogue exploration')}
                  </span>
                </div>
                <span className="text-[11px] text-charcoal-400 shrink-0">{timeStr}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
