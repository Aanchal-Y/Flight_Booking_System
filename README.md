# Flight Booking System

A minimal, full-stack flight booking demo built with Next.js and TypeScript. It showcases in-memory flight data, a dynamic pricing engine, a user wallet, PDF ticket generation, and simple API routes suitable for local development and demos.

## What this repo contains

- A Next.js + TypeScript app implementing a small flight booking demo
- In-memory data store (no external DB required for local testing)
- API routes under `pages/api/` for flights, wallet, bookings and ticket download

## Features

- Flight search and listing
- Simple dynamic (surge) pricing rules
- User wallet with balance checks and real-time updates
- Booking history and downloadable PDF tickets

## Tech

- Next.js (app & API routes)
- React + TypeScript
- Tailwind CSS
- jsPDF + html2canvas for ticket PDFs

## Requirements

- Node.js 16+ (Node 18 recommended)
- npm or yarn

## Install & Run

Clone and install:

```bash
git clone <repo-url>
cd Flight_Booking_System
npm install
```

Run development server:

```bash
npm run dev
```

Open http://localhost:3000

Available npm scripts (from package.json):

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm start` — run production build
- `npm run lint` — run linter

## Useful files

- `pages/index.tsx` — search UI
- `pages/bookings.tsx` — booking history
- `pages/api/flights/search.ts` — flight search API
- `pages/api/bookings/create.ts` — booking creation API
- `lib/db.ts` — in-memory DB implementation
- `lib/pricing.ts` — pricing/surge logic
- `lib/wallet.ts` — wallet logic
- `lib/pdf.ts` — PDF generation helper

## Data persistence

This project uses an in-memory store by default. Data will reset when the server restarts. To persist data in production, replace `lib/db.ts` with calls to your preferred database and update configuration accordingly.

## Notes

- Prices are stored in paisa (1 INR = 100 paisa) for accuracy.
- Users are identified by a localStorage-generated ID; there is no auth in this demo.

## Contributing

Issues and PRs are welcome. For larger changes, open an issue first to discuss the approach.

## License

This repository is provided as-is. See the `LICENSE` file for details.

---

Project created as a demo flight booking system.
