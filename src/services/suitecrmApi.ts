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

  // Mock method for development - returns multiple leads
  async getMockLeads(): Promise<Lead[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: 'lead-001',
        first_name: 'John',
        last_name: 'Smith',
        title: 'IT Director',
        account_name: 'TechCorp Solutions',
        email1: 'j.smith@techcorp.com',
        phone_mobile: '+1-555-0123',
        phone_work: '+1-555-0123',
        website: 'https://techcorp.com',
        lead_source: 'Website',
        status: 'New',
        description: 'Looking for cloud migration solutions for enterprise infrastructure.',
        department: 'Information Technology',
        primary_address_city: 'San Francisco',
        primary_address_state: 'California',
        primary_address_country: 'USA',
        date_entered: '2024-01-25T09:00:00Z',
        date_modified: '2024-01-25T09:00:00Z',
      },
      {
        id: 'lead-002',
        first_name: 'Sarah',
        last_name: 'Johnson',
        title: 'Operations Manager',
        account_name: 'Manufacturing Plus',
        email1: 's.johnson@mfgplus.com',
        phone_mobile: '+1-555-0234',
        phone_work: '+1-555-0234',
        website: 'https://manufacturingplus.com',
        lead_source: 'Trade Show',
        status: 'Qualified',
        description: 'Interested in supply chain optimization and inventory management systems.',
        department: 'Operations',
        primary_address_city: 'Chicago',
        primary_address_state: 'Illinois',
        primary_address_country: 'USA',
        date_entered: '2024-01-20T14:30:00Z',
        date_modified: '2024-01-23T16:45:00Z',
      },
      {
        id: 'lead-003',
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
      },
      {
        id: 'lead-004',
        first_name: 'Emily',
        last_name: 'Rodriguez',
        title: 'Chief Information Officer',
        account_name: 'Retail Solutions Co',
        email1: 'e.rodriguez@retailsolutions.com',
        phone_mobile: '+1-555-0456',
        phone_work: '+1-555-0456',
        website: 'https://retailsolutions.com',
        lead_source: 'Cold Call',
        status: 'New',
        description: 'Evaluating CRM and customer analytics platforms for multi-location retail chain.',
        department: 'Information Technology',
        primary_address_city: 'New York',
        primary_address_state: 'New York',
        primary_address_country: 'USA',
        date_entered: '2024-01-28T11:15:00Z',
        date_modified: '2024-01-28T11:15:00Z',
      },
      {
        id: 'lead-005',
        first_name: 'David',
        last_name: 'Wilson',
        title: 'IT Manager',
        account_name: 'Healthcare Systems Ltd',
        email1: 'd.wilson@healthcaresys.com',
        phone_mobile: '+1-555-0567',
        phone_work: '+1-555-0567',
        website: 'https://healthcaresystems.com',
        lead_source: 'LinkedIn',
        status: 'Qualified',
        description: 'Seeking HIPAA-compliant data management and patient record systems.',
        department: 'Information Technology',
        primary_address_city: 'Boston',
        primary_address_state: 'Massachusetts',
        primary_address_country: 'USA',
        date_entered: '2024-01-18T13:20:00Z',
        date_modified: '2024-01-22T10:30:00Z',
      },
    ];
  }

  // Mock method for development - returns single lead by ID
  async getMockLead(leadId: string): Promise<Lead> {
    const leads = await this.getMockLeads();
    const lead = leads.find(l => l.id === leadId);
    
    if (lead) {
      return lead;
    }
    
    // Return default lead if not found
    return leads[2]; // Michael Chen as default
  }
}

export const suiteCRMApi = new SuiteCRMApi(); 