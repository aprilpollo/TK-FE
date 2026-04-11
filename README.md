# TK-FE

TK-FE is a project management web application — a control panel for teams to track work across projects, members, and tasks. It provides views such as Dashboard, Board (Kanban), List, Projects, Members, Inbox, and My Work, with full authentication and light/dark theme support.

## Tech Stack

Frontend application built with React 19, TypeScript, Vite, and Tailwind CSS v4.


| Category | Library |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State Management | Redux Toolkit |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| Animation | Motion |
| Theme | next-themes (light / dark) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Other commands

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript type check
npm run format      # Prettier
```

## Project Structure

```
src/
├── app/            # App entry, routing, theme provider
├── auth/           # Authentication logic
├── components/     # Reusable UI components (shadcn/ui + custom)
├── configs/        # App-wide configuration
├── context/        # React context providers
├── hooks/          # Custom hooks
├── layouts/        # Page layout components
├── lib/            # Utility libraries
├── providers/      # Global providers (Redux, Theme, etc.)
├── settings/       # App settings
├── shared/         # Shared components (Loading, ThemeToggle, etc.)
├── store/          # Redux store & slices
├── types/          # TypeScript type definitions
├── utils/          # Helper functions
└── index.css       # Global styles + moon loader styles
```

## License

[MIT](https://choosealicense.com/licenses/mit/) © 2026 p.phonsing_

