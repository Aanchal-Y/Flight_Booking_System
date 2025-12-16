import { v4 as uuidv4 } from 'uuid';
import db from './db';

export function generatePNR(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}

export async function createBooking(
  userId: string,
  flightId: string,
  passengerName: string,
  finalPrice: number
): Promise<{ bookingId: string; pnr: string }> {
  try {
    const bookingId = uuidv4();
    const pnr = generatePNR();

    db.createBooking(userId, flightId, passengerName, finalPrice, pnr, bookingId);

    return { bookingId, pnr };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function getBookings(userId: string) {
  try {
    const bookings = db.getBookingsByUserId(userId);

    return bookings.map((b) => {
      const flight = db.getFlightById(b.flight_id);
      return {
        id: b.id,
        booking_id: b.booking_id,
        flight_id: b.flight_id,
        passenger_name: b.passenger_name,
        pnr: b.pnr,
        final_price: b.final_price,
        booking_date: b.booking_date,
        airline: flight?.airline || 'Unknown',
        departure_city: flight?.departure_city || 'Unknown',
        arrival_city: flight?.arrival_city || 'Unknown',
      };
    }).sort((a, b) => b.booking_date.getTime() - a.booking_date.getTime());
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

export async function getBookingDetails(bookingId: string, userId: string) {
  try {
    const booking = db.getBookingById(bookingId, userId);

    if (!booking) return null;

    const flight = db.getFlightById(booking.flight_id);

    return {
      id: booking.id,
      booking_id: booking.booking_id,
      flight_id: booking.flight_id,
      passenger_name: booking.passenger_name,
      pnr: booking.pnr,
      final_price: booking.final_price,
      booking_date: booking.booking_date,
      airline: flight?.airline || 'Unknown',
      departure_city: flight?.departure_city || 'Unknown',
      arrival_city: flight?.arrival_city || 'Unknown',
    };
  } catch (error) {
    console.error('Error fetching booking details:', error);
    throw error;
  }
}
