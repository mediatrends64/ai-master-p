import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { LANGUAGES } from '../constants/languages';

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLanguage = LANGUAGES.find(lang => lang.code === locale);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleLanguageChange = (code: string) => {
    setLocale(code as any);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
        className="flex items-center justify-between w-full min-w-[120px] cursor-pointer py-2 pe-8 ps-3 rounded-md bg-secondary-light dark:bg-secondary border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-primary focus:ring-accent focus:outline-none text-slate-700 dark:text-slate-200"
      >
        <span>{selectedLanguage?.name}</span>
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-text-secondary dark:text-text-secondary">
          <svg className={`fill-current h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </button>

      {isOpen && (
        <ul
          className="absolute end-0 mt-2 w-full max-h-60 overflow-y-auto z-50 rounded-md bg-secondary-light dark:bg-secondary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in"
          style={{ animationDuration: '150ms' }}
          role="listbox"
        >
          {LANGUAGES.map(lang => (
            <li key={lang.code}>
              <button
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-start px-4 py-2 text-sm transition-colors duration-150 ${
                  locale === lang.code
                    ? 'bg-accent text-white font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/50'
                }`}
                role="option"
                aria-selected={locale === lang.code}
              >
                {lang.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


const Header = () => {
  return (
    <header className="flex-shrink-0 bg-secondary-light dark:bg-primary-dark shadow-sm">
      <div className="flex items-center justify-end h-16 px-4 sm:px-6 lg:px-8">
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;