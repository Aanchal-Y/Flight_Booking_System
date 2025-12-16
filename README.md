# SkyBook - Flight Booking System

A professional, full-stack flight booking application built with **Next.js**, **PostgreSQL**, and **TypeScript**. This system demonstrates real-world features including database-driven flight search, dynamic pricing, wallet management, and PDF ticket generation.

## Features

### Core Requirements
- **Database-Driven Flight Search**: 15+ flights stored in PostgreSQL with filtering by departure/arrival cities
- **Dynamic Pricing Engine**: Surge pricing (+10%) when a user attempts to book the same flight 3+ times within 5 minutes, auto-resets after 10 minutes
- **Wallet System**: Default balance of ₹50,000, automatic deduction on booking, insufficient balance validation
- **Ticket PDF Generation**: Downloadable PDF tickets with passenger details, PNR, route, and booking date
- **Booking History**: Complete booking records with re-download functionality

### Bonus Features
- **Responsive UI**: Built with Tailwind CSS, works on all devices
- **Flight Search Filtering**: Filter by departure and arrival cities
- **Surge Pricing Indicators**: Visual warnings when surge pricing is applied
- **Real-time Balance Updates**: Wallet balance updates every 5 seconds
- **Modern UI/UX**: Gradient cards, smooth transitions, intuitive navigation

## Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript
- **Backend**: Next.js API Routes
- **Database**: In-Memory (no external database needed!)
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF + html2canvas
- **Utilities**: uuid

##  Prerequisites

- Node.js 16+ and npm/yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** in your browser. The app will start with 15 pre-seeded flights!

**No database setup required** - uses in-memory storage that resets when you restart the server.

## Project Structure

```
flight-booking-system/
├── pages/
│   ├── api/
│   │   ├── flights/
│   │   │   ├── search.ts      # Flight search endpoint
│   │   │   └── [id].ts        # Get flight details
│   │   ├── wallet/
│   │   │   └── balance.ts     # Get wallet balance
│   │   ├── bookings/
│   │   │   ├── create.ts      # Create booking
│   │   │   └── list.ts        # Get user bookings
│   │   └── tickets/
│   │       └── download.ts    # Download PDF ticket
│   ├── index.tsx              # Home page (flight search)
│   ├── bookings.tsx           # Booking history page
│   ├── _app.tsx               # Next.js app wrapper
│   └── _document.tsx          # HTML structure
├── components/
│   ├── Header.tsx             # Navigation header
│   ├── SearchForm.tsx         # Flight search form
│   ├── FlightCard.tsx         # Individual flight display
│   ├── BookingModal.tsx       # Booking confirmation modal
│   └── WalletCard.tsx         # Wallet balance display
├── lib/
│   ├── db.ts                  # Database connection
│   ├── pricing.ts             # Dynamic pricing logic
│   ├── wallet.ts              # Wallet management
│   ├── pdf.ts                 # PDF generation
│   └── bookings.ts            # Booking utilities
├── hooks/
│   └── useUser.ts             # Custom user ID hook
├── scripts/
│   ├── setupDb.ts             # Database schema setup
│   └── seedFlights.ts         # Flight data seeding
└── README.md                   # This file
```

## Key Features Explained

### 1. Flight Search
- Query flights by departure/arrival cities
- Returns up to 10 matching flights from database
- Shows base price, airline, and route details

### 2. Dynamic Pricing Engine
```typescript
// Surge pricing rules:
// - 3 booking attempts on same flight within 5 minutes → +10% price
// - Automatically resets after 10 minutes
// - User sees warning when surge is applied
```

### 3. Wallet System
```typescript
// Default balance: ₹50,000 (5,000,000 paisa)
// Deducted on successful booking
// Validation prevents overbooking
// Real-time balance updates
```

### 4. PDF Ticket Generation
- Generated after successful booking
- Includes: Passenger name, airline, flight ID, route, price, booking date, PNR
- Modern gradient design
- Downloadable on booking history page

