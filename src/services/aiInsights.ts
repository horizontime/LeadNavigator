import type { Lead, LeadInsight } from '../types/lead';

class AIInsightsService {
  private openaiApiKey: string;
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file');
    }
  }

  async generateInsights(lead: Lead): Promise<LeadInsight[]> {
    if (!this.openaiApiKey) {
      console.warn('No OpenAI API key available, falling back to mock insights');
      return this.generateMockInsights(lead);
    }

    try {
      const prompt = this.buildPrompt(lead);
      const response = await this.callOpenAI(prompt);
      return this.parseInsightsFromResponse(response);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
      // Fallback to mock insights if OpenAI fails
      return this.generateMockInsights(lead);
    }
  }

  private buildPrompt(lead: Lead): string {
    const leadData = {
      name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
      title: lead.title,
      company: lead.account_name,
      email: lead.email1,
      phone: lead.phone_mobile || lead.phone_work,
      website: lead.website,
      leadSource: lead.lead_source,
      status: lead.status,
      description: lead.description,
      department: lead.department,
      location: `${lead.primary_address_city || ''}, ${lead.primary_address_state || ''}, ${lead.primary_address_country || ''}`.replace(/^,\s*|,\s*$/g, ''),
      dateEntered: lead.date_entered,
      dateModified: lead.date_modified
    };

    return `You are an expert sales analyst. Analyze the following lead information and provide exactly 4 specific, actionable insights in JSON format.

Lead Information:
- Name: ${leadData.name}
- Title: ${leadData.title || 'Not specified'}
- Company: ${leadData.company || 'Not specified'}
- Email: ${leadData.email || 'Not specified'}
- Phone: ${leadData.phone || 'Not specified'}
- Website: ${leadData.website || 'Not specified'}
- Lead Source: ${leadData.leadSource || 'Not specified'}
- Status: ${leadData.status || 'Not specified'}
- Description: ${leadData.description || 'Not specified'}
- Department: ${leadData.department || 'Not specified'}
- Location: ${leadData.location || 'Not specified'}
- Date Entered: ${leadData.dateEntered || 'Not specified'}
- Last Modified: ${leadData.dateModified || 'Not specified'}

Generate exactly 4 insights with the following categories:
1. "engagement" - Analyze engagement level and recommend next action
2. "opportunity" - Identify cross-selling/upselling opportunities based on role and needs
3. "strategy" - Provide geographic, timing, or approach strategy recommendations
4. "priority" - Assess lead priority and urgency level

Return the response as a JSON array with this exact format:
[
  {
    "id": "engagement-1",
    "title": "Lead Engagement Level & Next Action",
    "content": "Specific analysis and recommended action...",
    "category": "engagement",
    "confidence": 0.85
  },
  {
    "id": "opportunity-1", 
    "title": "Cross-selling & Upselling Opportunities",
    "content": "Specific opportunities based on role and stated needs...",
    "category": "opportunity",
    "confidence": 0.8
  },
  {
    "id": "strategy-1",
    "title": "Outreach Strategy Recommendation", 
    "content": "Strategic approach recommendations...",
    "category": "strategy",
    "confidence": 0.8
  },
  {
    "id": "priority-1",
    "title": "Lead Priority Assessment",
    "content": "Priority level and reasoning...",
    "category": "priority", 
    "confidence": 0.85
  }
]

Confidence should be between 0.5 and 1.0. Make insights specific, actionable, and relevant to the lead data provided. Do not include any text outside the JSON array.`;
  }

  private async callOpenAI(prompt: string): Promise<string> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return data.choices[0].message.content;
  }

  private parseInsightsFromResponse(response: string): LeadInsight[] {
    try {
      // Clean the response - remove any potential markdown formatting
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const insights = JSON.parse(cleanedResponse);
      
      if (!Array.isArray(insights)) {
        throw new Error('Response is not an array');
      }

      // Validate insights structure
      const validInsights = insights.filter(insight => 
        insight.id && 
        insight.title && 
        insight.content && 
        insight.category && 
        typeof insight.confidence === 'number'
      );

      if (validInsights.length === 0) {
        throw new Error('No valid insights found in response');
      }

      return validInsights;
    } catch (error) {
      console.error('Failed to parse insights from OpenAI response:', error);
      console.error('Raw response:', response);
      throw new Error('Failed to parse AI insights response');
    }
  }

  // Fallback mock insights method
  private generateMockInsights(lead: Lead): LeadInsight[] {
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