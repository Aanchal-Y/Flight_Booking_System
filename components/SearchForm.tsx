import { useState } from 'react';

interface SearchFormProps {
  onSearch: (departure: string, arrival: string) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(departure, arrival);
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-gradient-to-r from-red-50 to-blue-50 border-2 border-blue-200">
      <h2 className="text-2xl font-bold mb-6 text-text-dark">🔍 Search Flights</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            📍 Departure City
          </label>
          <input
            type="text"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            placeholder="e.g., Mumbai"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            🎯 Arrival City
          </label>
          <input
            type="text"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            placeholder="e.g., Delhi"
            className="input-field"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full button-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🔄 Searching...' : '🚀 Search'}
          </button>
        </div>
      </div>

      {!departure && !arrival && (
        <p className="text-xs text-gray-600 mt-4 font-medium">💡 Tip: Leave fields empty to see all 15 available flights</p>
      )}
    </form>
  );
}
