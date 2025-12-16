import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';

interface Booking {
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

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userId } = useUser();

  useEffect(() => {
    if (!userId) return;

    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/bookings/list?userId=${userId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to fetch bookings');
        } else {
          setBookings(data.bookings || []);
        }
      } catch (err) {
        setError('An error occurred while fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const handleDownloadTicket = (booking: Booking) => {
    try {
      const link = document.createElement('a');
      link.href = `/api/tickets/download?bookingId=${booking.booking_id}&userId=${userId}`;
      link.download = `ticket_${booking.pnr}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 100);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download ticket. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-8">📋 My Bookings</h2>

      {error && (
        <div className="card bg-red-50 border-l-4 border-red-500 mb-6">
          <p className="text-red-800 font-semibold">⚠️ {error}</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="card text-center py-12 bg-gradient-to-b from-red-50 to-blue-50 border-2 border-red-200">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-text-dark text-lg font-semibold">No bookings yet</p>
          <p className="text-gray-600 text-sm mt-2">Book a flight to see your reservations here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="card border-l-4 border-red-500 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-gray-700 font-semibold uppercase">✈️ Airline</p>
                  <p className="text-lg font-bold text-text-dark">{booking.airline}</p>
                  <p className="text-xs text-gray-600">Flight {booking.flight_id}</p>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-gray-700 font-semibold uppercase">🛫 Route</p>
                  <p className="text-lg font-bold text-text-dark">{booking.route}</p>
                </div>

                <div className="bg-red-50 p-3 rounded">
                  <p className="text-xs text-gray-700 font-semibold uppercase">👤 Passenger</p>
                  <p className="text-lg font-bold text-text-dark">{booking.passenger_name}</p>
                </div>

                <div className="bg-gradient-to-br from-red-100 to-blue-100 p-3 rounded border-2 border-blue-300">
                  <p className="text-xs text-gray-700 font-semibold uppercase">🎫 PNR</p>
                  <p className="text-lg font-bold text-blue-600">{booking.pnr}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t-2 border-light-gray">
                <div>
                  <p className="text-xs text-gray-700 font-semibold uppercase">💳 Amount Paid</p>
                  <p className="text-xl font-bold text-red-600 mt-1">₹{booking.final_price}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-700 font-semibold uppercase">📅 Booking Date</p>
                  <p className="text-sm text-text-dark mt-1 font-semibold">{booking.booking_date}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadTicket(booking)}
                    className="flex-1 button-primary text-sm"
                  >
                    📥 Download Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
