export interface Wallet {
  id: string;
  name: string;
  type: 'bank' | 'cash' | 'mobile' | 'crypto';
  balance: number;
  accountNumber?: string;
  currency: string;
  color: string;
  createdAt: string;
}

const STORAGE_KEY = 'wallets';

export const getWallets = (): Wallet[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addWallet = (wallet: Omit<Wallet, 'id' | 'createdAt'>): Wallet => {
  const wallets = getWallets();
  const newWallet: Wallet = {
    ...wallet,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  wallets.push(newWallet);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
  return newWallet;
};

export const updateWallet = (id: string, updates: Partial<Wallet>): void => {
  const wallets = getWallets();
  const index = wallets.findIndex(w => w.id === id);
  if (index !== -1) {
    wallets[index] = { ...wallets[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
  }
};

export const deleteWallet = (id: string): void => {
  const wallets = getWallets().filter(w => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
};

export const getTotalBalance = (): number => {
  return getWallets().reduce((sum, wallet) => sum + wallet.balance, 0);
};
