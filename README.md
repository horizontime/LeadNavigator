# Lead Navigator

A modern, mobile-first web application that integrates with SuiteCRM 8 to provide OpenAI-powered sales insights for lead management with offline-first data storage.

## Features

- **Real-time SuiteCRM Integration**: Automatic authentication and data synchronization
- **Offline-First Architecture**: IndexedDB storage with Dexie.js for reliable data access
- **Lead Lookup**: Search leads by ID or browse all available leads
- **Comprehensive Lead Information**: Display detailed lead data including contact info, company details, and descriptions
- **OpenAI-Powered Insights**: Generate intelligent insights using GPT-4o-mini including:
  - Lead engagement level and next best actions
  - Cross-selling and upselling opportunities 
  - Geographic outreach strategies
  - Lead priority analysis
- **Mobile-First Design**: Responsive UI optimized for smartphones and tablets
- **Real-time Loading States**: Visual feedback during API calls and insight generation
- **Data Persistence**: Automatic storage and retrieval from IndexedDB for optimal performance

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Database**: IndexedDB with Dexie.js for local data storage
- **Styling**: Custom CSS with mobile-first responsive design
- **Icons**: Lucide React
- **API Integration**: Axios for HTTP requests
- **AI Insights**: OpenAI GPT-4o-mini integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- SuiteCRM 8 instance running on localhost:18080
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LeadNavigator
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create .env file in the project root
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. Ensure SuiteCRM 8 is running on the expected URL:
   - Base URL: `http://localhost:18080/SuiteCRM-8.8.0/public/legacy/Api/V8`
   - Token URL: `http://localhost:18080/SuiteCRM-8.8.0/public/legacy/Api/access_token`
   - Client ID: `e01902d6-d26a-4f7e-9496-6883b8548485`
   - Client Secret: `ASecurePassword`

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Usage

### Application Flow

The application follows an automatic data synchronization flow:

1. **Initialization**: On first load, the app automatically:
   - Authenticates with SuiteCRM using client credentials
   - Fetches all leads from the SuiteCRM API
   - Stores lead data in IndexedDB for offline access
   - Shows initialization progress to the user

2. **Lead Browsing**: 
   - Click "Browse All Leads" to view all synchronized leads
   - Data is loaded from IndexedDB for instant access
   - Select any lead to view detailed information

3. **Lead Search**:
   - Enter a specific lead ID to search
   - App first checks IndexedDB, then fallback to API if needed
   - Search results display immediately from local storage

4. **AI Insights Generation**:
   - When viewing a lead, AI insights are automatically generated using OpenAI GPT-4o-mini
   - Insights are stored in IndexedDB to avoid regeneration
   - Four categories of insights: engagement, opportunity, strategy, priority

### Data Management

- **Offline-First**: All data is stored locally in IndexedDB for fast access
- **Real-time Sync**: Initial sync on app load, with API fallbacks for missing data
- **Persistent Insights**: AI-generated insights are cached to optimize OpenAI API usage
- **Automatic Refresh**: Clear browser storage to force a fresh data sync

## SuiteCRM Integration

The app is designed to work with SuiteCRM 8's REST API. Key integration points:

- **Authentication**: OAuth2 token-based authentication
- **Lead Retrieval**: GET `/module/Leads/{id}` and `/module/Leads`
- **Field Mapping**: Supports standard SuiteCRM lead fields including contact info, addresses, and custom fields

## AI Insights

The AI insights engine analyzes lead data to provide:

### Engagement Level Analysis
- Analyzes last activity dates and lead status
- Suggests appropriate follow-up actions
- Prioritizes leads based on engagement recency

### Opportunity Identification  
- Reviews job titles for decision-making authority
- Analyzes descriptions for specific needs
- Suggests relevant products/services based on industry

### Geographic Strategy
- Identifies optimal contact times based on location
- Suggests time zone considerations
- Recommends local market approaches

### Priority Scoring
- Weighs multiple factors (status, title, source, details)
- Assigns priority levels (High/Medium/Low)
- Provides actionable next steps

## Customization

### Extending AI Insights
Add new insight types by extending the `AIInsightsService` class:

```typescript
// In src/services/aiInsights.ts
private analyzeCustomInsight(lead: Lead): LeadInsight | null {
  // Your custom analysis logic
  return {
    id: 'custom-1',
    title: 'Custom Insight',
    content: 'Your insight content',
    category: 'custom',
    confidence: 0.8,
  };
}
```

### Styling Customization
The app uses CSS custom properties for easy theming. Key variables are defined in `src/App.css`.

## Mobile Optimization

- Progressive enhancement from mobile to desktop
- Touch-friendly interface elements
- Optimized loading states for slower connections
- Responsive grid layouts for insights display

## Browser Support

- Chrome 80+
- Firefox 80+
- Safari 14+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license information here]

## Support

For questions or issues, please [create an issue](link-to-issues) or contact the development team.
