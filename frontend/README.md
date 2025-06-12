<<<<<<< HEAD
# AI Novel Assistant

Full MVC backend with Express, Sequelize (SQLite), and structured API routes.
=======
# AI Novel Assistant Frontend

## Overview
This project is a modern, scalable frontend for an AI Novel Assistant web app, built with React, Vite, TypeScript, and Tailwind CSS. It features a design system, reusable component library, responsive layout, authentication UI, API integration, and global state management.

---

## Project Structure
```
ai-novel-assistant/
├── src/
│   ├── components/      # Reusable UI components (see ui/ for design system)
│   │   └── ui/          # Button, Input, Card, Modal, etc.
│   ├── pages/           # Route-level pages (Login, Register, Dashboard, StoryEditor)
│   ├── context/         # React context providers (Auth, Theme)
│   ├── services/        # API and utility services
│   ├── styles/          # Global/custom styles
│   ├── App.tsx          # Main app with routing and navigation
│   ├── main.tsx         # Entry point, wraps app in providers
│   └── index.css        # Tailwind CSS entry
├── public/
├── .gitignore
├── package.json
├── tailwind.config.js   # Design tokens: colors, fonts, spacing, etc.
├── postcss.config.js
└── vite.config.ts
```

---

## Design System
- **Colors, fonts, spacing, border radius, font sizes** are defined in `tailwind.config.js`.
- Use Tailwind utility classes (e.g. `bg-primary`, `font-heading`, `rounded-lg`, `text-2xl`).
- Extend the design system by editing `tailwind.config.js`.

---

## Component Library
- All reusable UI components are in `src/components/ui/`.
- Example usage:
  ```tsx
  import Button from '../components/ui/Button';
  <Button variant="primary">Click Me</Button>
  ```
- Components are themeable and mobile-first.

---

## Routing & Navigation
- Routing is handled by React Router DOM in `App.tsx`.
- Navigation bar is mobile-friendly and highlights the active page.

---

## State Management
- **AuthContext**: Handles authentication state, login/logout, loading, and error.
- **ThemeContext**: Handles global theme (light/dark) and toggle.
- Wrap your app in both providers (see `main.tsx`).
- Use `useAuth()` and `useTheme()` hooks in components.

---

## Authentication UI
- Login and Register forms use Card, Input, and Button components.
- Forms show loading and error states, and are ready to connect to real APIs.

---

## API Integration
- All API calls are in `src/services/api.ts`.
- Example endpoints: `loginApi`, `fetchUser`, `fetchStories`.
- Replace `/api/...` URLs with your backend endpoints.

---

## Responsive Layout
- Layout is mobile-first, with a modern header, sidebar, and content area.
- Theme toggle is in the header.
- All pages are responsive and visually consistent.

---

## Onboarding for Developers (@Douglas Otieno and others)
1. **Clone the repo and install dependencies:**
   ```bash
   git clone <repo-url>
   cd ai-novel-assistant
   npm install
   npm run dev
   ```
2. **Explore the folder structure and component library.**
3. **Use and extend the design system via Tailwind config.**
4. **Add new UI components to `components/ui/` and pages to `pages/`.**
5. **Connect to real backend APIs by updating `api.ts` and AuthContext.**
6. **Ask for help or review this README for guidance!**

---

## Success Criteria
- Responsive design works on all devices
- Component library is consistent and reusable
- Navigation is intuitive
- Authentication forms connect to backend APIs
- Codebase is modular and ready for scalable development
>>>>>>> 56e719e (initial front end commit with the frontend structure plus wireframes)
