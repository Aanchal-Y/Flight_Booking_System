import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = postgres(connectionString);

const flights = [
  {
    flight_id: 'AI101',
    airline: 'Air India',
    departure_city: 'Mumbai',
    arrival_city: 'Delhi',
    base_price: 250000,
  },
  {
    flight_id: 'AI102',
    airline: 'Air India',
    departure_city: 'Delhi',
    arrival_city: 'Bangalore',
    base_price: 280000,
  },
  {
    flight_id: 'SG201',
    airline: 'SpiceJet',
    departure_city: 'Hyderabad',
    arrival_city: 'Chennai',
    base_price: 220000,
  },
  {
    flight_id: 'SG202',
    airline: 'SpiceJet',
    departure_city: 'Mumbai',
    arrival_city: 'Bangalore',
    base_price: 270000,
  },
  {
    flight_id: 'UK601',
    airline: 'Vistara',
    departure_city: 'Delhi',
    arrival_city: 'Mumbai',
    base_price: 290000,
  },
  {
    flight_id: 'UK602',
    airline: 'Vistara',
    departure_city: 'Bangalore',
    arrival_city: 'Kolkata',
    base_price: 310000,
  },
  {
    flight_id: 'G8301',
    airline: 'GoAir',
    departure_city: 'Chennai',
    arrival_city: 'Delhi',
    base_price: 240000,
  },
  {
    flight_id: 'G8302',
    airline: 'GoAir',
    departure_city: 'Pune',
    arrival_city: 'Mumbai',
    base_price: 210000,
  },
  {
    flight_id: 'I5401',
    airline: 'IndiGo',
    departure_city: 'Hyderabad',
    arrival_city: 'Mumbai',
    base_price: 260000,
  },
  {
    flight_id: 'I5402',
    airline: 'IndiGo',
    departure_city: 'Bangalore',
    arrival_city: 'Delhi',
    base_price: 300000,
  },
  {
    flight_id: 'AI103',
    airline: 'Air India',
    departure_city: 'Kolkata',
    arrival_city: 'Pune',
    base_price: 265000,
  },
  {
    flight_id: 'SG203',
    airline: 'SpiceJet',
    departure_city: 'Delhi',
    arrival_city: 'Hyderabad',
    base_price: 255000,
  },
  {
    flight_id: 'UK603',
    airline: 'Vistara',
    departure_city: 'Mumbai',
    arrival_city: 'Kolkata',
    base_price: 295000,
  },
  {
    flight_id: 'G8303',
    airline: 'GoAir',
    departure_city: 'Bangalore',
    arrival_city: 'Pune',
    base_price: 235000,
  },
  {
    flight_id: 'I5403',
    airline: 'IndiGo',
    departure_city: 'Delhi',
    arrival_city: 'Chennai',
    base_price: 285000,
  },
];

async function seedFlights() {
  try {
    console.log('Seeding flights into database...');

    // Clear existing flights
    await sql`DELETE FROM booking_attempts`;
    await sql`DELETE FROM bookings`;
    await sql`DELETE FROM flights`;

    // Insert flights
    for (const flight of flights) {
      await sql`
        INSERT INTO flights (flight_id, airline, departure_city, arrival_city, base_price)
        VALUES (${flight.flight_id}, ${flight.airline}, ${flight.departure_city}, ${flight.arrival_city}, ${flight.base_price})
      `;
    }

    console.log(`✅ Successfully seeded ${flights.length} flights`);
  } catch (error) {
    console.error('❌ Error seeding flights:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedFlights();
