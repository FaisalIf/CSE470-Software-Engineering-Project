<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Palate Recipe Platform - Copilot Instructions

## Architecture
This project follows the **MVC (Model-View-Controller)** pattern:
- **Models** (`src/models/`) - Database operations using Prisma ORM
- **Views** (`src/views/`) - React components for UI presentation  
- **Controllers** (`src/controllers/`) - API request handlers and business logic
- **Services** (`src/services/`) - Reusable business logic

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Prisma ORM with PostgreSQL (Supabase)
- Lucide React icons

## Code Style Guidelines
- Use TypeScript for all files
- Follow the existing MVC structure when adding new features
- Use Prisma for all database operations
- Import types from `@/types` for consistency
- Use proper error handling in controllers
- Create responsive components with Tailwind CSS
- Follow Next.js 14 App Router conventions

## Database
- Use Prisma schema in `prisma/schema.prisma`
- All models follow the existing naming conventions
- Use the shared Prisma client from `@/lib/prisma`

## API Routes
- Place routes in `src/app/api/` following REST conventions
- Use controllers from `src/controllers/` for business logic
- Return consistent JSON responses with `success` boolean

## Components
- Create reusable View components in `src/views/`
- Use Tailwind CSS for styling
- Make components responsive and accessible
- Import icons from `lucide-react`

## Features to Support
The platform includes recipe search, user favorites, collections, ratings, shopping lists, recipe scaling, and nutrition information. When suggesting new features, consider how they fit into the existing MVC structure.
