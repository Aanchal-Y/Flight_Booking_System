import { useState } from 'react';
import { useUser } from '@/hooks/useUser';

interface Flight {
  flight_id: string;
  airline: string;
  departure_city: string;
  arrival_city: string;
  base_price: number;
}

interface BookingModalProps {
  flight: Flight;
  onClose: () => void;
}

export default function BookingModal({ flight, onClose }: BookingModalProps) {
  const [passengerName, setPassengerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState<any>(null);
  const { userId } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          flightId: flight.flight_id,
          passengerName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Booking failed');
        setLoading(false);
        return;
      }

      setBookingResult(data);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (bookingResult) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg p-8 max-w-md w-full mx-4 border-2 border-blue-200">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4 animate-bounce">✅</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">Booking Successful!</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-700 font-semibold">🎫 PNR Code</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{bookingResult.pnr}</p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-gray-700 font-semibold">💳 Amount Paid</p>
              <p className="text-2xl font-bold text-red-600 mt-1">₹{bookingResult.finalPrice}</p>
            </div>

            {bookingResult.isSurged && (
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                <p className="text-sm text-yellow-800 font-semibold">⚠️ Surge Pricing Applied</p>
                <p className="text-xs text-yellow-700 mt-1">Price increased by 10% due to multiple booking attempts</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = `/api/tickets/download?bookingId=${bookingResult.bookingId}&userId=${userId}`;
                link.download = `ticket_${bookingResult.pnr}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-full button-primary"
            >
              📥 Download Ticket
            </button>
            <button
              onClick={onClose}
              className="w-full button-secondary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white to-red-50 rounded-lg p-8 max-w-md w-full mx-4 max-h-96 overflow-y-auto border-2 border-red-200">
        <h2 className="text-2xl font-bold mb-6 text-text-dark">🎫 Book Flight</h2>

        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-gray-700 font-semibold">✈️ Flight Details</p>
          <p className="font-bold text-text-dark mt-2">{flight.airline}</p>
          <p className="text-sm text-gray-700 mt-2 font-semibold">
            {flight.departure_city} → {flight.arrival_city}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-dark mb-2">
              👤 Passenger Name
            </label>
            <input
              type="text"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              placeholder="John Doe"
              className="input-field"
              required
              minLength={3}
            />
          </div>

          {error && <div className="error-text bg-red-100 border-l-4 border-red-500 text-red-800 p-3 rounded">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full button-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Processing...' : `✅ Confirm Booking - ₹${(flight.base_price / 100).toFixed(0)}`}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full button-secondary"
          >
            ❌ Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
