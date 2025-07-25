# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Admin Monitor Suite (AMS)** - an Angular 12.2.11 web application for accessibility monitoring and administration. It provides comprehensive tools for managing website accessibility evaluations, user administration, and compliance reporting.

## Common Development Commands

### Development Server
```bash
npm start
# Uses NODE_OPTIONS=--openssl-legacy-provider due to legacy OpenSSL requirements
# Serves on http://localhost:4200/
```

### Building
```bash
# Development build with base href for deployment
npm run build:dev

# Production build  
npm run build:prod

# Manual Angular build
ng build --configuration production --build-optimizer
```

### Testing and Quality
```bash
# Unit tests
npm test

# Run specific test (example: accessibility statement service)
npm run test:aStatement

# Linting
npm run lint

# End-to-end tests
npm run e2e

# Build with bundle analysis
npm run build:stats
```

### Admin Management
```bash
# Database admin utility for user management
node admin.js
# Options: 1=Create admin, 2=Change password, 3=Remove admin
```

## Architecture Overview

### Core Structure
- **Angular 12.x** with TypeScript
- **Angular Material** for UI components
- **MySQL** database with Node.js admin utility
- **Multi-environment** deployment (DEV/PPR/PRD)

### Key Service Architecture

#### Configuration & Environment Management
- **ConfigService**: Dynamic API endpoint configuration based on environment detection
- **Environment Detection**: Automatic switching between localhost, preprod, and production
- **API Base**: Defaults to `/api` with localStorage override capability

#### Authentication System
- **AuthInterceptor**: Automatic Bearer token injection for all HTTP requests
- **UserService**: Session management with 24-hour token expiration
- **Token Storage**: `AMS-SSID` in localStorage for session persistence

#### Core Services Pattern
All services follow a consistent pattern with robust error handling:

- **GetService**: Comprehensive data retrieval with pagination, search, and error retry (3 attempts)
  - Timeout handling for large datasets (30s timeout)
  - Structured response mapping and validation
  - Fallback to `null` or empty arrays on error
- **CreateService**: Entity creation (Users, Websites, Pages, Tags, Entities, Directories)
- **UpdateService**: Entity updates and accessibility statement management
- **DeleteService**: Single and bulk deletion operations
- **EvaluationService**: Complex accessibility evaluation processing and export (CSV/EARL)
- **CrawlerService**: Website crawling and URL discovery functionality
- **VerifyService**: Data validation and verification operations

### API Response Format
All API responses follow this structure:
```typescript
{
  success: number;  // 1 = success, other = error codes
  message: string;
  errors: any;
  result: any;
}
```

### Main Domain Entities
- **Users/GovUsers**: Admin and government user management
- **Entities**: Government organizations
- **Websites**: Monitored websites for accessibility
- **Pages**: Individual web pages under evaluation
- **Tags**: Grouping and categorization
- **Evaluations**: Accessibility assessment results
- **AccessibilityStatements**: Compliance documentation

### Key Features
- **Multi-Monitor Support**: AMS Observatory, MyMonitor, StudyMonitor, AccessMonitor
- **Crawling System**: Automated website discovery and evaluation
- **Internationalization**: English and Portuguese language support
- **Data Export**: CSV and EARL format exports for evaluations
- **Real-time Updates**: Socket.io integration for live data

## Development Notes

### Error Handling
- **AdminError** class for structured error management
- **Retry Logic**: Services automatically retry failed requests 3 times
- **Fallback Strategy**: Services return `null` or empty arrays on error

### Environment Configuration
- Development: `localhost` and local development
- Pre-production: `preprod.acessibilidade.gov.pt`
- Production: `acessibilidade.gov.pt`

### Database Configuration
- Requires `../monitor_db.json` config file for admin utility
- MySQL database with bcrypt password hashing
- Admin user type identified as "nimda"

### Build Requirements
- **Node.js** with legacy OpenSSL provider flags
- **Angular CLI** for development and build operations
- **Base href** modification required for deployment (`/ams/` for dev builds)

### Testing
- **Karma + Jasmine** for unit tests with custom matchers
- **Protractor** for end-to-end tests
- **Test Isolation**: Individual test runs available (e.g., `npm run test:aStatement`)
- Configuration files: `karma.conf.js`, `protractor.conf.js`
- **Coverage**: Tests include service layer, components, and integration scenarios

## Key Development Patterns

### Component Architecture
- **Modular Design**: Feature-based component organization under `/pages/`
- **Dialog System**: Extensive use of Angular Material dialogs for modals and forms
- **Shared Components**: Global reusable components in `/global/` (loading, error handling, plots)
- **Layout Components**: Header, footer, and navigation components with responsive design

### Routing Strategy
- **Guard-Protected Routes**: All admin routes protected by `AdminAuthGuard`
- **Nested Routes**: Complex navigation hierarchy with nested child routes
- **Dynamic Parameters**: Route parameters for entities (user, website, page, tag, directory)
- **Breadcrumb Navigation**: Automatic breadcrumb generation for current route context

### State Management
- **Service-Based State**: No external state management library; uses Angular services
- **BehaviorSubject Pattern**: For reactive state updates and environment detection
- **Local Storage**: Session persistence and server endpoint configuration
- **HTTP Caching**: Built-in retry mechanisms and error recovery

### UI/UX Patterns
- **Angular Material**: Consistent Material Design components throughout
- **Responsive Design**: Flex layout for mobile and desktop compatibility
- **Internationalization**: English and Portuguese language support via ngx-translate
- **Data Tables**: Paginated tables with sorting, filtering, and export capabilities
- **Progress Indicators**: Loading states and progress gauges for long-running operations