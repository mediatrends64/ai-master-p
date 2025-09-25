import React, { useState, useRef, useEffect } from 'react';
import { PERSONAS } from '../constants';
import { Persona } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface PersonaSelectorProps {
  selectedPersona: Persona | null;
  onSelectPersona: (persona: Persona | null) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersona, onSelectPersona }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSelect = (persona: Persona) => {
    onSelectPersona(persona);
    setIsOpen(false);
  };
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the dropdown from opening
    onSelectPersona(null);
  };

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <label className="block text-lg font-medium text-text-primary-light dark:text-text-primary mb-2">
        {t('practice.persona_label')}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="flex items-center justify-between w-full cursor-pointer py-2 pe-8 ps-3 rounded-md bg-primary-light/50 dark:bg-primary-dark/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-primary focus:ring-accent focus:outline-none text-text-primary-light dark:text-text-primary"
        >
          <span className={selectedPersona ? '' : 'text-text-secondary-light dark:text-text-secondary'}>
            {selectedPersona ? t(selectedPersona.nameKey) : t('practice.persona_placeholder')}
          </span>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-text-secondary-light dark:text-text-secondary">
            <svg className={`fill-current h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </button>
        {selectedPersona && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={t('practice.persona_clear')}
            className="absolute inset-y-0 end-8 flex items-center px-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <ul
          className="absolute mt-2 w-full max-h-60 overflow-y-auto z-10 rounded-md bg-secondary-light dark:bg-secondary shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in"
          style={{ animationDuration: '150ms' }}
          role="listbox"
        >
          {PERSONAS.map(persona => (
            <li key={persona.nameKey}>
              <button
                onClick={() => handleSelect(persona)}
                className={`w-full text-start px-4 py-3 transition-colors duration-150 ${
                  selectedPersona?.nameKey === persona.nameKey
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-primary-light dark:text-text-primary hover:bg-slate-200 dark:hover:bg-slate-700/50'
                }`}
                role="option"
                aria-selected={selectedPersona?.nameKey === persona.nameKey}
              >
                <p className="font-semibold">{t(persona.nameKey)}</p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary">{t(persona.descriptionKey)}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PersonaSelector;