export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  vat: number;
  vatAmount: number;
  total: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'pending';
  createdAt: string;
  userId: string;
  walletId?: string;
}

const STORAGE_KEY = 'invoices';

export const getInvoices = (userId: string): Invoice[] => {
  const invoices = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return invoices.filter((inv: Invoice) => inv.userId === userId);
};

export const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>): Invoice => {
  const invoices = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newInvoice: Invoice = {
    ...invoice,
    id: `INV-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  invoices.push(newInvoice);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  return newInvoice;
};

export const updateInvoice = (id: string, updates: Partial<Invoice>): Invoice | null => {
  const invoices = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const index = invoices.findIndex((inv: Invoice) => inv.id === id);
  
  if (index === -1) return null;
  
  invoices[index] = { ...invoices[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  return invoices[index];
};

export const deleteInvoice = (id: string): boolean => {
  const invoices = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const filtered = invoices.filter((inv: Invoice) => inv.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

export const calculateVAT = (amount: number, vatPercentage: number) => {
  const vatAmount = (amount * vatPercentage) / 100;
  const total = amount + vatAmount;
  return { vatAmount, total };
};
