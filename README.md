# Admin Panel — Frontend Assessment

A Next.js admin dashboard built with Material UI and Zustand. Covers user management and product browsing, backed by the DummyJSON public API.

---

## Tech Stack

| Tool | Role |
|---|---|
| Next.js 16 (App Router) | Framework |
| TypeScript | Language |
| Material UI v6 | UI components |
| Zustand | Client state management |
| use-debounce | Search input debouncing |
| DummyJSON | Mock API |

---

## Getting Started

### 1. Install dependencies

```bash
cd admin-panel
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Build for production

```bash
npm run build
npm start
```

---

## Environment Variables

This project uses no private API keys. DummyJSON is a public API with no authentication required for read endpoints.

The only environment-sensitive value is the API base URL. If you need to override it (e.g. to proxy through your own backend), create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE=https://dummyjson.com
```

By default, the app hardcodes the DummyJSON base URL directly in the Zustand stores. This is acceptable for an assessment project — in production you'd centralise it through an env variable.

---

## Login Credentials

The app uses DummyJSON's auth endpoint. Use any valid DummyJSON user, for example:

```
Username: dummy
Password: dummypass
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — MUI theme, Inter font
│   ├── page.tsx                # Redirects / → /dashboard
│   ├── login/page.tsx          # Login form
│   └── dashboard/
│       ├── layout.tsx          # Auth guard, AppBar, nav links
│       ├── page.tsx            # Dashboard home
│       ├── users/
│       │   ├── page.tsx        # Users table with search + pagination
│       │   └── [id]/page.tsx   # User detail page
│       └── products/
│           ├── page.tsx        # Products grid with search, category filter, pagination
│           └── [id]/page.tsx   # Product detail with image carousel + specs
├── store/
│   ├── authStore.ts            # Auth: login, logout, localStorage persistence
│   ├── usersStore.ts           # Users: list, search, pagination
│   └── productsStore.ts        # Products: list, search, category, caching, single product
├── components/
│   ├── MuiProvider.tsx         # Client-side ThemeProvider wrapper
│   └── ProductCard.tsx         # Memoized product grid card
└── hooks/
    └── useRequireAuth.ts       # Auth redirect hook (guard also lives in dashboard layout)
```

---

## Why Zustand

Zustand was chosen over Redux or React Context for a few practical reasons:

- **Minimal boilerplate** — stores are plain functions, no actions/reducers/selectors split required
- **Async-friendly** — async actions live directly in the store, no middleware like redux-thunk needed
- **Outside-React access** — `useProductsStore.getState()` and `useProductsStore.setState()` work outside components, which made it easy to call `setState` directly in the rows-per-page handler
- **Selective subscriptions** — `useStore((s) => s.value)` means components only re-render when the slice they care about changes
- **Small bundle** — under 1kb gzipped, appropriate for a client-heavy app that already ships MUI

---

## Caching Strategy

### Products list (in-memory, Zustand)

Results from the products list API are cached in a `listCache` map inside the Zustand products store. The cache key encodes the page, page size, search query, and category:

```
p:0|s:12|q:phone|c:
```

**Why**: When a user navigates to page 2, then back to page 1, or changes filters and resets to defaults, the already-fetched data is returned immediately from the cache without a network request. This avoids a visible loading spinner for data the user has already seen in the same session.

**Why not localStorage**: Product data changes frequently enough that persisting across sessions risks showing stale data. In-memory cache is cleared on page refresh, which is the right trade-off here.

**Why not SWR/React Query**: This is an assessment project using Zustand. Adding a separate data-fetching library would introduce redundancy. The manual cache is simple, explicit, and shows understanding of the problem without pulling in another dependency.

### Auth (localStorage)

The auth token and user info are stored in `localStorage` so users stay logged in across page refreshes. This mirrors how most real apps handle JWT sessions without a backend session store.

---

## Performance Notes

- **`React.memo`** on `ProductCard` — prevents every card in the grid from re-rendering when the parent's pagination state changes (e.g. page number updates)
- **`useCallback`** on `handleCategoryChange` and `handlePageChange` in the products page — keeps references stable so they don't trigger child re-renders unnecessarily
- **`useMemo`** for `totalPages` — minor, but avoids recalculating `Math.ceil(total / pageSize)` on every render
- **Debounced search** — 400ms debounce on both search inputs prevents flooding the API with requests on every keystroke
- **Server-side pagination** — `limit` and `skip` are sent to the API, so only the current page of data is transferred and rendered
