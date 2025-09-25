import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'de' | 'fr' | 'es' | 'ar' | 'zh' | 'vi' | 'fil' | 'ja' | 'hi';
type Translations = Record<string, any>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get nested values from an object using a string path
const getNestedValue = (obj: any, path: string): string | undefined => {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem('locale');
    const validLocales: Locale[] = ['en', 'de', 'fr', 'es', 'ar', 'zh', 'vi', 'fil', 'ja', 'hi'];
    return (savedLocale && validLocales.includes(savedLocale as Locale)) ? savedLocale as Locale : 'en';
  });

  const [translations, setTranslations] = useState<Translations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/translations/${locale}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translation file for locale: ${locale}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Translation fetch error:", error);
        // Fallback to English if the selected locale fails
        if (locale !== 'en') {
            console.warn("Falling back to English translations.");
            try {
                const response = await fetch(`/translations/en.json`);
                const data = await response.json();
                setTranslations(data);
            } catch (fallbackError) {
                console.error("Failed to load fallback English translations:", fallbackError);
                setTranslations({}); // Set empty translations on complete failure
            }
        } else {
             setTranslations({});
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    if (newLocale !== locale) {
      setLocaleState(newLocale);
      localStorage.setItem('locale', newLocale);
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' || locale === 'hi' ? 'rtl' : 'ltr';
  }, [locale]);
  
  const t = (key: string, replacements?: Record<string, string>): string => {
    if (loading || !translations) {
      return key; // Return key itself as a fallback during loading
    }
    let translation = getNestedValue(translations, key) || key;

    if (replacements) {
      Object.entries(replacements).forEach(([rKey, value]) => {
        translation = translation.replace(new RegExp(`{{${rKey}}}`, 'g'), value);
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};