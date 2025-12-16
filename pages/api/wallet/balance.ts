import type { NextApiRequest, NextApiResponse } from 'next';
import { getWalletBalance, formatPrice } from '@/lib/wallet';

interface Response {
  balance?: string;
  balanceInPaisa?: number;
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
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const balance = await getWalletBalance(userId as string);

    return res.status(200).json({
      balance: formatPrice(balance),
      balanceInPaisa: balance,
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return res.status(500).json({ error: 'Failed to fetch wallet balance' });
  }
}
