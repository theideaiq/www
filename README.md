# The IDEA IQ Monorepo

![CI Status](https://github.com/theideaiq/monorepo/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-Proprietary-red)
![Version](https://img.shields.io/badge/version-0.0.0-blue)

A modern, high-performance monorepo for **The IDEA IQ**, built with **Next.js 16**, **Tailwind CSS 4**, and **Supabase**.

## 🏗 Architecture

The system is designed as a centralized routing hub and application suite.

```mermaid
graph TD
    User((User)) -->|HTTPS| Web[Web App (Next.js 16)]

    subgraph "Infrastructure"
        Web -->|Data & Auth| Supabase[Supabase]
        Web -->|Payments & State| Wayl[Wayl]
    end

    subgraph "Supabase Services"
        Supabase --> Auth[Authentication]
        Supabase --> DB[(PostgreSQL)]
        Supabase --> Storage[Storage]
        Supabase --> Edge[Edge Functions]
    end
```

## 📦 Packages & Apps

This monorepo is managed with [Turbo](https://turbo.build/) and [pnpm](https://pnpm.io/).

- **Apps**
  - [`apps/web`](./apps/web): The main corporate landing page and application (Next.js 16).

- **Packages**
  - [`packages/ui`](./packages/ui): Shared UI components (Tailwind 4 + React).
  - [`packages/config`](./packages/config): Shared configurations (Biome, TypeScript).
  - [`packages/utils`](./packages/utils): Shared utility functions.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v24.12.0 or higher
- **pnpm**: v9 or higher

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Setup:**

    Copy the example environment file in `apps/web`:

    ```bash
    cp apps/web/.env.example apps/web/.env.local
    ```

    Update `apps/web/.env.local` with your credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email
    YOUTUBE_API_KEY=your_youtube_api_key
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```

4.  **Run Development Server:**

    ```bash
    pnpm dev
    ```

    The web app will be available at [http://localhost:3000](http://localhost:3000).

## 🛠 Tooling

- **Build System**: [Turborepo](https://turbo.build/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Linting & Formatting**: [Biome](https://biomejs.dev/)
- **Versioning**: [Changesets](https://github.com/changesets/changesets)

### Commands

- `pnpm dev`: Start all apps in development mode.
- `pnpm build`: Build all apps and packages.
- `pnpm lint`: Lint all code using Biome.
- `pnpm test`: Run tests across the workspace.
- `pnpm changeset`: Generate a changeset for versioning.

## 🧠 Memory (.jules)

The `.jules/` directory contains journal files that serve as long-term memory and context for AI agents working on this project. These files document architectural decisions, design patterns, security protocols, and operational learnings.

- **architect.md**: System architecture and design patterns.
- **palette.md**: UI/UX design tokens and accessibility standards.
- **sentinel.md**: Security protocols and vulnerability patterns.
- **bolt.md**: Performance optimization guidelines.

Please **do not delete** these files, as they ensure continuity and high-quality assistance from AI tools.

## 📄 License

**All Rights Reserved.**

Copyright © 2017-2026 The IDEA.

This software is proprietary. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.
