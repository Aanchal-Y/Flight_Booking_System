import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = postgres(connectionString);

async function setupDatabase() {
  try {
    console.log('Setting up database schema...');

    // Drop existing tables if they exist
    await sql`DROP TABLE IF EXISTS bookings CASCADE`;
    await sql`DROP TABLE IF EXISTS flights CASCADE`;
    await sql`DROP TABLE IF EXISTS wallets CASCADE`;
    await sql`DROP TABLE IF EXISTS booking_attempts CASCADE`;

    // Create flights table
    await sql`
      CREATE TABLE flights (
        id SERIAL PRIMARY KEY,
        flight_id VARCHAR(20) UNIQUE NOT NULL,
        airline VARCHAR(100) NOT NULL,
        departure_city VARCHAR(100) NOT NULL,
        arrival_city VARCHAR(100) NOT NULL,
        base_price INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create wallets table
    await sql`
      CREATE TABLE wallets (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) UNIQUE NOT NULL,
        balance INTEGER NOT NULL DEFAULT 5000000,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create bookings table
    await sql`
      CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        booking_id VARCHAR(50) UNIQUE NOT NULL,
        user_id VARCHAR(50) NOT NULL,
        flight_id VARCHAR(20) NOT NULL,
        passenger_name VARCHAR(100) NOT NULL,
        pnr VARCHAR(10) UNIQUE NOT NULL,
        final_price INTEGER NOT NULL,
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
      )
    `;

    // Create booking attempts table for surge pricing
    await sql`
      CREATE TABLE booking_attempts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        flight_id VARCHAR(20) NOT NULL,
        attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
      )
    `;

    console.log('✅ Database schema created successfully');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

setupDatabase();
