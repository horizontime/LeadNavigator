import Dexie from 'dexie';
import type { Lead, LeadInsight } from '../types/lead';

// Define the database schema
export interface LeadRecord extends Lead {
  id: string;
  lastUpdated: Date;
}

export interface InsightRecord extends LeadInsight {
  id: string;
  leadId: string;
  createdAt: Date;
}

export class LeadDatabase extends Dexie {
  leads!: Dexie.Table<LeadRecord, string>;
  insights!: Dexie.Table<InsightRecord, string>;

  constructor() {
    super('LeadNavigatorDB');
    
    this.version(1).stores({
      leads: 'id, first_name, last_name, account_name, status, lead_source, lastUpdated',
      insights: '++id, leadId, category, createdAt'
    });
  }

  // Store leads from API response
  async storeLeads(leads: Lead[]): Promise<void> {
    const leadRecords: LeadRecord[] = leads.map(lead => ({
      ...lead,
      lastUpdated: new Date()
    }));
    
    await this.leads.bulkPut(leadRecords);
  }

  // Get all leads from IndexedDB
  async getAllLeads(): Promise<Lead[]> {
    return await this.leads.toArray();
  }

  // Get a specific lead by ID
  async getLeadById(id: string): Promise<Lead | undefined> {
    return await this.leads.get(id);
  }

  // Store insights for a lead
  async storeInsights(leadId: string, insights: LeadInsight[]): Promise<void> {
    // First, delete existing insights for this lead
    await this.insights.where('leadId').equals(leadId).delete();
    
    // Then store new insights
    const insightRecords = insights.map(insight => ({
      title: insight.title,
      content: insight.content,
      category: insight.category,
      confidence: insight.confidence,
      leadId,
      createdAt: new Date()
    }));
    
    await this.insights.bulkAdd(insightRecords);
  }

  // Get insights for a specific lead
  async getInsightsForLead(leadId: string): Promise<LeadInsight[]> {
    const records = await this.insights.where('leadId').equals(leadId).toArray();
    return records.map(record => ({
      id: record.id.toString(),
      title: record.title,
      content: record.content,
      category: record.category,
      confidence: record.confidence
    }));
  }

  // Clear all data (useful for refresh)
  async clearAllData(): Promise<void> {
    await this.leads.clear();
    await this.insights.clear();
  }
}

// Create singleton instance
export const db = new LeadDatabase(); 