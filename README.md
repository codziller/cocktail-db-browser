# Cocktail DB Browser

A web application for discovering cocktails by ingredient using The CocktailDB API.

**Live Demo:** https://cocktail-db-browser.vercel.app/

## Features

- **Search by Ingredient**: Find cocktails containing specific ingredients (e.g., vodka, lemon, mint)
- **Browse by Type**: Explore all cocktails filtered by Alcoholic or Non-Alcoholic
- **Smart Search Suggestions**: When no results are found, the app suggests popular ingredients with quick-action buttons to help users discover cocktails
- **Drinks Gallery**: Responsive grid layout with drink images and badges
- **Cocktail Details**: Complete recipes with ingredients, measurements, instructions, and glass types
- **Ingredient Details**: Ingredient information and list of cocktails using that ingredient

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **React 19**: UI library with hooks
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety and better developer experience
- **Chakra UI v2**: Component library for consistent, accessible design
- **React Query**: Server state management with caching and automatic refetching
- **React Router v7**: Client-side routing
- **Native Fetch API**: Used instead of Axios to keep dependencies minimal for this project size

## Architecture

```
src/
├── api/           # CocktailDB API integration with response normalization
├── components/    # Reusable UI components (DrinkCard, DrinksGrid)
├── pages/         # Route-level components (Home, CocktailDetail, IngredientDetail)
├── theme/         # Chakra UI theme customization
└── types/         # TypeScript type definitions
```

### Key Decisions

- **Separated Search and Browse UX**: The CocktailDB API has distinct endpoints for searching by ingredient (`/filter.php?i=`) and filtering by alcoholic type (`/filter.php?a=`). These parameters cannot be combined in a single request. To provide clear UX and avoid user confusion, I implemented a tabbed interface that explicitly separates "Search by Ingredient" from "Browse by Type", making it clear these are independent operations rather than combinable filters.

- **Native Fetch API**: Used the browser's native `fetch` instead of Axios to minimize bundle size and dependencies. For this project's scope, `fetch` provides sufficient functionality. Axios would be beneficial for larger projects requiring interceptors, automatic request cancellation, or more complex error handling.

- **React Query for API State**: Handles data fetching, caching, loading states, and error handling automatically, eliminating the need for manual state management of API responses.

- **Type-safe API Layer**: All API responses are typed with TypeScript interfaces, including edge case handling where the API returns `{"drinks": "no data found"}` instead of null.

- **Chakra UI v2**: Provides accessible, pre-built components with consistent theming, reducing development time while maintaining professional appearance.

### Trade-offs

- **Single API service file**: Kept all API methods in one file for simplicity given the small API surface area
- **Minimal custom components**: Leveraged Chakra UI's built-in components extensively to accelerate development
- **No local state persistence**: Search history is not persisted across sessions
- **Limited error recovery**: Network errors require manual retry rather than automatic retry with exponential backoff

## Improvements with More Time

- Add search suggestions/autocomplete for ingredients
- Implement favorites/bookmarks with local storage
- Add animation transitions between routes
- Include unit and integration tests
- Add error boundaries for better error handling
- Implement pagination or infinite scroll for large result sets
- Add ability to search by cocktail name in addition to ingredient
- Use custom color scheme that matches the brand logo colors for better visual consistency
