# Lead Navigator

A modern, mobile-first React application that integrates with SuiteCRM 8 to provide OpenAI-powered sales insights for lead management with offline-first data storage.


## ✨ Features

-  **🔗 Real-time SuiteCRM Integration**: Automatic OAuth2 authentication and data synchronization

-  **💾 Offline-First Architecture**: IndexedDB storage with Dexie.js for reliable data access

-  **🔍 Smart Lead Search**: Autocomplete search with real-time suggestions and browse all leads functionality

-  **📱 Mobile-First Design**: Responsive UI optimized for smartphones, tablets, and desktop

-  **🤖 AI-Powered Insights**: OpenAI GPT-4o-mini generates comprehensive lead intelligence:

-  **Engagement Analysis**: Activity level assessment and next best actions

-  **Opportunity Identification**: Cross-selling and upselling recommendations

-  **Strategic Guidance**: Geographic, timing, and approach strategies

-  **Priority Assessment**: Lead scoring and urgency evaluation

-  **Conversation Starters**: Personalized ice-breakers and opening lines

-  **Red Flags Detection**: Potential objections and risk analysis

- **⚡ Performance Optimized**: 
- Instant lead browsing from local storage

- Intelligent insights caching

- Background data synchronization

- Visual loading states and error handling

-  **📊 Data Management**: Automatic initialization, pagination, and persistent storage

-  **📱 QR Code Access**: Quick mobile device access via QR code

## 🛠 Tech Stack

-  **Frontend**: React 19 + TypeScript + Vite

-  **Database**: IndexedDB with Dexie.js for offline-first local storage

-  **Styling**: Custom CSS with mobile-first responsive design

-  **Icons**: Lucide React icon library

-  **HTTP Client**: Axios for API requests

-  **QR Generation**: react-qr-code for mobile access

-  **AI Integration**: OpenAI GPT-4o-mini for intelligent insights

-  **API Integration**: SuiteCRM 8 REST API with OAuth2 authentication


## 🚀 Getting Started

### Prerequisites
  

-  **Node.js 18+** and npm/yarn

-  **SuiteCRM 8** 

-  **OpenAI API key** for AI insights 


### Installation


1.  **Clone the repository:**

```bash

git  clone  <repository-url>

cd  LeadNavigator

```

2.  **Install dependencies:**

```bash

npm  install

```

3.  **Configure environment variables:**

```bash

# Create .env file in the project root

VITE_OPENAI_API_KEY=your_openai_api_key_here

```

4.  **Start the development server:**

```bash

npm  run  dev

```

5.  **Open your browser:** Navigate to `http://localhost:5173`

## 📱 Usage


### Application Workflow

**Automatic Initialization:**

- On first load, the app automatically authenticates with SuiteCRM

- Fetches all leads from the API and stores them in IndexedDB

- Shows initialization progress with visual feedback

- Subsequent loads use cached data for instant access

  
**Lead Discovery:**

1.  **Smart Search**:

- Type 2+ characters to get autocomplete suggestions

- Search by name, company, or other lead attributes

- Keyboard navigation support (up/down arrows, enter to select)


2.  **Browse All Leads**:

- Click "Browse All Leads" to view paginated lead list

- Mobile: Card-based responsive layout

- 10 leads per page with pagination controls


3.  **Lead Selection**:

- Click any lead to view comprehensive details

- Automatic AI insights generation (or retrieval from cache)

- Mobile-optimized lead information display


**AI Insights Generation:**

-  **Real-time Analysis**: When selecting a lead, AI insights are automatically generated

-  **6 Intelligence Categories**:

- 🎯 **Engagement**: Last activity analysis and follow-up recommendations

- 💰 **Opportunity**: Role-based cross-sell/upsell identification

- 🗺️ **Strategy**: Geographic and timing optimization

- ⚡ **Priority**: Multi-factor lead scoring and urgency

- 💬 **Conversation**: Personalized opening lines and ice-breakers

- 🚩 **Red Flags**: Objection prediction and risk assessment

-  **Performance**: Insights cached in IndexedDB to avoid regeneration

### Data Management
 

-  **🔄 Offline-First**: All leads stored locally for instant access

-  **🔄 Smart Sync**: Initial data fetch on first run, cached thereafter

-  **🔄 Persistent Cache**: AI insights stored to optimize API usage

-  **🔄 Data Refresh**: Clear browser storage to force fresh synchronization

## 🔧 SuiteCRM Integration

**API Endpoints:**

-  **Authentication**: `POST /Api/access_token` (OAuth2 client credentials)

-  **All Leads**: `GET /module/Leads` (bulk lead retrieval)

-  **Single Lead**: `GET /module/Leads/{id}` (individual lead lookup)

**Supported Lead Fields:**

- Contact information (name, email, phone, address)

- Company details (account name, website, department)

- Sales data (status, source, opportunity information)

- Activity tracking (dates, assignments, modifications)

- Custom SuiteCRM fields and relationships

## 🤖 AI Insights Engine

**OpenAI Integration:**

-  **Model**: GPT-4o-mini for cost-effective, high-quality analysis

-  **Prompt Engineering**: Structured prompts for consistent, actionable insights

-  **Data Analysis**: Comprehensive lead profile evaluation including:

- Contact information and role analysis

- Company and industry context

- Lead source and referral information

- Activity history and engagement patterns

- Geographic and demographic factors


**Insight Categories:**

1.  **Engagement**: Analyzes last activity, status changes, and recommends follow-up timing

2.  **Opportunity**: Reviews job titles, company info, and descriptions for sales opportunities

3.  **Strategy**: Provides geographic, timing, and approach recommendations

4.  **Priority**: Multi-factor scoring based on status, role, source, and details

5.  **Conversation**: Crafts personalized openers using lead context and referral information

6.  **Red Flags**: Predicts objections based on status history and source descriptions


## 📱 Mobile Optimization
  

-  **Progressive Enhancement**: Mobile-first design scaling to desktop

-  **Touch-Friendly**: Optimized tap targets and gesture support

-  **Responsive Layouts**: Adaptive grid systems and card layouts

-  **Performance**: Optimized for slower mobile connections

-  **QR Code Access**: Easy transition from desktop to mobile workflow
  

## 🔧 Available Scripts

  
-  `npm run dev` - Start development server with hot reload

-  `npm run build` - Build for production with TypeScript compilation

-  `npm run preview` - Preview production build locally

-  `npm run lint` - Run ESLint code analysis
 