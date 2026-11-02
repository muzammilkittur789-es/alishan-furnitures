import { Product, ShowroomSettings, AnalyticsEvent } from '../types';
import { seedProducts } from '../data/seedProducts';
import { initialShowroomSettings } from '../data/seedSettings';
import { seedAnalyticsEvents } from '../data/seedAnalytics';

const STORAGE_KEYS = {
  PRODUCTS: 'alishan_products_v3',
  SETTINGS: 'alishan_settings_v1',
  ANALYTICS: 'alishan_analytics_v1',
  FAVOURITES: 'alishan_favourites_v1',
  COMPARE: 'alishan_compare_v1',
  SESSION_ID: 'alishan_session_id_v1',
};

export function getSessionId(): string {
  try {
    let sid = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (!sid) {
      sid = 'sess-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, sid);
    }
    return sid;
  } catch (e) {
    return 'sess-fallback-temp';
  }
}

export function loadProductsFromStorage(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      saveProductsToStorage(seedProducts);
      return seedProducts;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read products from localStorage, using seeds:', err);
  }
  saveProductsToStorage(seedProducts);
  return seedProducts;
}

export function saveProductsToStorage(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to localStorage:', err);
  }
}

export function loadSettingsFromStorage(): ShowroomSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      saveSettingsToStorage(initialShowroomSettings);
      return initialShowroomSettings;
    }
    const parsed = JSON.parse(raw);
    if (parsed && parsed.name) {
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read settings from localStorage, using defaults:', err);
  }
  saveSettingsToStorage(initialShowroomSettings);
  return initialShowroomSettings;
}

export function saveSettingsToStorage(settings: ShowroomSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
  }
}

export function loadAnalyticsFromStorage(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (!raw) {
      saveAnalyticsToStorage(seedAnalyticsEvents);
      return seedAnalyticsEvents;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read analytics from localStorage, using seeds:', err);
  }
  saveAnalyticsToStorage(seedAnalyticsEvents);
  return seedAnalyticsEvents;
}

export function saveAnalyticsToStorage(events: AnalyticsEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save analytics to localStorage:', err);
  }
}

export function loadFavouritesFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVOURITES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load favourites:', err);
  }
  return [];
}

export function saveFavouritesToStorage(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save favourites:', err);
  }
}

export function loadCompareFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPARE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load compare list:', err);
  }
  return [];
}

export function saveCompareToStorage(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPARE, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save compare list:', err);
  }
}

export function resetDemoDataToDefault(): {
  products: Product[];
  settings: ShowroomSettings;
  analytics: AnalyticsEvent[];
} {
  saveProductsToStorage(seedProducts);
  saveSettingsToStorage(initialShowroomSettings);
  saveAnalyticsToStorage(seedAnalyticsEvents);
  saveFavouritesToStorage([]);
  saveCompareToStorage([]);

  return {
    products: seedProducts,
    settings: initialShowroomSettings,
    analytics: seedAnalyticsEvents,
  };
}
