// In-memory database store
interface Flight {
  id: number;
  flight_id: string;
  airline: string;
  departure_city: string;
  arrival_city: string;
  base_price: number;
  created_at: Date;
}

interface Booking {
  id: number;
  booking_id: string;
  user_id: string;
  flight_id: string;
  passenger_name: string;
  pnr: string;
  final_price: number;
  booking_date: Date;
}

interface Wallet {
  id: number;
  user_id: string;
  balance: number;
  updated_at: Date;
}

interface BookingAttempt {
  id: number;
  user_id: string;
  flight_id: string;
  attempt_time: Date;
}

class InMemoryDB {
  private flights: Flight[] = [];
  private bookings: Booking[] = [];
  private wallets: Wallet[] = [];
  private bookingAttempts: BookingAttempt[] = [];
  private flightIdCounter = 1;
  private bookingIdCounter = 1;
  private walletIdCounter = 1;
  private attemptIdCounter = 1;

  constructor() {
    this.seedFlights();
  }

  private seedFlights() {
    const flightData = [
      { flight_id: 'AI101', airline: 'Air India', departure_city: 'Mumbai', arrival_city: 'Delhi', base_price: 250000 },
      { flight_id: 'AI102', airline: 'Air India', departure_city: 'Delhi', arrival_city: 'Bangalore', base_price: 280000 },
      { flight_id: 'SG201', airline: 'SpiceJet', departure_city: 'Hyderabad', arrival_city: 'Chennai', base_price: 220000 },
      { flight_id: 'SG202', airline: 'SpiceJet', departure_city: 'Mumbai', arrival_city: 'Bangalore', base_price: 270000 },
      { flight_id: 'UK601', airline: 'Vistara', departure_city: 'Delhi', arrival_city: 'Mumbai', base_price: 290000 },
      { flight_id: 'UK602', airline: 'Vistara', departure_city: 'Bangalore', arrival_city: 'Kolkata', base_price: 310000 },
      { flight_id: 'G8301', airline: 'GoAir', departure_city: 'Chennai', arrival_city: 'Delhi', base_price: 240000 },
      { flight_id: 'G8302', airline: 'GoAir', departure_city: 'Pune', arrival_city: 'Mumbai', base_price: 210000 },
      { flight_id: 'I5401', airline: 'IndiGo', departure_city: 'Hyderabad', arrival_city: 'Mumbai', base_price: 260000 },
      { flight_id: 'I5402', airline: 'IndiGo', departure_city: 'Bangalore', arrival_city: 'Delhi', base_price: 300000 },
      { flight_id: 'AI103', airline: 'Air India', departure_city: 'Kolkata', arrival_city: 'Pune', base_price: 265000 },
      { flight_id: 'SG203', airline: 'SpiceJet', departure_city: 'Delhi', arrival_city: 'Hyderabad', base_price: 255000 },
      { flight_id: 'UK603', airline: 'Vistara', departure_city: 'Mumbai', arrival_city: 'Kolkata', base_price: 295000 },
      { flight_id: 'G8303', airline: 'GoAir', departure_city: 'Bangalore', arrival_city: 'Pune', base_price: 235000 },
      { flight_id: 'I5403', airline: 'IndiGo', departure_city: 'Delhi', arrival_city: 'Chennai', base_price: 285000 },
    ];

    this.flights = flightData.map((f, index) => ({
      id: index + 1,
      ...f,
      created_at: new Date(),
    }));
  }

  // Flight operations
  getAllFlights(): Flight[] {
    return this.flights;
  }

  searchFlights(departure?: string, arrival?: string): Flight[] {
    return this.flights.filter((f) => {
      const matchDeparture = !departure || f.departure_city.toLowerCase().includes(departure.toLowerCase());
      const matchArrival = !arrival || f.arrival_city.toLowerCase().includes(arrival.toLowerCase());
      return matchDeparture && matchArrival;
    });
  }

  getFlightById(flightId: string): Flight | null {
    return this.flights.find((f) => f.flight_id === flightId) || null;
  }

  // Wallet operations
  getOrCreateWallet(userId: string): number {
    let wallet = this.wallets.find((w) => w.user_id === userId);
    if (!wallet) {
      wallet = {
        id: this.walletIdCounter++,
        user_id: userId,
        balance: 5000000, // ₹50,000
        updated_at: new Date(),
      };
      this.wallets.push(wallet);
    }
    return wallet.balance;
  }

  getWalletBalance(userId: string): number {
    return this.getOrCreateWallet(userId);
  }

  deductFromWallet(userId: string, amount: number): boolean {
    const wallet = this.wallets.find((w) => w.user_id === userId);
    if (!wallet || wallet.balance < amount) {
      return false;
    }
    wallet.balance -= amount;
    wallet.updated_at = new Date();
    return true;
  }

  addToWallet(userId: string, amount: number): void {
    const balance = this.getOrCreateWallet(userId);
    const wallet = this.wallets.find((w) => w.user_id === userId)!;
    wallet.balance += amount;
    wallet.updated_at = new Date();
  }

  // Booking operations
  createBooking(
    userId: string,
    flightId: string,
    passengerName: string,
    finalPrice: number,
    pnr: string,
    bookingId: string
  ): Booking {
    const booking: Booking = {
      id: this.bookingIdCounter++,
      booking_id: bookingId,
      user_id: userId,
      flight_id: flightId,
      passenger_name: passengerName,
      pnr: pnr,
      final_price: finalPrice,
      booking_date: new Date(),
    };
    this.bookings.push(booking);
    return booking;
  }

  getBookingsByUserId(userId: string): Booking[] {
    return this.bookings.filter((b) => b.user_id === userId);
  }

  getBookingById(bookingId: string, userId: string): Booking | null {
    return this.bookings.find((b) => b.booking_id === bookingId && b.user_id === userId) || null;
  }

  // Booking attempts (for surge pricing)
  recordBookingAttempt(userId: string, flightId: string): void {
    this.bookingAttempts.push({
      id: this.attemptIdCounter++,
      user_id: userId,
      flight_id: flightId,
      attempt_time: new Date(),
    });
  }

  getRecentAttempts(userId: string, flightId: string, minutes: number): number {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    return this.bookingAttempts.filter(
      (a) =>
        a.user_id === userId &&
        a.flight_id === flightId &&
        a.attempt_time > cutoffTime
    ).length;
  }

  cleanupExpiredAttempts(minutes: number): void {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    this.bookingAttempts = this.bookingAttempts.filter(
      (a) => a.attempt_time > cutoffTime
    );
  }
}

// Create singleton instance
const db = new InMemoryDB();

export default db;
