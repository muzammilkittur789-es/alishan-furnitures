import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Settings,
  BarChart3,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Menu,
  X,
  Store,
  LogOut,
} from 'lucide-react';
import { useShowroom } from '../../context/ShowroomContext';

export const AdminLayout: React.FC = () => {
  const { settings, resetAllDemoData, isAdminAuthenticated, adminLogout } = useShowroom();
  const location = useLocation();
  const navigate = useNavigate();

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Protected route guard: Redirect unauthenticated requests to /admin/login
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleReset = () => {
    resetAllDemoData();
    setResetConfirmOpen(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Product Management', path: '/admin/products', icon: Package },
    { name: 'Add New Product', path: '/admin/products/new', icon: PlusCircle },
    { name: 'Customer Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Showroom Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (path === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/dashboard')) {
      return true;
    }
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col font-sans">
      {/* Top Banner */}
      <header className="bg-walnut-950 text-sand-100 border-b border-walnut-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded text-sand-300 hover:text-white hover:bg-walnut-900"
              aria-label="Toggle admin menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-walnut-800 text-sand-100 flex items-center justify-center font-serif font-bold text-sm">
                {settings.initials || 'AF'}
              </span>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-white block leading-none">
                  {settings.name}
                </span>
                <span className="text-[10px] text-sand-400 uppercase tracking-wider">
                  Showroom Management Portal
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block ml-3 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              Admin Session Active
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {resetSuccess && (
              <span className="hidden md:inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Data Reset
              </span>
            )}

            {/* Reset Demo Data Button (Exclusively inside Admin Header) */}
            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-sand-300 hover:text-white bg-walnut-900 hover:bg-walnut-800 border border-walnut-800 px-2.5 py-1.5 rounded transition-colors"
              title="Restore initial seed catalog & settings"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-walnut-950 bg-sand-200 hover:bg-sand-100 px-3 py-1.5 rounded transition-colors shadow-xs"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Customer Website</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            {/* Logout Action */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-100 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 px-2.5 py-1.5 rounded transition-colors"
              title="Log out of Showroom Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-lg border border-sand-200 p-4 sticky top-24 space-y-6 shadow-xs">
            <div>
              <div className="text-[11px] font-bold text-walnut-600 uppercase tracking-wider px-3 mb-2">
                Showroom Management
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path, item.exact);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        active
                          ? 'bg-walnut-900 text-white shadow-xs'
                          : 'text-charcoal-700 hover:bg-sand-100 hover:text-walnut-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-sand-200 text-xs text-charcoal-500 space-y-2 px-3">
              <div className="font-medium text-charcoal-800">Admin Guidance:</div>
              <p className="text-[11px] leading-relaxed">
                Changes to products, prices, and availability immediately reflect on the public catalogue.
              </p>
            </div>

            <div className="pt-4 border-t border-sand-200 px-3">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 py-2 rounded-md transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex">
            <div className="w-72 bg-white h-full p-5 space-y-6 shadow-xl animate-in slide-in-from-left">
              <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                <span className="font-serif font-bold text-lg text-walnut-900">Admin Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded text-charcoal-500 hover:bg-sand-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path, item.exact);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        active
                          ? 'bg-walnut-900 text-white'
                          : 'text-charcoal-700 hover:bg-sand-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-sand-200 space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex items-center justify-center gap-2 bg-sand-200 text-walnut-900 py-2 rounded text-xs font-semibold"
                >
                  <Store className="w-4 h-4" />
                  <span>View Customer Website</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-800 border border-rose-200 py-2 rounded text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 text-charcoal-900 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-walnut-800">
              <RotateCcw className="w-6 h-6 text-walnut-700" />
              <h3 className="font-serif text-lg font-bold">Reset Demo Data to Original Seeds?</h3>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              This will restore original catalogue items, seed analytics, and initial showroom
              settings.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-medium text-charcoal-700 hover:bg-sand-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold bg-walnut-800 hover:bg-walnut-900 text-white rounded-md"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
