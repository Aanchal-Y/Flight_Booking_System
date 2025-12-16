import type { NextApiRequest, NextApiResponse } from 'next';
import { getBookings } from '@/lib/bookings';
import { formatPrice } from '@/lib/wallet';

interface BookingRecord {
  id: number;
  booking_id: string;
  flight_id: string;
  passenger_name: string;
  pnr: string;
  final_price: number;
  booking_date: Date;
  airline: string;
  departure_city: string;
  arrival_city: string;
}

interface FormattedBooking {
  id: number;
  booking_id: string;
  flight_id: string;
  passenger_name: string;
  pnr: string;
  final_price: string;
  booking_date: string;
  airline: string;
  departure_city: string;
  arrival_city: string;
  route: string;
}

interface ListResponse {
  bookings?: FormattedBooking[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const bookings = await getBookings(userId as string);

    const formattedBookings = (bookings as BookingRecord[]).map((booking) => ({
      id: booking.id,
      booking_id: booking.booking_id,
      flight_id: booking.flight_id,
      passenger_name: booking.passenger_name,
      pnr: booking.pnr,
      final_price: formatPrice(booking.final_price),
      booking_date: new Date(booking.booking_date).toLocaleString('en-IN'),
      airline: booking.airline,
      departure_city: booking.departure_city,
      arrival_city: booking.arrival_city,
      route: `${booking.departure_city} → ${booking.arrival_city}`,
    }));

    return res.status(200).json({ bookings: formattedBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}
