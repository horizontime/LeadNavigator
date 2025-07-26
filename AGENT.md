# LeadNavigator - Agent Guide

## Commands
- **Build**: `npm run build` (TypeScript check + Vite build)
- **Dev**: `npm run dev` (Vite dev server on localhost:5173)
- **Lint**: `npm run lint` (ESLint check)
- **Preview**: `npm run preview` (Preview built app)

## Architecture
- **Frontend**: React 19 + TypeScript + Vite
- **API**: SuiteCRM 8 REST API integration (mock data for demo)
- **Structure**: `/src/components` (React components), `/src/services` (API/AI), `/src/types` (TypeScript types)
- **Key Files**: `suitecrmApi.ts` (SuiteCRM integration), `aiInsights.ts` (AI lead analysis), `lead.ts` (Lead types)

## Code Style
- **Imports**: Use `import type` for types, absolute imports from `../`
- **Components**: Functional components with TypeScript interfaces for props
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Types**: Explicit TypeScript interfaces, optional properties with `?`
- **Error Handling**: try/catch with console.error, throw descriptive Error messages
- **Export**: Named exports for utilities, default export for components

## Rules
- Follow Conventional Commits (from `.cursor/rules/git-commit.mdc`)
- Mobile-first responsive design
- Use Lucide React icons consistently
