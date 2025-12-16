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

interface SearchResponse {
  flights?: Flight[];
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { departure, arrival, limit = 10 } = req.query;

    let flights = db.searchFlights(
      departure as string | undefined,
      arrival as string | undefined
    );

    const limitNum = parseInt(limit as string) || 10;
    flights = flights.slice(0, limitNum);

    return res.status(200).json({ flights: flights as Flight[] });
  } catch (error) {
    console.error('Error searching flights:', error);
    return res.status(500).json({ error: 'Failed to search flights' });
  }
}
