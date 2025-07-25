# Replit.md

## Overview

This is a full-stack web application built with React, TypeScript, and Express.js. The project uses a modern tech stack with Vite for frontend development, shadcn/ui for the component library, Drizzle ORM for database management, and TanStack Query for state management. The application follows a monorepo structure with shared schemas and types between frontend and backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and caching

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Storage**: PostgreSQL sessions with connect-pg-simple
- **Development**: Hot reloading with tsx

### Database Strategy
- **Primary Database**: PostgreSQL (configured for Neon Database)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema migrations
- **Current Storage**: In-memory storage implementation (MemStorage) as fallback

## Key Components

### Shared Schema (`shared/schema.ts`)
- Centralized database schema definitions using Drizzle
- Zod validation schemas for type safety
- User model with id, username, and password fields

### Frontend Components
- **UI Components**: Comprehensive set of shadcn/ui components (buttons, forms, dialogs, etc.)
- **Pages**: Home page with feature showcase and 404 not-found page
- **Hooks**: Custom hooks for mobile detection and toast notifications
- **Query Client**: Configured TanStack Query client with custom fetch functions

### Backend Services
- **Storage Interface**: Abstract storage interface with in-memory implementation
- **Routes**: Express route registration system
- **Vite Integration**: Development server with HMR and production static serving

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **Server Processing**: Express.js handles requests and interacts with storage layer
3. **Database Operations**: Drizzle ORM manages database interactions
4. **Response Handling**: Data flows back through the same chain with proper error handling

## External Dependencies

### Frontend Dependencies
- React ecosystem (React 18, React DOM)
- Radix UI primitives for accessible components
- TanStack Query for server state management
- Wouter for routing
- Tailwind CSS for styling
- Various utility libraries (clsx, date-fns, etc.)

### Backend Dependencies
- Express.js for web framework
- Drizzle ORM and Drizzle Kit for database management
- Neon Database serverless driver
- Session management with connect-pg-simple
- Development tools (tsx, esbuild)

### Development Tools
- TypeScript for type safety
- Vite for frontend tooling
- ESLint and Prettier (implied by setup)
- Replit-specific plugins for development environment

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- Express server with tsx for hot reloading
- Development-specific Vite plugins for Replit integration

### Production Build
- Vite builds optimized frontend bundle to `dist/public`
- esbuild compiles backend TypeScript to `dist/index.js`
- Static file serving integrated with Express server

### Environment Configuration
- Database URL configuration via environment variables
- Separate development and production modes
- Replit-specific deployment optimizations

### Database Setup
- Drizzle migrations managed via `db:push` command
- PostgreSQL connection configured for Neon Database
- Session storage persisted to database in production

The application is designed to be easily deployable on Replit with minimal configuration, supporting both development and production environments seamlessly.