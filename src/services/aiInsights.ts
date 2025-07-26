import type { Lead, LeadInsight } from '../types/lead';

class AIInsightsService {
  async generateInsights(lead: Lead): Promise<LeadInsight[]> {
    // In production, this would call an actual AI service (OpenAI, Claude, etc.)
    // For now, we'll generate insights based on the lead data
    const insights: LeadInsight[] = [];

    // Engagement Level Analysis
    const engagementInsight = this.analyzeEngagementLevel(lead);
    if (engagementInsight) insights.push(engagementInsight);

    // Cross-selling/Upselling Opportunities
    const opportunityInsight = this.analyzeCrossSellOpportunities(lead);
    if (opportunityInsight) insights.push(opportunityInsight);

    // Geographic Strategy
    const geoInsight = this.analyzeGeographicStrategy(lead);
    if (geoInsight) insights.push(geoInsight);

    // Lead Priority
    const priorityInsight = this.analyzePriority(lead);
    if (priorityInsight) insights.push(priorityInsight);

    return insights;
  }

  private analyzeEngagementLevel(lead: Lead): LeadInsight | null {
    const lastModified = lead.date_modified ? new Date(lead.date_modified) : null;
    const daysSinceModified = lastModified ? 
      Math.floor((Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24)) : null;

    let content = '';
    let confidence = 0.8;

    if (daysSinceModified === null) {
      content = 'No recent activity data available. Consider reaching out to re-establish contact.';
    } else if (daysSinceModified < 3) {
      content = `This lead was recently active (${daysSinceModified} days ago) with status "${lead.status}". High engagement potential - prioritize immediate follow-up with a discovery call.`;
      confidence = 0.9;
    } else if (daysSinceModified < 14) {
      content = `Moderate engagement - last activity ${daysSinceModified} days ago. Consider sending a personalized email to re-engage and schedule a call.`;
    } else {
      content = `Cold lead - ${daysSinceModified} days since last activity. Implement a re-engagement campaign with valuable content before direct outreach.`;
      confidence = 0.7;
    }

    return {
      id: 'engagement-1',
      title: 'Lead Engagement Level & Next Action',
      content,
      category: 'engagement',
      confidence,
    };
  }

  private analyzeCrossSellOpportunities(lead: Lead): LeadInsight | null {
    const title = lead.title?.toLowerCase() || '';
    const description = lead.description?.toLowerCase() || '';
    const accountName = lead.account_name?.toLowerCase() || '';

    let opportunities: string[] = [];
    let confidence = 0.7;

    // Analyze title for decision-making authority
    if (title.includes('vp') || title.includes('director') || title.includes('manager')) {
      opportunities.push('High decision-making authority - good candidate for premium solutions');
      confidence = 0.85;
    }

    // Analyze description for specific needs
    if (description.includes('warehouse') || description.includes('inventory')) {
      opportunities.push('Supply chain optimization modules, inventory analytics dashboard');
    }
    if (description.includes('erp') || description.includes('integration')) {
      opportunities.push('API integration services, custom connector development');
    }
    if (description.includes('management') || description.includes('system')) {
      opportunities.push('Advanced reporting suite, workflow automation tools');
    }

    // Industry analysis
    if (accountName.includes('logistics') || accountName.includes('shipping')) {
      opportunities.push('Transportation management system, route optimization tools');
    }

    if (opportunities.length === 0) {
      return null;
    }

    return {
      id: 'opportunity-1',
      title: 'Cross-selling & Upselling Opportunities',
      content: `Based on their role and stated needs: ${opportunities.join('. ')}`,
      category: 'opportunity',
      confidence,
    };
  }

  private analyzeGeographicStrategy(lead: Lead): LeadInsight | null {
    const city = lead.primary_address_city;
    const state = lead.primary_address_state;
    const country = lead.primary_address_country;

    if (!city && !state && !country) {
      return null;
    }

    let timeZone = 'EST';
    let bestCallTime = '9 AM - 4 PM EST';

    // Simple timezone mapping
    if (state === 'California' || state === 'Washington' || state === 'Oregon') {
      timeZone = 'PST';
      bestCallTime = '9 AM - 4 PM PST';
    } else if (state === 'Texas' || state === 'Colorado' || state === 'Arizona') {
      timeZone = 'CST/MST';
      bestCallTime = '9 AM - 4 PM local time';
    }

    const location = [city, state, country].filter(Boolean).join(', ');

    return {
      id: 'strategy-1',
      title: 'Geographic Outreach Strategy',
      content: `Lead located in ${location}. Optimal contact window: ${bestCallTime}. Consider referencing local market conditions or similar clients in the region to build rapport.`,
      category: 'strategy',
      confidence: 0.8,
    };
  }

  private analyzePriority(lead: Lead): LeadInsight | null {
    let priorityScore = 0;
    const factors: string[] = [];

    // Status weight
    if (lead.status === 'New') {
      priorityScore += 3;
      factors.push('New lead (high urgency)');
    } else if (lead.status === 'Contacted') {
      priorityScore += 2;
      factors.push('Recently contacted');
    }

    // Title weight
    if (lead.title?.match(/(vp|vice president|director|head)/i)) {
      priorityScore += 2;
      factors.push('Senior decision maker');
    }

    // Referral source weight
    if (lead.lead_source === 'Referral') {
      priorityScore += 2;
      factors.push('Referral source (higher conversion)');
    }

    // Description detail weight
    if (lead.description && lead.description.length > 50) {
      priorityScore += 1;
      factors.push('Detailed requirements provided');
    }

    let priority = 'Medium';
    if (priorityScore >= 5) priority = 'High';
    else if (priorityScore <= 2) priority = 'Low';

    return {
      id: 'priority-1',
      title: `Lead Priority: ${priority}`,
      content: `Priority factors: ${factors.join(', ')}. ${priority === 'High' ? 'Schedule immediate follow-up.' : priority === 'Medium' ? 'Follow up within 2-3 days.' : 'Add to nurture campaign.'}`,
      category: 'priority',
      confidence: 0.85,
    };
  }
}

export const aiInsights = new AIInsightsService(); 