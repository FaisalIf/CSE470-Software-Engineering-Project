# Palate — Cooking Recipe Platform

## Deployment and SRS

Find the platform deployed at [Vercel App](https://cse-470-software-engineering-projec.vercel.app/)

Find the Software Requirements Specifications [here](https://drive.google.com/file/d/1nbw20FvrT9RbE1_v_12-lmfDL_vWQKoC/view?usp=sharing)

## Introduction

Palate is an engaging web platform that reimagines how food lovers discover, share, and curate recipes. By blending intuitive technology with a passion for culinary creativity, Palate connects home cooks, food enthusiasts, and aspiring chefs in a vibrant, easy-to-use digital recipe ecosystem. Explore, collect, and share your favorite dishes with Palate, where every recipe tells a different story.

## Project Summary

Palate is a modern web application designed to transform the way people interact with cooking and recipes online. With a clean, user-friendly interface, users can browse a diverse collection of recipes from various cuisines, contributed by a growing community of food lovers. The platform emphasizes simplicity and accessibility, offering straightforward registration and login, personalized user profiles, and the ability to create, edit, and save recipes. Each recipe features detailed instructions, ingredient lists, and nutritional information, making it easy for users to recreate dishes at home. Social features such as ratings, favorites, and recent views foster community engagement and help users discover trending and highly-rated recipes. Palate aims to make cooking inspiration accessible to everyone, without unnecessary complexity.

## Functional Requirements

- Recipe Search: Users can search for recipes by keywords (e.g., "pasta", "chicken") to quickly find relevant dishes.
- Trending Recipes: A section on the homepage or sidebar displays trending recipes, such as those with the most views or highest ratings.
- User-Submitted Recipes: Users can submit their own recipes, including fields for ingredients, instructions, preparation time, and images.
- Browse Users: Users can explore other users’ public profiles and discover their public recipe collections.
- Edit User Profile: Users can edit their profile information, including name, username, bio, and profile photo.
- Recipe Rating & Reviews: Users can rate recipes (e.g., 1-5 stars) and leave comments or reviews to help others choose what to cook.
- My Recipes (Edit/Delete): Users can view a list of their own recipes and edit details (including optional nutrition info) or delete recipes they own.
- Ingredient List Builder: Users can select multiple recipes, and the system compiles a consolidated shopping list of all required ingredients.
- Nutritional Information Display: Each recipe displays estimated nutritional information, such as calories, protein, fat, and carbohydrates.
- User Favorites/Bookmarks: Users can save their favorite recipes to a personal collection for quick access later.
- User Recipe Collections: Users can create and manage their own themed collections of recipes (e.g., "Weeknight Dinners", "Desserts for Parties").
- Automated Recipe Scaling: Users can adjust the number of servings for a recipe, and ingredient quantities are automatically recalculated.
- Recently Viewed Recipes: Users can see a list of recipes they have recently viewed for easy reference and quick access.

## Non-Functional Requirements

- Simplicity: The platform is designed for ease of use, with a straightforward interface and minimal setup.
- Accessibility: The website is accessible from any modern web browser and device.
- Performance: Recipe search, filtering, and navigation are responsive and fast for a smooth user experience.
- Portability: All configuration is included so anyone can clone and run the project without extra setup.
- Maintainability: The codebase is organized and documented for easy understanding and future extension.
- Reliability: The system should handle typical user actions without crashing or data loss.

## Architecture

This project follows the **MVC (Model-View-Controller)** pattern:

- **Models** (`src/models/`) - Database operations and business logic
- **Views** (`src/views/`) - React components for UI presentation
- **Controllers** (`src/controllers/`) - API request handlers and business logic coordination
- **Services** (`src/services/`) - Reusable business logic and external integrations

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: NextAuth.js (ready to implement)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (for PostgreSQL database)

### 1. Environment Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase database URL:

```env
DATABASE_URL="your_supabase_connection_string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create and apply database migrations
npx prisma migrate dev --name init
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

### Project structure notes

- `palate-recipe-app/src/app/` — Next.js App Router pages and layout
- `palate-recipe-app/src/components/` — shared UI components
- `palate-recipe-app/src/views/` — higher-level view components used by pages
- `palate-recipe-app/src/app/api/` — server routes for recipes, users, collections, favorites, ratings, recent-views
- `palate-recipe-app/prisma/` — schema and seed scripts
- `palate-recipe-app/src/lib/prisma.ts` — single shared Prisma client instance

### Developer tips & troubleshooting

- Prisma prepared statement errors (with PgBouncer): configure the pooling mode or use a PgBouncer-compatible connection string. Regenerate Prisma client with `npx prisma generate` after changing schema.
- Hydration errors caused by nested anchors: keep interactive controls (buttons, menus) outside anchor tags to avoid link-in-link issues.
- Dropdowns clipping: render dropdowns in a portal or ensure a high z-index and that parent containers don’t crop overflow.
- If the dev server fails to start, inspect the terminal for missing env variables or DB connection errors.
