import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { translations } from './translations';

export type Language = 'en-IN' | 'hi-IN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  translateContent: (content: string, isMLContent?: boolean) => Promise<string>;
  isTranslating: boolean;
  translationErrors: Record<string, string>;
}

const defaultContextValue: LanguageContextType = {
  language: 'en-IN',
  setLanguage: () => {},
  t: (key) => key,
  translateContent: async (content) => content,
  isTranslating: false,
  translationErrors: {}
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: Language;
}

interface TranslationCache {
  [key: string]: {
    en: string;
    hi: string;
    timestamp: number;
  };
}

// Helper function to safely access localStorage
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading localStorage item ${key}:`, error);
      return null;
    }
  }
  return null;
};

// Helper function to safely set localStorage
const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        try {
          localStorage.removeItem('translationCache');
        } catch (e) {
          console.error('Failed to clear translation cache:', e);
        }
      }
    }
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLanguage = 'en-IN',
}) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<TranslationCache>({});
  const [translationErrors, setTranslationErrors] = useState<Record<string, string>>({});

  // Load language preference and translations from localStorage
  useEffect(() => {
    const loadStoredData = () => {
      if (typeof window === 'undefined') return;
      
      // Load language preference
      const savedLanguage = getLocalStorageItem('preferredLanguage');
      if (savedLanguage === 'en-IN' || savedLanguage === 'hi-IN') {
        setLanguage(savedLanguage as Language);
      }

      // Load cached translations
      const savedCache = getLocalStorageItem('translationCache');
      if (savedCache) {
        try {
          const parsedCache = JSON.parse(savedCache);
          if (typeof parsedCache === 'object' && parsedCache !== null) {
            setTranslationCache(parsedCache);
          }
        } catch (error) {
          console.error('Failed to parse translation cache:', error);
          localStorage.removeItem('translationCache');
        }
      }
    };

    loadStoredData();
  }, []);

  // Save language preference when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setLocalStorageItem('preferredLanguage', language);
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';
  }, [language]);

  // Save translation cache when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (Object.keys(translationCache).length > 0) {
      try {
        const cacheString = JSON.stringify(translationCache);
        setLocalStorageItem('translationCache', cacheString);
      } catch (error) {
        console.error('Failed to save translation cache:', error);
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          pruneTranslationCache();
        }
      }
    }
  }, [translationCache]);

  // Prune old translations to make space
  const pruneTranslationCache = useCallback(() => {
    const entries = Object.entries(translationCache);
    if (entries.length === 0) return;

    entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
    
    // Remove oldest 25% of entries
    const toRemove = Math.ceil(entries.length * 0.25);
    const prunedEntries = entries.slice(toRemove);
    const prunedCache = Object.fromEntries(prunedEntries);
    
    setTranslationCache(prunedCache);
    try {
      setLocalStorageItem('translationCache', JSON.stringify(prunedCache));
    } catch (error) {
      console.error('Failed to save pruned cache:', error);
    }
  }, [translationCache]);

  // Function to translate content using API (only for ML model content)
  const translateContent = useCallback(async (content: string, isMLContent: boolean = false): Promise<string> => {
    // Return original content for English or empty content
    if (!content?.trim() || language === 'en-IN') {
      return content;
    }

    const contentHash = btoa(encodeURIComponent(content)).slice(0, 32);
    
    // Check cache first
    if (translationCache[contentHash]?.hi) {
      return translationCache[contentHash].hi;
    }

    // Only use Gemini API for ML model content
    if (!isMLContent) {
      console.warn('Translation requested for non-ML content. This should use static translations.');
      return content;
    }

    setIsTranslating(true);
    setTranslationErrors(prev => ({ ...prev, [contentHash]: '' }));

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          targetLanguage: language,
          source: 'en-IN'
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const translatedText = data.translatedText;

      // Cache the translation if it's valid and different from source
      if (translatedText && translatedText !== content) {
        setTranslationCache(prev => ({
          ...prev,
          [contentHash]: {
            en: content,
            hi: translatedText,
            timestamp: Date.now()
          }
        }));
      }

      return translatedText || content;
    } catch (error) {
      console.error('Translation error:', error);
      setTranslationErrors(prev => ({
        ...prev,
        [contentHash]: error instanceof Error ? error.message : 'Translation failed'
      }));
      return content;
    } finally {
      setIsTranslating(false);
    }
  }, [language, translationCache]);

  // Function to translate text based on key (for static UI text)
  const translate = useCallback((key: string, params?: Record<string, string>): string => {
    if (!key) return '';

    // Get translation from static translations
    const translation = translations[key]?.[language] || key;
    
    // Replace parameters if provided
    if (params) {
      return Object.entries(params).reduce(
        (result, [param, value]) => result.replace(new RegExp(`{{${param}}}`, 'g'), value),
        translation
      );
    }
    
    return translation;
  }, [language]);

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t: translate,
    translateContent,
    isTranslating,
    translationErrors
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};