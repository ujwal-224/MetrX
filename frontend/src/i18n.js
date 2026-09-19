import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  hi: {
    translation: hiTranslation
  }
};

const getStoredLanguage = () => {
  try {
    const saved = localStorage.getItem('metrx_lang') || localStorage.getItem('i18nextLng');
    if (saved) {
      const clean = saved.trim().toLowerCase();
      if (clean.startsWith('hi')) return 'hi';
      if (clean.startsWith('en')) return 'en';
    }
  } catch (err) {
    console.warn('[i18n] Error reading localStorage', err);
  }
  return null;
};

const storedLang = getStoredLanguage();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: storedLang || undefined,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'metrx_lang',
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

// Persist both 'metrx_lang' and 'i18nextLng' on every change so refreshes survive
i18n.on('languageChanged', (lng) => {
  try {
    const code = lng.toLowerCase().startsWith('hi') ? 'hi' : 'en';
    localStorage.setItem('metrx_lang', code.toUpperCase());
    localStorage.setItem('i18nextLng', code);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = code;
    }
  } catch (err) {
    // ignore quota/security errors
  }
});

// Set document lang attribute on startup
if (typeof document !== 'undefined') {
  document.documentElement.lang = (storedLang || i18n.language || 'en').startsWith('hi') ? 'hi' : 'en';
}

export default i18n;
