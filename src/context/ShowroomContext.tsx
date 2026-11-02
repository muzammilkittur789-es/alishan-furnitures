import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  ShowroomSettings,
  AnalyticsEvent,
  AnalyticsEventType,
} from '../types';
import {
  loadProductsFromStorage,
  saveProductsToStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  loadAnalyticsFromStorage,
  saveAnalyticsToStorage,
  loadFavouritesFromStorage,
  saveFavouritesToStorage,
  resetDemoDataToDefault,
  getSessionId,
} from '../utils/storage';
import { slugify } from '../utils/formatters';

interface ShowroomContextType {
  products: Product[];
  settings: ShowroomSettings;
  analytics: AnalyticsEvent[];
  favourites: string[];
  sessionId: string;
  isAdminAuthenticated: boolean;
  adminLogin: (credentials: { username: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'slug'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (newSettings: Partial<ShowroomSettings>) => void;
  recordEvent: (type: AnalyticsEventType, payload?: {
    productId?: string;
    productName?: string;
    category?: string;
    metadata?: Record<string, any>;
  }) => void;
  toggleFavourite: (productId: string) => boolean;
  isFavourite: (productId: string) => boolean;
  resetAllDemoData: () => void;
}

const ShowroomContext = createContext<ShowroomContextType | undefined>(undefined);

const ADMIN_SESSION_KEY = 'alishan_admin_session_active';

export const ShowroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(loadProductsFromStorage);
  const [settings, setSettings] = useState<ShowroomSettings>(loadSettingsFromStorage);
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>(loadAnalyticsFromStorage);
  const [favourites, setFavourites] = useState<string[]>(loadFavouritesFromStorage);
  const [sessionId] = useState<string>(getSessionId);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Sync to localStorage whenever state changes
  useEffect(() => {
    saveProductsToStorage(products);
  }, [products]);

  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  useEffect(() => {
    saveAnalyticsToStorage(analytics);
  }, [analytics]);

  useEffect(() => {
    saveFavouritesToStorage(favourites);
  }, [favourites]);

  // Demo Authentication Implementation
  const adminLogin = useCallback(
    async ({ username, password }: { username: string; password: string }): Promise<{ success: boolean; error?: string }> => {
      // Simulate slight network delay for realistic experience
      await new Promise((res) => setTimeout(res, 400));

      const trimmedUser = username.trim().toLowerCase();
      const validUsers = ['admin@alishan.demo', 'admin', 'manager@alishan.demo'];
      const validPass = 'alishan2026';

      if (!trimmedUser) {
        return { success: false, error: 'Please enter your administrator username or email.' };
      }
      if (!password) {
        return { success: false, error: 'Please enter your password.' };
      }

      if ((validUsers.includes(trimmedUser) && password === validPass) || (trimmedUser === 'admin' && password === 'admin123')) {
        try {
          sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
        } catch (e) {
          console.warn('Session storage write failed:', e);
        }
        setIsAdminAuthenticated(true);
        return { success: true };
      }

      return {
        success: false,
        error: 'Invalid administrator credentials. (Demo hint: admin@alishan.demo / alishan2026)',
      };
    },
    []
  );

  const adminLogout = useCallback(() => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {
      console.warn('Session storage remove failed:', e);
    }
    setIsAdminAuthenticated(false);
  }, []);

  // Record analytics events safely
  const recordEvent = useCallback(
    (
      type: AnalyticsEventType,
      payload?: {
        productId?: string;
        productName?: string;
        category?: string;
        metadata?: Record<string, any>;
      }
    ) => {
      const newEvent: AnalyticsEvent = {
        id: 'evt-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36),
        type,
        timestamp: new Date().toISOString(),
        productId: payload?.productId,
        productName: payload?.productName,
        category: payload?.category,
        metadata: payload?.metadata,
        sessionId,
      };

      setAnalytics((prev) => [newEvent, ...prev.slice(0, 499)]); // Keep recent 500 events
    },
    [sessionId]
  );

  const addProduct = useCallback(
    (productData: Omit<Product, 'id' | 'createdAt' | 'slug'>): Product => {
      const id = 'prod-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
      const slug = slugify(productData.name) + '-' + id.slice(-4);
      const newProd: Product = {
        ...productData,
        id,
        slug,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProd, ...prev]);
      return newProd;
    },
    []
  );

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updatedName = updates.name || p.name;
          const slug = updates.slug || (updates.name ? slugify(updatedName) + '-' + p.id.slice(-4) : p.slug);
          return {
            ...p,
            ...updates,
            slug,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setFavourites((prev) => prev.filter((favId) => favId !== id));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ShowroomSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const toggleFavourite = useCallback(
    (productId: string): boolean => {
      let isNowFav = false;
      const targetProd = products.find((p) => p.id === productId);

      setFavourites((prev) => {
        if (prev.includes(productId)) {
          isNowFav = false;
          return prev.filter((id) => id !== productId);
        } else {
          isNowFav = true;
          return [...prev, productId];
        }
      });

      recordEvent('favourite_toggle', {
        productId,
        productName: targetProd?.name,
        category: targetProd?.category,
        metadata: { action: isNowFav ? 'added' : 'removed' },
      });

      return isNowFav;
    },
    [products, recordEvent]
  );

  const isFavourite = useCallback(
    (productId: string): boolean => favourites.includes(productId),
    [favourites]
  );

  const resetAllDemoData = useCallback(() => {
    const refreshed = resetDemoDataToDefault();
    setProducts(refreshed.products);
    setSettings(refreshed.settings);
    setAnalytics(refreshed.analytics);
    setFavourites([]);
  }, []);

  return (
    <ShowroomContext.Provider
      value={{
        products,
        settings,
        analytics,
        favourites,
        sessionId,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        recordEvent,
        toggleFavourite,
        isFavourite,
        resetAllDemoData,
      }}
    >
      {children}
    </ShowroomContext.Provider>
  );
};

export const useShowroom = (): ShowroomContextType => {
  const context = useContext(ShowroomContext);
  if (!context) {
    throw new Error('useShowroom must be used within a ShowroomProvider');
  }
  return context;
};
