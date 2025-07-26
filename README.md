# SuiteCRM AI Insights

A modern, mobile-first web application that integrates with SuiteCRM 8 to provide AI-powered sales insights for lead management.

## Features

- **Lead Lookup**: Search leads by ID or browse all available leads
- **Comprehensive Lead Information**: Display detailed lead data including contact info, company details, and descriptions
- **AI-Powered Insights**: Generate intelligent insights including:
  - Lead engagement level and next best actions
  - Cross-selling and upselling opportunities 
  - Geographic outreach strategies
  - Lead priority analysis
- **Mobile-First Design**: Responsive UI optimized for smartphones and tablets
- **Real-time Loading States**: Visual feedback during API calls and insight generation

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Custom CSS with mobile-first responsive design
- **Icons**: Lucide React
- **API Integration**: Axios for HTTP requests
- **AI Insights**: Custom analysis engine (extensible for OpenAI/Claude integration)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- SuiteCRM 8 instance (for production use)

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

3. (Optional) Configure environment variables:
```bash
# Create .env file for SuiteCRM connection
VITE_SUITECRM_URL=http://your-suitecrm-url/public/legacy/Api/V8
VITE_SUITECRM_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Demo Mode
The app includes mock data for demonstration purposes. Simply:

1. Enter any lead ID (e.g., "lead-003") in the search field
2. Click the search button or press Enter
3. Or click "Browse All Leads" to load a sample lead
4. View the lead information and AI-generated insights

### Production Setup

To connect to a real SuiteCRM 8 instance:

1. Set up your SuiteCRM 8 API credentials
2. Configure the environment variables
3. Update the API service to use actual endpoints instead of mock data
4. Implement authentication flow

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
