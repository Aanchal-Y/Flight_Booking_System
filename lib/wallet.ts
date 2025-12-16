import db from './db';

const DEFAULT_BALANCE = 5000000; // ₹50,000

export async function getOrCreateWallet(userId: string): Promise<number> {
  try {
    return db.getOrCreateWallet(userId);
  } catch (error) {
    console.error('Error getting/creating wallet:', error);
    throw error;
  }
}

export async function getWalletBalance(userId: string): Promise<number> {
  try {
    return db.getWalletBalance(userId);
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
}

export async function deductFromWallet(userId: string, amount: number): Promise<boolean> {
  try {
    const balance = await getWalletBalance(userId);

    if (balance < amount) {
      return false;
    }

    return db.deductFromWallet(userId, amount);
  } catch (error) {
    console.error('Error deducting from wallet:', error);
    throw error;
  }
}

export async function addToWallet(userId: string, amount: number): Promise<void> {
  try {
    await getOrCreateWallet(userId);
    db.addToWallet(userId, amount);
  } catch (error) {
    console.error('Error adding to wallet:', error);
    throw error;
  }
}

export function formatPrice(priceInPaisa: number): string {
  return (priceInPaisa / 100).toFixed(2);
}
