# Palate: A Cooking Recipe Media Platform

Palate is a comprehensive cooking recipe platform where users can discover, share, and manage their favorite dishes. Built with Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL following the **MVC (Model-View-Controller)** architectural pattern.

## Features

### Core Features

1. **Recipe Search** - Search recipes by keywords, ingredients, cuisine, or difficulty
2. **Trending Recipes** - Discover popular and trending recipes on homepage
3. AI Recipe Assistant Chatbot - Minimized chat on homepage (bottom-right) that asks user preferences and suggests recipes.
4. **Browse Users** - Discover other users and view their public profiles and collections
5. **User-Submitted Recipes** - Allow users to submit recipes with ingredients, instructions, and prep time
6. **Edit User Profile** - Update your name, username, bio, and photo
7. **Recipe Rating & Reviews** - Users can rate recipes (1-5 stars) and leave reviews
8. **My Recipes** - See your own recipes, with options to edit (including nutrition) or delete
9. **Ingredient List Builder** - Generate consolidated shopping lists from multiple recipes
10. **Nutritional Information** - Display estimated nutritional information for each recipe
11. **User Favorites/Bookmarks** - Save favorite recipes to personal collections
12. **User Recipe Collections** - Create themed collections (e.g., "Weeknight Dinners")
13. **Automated Recipe Scaling** - Adjust ingredient quantities based on servings; choose 1x, 2x, 3x, or 4x of the base servings
14. **Recently Viewed Recipes** - Track and display recently viewed recipes

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
- **AI**: LangChain + Groq (Llama 3.1 8B Instant)
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
GROQ_API_KEY="your_groq_api_key"
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

Homepage AI Assistant:

- Chat icon is minimized at bottom-right.
- Click to open.
- Prompts user preferences and returns recipe suggestions.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
