import axios from 'axios';
import type { Lead, SuiteCRMLeadResponse, SuiteCRMLeadAttributes, AuthTokenResponse } from '../types/lead';

class SuiteCRMApi {
  private baseUrl: string;
  private accessTokenUrl: string;
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    // Base URLs from the user's examples
    this.baseUrl = 'http://localhost:18080/SuiteCRM-8.8.0/public/legacy/Api/V8';
    this.accessTokenUrl = 'http://localhost:18080/SuiteCRM-8.8.0/public/legacy/Api/access_token';
  }

  /**
   * Authenticate and get access token using client credentials
   */
  async authenticate(): Promise<void> {
    try {
      const response = await axios.post<AuthTokenResponse>(this.accessTokenUrl, {
        grant_type: 'client_credentials',
        client_id: 'e01902d6-d26a-4f7e-9496-6883b8548485',
        client_secret: 'ASecurePassword'
      });

      this.token = response.data.access_token;
      // Set token expiry (subtract 60 seconds for safety buffer)
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
      
      console.log('SuiteCRM authentication successful');
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Failed to authenticate with SuiteCRM');
    }
  }

  /**
   * Check if current token is valid
   */
  private isTokenValid(): boolean {
    return this.token !== null && 
           this.tokenExpiry !== null && 
           Date.now() < this.tokenExpiry;
  }

  /**
   * Ensure we have a valid token, authenticate if needed
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.isTokenValid()) {
      await this.authenticate();
    }
  }

  /**
   * Transform SuiteCRM API response to our Lead format
   */
  private transformLeadData(apiLead: { id: string; attributes: SuiteCRMLeadAttributes }): Lead {
    return {
      id: apiLead.id,
      name: apiLead.attributes.name,
      first_name: apiLead.attributes.first_name,
      last_name: apiLead.attributes.last_name,
      full_name: apiLead.attributes.full_name,
      title: apiLead.attributes.title,
      account_name: apiLead.attributes.account_name,
      email1: apiLead.attributes.email1,
      email2: apiLead.attributes.email2,
      phone_mobile: apiLead.attributes.phone_mobile,
      phone_work: apiLead.attributes.phone_work,
      phone_home: apiLead.attributes.phone_home,
      phone_other: apiLead.attributes.phone_other,
      phone_fax: apiLead.attributes.phone_fax,
      website: apiLead.attributes.website,
      lead_source: apiLead.attributes.lead_source,
      lead_source_description: apiLead.attributes.lead_source_description,
      status: apiLead.attributes.status,
      status_description: apiLead.attributes.status_description,
      description: apiLead.attributes.description,
      department: apiLead.attributes.department,
      primary_address_street: apiLead.attributes.primary_address_street,
      primary_address_street_2: apiLead.attributes.primary_address_street_2,
      primary_address_street_3: apiLead.attributes.primary_address_street_3,
      primary_address_city: apiLead.attributes.primary_address_city,
      primary_address_state: apiLead.attributes.primary_address_state,
      primary_address_postalcode: apiLead.attributes.primary_address_postalcode,
      primary_address_country: apiLead.attributes.primary_address_country,
      alt_address_street: apiLead.attributes.alt_address_street,
      alt_address_city: apiLead.attributes.alt_address_city,
      alt_address_state: apiLead.attributes.alt_address_state,
      alt_address_postalcode: apiLead.attributes.alt_address_postalcode,
      alt_address_country: apiLead.attributes.alt_address_country,
      assigned_user_name: apiLead.attributes.assigned_user_name,
      created_by_name: apiLead.attributes.created_by_name,
      modified_by_name: apiLead.attributes.modified_by_name,
      date_entered: apiLead.attributes.date_entered,
      date_modified: apiLead.attributes.date_modified,
      converted: apiLead.attributes.converted,
      salutation: apiLead.attributes.salutation,
      do_not_call: apiLead.attributes.do_not_call,
      email_opt_out: apiLead.attributes.email_opt_out,
      invalid_email: apiLead.attributes.invalid_email,
      assistant: apiLead.attributes.assistant,
      assistant_phone: apiLead.attributes.assistant_phone,
      refered_by: apiLead.attributes.refered_by,
      reports_to_id: apiLead.attributes.reports_to_id,
      report_to_name: apiLead.attributes.report_to_name,
      account_description: apiLead.attributes.account_description,
      contact_id: apiLead.attributes.contact_id,
      account_id: apiLead.attributes.account_id,
      opportunity_id: apiLead.attributes.opportunity_id,
      opportunity_name: apiLead.attributes.opportunity_name,
      opportunity_amount: apiLead.attributes.opportunity_amount,
      campaign_id: apiLead.attributes.campaign_id,
      campaign_name: apiLead.attributes.campaign_name,
      birthdate: apiLead.attributes.birthdate,
      portal_name: apiLead.attributes.portal_name,
      portal_app: apiLead.attributes.portal_app
    };
  }

  /**
   * Get a specific lead by ID
   */
  async getLeadById(leadId: string): Promise<Lead> {
    await this.ensureAuthenticated();

    try {
      const response = await axios.get<{ data: { id: string; attributes: SuiteCRMLeadAttributes } }>(
        `${this.baseUrl}/module/Leads/${leadId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.transformLeadData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch lead:', error);
      throw new Error(`Failed to fetch lead with ID: ${leadId}`);
    }
  }

  /**
   * Get all leads from SuiteCRM
   */
  async getAllLeads(): Promise<Lead[]> {
    await this.ensureAuthenticated();

    try {
      const response = await axios.get<SuiteCRMLeadResponse>(
        `${this.baseUrl}/module/Leads`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data.map(item => this.transformLeadData(item));
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      throw new Error('Failed to fetch leads from SuiteCRM');
    }
  }
}

export const suiteCRMApi = new SuiteCRMApi(); 