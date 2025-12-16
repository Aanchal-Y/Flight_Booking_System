import db from './db';

const SURGE_THRESHOLD = 3;
const SURGE_WINDOW_MINUTES = 5;
const SURGE_RESET_MINUTES = 10;
const SURGE_PERCENTAGE = 10;

export async function calculatePrice(
  userId: string,
  flightId: string,
  basePrice: number
): Promise<{ finalPrice: number; isSurged: boolean }> {
  try {
    const attemptCount = db.getRecentAttempts(userId, flightId, SURGE_WINDOW_MINUTES);
    const isSurged = attemptCount >= SURGE_THRESHOLD;

    const finalPrice = isSurged
      ? Math.round(basePrice * (1 + SURGE_PERCENTAGE / 100))
      : basePrice;

    return { finalPrice, isSurged };
  } catch (error) {
    console.error('Error calculating price:', error);
    throw error;
  }
}

export async function recordBookingAttempt(userId: string, flightId: string): Promise<void> {
  try {
    db.recordBookingAttempt(userId, flightId);
  } catch (error) {
    console.error('Error recording booking attempt:', error);
    throw error;
  }
}

export async function cleanupExpiredAttempts(): Promise<void> {
  try {
    db.cleanupExpiredAttempts(SURGE_RESET_MINUTES);
  } catch (error) {
    console.error('Error cleaning up attempts:', error);
  }
}

export function getSurgeResetTime(basePrice: number, isSurged: boolean): Date | null {
  if (!isSurged) return null;
  return new Date(Date.now() + SURGE_RESET_MINUTES * 60 * 1000);
}

export function getTimeUntilReset(resetTime: Date): number {
  return Math.max(0, Math.ceil((resetTime.getTime() - Date.now()) / 1000));
}
