# styles/

This folder is for global and custom styles.

- Place Tailwind config extensions, custom CSS, and theme files here.
- Keep style logic separate from components and pages.

// This structure supports scalable and maintainable styling.

# Global Responsive Container Utility

Use the following class for main page wrappers to ensure mobile-first, responsive layouts:

```
responsive-container: w-full max-w-lg mx-auto p-4 md:p-8
```

- Use on the main div of each page (Dashboard, Editor, Login, Register, etc).
- Ensures content is centered, fills width on mobile, and is nicely padded on desktop.
- Combine with grid/flex responsive classes for inner layouts. 