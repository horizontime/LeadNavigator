interface Lead {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  account_name?: string;
  email1?: string;
  phone_mobile?: string;
  phone_work?: string;
  website?: string;
  lead_source?: string;
  status?: string;
  description?: string;
  department?: string;
  primary_address_street?: string;
  primary_address_city?: string;
  primary_address_state?: string;
  primary_address_country?: string;
  primary_address_postalcode?: string;
  date_entered?: string;
  date_modified?: string;
}

interface LeadInsight {
  id: string;
  title: string;
  content: string;
  category: 'engagement' | 'opportunity' | 'strategy' | 'priority';
  confidence: number;
}

export type { Lead, LeadInsight }; 