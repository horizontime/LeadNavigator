import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Lead } from '../types/lead';

interface AllLeadsProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onHideTable: () => void;
  isLoading?: boolean;
}

export default function AllLeads({ leads, onSelectLead, onHideTable, isLoading }: AllLeadsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;
  
  // Calculate pagination values
  const totalPages = Math.ceil(leads.length / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const endIndex = startIndex + leadsPerPage;
  const currentLeads = leads.slice(startIndex, endIndex);

  // Reset to first page when leads change
  useEffect(() => {
    setCurrentPage(1);
  }, [leads]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

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
        <div className="all-leads-title-section">
          <h2 className="all-leads-title">All Leads</h2>
          <p className="all-leads-subtitle">Tap on a lead to view detailed insights</p>
          {leads.length > 0 && (
            <div className="leads-count">
              Showing {startIndex + 1}-{Math.min(endIndex, leads.length)} of {leads.length} leads
            </div>
          )}
        </div>

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
                  {currentLeads.map((lead) => {
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
              {currentLeads.map((lead) => {
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="pagination-button pagination-prev"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="pagination-pages">
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? handlePageClick(page) : undefined}
                      disabled={page === '...' || page === currentPage}
                      className={`pagination-page ${
                        page === currentPage ? 'active' : ''
                      } ${page === '...' ? 'ellipsis' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-button pagination-next"
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 