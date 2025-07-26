import type { Lead } from '../types/lead';

interface AllLeadsProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onHideTable: () => void;
  isLoading?: boolean;
}

export default function AllLeads({ leads, onSelectLead, onHideTable, isLoading }: AllLeadsProps) {
  if (isLoading) {
    return (
      <div className="all-leads">
        <div className="all-leads-header">
          <button onClick={onHideTable} className="hide-table-button">
            Hide Table
          </button>
        </div>
        <div className="all-leads-loading">
          <div className="loading-spinner"></div>
          <p>Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-leads">
      <div className="all-leads-header">
        <button onClick={onHideTable} className="hide-table-button">
          Hide Table
        </button>
      </div>

      <div className="all-leads-content">
        <h2 className="all-leads-title">All Leads</h2>
        <p className="all-leads-subtitle">Tap on a lead to view detailed insights</p>

        {leads.length === 0 ? (
          <div className="no-leads">
            <p>No leads available</p>
          </div>
        ) : (
          <>
            {/* Desktop table view */}
            <div className="leads-table-container desktop-only">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const fullName = [lead.first_name, lead.last_name].filter(Boolean).join(' ');
                    return (
                      <tr 
                        key={lead.id} 
                        onClick={() => onSelectLead(lead)}
                        className="lead-row"
                      >
                        <td className="lead-name-cell">
                          <div className="lead-name">{fullName}</div>
                          {lead.title && <div className="lead-title">{lead.title}</div>}
                        </td>
                        <td className="lead-company">{lead.account_name || 'N/A'}</td>
                        <td className="lead-status-cell">
                          <span className={`status-badge ${lead.status?.toLowerCase().replace(/\s+/g, '_') || 'unknown'}`}>
                            {lead.status || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="leads-cards-container mobile-only">
              {leads.map((lead) => {
                const fullName = [lead.first_name, lead.last_name].filter(Boolean).join(' ');
                return (
                  <div 
                    key={lead.id} 
                    onClick={() => onSelectLead(lead)}
                    className="lead-card"
                  >
                    <div className="lead-card-main">
                      <div className="lead-card-info">
                        <div className="lead-name">{fullName}</div>
                        {lead.title && <div className="lead-title">{lead.title}</div>}
                        <div className="lead-company">{lead.account_name || 'N/A'}</div>
                      </div>
                      <div className="lead-card-status">
                        <span className={`status-badge ${lead.status?.toLowerCase().replace(/\s+/g, '_') || 'unknown'}`}>
                          {lead.status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 