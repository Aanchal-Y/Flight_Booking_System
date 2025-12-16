import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
import FlightCard from '@/components/FlightCard';
import WalletCard from '@/components/WalletCard';
import { useUser } from '@/hooks/useUser';

interface Flight {
  id: number;
  flight_id: string;
  airline: string;
  departure_city: string;
  arrival_city: string;
  base_price: number;
}

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const { userId } = useUser();

  const handleSearch = async (departure: string, arrival: string) => {
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (departure) params.append('departure', departure);
      if (arrival) params.append('arrival', arrival);

      const response = await fetch(`/api/flights/search?${params}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to search flights');
        setFlights([]);
      } else {
        setFlights(data.flights || []);
        if ((data.flights || []).length === 0) {
          setError('No flights found for the selected route');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialLoad = async () => {
    if (!userId) return;
    await handleSearch('', '');
  };

  useEffect(() => {
    handleInitialLoad();
  }, [userId]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-6">✈️ Find Your Perfect Flight</h2>
        <SearchForm onSearch={handleSearch} loading={loading} />
      </div>

      <div className="mb-8">
        <WalletCard />
      </div>

      {error && !searched && (
        <div className="card bg-blue-50 border-l-4 border-blue-500 mb-6">
          <p className="text-blue-800 font-semibold">🔄 Loading flights from database...</p>
        </div>
      )}

      {error && searched && (
        <div className="card bg-red-50 border-l-4 border-red-500 mb-6">
          <p className="text-red-800 font-semibold">⚠️ {error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin text-3xl mb-4">🔄</div>
          <p className="text-gray-700 font-semibold">Searching flights...</p>
        </div>
      )}

      {flights.length > 0 && (
        <div>
          <h3 className="text-3xl font-bold text-text-dark mb-6 flex items-center gap-2">
            📊 Available Flights ({flights.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onBookingSuccess={() => handleInitialLoad()}
              />
            ))}
          </div>
        </div>
      )}

      {searched && flights.length === 0 && !loading && (
        <div className="card text-center py-12 bg-gradient-to-b from-red-50 to-blue-50 border-2 border-red-200">
          <p className="text-5xl mb-4">✈️</p>
          <p className="text-text-dark font-semibold text-lg">No flights found</p>
          <p className="text-gray-600 mt-2">Try a different search or <Link href="/help" className="text-blue-500 font-semibold hover:underline">view help</Link></p>
        </div>
      )}
    </div>
  );
}
