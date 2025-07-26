import { useState } from 'react';
import { Search } from 'lucide-react';

interface LeadLookupProps {
  onSearchLead: (leadId: string) => void;
  onBrowseLeads: () => void;
  isLoading?: boolean;
}

export default function LeadLookup({ onSearchLead, onBrowseLeads, isLoading = false }: LeadLookupProps) {
  const [leadId, setLeadId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadId.trim() && !isLoading) {
      onSearchLead(leadId.trim());
    }
  };

  return (
    <div className="lead-lookup">
      <h2 className="lead-lookup-title">Lead Lookup</h2>
      <p className="lead-lookup-subtitle">Enter a lead ID or browse all leads</p>
      
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            placeholder="lead-003"
            className="search-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={isLoading || !leadId.trim()}
          >
            <Search size={20} />
          </button>
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