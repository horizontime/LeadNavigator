import { useState, useEffect } from 'react';
import Header from './components/Header';
import LeadLookup from './components/LeadLookup';
import AllLeads from './components/AllLeads';
import LeadInfo from './components/LeadInfo';
import InsightsSection from './components/InsightsSection';
import type { Lead, LeadInsight } from './types/lead';
import { dataService } from './services/dataService';
import './App.css';

function App() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [insights, setInsights] = useState<LeadInsight[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showAllLeads, setShowAllLeads] = useState(false);
  const [isLoadingLead, setIsLoadingLead] = useState(false);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string>('');

  // Initialize the app when it loads
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsInitializing(true);
        setError('');
        
        // Initialize the data service (fetch from API and store in IndexedDB)
        await dataService.initializeApp();
        
        console.log('Application initialized successfully');
      } catch (err) {
        console.error('Failed to initialize application:', err);
        setError('Failed to initialize application. Please check your SuiteCRM connection.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  const handleSearchLead = async (selectedLead: Lead) => {
    setIsLoadingInsights(false);
    setError('');
    setLead(selectedLead);
    setInsights([]);
    setShowAllLeads(false); // Hide leads table when searching

    try {
      // Generate/retrieve AI insights for the selected lead
      setIsLoadingInsights(true);
      const generatedInsights = await dataService.getOrGenerateInsights(selectedLead);
      setInsights(generatedInsights);
      
    } catch (err) {
      setError('Failed to generate insights');
      console.error('Error:', err);
    } finally {
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
      // Get all leads from IndexedDB
      const leadsData = await dataService.getAllLeads();
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
      // Generate/retrieve AI insights for selected lead
      const generatedInsights = await dataService.getOrGenerateInsights(selectedLead);
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

  // Show initialization screen while app is starting up
  if (isInitializing) {
    return (
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <div className="initialization-container">
              <div className="loading-spinner"></div>
              <p>Initializing Lead Navigator...</p>
              <p className="initialization-detail">Connecting to SuiteCRM and setting up local storage</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
