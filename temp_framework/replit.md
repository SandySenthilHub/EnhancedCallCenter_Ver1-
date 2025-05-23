# Enterprise Platform - Multi-Tenant SaaS Application

## Overview

This is a full-stack multi-tenant enterprise platform built with React, Express.js, and PostgreSQL. The application provides comprehensive management capabilities for entities, users, roles, transactions, and screen assets within a multi-tenant architecture. It features modern UI components, robust authentication via Replit Auth, and a scalable database design using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Middleware**: Custom logging, error handling, and authentication middleware
- **Session Management**: Express sessions with PostgreSQL storage

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migration Strategy**: Schema-first approach with Drizzle Kit
- **Connection**: Serverless connection pooling for scalability

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Strategy**: Passport.js with custom strategy implementation
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Security**: HTTP-only secure cookies with configurable TTL

### Multi-Tenancy
- **Isolation**: Tenant-based data separation at application level
- **User Context**: Current tenant tracking per user session
- **Role-Based Access**: Tenant-specific user roles and permissions
- **Data Scoping**: All queries scoped to current tenant context

### Entity Management
- **Schema**: Flexible entity definitions with custom attributes
- **CRUD Operations**: Full create, read, update, delete capabilities
- **Type Safety**: Schema validation using Zod and Drizzle
- **UI Components**: Modal-based forms for entity management

### User & Role Management
- **User Profiles**: Integration with Replit user data
- **Role Assignment**: Multi-tenant role assignments per user
- **Permission System**: Granular permissions for different operations
- **Avatar Support**: Profile image display and fallback handling

### Transaction System
- **Definitions**: Reusable transaction templates
- **Instances**: Execution records with status tracking
- **Status Management**: Pending, processing, completed, failed states
- **History Tracking**: Full audit trail of transaction executions

### Screen Assets
- **Types**: List, form, and detail screen configurations
- **Entity Binding**: Screens associated with specific entities
- **Layout Management**: Configurable screen layouts and components
- **Runtime Generation**: Dynamic screen generation from definitions

## Data Flow

### Authentication Flow
1. User initiates login via Replit Auth
2. OpenID Connect handshake with Replit
3. User profile creation/update in local database
4. Session establishment with tenant context
5. Redirect to application dashboard

### Request Processing Flow
1. Client requests pass through authentication middleware
2. Tenant context extracted from user session
3. Database queries automatically scoped to tenant
4. Response data filtered and formatted
5. Error handling with structured responses

### State Management Flow
1. TanStack Query manages server state caching
2. Optimistic updates for improved UX
3. Background refetching for data freshness
4. Error boundaries for graceful failure handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Accessible UI primitive components
- **passport**: Authentication middleware
- **express-session**: Session management

### Development Dependencies
- **typescript**: Type checking and compilation
- **vite**: Build tool and development server
- **tailwindcss**: Utility-first CSS framework
- **tsx**: TypeScript execution for Node.js

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tools integration

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React app to static assets
2. **Backend Build**: ESBuild bundles Node.js server
3. **Asset Generation**: Static files output to dist/public
4. **Server Bundle**: Single-file server executable

### Environment Configuration
- **Development**: Hot reloading with Vite middleware
- **Production**: Optimized builds with asset compression
- **Database**: Environment-based connection strings
- **Sessions**: Configurable session secrets and TTL

### Replit Deployment
- **Autoscale Target**: Configured for automatic scaling
- **Port Configuration**: External port 80 mapping to internal 5000
- **Environment Variables**: Database URL and session secrets
- **Health Checks**: Application readiness monitoring

### Database Management
- **Schema Deployment**: Drizzle migrations for schema changes
- **Connection Pooling**: Serverless-optimized connection management
- **Backup Strategy**: Neon-managed automated backups
- **Monitoring**: Connection and query performance tracking

The application follows a modern, scalable architecture suitable for enterprise use cases while maintaining developer productivity through type safety, hot reloading, and comprehensive tooling integration.