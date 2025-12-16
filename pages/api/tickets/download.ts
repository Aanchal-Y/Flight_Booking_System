import type { NextApiRequest, NextApiResponse } from 'next';
import { generateTicketPDFNode } from '@/lib/pdf';
import { getBookingDetails } from '@/lib/bookings';
import { formatPrice } from '@/lib/wallet';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bookingId, userId } = req.query;

    if (!bookingId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const booking = await getBookingDetails(bookingId as string, userId as string);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const ticketData = {
      passengerName: (booking as any).passenger_name,
      airline: (booking as any).airline,
      flightId: (booking as any).flight_id,
      departureCity: (booking as any).departure_city,
      arrivalCity: (booking as any).arrival_city,
      finalPrice: formatPrice((booking as any).final_price),
      bookingDate: new Date((booking as any).booking_date).toLocaleString('en-IN'),
      pnr: (booking as any).pnr,
    };

    const pdfBuffer = await generateTicketPDFNode(ticketData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ticket_${ticketData.pnr}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating ticket:', error);
    return res.status(500).json({ error: 'Failed to generate ticket' });
  }
}
