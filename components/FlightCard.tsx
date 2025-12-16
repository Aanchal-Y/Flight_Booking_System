import { useState } from 'react';
import BookingModal from './BookingModal';

interface Flight {
  id: number;
  flight_id: string;
  airline: string;
  departure_city: string;
  arrival_city: string;
  base_price: number;
}

interface FlightCardProps {
  flight: Flight;
  onBookingSuccess: () => void;
}

export default function FlightCard({ flight, onBookingSuccess }: FlightCardProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookingClose = () => {
    setShowBookingModal(false);
    onBookingSuccess();
  };

  return (
    <>
      <div className="card border-l-4 border-red-500 hover:border-blue-500 hover:shadow-xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-text-dark">{flight.airline}</h3>
            <p className="text-sm text-gray-600">{flight.flight_id}</p>
          </div>
          <div className="text-right bg-gradient-to-r from-red-100 to-blue-100 px-3 py-2 rounded-lg">
            <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">₹{(flight.base_price / 100).toFixed(0)}</p>
            <p className="text-xs text-gray-600">Base Price</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-t-2 border-b-2 border-light-gray">
          <div>
            <p className="text-sm text-gray-600 font-semibold">From</p>
            <p className="text-lg font-bold text-text-dark">{flight.departure_city}</p>
          </div>
          <div className="text-2xl text-blue-400">✈️</div>
          <div className="text-right">
            <p className="text-sm text-gray-600 font-semibold">To</p>
            <p className="text-lg font-bold text-text-dark">{flight.arrival_city}</p>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setShowBookingModal(true)}
            className="w-full button-primary"
          >
            🎫 Book Now
          </button>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          flight={flight}
          onClose={handleBookingClose}
        />
      )}
    </>
  );
}
