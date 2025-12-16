import type { AppProps } from 'next/app';
import Header from '@/components/Header';
import '@/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-8">
        <Component {...pageProps} />
      </main>
      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>© 2024 SkyBook - Flight Booking System</p>
      </footer>
    </div>
  );
}
