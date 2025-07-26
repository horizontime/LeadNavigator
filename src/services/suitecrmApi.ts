import axios from 'axios';
import type { Lead } from '../types/lead';

class SuiteCRMApi {
  private baseUrl: string;
  private apiKey: string;
  private token: string | null = null;

  constructor() {
    // These should be set via environment variables in production
    this.baseUrl = import.meta.env.VITE_SUITECRM_URL || 'http://localhost/suitecrm/public/legacy/Api/V8';
    this.apiKey = import.meta.env.VITE_SUITECRM_API_KEY || '';
  }

  async authenticate(username: string, password: string): Promise<void> {
    try {
      const response = await axios.post(`${this.baseUrl}/oauth2/token`, {
        grant_type: 'password',
        client_id: this.apiKey,
        username,
        password,
      });
      this.token = response.data.access_token;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Failed to authenticate with SuiteCRM');
    }
  }

  async getLeadById(leadId: string): Promise<Lead> {
    try {
      const response = await axios.get(`${this.baseUrl}/module/Leads/${leadId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.data.attributes;
    } catch (error) {
      console.error('Failed to fetch lead:', error);
      throw new Error('Failed to fetch lead data');
    }
  }

  async getAllLeads(limit = 20): Promise<Lead[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/module/Leads`, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        params: {
          'page[size]': limit,
        },
      });
      return response.data.data.map((item: any) => ({
        id: item.id,
        ...item.attributes,
      }));
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      throw new Error('Failed to fetch leads data');
    }
  }

  // Mock method for development - replace with actual API call
  async getMockLead(leadId: string): Promise<Lead> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: leadId,
      first_name: 'Michael',
      last_name: 'Chen',
      title: 'VP of Technology',
      account_name: 'Global Logistics Inc',
      email1: 'm.chen@globallogistics.com',
      phone_mobile: '+1-555-0345',
      phone_work: '+1-555-0345',
      website: 'https://globallogistics.com',
      lead_source: 'Referral',
      status: 'Contacted',
      description: 'Needs warehouse management system integration with existing ERP.',
      department: 'Technology',
      primary_address_city: 'Dallas',
      primary_address_state: 'Texas',
      primary_address_country: 'USA',
      date_entered: '2024-01-15T10:30:00Z',
      date_modified: '2024-01-20T14:45:00Z',
    };
  }
}

export const suiteCRMApi = new SuiteCRMApi(); 