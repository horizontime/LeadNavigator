import { useState } from 'react';
import Header from './components/Header';
import LeadLookup from './components/LeadLookup';
import LeadInfo from './components/LeadInfo';
import InsightsSection from './components/InsightsSection';
import type { Lead, LeadInsight } from './types/lead';
import { suiteCRMApi } from './services/suitecrmApi';
import { aiInsights } from './services/aiInsights';
import './App.css';

function App() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [insights, setInsights] = useState<LeadInsight[]>([]);
  const [isLoadingLead, setIsLoadingLead] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSearchLead = async (leadId: string) => {
    setIsLoadingLead(true);
    setIsLoadingInsights(false);
    setError('');
    setLead(null);
    setInsights([]);

    try {
      // For demo purposes, using mock data. In production, use actual API:
      // const leadData = await suiteCRMApi.getLeadById(leadId);
      const leadData = await suiteCRMApi.getMockLead(leadId);
      setLead(leadData);
      
      // Generate AI insights
      setIsLoadingInsights(true);
      const generatedInsights = await aiInsights.generateInsights(leadData);
      setInsights(generatedInsights);
      
    } catch (err) {
      setError('Failed to generate insights');
      console.error('Error:', err);
    } finally {
      setIsLoadingLead(false);
      setIsLoadingInsights(false);
    }
  };

  const handleBrowseLeads = () => {
    // For demo purposes, just search for a default lead
    handleSearchLead('lead-003');
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <LeadLookup 
            onSearchLead={handleSearchLead}
            onBrowseLeads={handleBrowseLeads}
            isLoading={isLoadingLead}
          />

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {isLoadingLead && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading lead information...</p>
            </div>
          )}

          {lead && (
            <>
              <LeadInfo lead={lead} />
              <InsightsSection 
                insights={insights}
                isLoading={isLoadingInsights}
                error={error}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