### 5. Booking History
- View all past bookings
- Shows flight details, amount paid, booking date, PNR
- Re-download tickets anytime

## Testing the System

### Test Flight Search
1. Go to home page
2. Leave search fields empty to see all flights
3. Or filter by city (e.g., "Mumbai" in departure field)

### Test Surge Pricing
1. Select a flight and book it
2. Immediately try booking the same flight again (within 5 minutes)
3. Do this 3 times total
4. On the 3rd booking, you'll see "+10% surge pricing"
5. Wait 10 minutes and the price returns to normal

### Test Wallet Validation
1. Note your wallet balance
2. Try booking a flight more expensive than your balance
3. You'll see error: "Insufficient wallet balance"

### Test PDF Generation
1. Successfully book a flight
2. Click "Download Ticket" in the modal
3. A PDF is generated with your booking details
4. Go to "My Bookings" to download any previous ticket

## In-Memory Database

The application uses a simple in-memory database (stored in `lib/db.ts`) with the following data structures:

- **Flights**: 15 pre-seeded flights with airline, route, and pricing info
- **Bookings**: User bookings with passenger details, PNR, and prices
- **Wallets**: User wallet balances (default: ₹50,000)
- **Booking Attempts**: Tracks booking attempts for surge pricing

**Note**: Data is reset when the server restarts. For production, you can easily upgrade to PostgreSQL or MongoDB.

## User Management

- Users are identified by a **unique ID stored in localStorage**
- On first visit, a new user ID is generated
- Each user has their own wallet and booking history
- Multiple users can use the system independently

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/flights/search` | Search flights (optional: `?departure=X&arrival=Y`) |
| GET | `/api/flights/[id]` | Get flight details |
| GET | `/api/wallet/balance` | Get wallet balance (`?userId=X`) |
| POST | `/api/bookings/create` | Create booking |
| GET | `/api/bookings/list` | Get user bookings (`?userId=X`) |
| GET | `/api/tickets/download` | Download ticket PDF |

##  UI/UX Highlights

- **Responsive Design**: Works on mobile, tablet, desktop
- **Gradient Colors**: Modern purple-blue gradients
- **Real-time Updates**: Wallet balance updates every 5 seconds
- **Clear Feedback**: Success/error messages for all actions
- **Smooth Transitions**: Hover effects and animations
- **Accessible**: Clear labels and instructions

## Deployment

### Deploy to Netlify or Vercel

1. Push your code to GitHub
2. Connect to Netlify/Vercel
3. Deploy! No environment variables needed

**Note**: In-memory database will reset on each deployment. For persistent data, upgrade to a real database by modifying `lib/db.ts`.

## Docker Setup (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t flight-booking .
docker run -p 3000:3000 flight-booking
```

## Sample Flights

The system seeds these flights on initialization:

| Flight ID | Airline | Route | Price |
|-----------|---------|-------|-------|
| AI101 | Air India | Mumbai → Delhi | ₹2,500 |
| SG201 | SpiceJet | Hyderabad → Chennai | ₹2,200 |
| UK601 | Vistara | Delhi → Mumbai | ₹2,900 |
| I5401 | IndiGo | Hyderabad → Mumbai | ₹2,600 |
| And 11 more... | | | |

## Notes

- Prices stored in **paisa** (1 rupee = 100 paisa) for accuracy
- PNRs are randomly generated 6-character alphanumeric codes
- Booking attempts are tracked per user per flight for surge pricing
- All timestamps are in UTC and displayed in user's local timezone

## Upgrading to a Real Database

To use a persistent database (PostgreSQL, MongoDB, etc.), modify `lib/db.ts`:

1. Replace the `InMemoryDB` class with actual database calls
2. The API endpoints in `pages/api/` will work unchanged
3. Refer to the commented PostgreSQL code in the git history for reference

## Support

This is a simplified in-memory implementation. For production use, consider adding:
- Real database persistence
- User authentication
- Error logging and monitoring
- Rate limiting
- Testing suite

---

**Built for the XTechon Flight Booking System Assignment**
