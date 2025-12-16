import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  icon: string;
}

const faqItems: FAQItem[] = [
  {
    icon: '🔍',
    question: 'How do I search for flights?',
    answer: 'Go to the homepage and use the search form at the top. You can search by leaving fields empty (shows all flights) or filter by departure and arrival cities. Click "Search" to see available flights matching your criteria.',
  },
  {
    icon: '💳',
    question: 'How do I book a flight?',
    answer: 'Click "Book Now" on any flight card. Enter your full passenger name in the modal dialog and click "Confirm Booking". Your wallet will be deducted immediately and you will receive your booking confirmation with a PNR code.',
  },
  {
    icon: '💰',
    question: 'What is the wallet balance and how does it work?',
    answer: 'Every new user gets a default wallet balance of ₹50,000. When you book a flight, the final price is automatically deducted from your wallet. Your wallet balance is displayed on the home page and updates in real-time. You cannot book a flight if your balance is insufficient.',
  },
  {
    icon: '📈',
    question: 'What is surge pricing and how does it work?',
    answer: 'If you attempt to book the same flight 3 or more times within 5 minutes, the price increases by 10% (surge pricing). This is to simulate real-world demand pricing. The price automatically resets to the original base price after 10 minutes of no booking attempts.',
  },
  {
    icon: '📝',
    question: 'How do I download my ticket?',
    answer: 'After successful booking, click "Download Ticket" in the booking confirmation modal. The PDF will download automatically to your device. You can also download your ticket anytime from the "My Bookings" page by clicking the "Download Ticket" button next to any booking.',
  },
  {
    icon: '📋',
    question: 'How do I view my booking history?',
    answer: 'Click on "My Bookings" in the header navigation. This page shows all your past bookings with flight details, amount paid, booking date, and PNR. You can download any ticket again from this page.',
  },
  {
    icon: '⚠️',
    question: 'What does the PNR code mean?',
    answer: 'PNR (Passenger Name Record) is a unique 6-character code assigned to each booking. It serves as your booking reference. Keep this code safe as it may be required for any inquiries or rebooking requests.',
  },
  {
    icon: '❓',
    question: 'What happens if I try to book a flight with insufficient wallet balance?',
    answer: 'The system will show an error message: "Insufficient wallet balance". You cannot proceed with the booking. The error message will show the required amount and your available balance. Go back and search for a cheaper flight or try booking later.',
  },
  {
    icon: '🔄',
    question: 'Can I modify or cancel a booking?',
    answer: 'Currently, the system does not support booking modifications or cancellations. Once a booking is confirmed and your wallet is debited, it cannot be reversed. Please ensure passenger details are correct before confirming.',
  },
  {
    icon: '📱',
    question: 'Why is the PDF download not working?',
    answer: 'If the PDF download fails, try these steps: 1) Check your internet connection, 2) Clear browser cache, 3) Try a different browser, 4) Use the "My Bookings" page to download instead of the modal. If issues persist, contact support.',
  },
];

export default function HelpSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="help-container py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient-primary mb-4">Help & Instructions</h1>
          <p className="text-lg text-gray-600">Everything you need to know about SkyBook Flight Booking System</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="help-card bg-white rounded-lg border-2 border-gradient-red-blue shadow-md hover:shadow-lg transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-6 flex items-start gap-4 hover:bg-light-gray transition-colors"
              >
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-dark flex items-center justify-between">
                    {item.question}
                    <span className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </h3>
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 border-t-2 border-light-gray">
                  <p className="text-gray-700 leading-relaxed mt-4">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-red-50 to-blue-50 rounded-lg border-2 border-gradient-red-blue p-8">
          <h2 className="text-2xl font-bold text-text-dark mb-4">🆘 Still Need Help?</h2>
          <p className="text-gray-700 mb-6">
            If you encounter any issues not covered in the FAQ above, here are some quick troubleshooting steps:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <span>Clear your browser cache and cookies, then refresh the page</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <span>Try using a different browser (Chrome, Firefox, Safari, Edge)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <span>Ensure you have JavaScript enabled in your browser</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">4.</span>
              <span>Check your internet connection and try again</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary">5.</span>
              <span>For PDF download issues, right-click the download button and select "Save link as..."</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            💡 <span className="font-semibold">Pro Tip:</span> Bookmark this help page for quick reference while using SkyBook!
          </p>
        </div>
      </div>
    </div>
  );
}
