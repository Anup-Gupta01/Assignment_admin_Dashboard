# Frontend Technical Assessment

This is a [Next.js](https://nextjs.org) frontend dashboard project built as part of a technical assessment. The application uses [Material UI](https://mui.com), [Zustand](https://zustand-demo.pmnd.rs), and the [DummyJSON API](https://dummyjson.com) to create a responsive admin dashboard with authentication, users management, and products management features.

---

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Features

### Authentication
- Admin login using DummyJSON auth API
- Protected dashboard routes
- Zustand-based auth state management
- Token persistence using localStorage

### Users Module
- Users listing page
- Search users
- API-side pagination
- Responsive MUI table/card layout
- Single user detail page

### Products Module
- Products listing page
- Search products
- Category filter dropdown
- API-side pagination
- Responsive product grid
- Single product detail page with images and details

### Performance Optimization
- React.memo for reusable components
- useMemo and useCallback optimization
- Client-side caching using Zustand/localStorage
- API-side pagination to avoid unnecessary large data loads

---

## Tech Stack

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Material UI](https://mui.com)
- [Zustand](https://zustand-demo.pmnd.rs)
- [DummyJSON API](https://dummyjson.com)

---

## API Endpoints Used

### Authentication

```bash
POST https://dummyjson.com/auth/login
```

### Users APIs

```bash
GET https://dummyjson.com/users?limit=10&skip=0
GET https://dummyjson.com/users/search?q=...
GET https://dummyjson.com/users/{id}
```

### Products APIs

```bash
GET https://dummyjson.com/products?limit=10&skip=0
GET https://dummyjson.com/products/search?q=...
GET https://dummyjson.com/products/category/{category}
GET https://dummyjson.com/products/{id}
```

---

## Project Structure

```bash
src/
├── app/
│   ├── login/
│   ├── dashboard/
│   ├── users/
│   └── products/
│
├── components/
│   ├── common/
│   ├── users/
│   └── products/
│
├── store/
│   ├── authStore.js
│   ├── userStore.js
│   └── productStore.js
│
├── services/
│   └── api.js
│
├── hooks/
├── utils/
└── styles/
```

---

## Why Zustand?

Zustand was chosen because:
- lightweight and easy to use
- minimal boilerplate
- simple async state management
- better suited for small to medium-sized applications
- clean integration with React and Next.js

---

## Caching Strategy

The application uses client-side caching with Zustand and localStorage.

### Why caching?
Caching helps:
- reduce repeated API calls
- improve performance
- create smoother navigation between pages

### Implemented Strategy
- users/products list data stored in Zustand
- optional localStorage persistence
- cached data reused before triggering new API requests

---

## Responsive Design

The application is fully responsive for:
- Desktop
- Tablet
- Mobile devices

Material UI Grid, Stack, and responsive utilities were used to ensure a clean responsive layout.

---

## Future Improvements

Possible enhancements:
- Dark mode support
- Better loading skeletons
- Debounced search
- Unit testing
- Improved error handling
- Server-side authentication handling

---

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [Zustand Documentation](https://zustand.docs.pmnd.rs)

---

## Deploy on Vercel

The easiest way to deploy this app is by using the [Vercel Platform](https://vercel.com/new).

For more details, check the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
