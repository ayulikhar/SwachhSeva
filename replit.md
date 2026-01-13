# SwachhSeva - Smart Waste Report System

## Overview

SwachhSeva is an AI-powered smart waste monitoring and reporting platform designed for mobile-first experiences. The application enables citizens to photograph roadside waste, analyze it using AI (Google Gemini), and submit geo-tagged reports for municipal authorities. The system includes waste image analysis, report history tracking, map-based visualization of reported waste locations, and user profiles with impact dashboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom emerald/teal theme variables
- **Animations**: Framer Motion for page transitions and UI animations
- **Maps**: React-Leaflet with OpenStreetMap tiles for report visualization
- **Charts**: Recharts for impact dashboard in user profiles

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: REST endpoints with Zod schema validation
- **Build Tool**: Vite for frontend, esbuild for server bundling

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` with models split into `shared/models/`
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Session Management**: Express-session with PostgreSQL store
- **Protected Routes**: Middleware-based authentication checks

### AI Integration
- **Primary**: Google Gemini API for waste image analysis
- **Fallback**: Replit AI Integrations (provides Gemini-compatible API without personal API key)
- **Features**: 
  - Image analysis for waste categorization
  - Chat capabilities (conversation storage in DB)
  - Image generation support

### Key Design Patterns
- **Shared Types**: `shared/` directory contains schemas and types used by both frontend and backend
- **Route Definitions**: API contracts defined in `shared/routes.ts` with Zod validation
- **Integration Modules**: Server integrations organized in `server/replit_integrations/` (auth, chat, image, batch)
- **Storage Layer**: Database operations abstracted through storage classes

## External Dependencies

### Database
- **PostgreSQL**: Primary database (connection via `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and migrations

### AI Services
- **Google Gemini API**: Waste image analysis (`GEMINI_API_KEY` environment variable)
- **Replit AI Integrations**: Alternative Gemini access (`AI_INTEGRATIONS_GEMINI_API_KEY`, `AI_INTEGRATIONS_GEMINI_BASE_URL`)

### Authentication
- **Replit Auth**: OAuth/OIDC provider (`ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`)

### Mapping
- **OpenStreetMap**: Tile server for map visualization (no API key required)
- **Leaflet**: Client-side map rendering

### Key npm Packages
- `@google/genai`: Gemini AI SDK
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `react-leaflet` / `leaflet`: Map components
- `framer-motion`: Animations
- `recharts`: Charts for impact dashboard
- `passport` / `openid-client`: Authentication