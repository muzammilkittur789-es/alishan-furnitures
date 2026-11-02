import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AdminLayout } from './components/layout/AdminLayout';

import { HomePage } from './pages/HomePage';
import { CataloguePage } from './pages/CataloguePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SmartFinderPage } from './pages/SmartFinderPage';
import { RoomCollectionPage } from './pages/RoomCollectionPage';
import { FavouritesPage } from './pages/FavouritesPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductEditorPage } from './pages/admin/AdminProductEditorPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

// Scroll restoration component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Customer Website Shell with Navbar and Footer
const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-charcoal-900 font-sans selection:bg-walnut-200 selection:text-walnut-900 relative overflow-x-hidden">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Customer Facing Routes */}
        <Route
          path="/"
          element={
            <CustomerLayout>
              <HomePage />
            </CustomerLayout>
          }
        />
        <Route
          path="/catalogue"
          element={
            <CustomerLayout>
              <CataloguePage />
            </CustomerLayout>
          }
        />
        <Route
          path="/product/:slug"
          element={
            <CustomerLayout>
              <ProductDetailPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/find-furniture"
          element={
            <CustomerLayout>
              <SmartFinderPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/collections/:slug"
          element={
            <CustomerLayout>
              <RoomCollectionPage />
            </CustomerLayout>
          }
        />
        <Route
          path="/favourites"
          element={
            <CustomerLayout>
              <FavouritesPage />
            </CustomerLayout>
          }
        />
        {/* Product comparison is omitted per requirements; redirect legacy /compare to /favourites */}
        <Route
          path="/compare"
          element={<Navigate to="/favourites" replace />}
        />
        <Route
          path="/contact"
          element={
            <CustomerLayout>
              <ContactPage />
            </CustomerLayout>
          }
        />

        {/* Dedicated Admin Login Portal */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Showroom Management Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverviewPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductEditorPage />} />
          <Route path="products/:id/edit" element={<AdminProductEditorPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <CustomerLayout>
              <NotFoundPage />
            </CustomerLayout>
          }
        />
      </Routes>
    </>
  );
};
