# King Festus Foundation

## Project Overview

The **King Festus Foundation** web application is a comprehensive platform designed to manage the foundation's digital presence and internal operations. It features a public-facing website for showcasing the foundation's mission and activities, alongside a robust **Content Management System (CMS)** for administrative control.

The application is built with modern web technologies, prioritizing performance, security, and a seamless user experience.

## Key Features

### 🔐 Super Admin Privileges

To ensure proper governance and hierarchy within the system, a **Super Admin** role has been implemented with exclusive capabilities:

- **User Deactivation**: Super Admins can deactivate user accounts directly from the CMS.
- **Access Control**: Deactivated users are immediately signed out and blocked from accessing the dashboard.
- **Intercepting UX**: A "soft" deactivation experience uses intercepting routes to display a modal warning to the user before signing them out, preserving context while enforcing security.

### 📸 Photo Dump Storage Logic

The media gallery ("Photo Dump") includes smart storage limits to manage resources effectively:

- **Storage Limits**: Standard users are limited to uploading a maximum of **10 images**.
- **Usage Tracking**: Users can see their current usage (e.g., "Usage: 5/10") in real-time.
- **Smart Restrictions**: The upload button is automatically disabled when the limit is reached.
- **Admin Override**: **Admins** and **Super Admins** have unlimited storage capacity.
- **Ownership & Management**: Users can delete their own uploaded images, while Admins have the authority to moderate/delete any media asset.

## Tech Stack

This project leverages a modern, type-safe stack:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Clerk](https://clerk.com/)
- **File Storage**: [UploadThing](https://uploadthing.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)

## User Roles

The application enforces a strict role-based hierarchy:

1. **Super Admin** (`SUPER_ADMIN`)
    - Highest level of access.
    - Can manage all content and users.
    - **Exclusive**: Can deactivate/activate other users and admins.
    - Cannot be deactivated.

2. **Admin** (`ADMIN`)
    - Full access to the CMS (Content, Media, Events).
    - Can moderate all media uploads.
    - **Unlimited** media storage.

3. **User** (`USER`)
    - Standard access.
    - Can upload media to the gallery.
    - **Limited**: Restricted to 10 media uploads.

## Local Setup

Follow these steps to run the application locally:

### Prerequisites

- Node.js (v18+)
- pnpm

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/abdullmustyy/king-festus-foundation.git
    cd king-festus-foundation
    ```

2. **Install dependencies**:

    ```bash
    pnpm install
    ```

3. **Environment Variables**:
    Create a `.env` file in the root directory and add the required keys (Clerk, Database URL, UploadThing secrets).

    ```env
    DATABASE_URL="postgresql://..."
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
    CLERK_SECRET_KEY="sk_test_..."
    UPLOADTHING_SECRET="sk_live_..."
    UPLOADTHING_APP_ID="..."
    ```

4. **Database Setup**:
    Push the schema to your database.

    ```bash
    pnpm prisma migrate dev
    ```

5. **Run the development server**:

    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Workflows

- **Migrations**: Always run `pnpm prisma migrate dev` when modifying `schema.prisma`.
