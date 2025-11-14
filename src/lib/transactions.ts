export interface Transaction {
  id: string;
  type: 'invoice_payment' | 'wallet_deposit' | 'wallet_withdrawal' | 'wallet_transfer';
  amount: number;
  description: string;
  walletId?: string;
  invoiceId?: string;
  fromWalletId?: string;
  toWalletId?: string;
  createdAt: string;
  userId: string;
}

const STORAGE_KEY = 'transactions';

export const getTransactions = (userId: string): Transaction[] => {
  const transactions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return transactions.filter((tx: Transaction) => tx.userId === userId)
    .sort((a: Transaction, b: Transaction) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
  const transactions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newTransaction: Transaction = {
    ...transaction,
    id: `TXN-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  transactions.push(newTransaction);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  return newTransaction;
};

export const getTransactionsByWallet = (walletId: string, userId: string): Transaction[] => {
  return getTransactions(userId).filter(tx => 
    tx.walletId === walletId || tx.fromWalletId === walletId || tx.toWalletId === walletId
  );
};

export const getTransactionsByInvoice = (invoiceId: string, userId: string): Transaction[] => {
  return getTransactions(userId).filter(tx => tx.invoiceId === invoiceId);
};
