import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-red-500 via-blue-500 to-red-500 text-white shadow-lg">
      <div className="container py-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <h1 className="text-3xl font-bold">✈️ SkyBook</h1>
            </Link>
            <p className="text-red-100 text-sm">Professional Flight Booking System</p>
          </div>
          <nav className="flex gap-6">
            <Link href="/" className="hover:text-red-100 transition-colors font-medium">
              🔍 Search Flights
            </Link>
            <Link href="/bookings" className="hover:text-red-100 transition-colors font-medium">
              📋 My Bookings
            </Link>
            <Link href="/help" className="hover:text-red-100 transition-colors font-medium">
              ❓ Help
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
