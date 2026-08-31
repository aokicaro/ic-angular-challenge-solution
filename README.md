# Product Catalog Challenge

## Task

Build a Product Catalog Single Page Application (SPA) for browsing and managing products. You will use the **Fake Store API** https://fakestoreapi.com/ as your data source.

### Requirements:

- **Overview Page:** Implement an overview page that displays a list of products with their title, image, price, and a truncated description.
- **Detail Page:** Implement a product detail page that shows the complete product information (full description, category, ratings, etc.).
- **Product Creation:** Create a form to simulate adding a new product to the catalog.
- **Best Practices:** Consider UX best practices, accessibility, and web semantics. It doesn't have to look incredibly fancy, but it should be clean and highly usable.
- **Getting Started:** Use the pre-configured `@ngneat/query` setup to manage your API state efficiently.

---

## What We Look For

This challenge is not about racing to finish every single requirement; it's about showing us how you work, how you think, and what you value as an engineer. **Please invest no more than 2 to 3 hours of your time.**

Please organize, design, test, and document your solution the way you normally would in a production environment. We understand that this timeline requires trade-offs.

The use of AI is mandatory, but the ownership of every technical decision is yours.

### Documentation Requirement:

Please use the bottom of this README to document:

- Your technical trade-offs and the rationale behind your choices.
- What you would do differently, or what you would focus on next if you had more time (e.g., specific architectural improvements, edge-case testing, advanced UI features).

---

## Submission

Clone this repo and send us the link to your repository when you are finished. This should be completed at least **24 hours before your scheduled interview**. We will walk through your codebase and discuss your solution together during the interview.

---

## Helpful Links

- [Fake Store API Docs](https://fakestoreapi.com/docs)
- [@ngneat/query Documentation](https://github.com/ngneat/query)
- [Angular Documentation](https://angular.dev/)

---

## Development & Tooling

This project was generated using Angular CLI version 21.2.11.

### Development Server

To start a local development server, run:

```bash
ng serve
```

---

## Solution Overview

The implemented catalog covers the three main user journeys requested by the challenge:

- Browse a responsive product overview with images, titles, prices, ratings, and truncated descriptions.
- Open a product details page with its complete description, category, price, and rating information.
- Submit a validated product creation form and see the result returned by the Fake Store API.

The interface also includes loading skeletons, empty states, recoverable error states, invalid-product handling, responsive layouts, keyboard focus styles, reduced-motion support, and semantic status announcements.

## Running the Solution

Install the exact dependency versions recorded in the lockfile:

```bash
npm ci
```

Start the development server:

```bash
npm start
```

Then open `http://localhost:4200`.

Run the unit test suite once:

```bash
npm test -- --watch=false
```

Create a production build:

```bash
npm run build
```

## Architecture and Technical Decisions

### Feature-focused organization

All catalog code is colocated under `src/app/products`. The feature contains its API access, models, product card, overview, details, and creation form. This keeps related code close together without adding generic `core`, `shared`, or `features` layers before the application actually needs them.

### Standalone and lazy-loaded Angular components

The application uses standalone components and lazy-loaded route components. This follows the current Angular model while keeping each user journey independently organized and avoiding NgModule boilerplate.

### Server state with `@ngneat/query`

Product lists and individual products are handled as server state through `@ngneat/query`. Queries expose explicit pending, error, empty/not-found, and success states. Successful reads remain fresh for five minutes, and failed reads retry once. Product creation uses a mutation rather than duplicating request state inside the component.

### HTTP and domain types

HTTP calls are isolated in `ProductApiService`. API responses use strict TypeScript models, and product creation has separate input and response types because the POST request does not contain an ID while the simulated response does.

### Reactive and accessible form handling

The creation flow uses a typed reactive form with required, length, numeric, category, and URL validation. Validation messages are associated with their fields through ARIA attributes, submission states are announced, and controls remain usable with a keyboard.

### Styling without a component library

The interface uses component-scoped SCSS and a small set of global design tokens. Avoiding a UI dependency reduced setup time and bundle overhead while still allowing a consistent responsive design and visible focus states.

### Testing approach

Unit tests focus on behavior at the boundaries of the solution:

- HTTP methods, endpoints, request bodies, and responses.
- Product card rendering, accessible images, and details navigation.
- Overview loading, success, empty, error, and retry states.
- Details loading, success, not-found, error, and retry states.
- Creation form validation, successful submission, and API failure.

API calls are mocked in component tests, and each query or mutation suite receives an isolated `QueryClient`.

## Trade-offs

- The Fake Store API simulates product creation but does not persist it. The UI communicates this limitation and intentionally does not insert the returned product into the list cache, because navigating to that product later would return no persisted resource.
- The API base URL is kept in the product service for this small exercise. A production application would move it to environment/runtime configuration.
- The overview loads the complete small API catalog. Pagination, filtering, sorting, and search were left out to prioritize the required journeys within the time limit.
- Route titles are descriptive but static. A production details route could update the document title with the loaded product name.
- The test suite covers components and HTTP integration boundaries, but it does not include browser-level E2E, automated accessibility, or visual-regression tests.
- The UI uses remote product images as provided by the API. A production catalog would add image fallbacks, dimensions from trusted metadata, and an image optimization strategy.

## What I Would Do Next

With more time, I would prioritize:

1. Add Playwright user-journey tests and automated accessibility checks.
2. Add search, category filtering, sorting, and URL-backed filter state.
3. Add pagination or virtual scrolling for a larger real-world catalog.
4. Add an image fallback and more resilient, user-friendly API error mapping.
5. Move runtime configuration into environments and introduce request logging/observability.
6. Use reactive route parameters and product-specific document titles if navigation between detail pages is introduced.
7. Add visual-regression coverage for responsive layouts and loading/error states.

## AI Usage

AI was used as a development assistant to explore implementation options, review architectural trade-offs, identify edge cases, and suggest test scenarios. The resulting decisions, code organization, behavior, and final validation remained under the engineer's review and ownership.
