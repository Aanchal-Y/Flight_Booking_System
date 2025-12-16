import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

interface Flight {
  id: number;
  flight_id: string;
  airline: string;
  departure_city: string;
  arrival_city: string;
  base_price: number;
}

interface Response {
  flight?: Flight;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    const flight = db.getFlightById(id as string);

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    return res.status(200).json({ flight: flight as Flight });
  } catch (error) {
    console.error('Error fetching flight:', error);
    return res.status(500).json({ error: 'Failed to fetch flight' });
  }
}
