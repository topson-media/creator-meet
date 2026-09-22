import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, Globe } from 'lucide-react';
import { Country, COUNTRIES } from '../data/countries';

interface CountryPickerProps {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
  isDarkMode: boolean;
  disabled?: boolean;
  idPrefix?: string;
}

export const CountryPicker: React.FC<CountryPickerProps> = ({
  selectedCountry,
  onSelectCountry,
  isDarkMode,
  disabled = false,
  idPrefix = 'country-picker',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filter countries
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;
    const q = searchQuery.toLowerCase().trim();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected Country Trigger Button */}
      <button
        type="button"
        id={`${idPrefix}-button`}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-medium transition cursor-pointer text-left ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        } ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-700 text-white hover:border-slate-600 focus:border-[#00D2FF]'
            : 'bg-white border-slate-300 text-slate-900 hover:border-slate-400 focus:border-[#7928CA]'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 truncate">
          <span className="text-lg leading-none" role="img" aria-label={selectedCountry.name}>
            {selectedCountry.flag}
          </span>
          <span className="font-bold truncate">{selectedCountry.name}</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded-md text-[11px] shrink-0 ${
              isDarkMode ? 'bg-white/10 text-cyan-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {selectedCountry.dialCode}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform text-slate-400 ${
            isOpen ? 'rotate-180 text-[#00D2FF]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id={`${idPrefix}-dropdown`}
          className={`absolute z-50 mt-1.5 w-full rounded-2xl border shadow-xl overflow-hidden animate-fade-in ${
            isDarkMode
              ? 'bg-[#0E1528] border-slate-700 text-white shadow-black/60'
              : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
          }`}
          style={{ maxHeight: '320px' }}
        >
          {/* Search Box */}
          <div
            className={`p-2.5 border-b sticky top-0 z-10 flex items-center gap-2 ${
              isDarkMode ? 'bg-[#0E1528] border-slate-800' : 'bg-white border-slate-100'
            }`}
          >
            <Search size={14} className="text-slate-400 shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              id={`${idPrefix}-search`}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country name or calling code..."
              className={`w-full text-xs py-1.5 px-2 rounded-lg bg-transparent focus:outline-hidden ${
                isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-200 px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Country List */}
          <div className="overflow-y-auto max-h-56 divide-y divide-inherit divide-opacity-30 scrollbar-thin">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                <Globe size={20} className="mx-auto mb-1 opacity-50" />
                No countries found for "{searchQuery}"
              </div>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = country.code === selectedCountry.code;
                return (
                  <button
                    key={`${country.code}-${country.dialCode}`}
                    type="button"
                    onClick={() => {
                      onSelectCountry(country);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 flex items-center justify-between text-xs transition text-left cursor-pointer ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-[#00D2FF]/15 text-[#00D2FF] font-bold'
                          : 'bg-indigo-50 text-indigo-700 font-bold'
                        : isDarkMode
                        ? 'hover:bg-white/5 text-slate-200'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-lg leading-none" role="img" aria-label={country.name}>
                        {country.flag}
                      </span>
                      <span className="truncate">{country.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span
                        className={`text-[11px] font-mono font-medium px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-[#00D2FF]/20 text-[#00D2FF]'
                            : isDarkMode
                            ? 'text-slate-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {country.dialCode}
                      </span>
                      {isSelected && <Check size={14} className="text-[#00D2FF] shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
