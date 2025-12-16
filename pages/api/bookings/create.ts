import type { NextApiRequest, NextApiResponse } from 'next';
import { calculatePrice, recordBookingAttempt } from '@/lib/pricing';
import { getWalletBalance, deductFromWallet, formatPrice } from '@/lib/wallet';
import { createBooking } from '@/lib/bookings';
import db from '@/lib/db';

interface BookingRequest {
  userId: string;
  flightId: string;
  passengerName: string;
}

interface BookingResponse {
  success?: boolean;
  bookingId?: string;
  pnr?: string;
  finalPrice?: string;
  finalPriceInPaisa?: number;
  isSurged?: boolean;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookingResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, flightId, passengerName } = req.body as BookingRequest;

    // Validate input
    if (!userId || !flightId || !passengerName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get flight details
    const flight = db.getFlightById(flightId);

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    const basePrice = flight.base_price;

    // Record booking attempt
    await recordBookingAttempt(userId, flightId);

    // Calculate final price with surge pricing
    const { finalPrice, isSurged } = await calculatePrice(userId, flightId, basePrice);

    // Check wallet balance
    const walletBalance = await getWalletBalance(userId);
    if (walletBalance < finalPrice) {
      return res.status(400).json({
        error: `Insufficient wallet balance. Required: ₹${formatPrice(finalPrice)}, Available: ₹${formatPrice(walletBalance)}`,
      });
    }

    // Deduct from wallet
    const deductionSuccess = await deductFromWallet(userId, finalPrice);
    if (!deductionSuccess) {
      return res.status(400).json({ error: 'Failed to process payment' });
    }

    // Create booking
    const { bookingId, pnr } = await createBooking(userId, flightId, passengerName, finalPrice);

    return res.status(201).json({
      success: true,
      bookingId,
      pnr,
      finalPrice: formatPrice(finalPrice),
      finalPriceInPaisa: finalPrice,
      isSurged,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
}
