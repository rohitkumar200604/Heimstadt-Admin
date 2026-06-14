# Heimstadt Admin

Backend admin panel for [heimstadt.com](https://heimstadt.com).

## Features

- **Dashboard** — stats overview, recent bookings and messages
- **Bookings** — confirm, cancel, and manage property booking requests
- **Messages** — real-time live chat with website visitors (powered by Supabase Realtime)
- **Properties** — add, edit, and manage property listings
- **Team** — view admin team members and roles
- **Settings** — integration and notification config

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth · PostgreSQL · Realtime)

## Getting Started

### 1. Set up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the Supabase SQL editor
3. Enable Realtime on the `messages`, `conversations`, and `bookings` tables

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Fill in your Supabase URL and anon key
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Connect the main website

In your main **heimstadt.com** project use the **same Supabase project**.  
Visitors create `conversations` and `messages` rows — the admin panel picks them up in real time.  
Booking forms on the main site insert into `bookings` — admins confirm/cancel here.

## Deployment

Deploy to [Vercel](https://vercel.com). Set the env vars in the Vercel dashboard.  
Keep this admin panel on a separate subdomain (e.g. `admin.heimstadt.com`) and restrict access.
