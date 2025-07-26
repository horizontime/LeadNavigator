// Define the raw API response structure from SuiteCRM
interface SuiteCRMLeadResponse {
  data: Array<{
    type: string;
    id: string;
    attributes: SuiteCRMLeadAttributes;
    relationships: any;
  }>;
}

interface SuiteCRMLeadAttributes {
  name?: string;
  date_entered?: string;
  date_modified?: string;
  modified_user_id?: string;
  modified_by_name?: string;
  created_by?: string;
  created_by_name?: string;
  description?: string;
  deleted?: string;
  assigned_user_id?: string;
  assigned_user_name?: string;
  salutation?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  title?: string;
  photo?: string;
  department?: string;
  do_not_call?: string;
  phone_home?: string;
  email?: string;
  phone_mobile?: string;
  phone_work?: string;
  phone_other?: string;
  phone_fax?: string;
  email1?: string;
  email2?: string;
  invalid_email?: string;
  email_opt_out?: string;
  lawful_basis?: string;
  date_reviewed?: string;
  lawful_basis_source?: string;
  primary_address_street?: string;
  primary_address_street_2?: string;
  primary_address_street_3?: string;
  primary_address_city?: string;
  primary_address_state?: string;
  primary_address_postalcode?: string;
  primary_address_country?: string;
  alt_address_street?: string;
  alt_address_street_2?: string;
  alt_address_street_3?: string;
  alt_address_city?: string;
  alt_address_state?: string;
  alt_address_postalcode?: string;
  alt_address_country?: string;
  assistant?: string;
  assistant_phone?: string;
  converted?: string;
  refered_by?: string;
  lead_source?: string;
  lead_source_description?: string;
  status?: string;
  status_description?: string;
  reports_to_id?: string;
  report_to_name?: string;
  account_name?: string;
  account_description?: string;
  contact_id?: string;
  account_id?: string;
  opportunity_id?: string;
  opportunity_name?: string;
  opportunity_amount?: string;
  campaign_id?: string;
  campaign_name?: string;
  webtolead_email1?: string;
  webtolead_email2?: string;
  webtolead_email_opt_out?: string;
  webtolead_invalid_email?: string;
  birthdate?: string;
  portal_name?: string;
  portal_app?: string;
  website?: string;
  jjwg_maps_address_c?: string;
  jjwg_maps_geocode_status_c?: string;
  jjwg_maps_lat_c?: string;
  jjwg_maps_lng_c?: string;
}

// Our application's Lead interface - cleaned up version of the API response
interface Lead {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  title?: string;
  account_name?: string;
  email1?: string;
  email2?: string;
  phone_mobile?: string;
  phone_work?: string;
  phone_home?: string;
  phone_other?: string;
  phone_fax?: string;
  website?: string;
  lead_source?: string;
  lead_source_description?: string;
  status?: string;
  status_description?: string;
  description?: string;
  department?: string;
  primary_address_street?: string;
  primary_address_street_2?: string;
  primary_address_street_3?: string;
  primary_address_city?: string;
  primary_address_state?: string;
  primary_address_postalcode?: string;
  primary_address_country?: string;
  alt_address_street?: string;
  alt_address_city?: string;
  alt_address_state?: string;
  alt_address_postalcode?: string;
  alt_address_country?: string;
  assigned_user_name?: string;
  created_by_name?: string;
  modified_by_name?: string;
  date_entered?: string;
  date_modified?: string;
  converted?: string;
  salutation?: string;
  do_not_call?: string;
  email_opt_out?: string;
  invalid_email?: string;
  assistant?: string;
  assistant_phone?: string;
  refered_by?: string;
  reports_to_id?: string;
  report_to_name?: string;
  account_description?: string;
  contact_id?: string;
  account_id?: string;
  opportunity_id?: string;
  opportunity_name?: string;
  opportunity_amount?: string;
  campaign_id?: string;
  campaign_name?: string;
  birthdate?: string;
  portal_name?: string;
  portal_app?: string;
}

interface LeadInsight {
  id: string;
  title: string;
  content: string;
  category: 'engagement' | 'opportunity' | 'strategy' | 'priority';
  confidence: number;
}

// Authentication response interface
interface AuthTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
}

export type { Lead, LeadInsight, SuiteCRMLeadResponse, SuiteCRMLeadAttributes, AuthTokenResponse }; 