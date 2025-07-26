import { Mail, Phone, Globe, MapPin, User, Building } from 'lucide-react';
import type { Lead } from '../types/lead';

interface LeadInfoProps {
  lead: Lead;
}

export default function LeadInfo({ lead }: LeadInfoProps) {
  const fullName = [lead.first_name, lead.last_name].filter(Boolean).join(' ');
  const fullAddress = [
    lead.primary_address_city,
    lead.primary_address_state,
    lead.primary_address_country
  ].filter(Boolean).join(', ');

  return (
    <div className="lead-info">
      <div className="lead-info-header">
        <User className="lead-info-icon" size={24} />
        <h2 className="lead-info-title">Lead Information</h2>
      </div>

      <div className="lead-details">
        <h3 className="lead-name">{fullName}</h3>
        {lead.title && <p className="lead-title">{lead.title}</p>}
        {lead.account_name && (
          <div className="lead-company">
            <Building size={16} />
            <span>{lead.account_name}</span>
          </div>
        )}

        <div className="lead-status-container">
          <span className={`lead-status ${lead.status?.toLowerCase()}`}>
            {lead.status || 'Unknown'}
          </span>
          <span className="lead-source">
            {lead.lead_source || 'Unknown Source'}
          </span>
        </div>

        <div className="contact-info">
          {lead.email1 && (
            <div className="contact-item">
              <Mail size={16} />
              <a href={`mailto:${lead.email1}`} className="contact-link">
                {lead.email1}
              </a>
            </div>
          )}
          
          {(lead.phone_mobile || lead.phone_work) && (
            <div className="contact-item">
              <Phone size={16} />
              <a href={`tel:${lead.phone_mobile || lead.phone_work}`} className="contact-link">
                {lead.phone_mobile || lead.phone_work}
              </a>
            </div>
          )}
          
          {lead.website && (
            <div className="contact-item">
              <Globe size={16} />
              <a 
                href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                {lead.website}
              </a>
            </div>
          )}
          
          {fullAddress && (
            <div className="contact-item">
              <MapPin size={16} />
              <span>{fullAddress}</span>
            </div>
          )}
        </div>

        {lead.description && (
          <div className="description">
            <h4 className="description-title">Description</h4>
            <p className="description-text">{lead.description}</p>
          </div>
        )}
      </div>
    </div>
  );
} 