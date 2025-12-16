import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';

export default function WalletCard() {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  useEffect(() => {
    if (!userId) return;

    const fetchBalance = async () => {
      try {
        const response = await fetch(`/api/wallet/balance?userId=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setBalance(data.balance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <div className="card">
        <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-red-50 to-blue-50 border-2 border-red-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text-dark">💳 Wallet Balance</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mt-2">₹{balance}</p>
        </div>
        <div className="text-5xl">💰</div>
      </div>
      <p className="text-xs text-gray-600 mt-4">Aanchal_Maker</p>
    </div>
  );
}
