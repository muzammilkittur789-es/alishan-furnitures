import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Search,
  MessageCircle,
  Eye,
  Sparkles,
  Download,
  Trash2,
  Calendar,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { useShowroom } from '../../context/ShowroomContext';
import { AnalyticsEventType } from '../../types';

export const AdminAnalyticsPage: React.FC = () => {
  const { analytics, products } = useShowroom();
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Metrics computation
  const totalEvents = analytics.length;
  const viewCount = analytics.filter((e) => e.type === 'product_view').length;
  const whatsappCount = analytics.filter((e) => e.type === 'whatsapp_click').length;
  const finderCount = analytics.filter((e) => e.type === 'finder_use').length;
  const searchCount = analytics.filter((e) => e.type === 'search').length;

  const enquiryRatio = viewCount > 0 ? ((whatsappCount / viewCount) * 100).toFixed(1) : '0';

  // Search Queries Breakdown
  const searchQueries = useMemo(() => {
    const map: Record<string, number> = {};
    analytics
      .filter((e) => e.type === 'search' && e.metadata?.query)
      .forEach((e) => {
        const q = String(e.metadata!.query).toLowerCase().trim();
        map[q] = (map[q] || 0) + 1;
      });
    return Object.entries(map)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count);
  }, [analytics]);

  // Category Breakdown
  const categoryEngagement = useMemo(() => {
    const map: Record<string, number> = {};
    analytics.forEach((e) => {
      if (e.category) {
        map[e.category] = (map[e.category] || 0) + 1;
      }
    });
    return Object.entries(map)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [analytics]);

  // Finder Room Demand
  const finderRoomDemand = useMemo(() => {
    const map: Record<string, number> = {};
    analytics
      .filter((e) => e.type === 'finder_use' && e.metadata?.room)
      .forEach((e) => {
        const rm = String(e.metadata!.room);
        map[rm] = (map[rm] || 0) + 1;
      });
    return Object.entries(map).map(([room, count]) => ({ room, count }));
  }, [analytics]);

  // Filtered raw events
  const filteredEvents = useMemo(() => {
    if (selectedEventType === 'all') return analytics;
    return analytics.filter((e) => e.type === selectedEventType);
  }, [analytics, selectedEventType]);

  const exportAnalyticsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analytics, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `alishan-analytics-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Analytics data exported as JSON file.');
  };

  return (
    <div className="space-y-8 font-sans pb-12">
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
            Customer Discovery Intelligence
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-walnut-950">
            Showroom Interest Analytics
          </h1>
          <p className="text-xs text-charcoal-600 mt-0.5">
            Audit customer discovery trends, search terminology, and WhatsApp enquiry conversion rates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={exportAnalyticsJSON}
            className="inline-flex items-center gap-1.5 bg-sand-200 hover:bg-sand-300 text-walnut-950 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log (JSON)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-sand-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block">
            Catalogue Views
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-sans text-walnut-950">{viewCount}</div>
          <div className="text-[11px] text-charcoal-500">Product detail impressions</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-sand-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            WhatsApp Clicks
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-sans text-emerald-900">{whatsappCount}</div>
          <div className="text-[11px] text-emerald-700">Enquiries initiated</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-sand-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block">
            Enquiry Ratio
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-sans text-walnut-950">{enquiryRatio}%</div>
          <div className="text-[11px] text-charcoal-500">WhatsApp clicks per product view</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-sand-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block">
            Total Logged Events
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-sans text-walnut-950">{totalEvents}</div>
          <div className="text-[11px] text-charcoal-500">Audited in local storage</div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Searches */}
        <div className="bg-white rounded-xl border border-sand-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-sand-200 pb-3">
            <div className="flex items-center gap-2 font-serif font-bold text-base text-walnut-950">
              <Search className="w-4 h-4 text-walnut-700" />
              <span>Customer Search Keywords</span>
            </div>
            <span className="text-[11px] text-charcoal-500">Frequent queries</span>
          </div>

          {searchQueries.length > 0 ? (
            <div className="space-y-2.5">
              {searchQueries.slice(0, 6).map((item, idx) => (
                <div
                  key={item.query}
                  className="flex items-center justify-between p-2 rounded bg-sand-50 border border-sand-200 text-xs"
                >
                  <span className="font-medium text-charcoal-900 font-mono">
                    "{item.query}"
                  </span>
                  <span className="font-bold text-walnut-800">
                    {item.count} search{item.count === 1 ? '' : 'es'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-charcoal-500 py-4 text-center">
              No search keywords recorded yet.
            </div>
          )}
        </div>

        {/* Category Engagement */}
        <div className="bg-white rounded-xl border border-sand-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-sand-200 pb-3">
            <div className="flex items-center gap-2 font-serif font-bold text-base text-walnut-950">
              <BarChart3 className="w-4 h-4 text-walnut-700" />
              <span>Category Interest Distribution</span>
            </div>
            <span className="text-[11px] text-charcoal-500">Total Interactions</span>
          </div>

          {categoryEngagement.length > 0 ? (
            <div className="space-y-2.5">
              {categoryEngagement.slice(0, 6).map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between p-2 rounded bg-sand-50 border border-sand-200 text-xs"
                >
                  <span className="font-medium text-charcoal-900">{item.category}</span>
                  <span className="font-bold text-walnut-800">{item.count} events</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-charcoal-500 py-4 text-center">
              No category engagement data yet.
            </div>
          )}
        </div>
      </div>

      {/* Raw Event Stream */}
      <div className="bg-white rounded-xl border border-sand-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-200 pb-3">
          <div className="flex items-center gap-2 font-serif font-bold text-base text-walnut-950">
            <span>Audit Event Log ({filteredEvents.length})</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-charcoal-600">Filter Event:</label>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="bg-sand-50 border border-sand-300 rounded-md py-1 px-2 text-xs text-charcoal-800"
            >
              <option value="all">All Events</option>
              <option value="product_view">Product Views</option>
              <option value="whatsapp_click">WhatsApp Clicks</option>
              <option value="search">Searches</option>
              <option value="finder_use">Finder Runs</option>
              <option value="favourite_toggle">Favourites</option>
              <option value="compare_action">Comparisons</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-sand-100 text-walnut-900 sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Target / Item</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200 text-charcoal-700">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-sand-50">
                  <td className="py-2 px-3 whitespace-nowrap text-charcoal-500 font-mono text-[11px]">
                    {new Date(evt.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sand-200 text-walnut-900">
                      {evt.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-medium text-charcoal-900 line-clamp-1 max-w-[200px]">
                    {evt.productName || (evt.metadata?.query ? `"${evt.metadata.query}"` : '—')}
                  </td>
                  <td className="py-2 px-3 text-charcoal-600 whitespace-nowrap">
                    {evt.category || '—'}
                  </td>
                  <td className="py-2 px-3 text-charcoal-400 font-mono text-[10px] whitespace-nowrap">
                    {evt.sessionId.slice(0, 10)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
