import { useState } from 'react';
import Header from './components/Header';
import LeadLookup from './components/LeadLookup';
import AllLeads from './components/AllLeads';
import LeadInfo from './components/LeadInfo';
import InsightsSection from './components/InsightsSection';
import type { Lead, LeadInsight } from './types/lead';
import { suiteCRMApi } from './services/suitecrmApi';
import { aiInsights } from './services/aiInsights';
import './App.css';

function App() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [insights, setInsights] = useState<LeadInsight[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showAllLeads, setShowAllLeads] = useState(false);
  const [isLoadingLead, setIsLoadingLead] = useState(false);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSearchLead = async (leadId: string) => {
    setIsLoadingLead(true);
    setIsLoadingInsights(false);
    setError('');
    setLead(null);
    setInsights([]);
    setShowAllLeads(false); // Hide leads table when searching

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

  const handleBrowseLeads = async () => {
    setIsLoadingLeads(true);
    setError('');
    setLead(null);
    setInsights([]);
    setShowAllLeads(true);

    try {
      // For demo purposes, using mock data. In production, use actual API:
      // const leadsData = await suiteCRMApi.getAllLeads();
      const leadsData = await suiteCRMApi.getMockLeads();
      setLeads(leadsData);
    } catch (err) {
      setError('Failed to load leads');
      console.error('Error:', err);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const handleSelectLead = async (selectedLead: Lead) => {
    setIsLoadingInsights(true);
    setError('');
    setLead(selectedLead);
    setInsights([]);
    setShowAllLeads(false); // Hide leads table when a lead is selected

    try {
      // Generate AI insights for selected lead
      const generatedInsights = await aiInsights.generateInsights(selectedLead);
      setInsights(generatedInsights);
    } catch (err) {
      setError('Failed to generate insights');
      console.error('Error:', err);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleHideTable = () => {
    setShowAllLeads(false);
    setLeads([]);
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <LeadLookup 
            onSearchLead={handleSearchLead}
            onBrowseLeads={handleBrowseLeads}
            isLoading={isLoadingLead || isLoadingLeads}
          />

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {showAllLeads && (
            <AllLeads 
              leads={leads}
              onSelectLead={handleSelectLead}
              onHideTable={handleHideTable}
              isLoading={isLoadingLeads}
            />
          )}

          {isLoadingLead && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading lead information...</p>
            </div>
          )}

          {lead && !showAllLeads && (
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
