import { suiteCRMApi } from './suitecrmApi';
import { aiInsights } from './aiInsights';
import { db } from './database';
import type { Lead, LeadInsight } from '../types/lead';

export class DataService {
  private isInitialized = false;

  /**
   * Initialize the application data flow
   * This will be called when the app loads
   */
  async initializeApp(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('Initializing application data...');
      
      // Step 1 & 2: Authenticate and fetch leads from SuiteCRM
      console.log('Fetching leads from SuiteCRM...');
      const leads = await suiteCRMApi.getAllLeads();
      console.log(`Fetched ${leads.length} leads from SuiteCRM`);

      // Step 3: Store leads in IndexedDB
      console.log('Storing leads in IndexedDB...');
      await db.storeLeads(leads);
      console.log('Leads stored successfully in IndexedDB');

      this.isInitialized = true;
      console.log('Application data initialization complete');
    } catch (error) {
      console.error('Failed to initialize application data:', error);
      throw new Error('Application initialization failed. Please check your SuiteCRM connection.');
    }
  }

  /**
   * Get all leads from IndexedDB
   * If no leads in IndexedDB, try to fetch from API
   */
  async getAllLeads(): Promise<Lead[]> {
    try {
      let leads = await db.getAllLeads();
      
      // If no leads in IndexedDB, initialize the app
      if (leads.length === 0) {
        console.log('No leads found in IndexedDB, initializing...');
        await this.initializeApp();
        leads = await db.getAllLeads();
      }
      
      return leads;
    } catch (error) {
      console.error('Failed to get leads:', error);
      throw new Error('Failed to retrieve leads data');
    }
  }

  /**
   * Get a specific lead by ID from IndexedDB
   * If not found, try to fetch from API
   */
  async getLeadById(leadId: string): Promise<Lead | null> {
    try {
      let lead = await db.getLeadById(leadId);
      
      // If lead not found in IndexedDB, try to fetch from API
      if (!lead) {
        console.log(`Lead ${leadId} not found in IndexedDB, fetching from API...`);
        try {
          lead = await suiteCRMApi.getLeadById(leadId);
          if (lead) {
            // Store the newly fetched lead in IndexedDB
            await db.storeLeads([lead]);
          }
        } catch (apiError) {
          console.warn('Failed to fetch lead from API:', apiError);
          return null;
        }
      }
      
      return lead || null;
    } catch (error) {
      console.error('Failed to get lead by ID:', error);
      throw new Error(`Failed to retrieve lead with ID: ${leadId}`);
    }
  }

  /**
   * Generate and store AI insights for a lead
   */
  async generateInsightsForLead(lead: Lead): Promise<LeadInsight[]> {
    try {
      console.log(`Generating AI insights for lead: ${lead.id}`);
      
      // Step 4: Generate AI insights using OpenAI
      const insights = await aiInsights.generateInsights(lead);
      console.log(`Generated ${insights.length} insights for lead ${lead.id}`);
      
      // Step 5: Store insights in IndexedDB
      await db.storeInsights(lead.id, insights);
      console.log(`Stored insights for lead ${lead.id} in IndexedDB`);
      
      return insights;
    } catch (error) {
      console.error('Failed to generate insights for lead:', error);
      throw new Error('Failed to generate AI insights');
    }
  }

  /**
   * Get stored insights for a lead from IndexedDB
   */
  async getInsightsForLead(leadId: string): Promise<LeadInsight[]> {
    try {
      const insights = await db.getInsightsForLead(leadId);
      return insights;
    } catch (error) {
      console.error('Failed to get insights for lead:', error);
      throw new Error(`Failed to retrieve insights for lead: ${leadId}`);
    }
  }

  /**
   * Get insights for a lead, generating them if they don't exist
   */
  async getOrGenerateInsights(lead: Lead): Promise<LeadInsight[]> {
    try {
      // First try to get existing insights
      let insights = await this.getInsightsForLead(lead.id);
      
      // If no insights exist, generate them
      if (insights.length === 0) {
        console.log(`No existing insights found for lead ${lead.id}, generating new ones...`);
        insights = await this.generateInsightsForLead(lead);
      }
      
      return insights;
    } catch (error) {
      console.error('Failed to get or generate insights:', error);
      throw new Error('Failed to retrieve AI insights');
    }
  }

  /**
   * Refresh all data from the API
   * This will clear IndexedDB and re-fetch everything
   */
  async refreshAllData(): Promise<void> {
    try {
      console.log('Refreshing all data from SuiteCRM...');
      
      // Clear existing data
      await db.clearAllData();
      
      // Reset initialization flag
      this.isInitialized = false;
      
      // Re-initialize
      await this.initializeApp();
      
      console.log('Data refresh complete');
    } catch (error) {
      console.error('Failed to refresh data:', error);
      throw new Error('Failed to refresh application data');
    }
  }

  /**
   * Check if the app has been initialized
   */
  isAppInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Search leads by name, company, or email
   */
  async searchLeads(query: string): Promise<Lead[]> {
    try {
      const allLeads = await this.getAllLeads();
      const lowercaseQuery = query.toLowerCase();
      
      return allLeads.filter(lead => {
        const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.toLowerCase();
        const company = (lead.account_name || '').toLowerCase();
        const email = (lead.email1 || '').toLowerCase();
        
        return fullName.includes(lowercaseQuery) || 
               company.includes(lowercaseQuery) || 
               email.includes(lowercaseQuery);
      });
    } catch (error) {
      console.error('Failed to search leads:', error);
      throw new Error('Failed to search leads');
    }
  }

  /**
   * Get data statistics
   */
  async getDataStats(): Promise<{ totalLeads: number; totalInsights: number }> {
    try {
      const leads = await db.getAllLeads();
      const allInsights = await Promise.all(
        leads.map(lead => db.getInsightsForLead(lead.id))
      );
      const totalInsights = allInsights.reduce((total, insights) => total + insights.length, 0);
      
      return {
        totalLeads: leads.length,
        totalInsights
      };
    } catch (error) {
      console.error('Failed to get data stats:', error);
      return { totalLeads: 0, totalInsights: 0 };
    }
  }
}

// Create singleton instance
export const dataService = new DataService(); 