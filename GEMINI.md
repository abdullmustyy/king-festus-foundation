# King Festus Foundation - Project Context

## Project Overview

This is a Next.js 16 web application for the **King Festus Foundation**. It is a full-stack application using the App Router, tailored for managing foundation activities, likely including a public-facing site and an administrative dashboard.

## Tech Stack

* **Framework:** Next.js 16.0 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4 (via `@tailwindcss/postcss`), `tailwind-merge`, `clsx`
* **UI Library:** Radix UI primitives, shadcn/ui (New York style), Lucide React icons
* **Authentication:** Clerk (`@clerk/nextjs`)
* **Database:** PostgreSQL (via Prisma ORM)
* **Forms:** React Hook Form + Zod
* **File Upload:** UploadThing
* **Data Tables:** TanStack Table
* **State Management:** `nuqs` (URL search params state)

## Architecture & Structure

### Directory Structure

* `app/`: Next.js App Router source.
  * `(auth)/`: Authentication routes (Sign In, Sign Up, Reset Password) wrapped in a route group.
  * `(dashboard)/`: Protected dashboard area.
  * `(public)/`: Public marketing pages (About, Contact, Governance).
  * `api/`: Backend API routes (e.g., `uploadthing`).
* `components/`:
  * `ui/`: Reusable generic components (buttons, inputs, etc.) - mostly shadcn/ui.
  * `features/`: Domain-specific components (e.g., `dashboard`, `forms`, `tables`).
  * `layout/`: Structural components (Navbar, Footer, Sidebar).
* `lib/`: Utility functions, database clients (`db.ts`), and constants.
* `prisma/`: Database schema and migrations.
* `generated/`: Generated artifacts (e.g., Prisma Client).

### Data Model

The project uses **Prisma** with **PostgreSQL**.

* **Schema Location:** `prisma/schema.prisma`
* **Client Location:** `generated/prisma` (Custom output path)
* **Current Models:** `Media` (User management is likely handled partially by Clerk).

## Development Workflow

### Package Manager

This project uses **pnpm**.

### Key Commands

* **Start Dev Server:** `pnpm dev`
* **Build Production:** `pnpm build`
* **Lint:** `pnpm lint`
* **Database Migration:** `pnpm prisma migrate deploy` (or `dev` for local)
* **Vercel Build:** `pnpm vercel-build` (Runs migrations, generates client, then builds)

### Conventions

* **Styling:** Use Tailwind utility classes. Avoid custom CSS files where possible.
* **Components:**
  * Place reusable UI primitives in `components/ui`.
  * Place business logic/feature components in `components/features`.
* **Imports:** Use absolute imports with `@/` (e.g., `@/components/ui/button`).
* **Forms:** Use `react-hook-form` with `zod` schemas.
