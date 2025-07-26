import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { dataService } from '../services/dataService';
import type { Lead } from '../types/lead';

interface LeadLookupProps {
  onSearchLead: (lead: Lead) => void;
  onBrowseLeads: () => void;
  isLoading?: boolean;
}

export default function LeadLookup({ onSearchLead, onBrowseLeads, isLoading = false }: LeadLookupProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Lead[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search for autocomplete
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await dataService.searchLeads(searchQuery);
          setSuggestions(results.slice(0, 8)); // Limit to 8 suggestions
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectLead(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectLead = (lead: Lead) => {
    const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
    setSearchQuery(fullName);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    onSearchLead(lead);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelectLead(suggestions[selectedIndex]);
    } else if (suggestions.length === 1) {
      handleSelectLead(suggestions[0]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatLeadDisplay = (lead: Lead) => {
    const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
    const company = lead.account_name;
    const title = lead.title;
    
    return {
      name: fullName,
      subtitle: [title, company].filter(Boolean).join(' • ')
    };
  };

  return (
    <div className="lead-lookup">
      <h2 className="lead-lookup-title">Lead Lookup</h2>
      <p className="lead-lookup-subtitle">Enter a lead name or browse all leads</p>
      
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container" ref={suggestionsRef}>
          <div className="search-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Start typing a lead name..."
              className="search-input"
              disabled={isLoading}
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="clear-search-button"
                disabled={isLoading}
              >
                <X size={16} />
              </button>
            )}
            <button 
              type="submit" 
              className="search-button"
              disabled={isLoading || !searchQuery.trim()}
            >
              <Search size={20} />
            </button>
          </div>

          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((lead, index) => {
                const { name, subtitle } = formatLeadDisplay(lead);
                return (
                  <div
                    key={lead.id}
                    className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                    onClick={() => handleSelectLead(lead)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="suggestion-content">
                      <div className="suggestion-name">{name}</div>
                      {subtitle && (
                        <div className="suggestion-subtitle">{subtitle}</div>
                      )}
                    </div>
                    <div className={`lead-status-badge ${lead.status?.toLowerCase().replace(/\s+/g, '_') || 'unknown'}`}>
                      {lead.status || 'Unknown'}
                    </div>
                  </div>
                );
              })}
              {isSearching && (
                <div className="suggestion-loading">
                  <div className="loading-spinner-small"></div>
                  Searching...
                </div>
              )}
            </div>
          )}
        </div>
      </form>

      <button 
        onClick={onBrowseLeads}
        className="browse-button"
        disabled={isLoading}
      >
        Browse All Leads
      </button>
    </div>
  );
} 