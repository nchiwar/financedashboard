import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTransactions } from '@/lib/transactions';
import { getWallets } from '@/lib/wallets';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, ArrowDownLeft, Wallet, Receipt } from 'lucide-react';
import { format } from 'date-fns';

const History = () => {
  const { user } = useAuth();
  const [transactions] = useState(() => getTransactions(user?.id || ''));
  const [wallets] = useState(() => getWallets());
  const [filterType, setFilterType] = useState<string>('all');
  const [filterWallet, setFilterWallet] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }
    
    if (filterWallet !== 'all') {
      filtered = filtered.filter(tx => 
        tx.walletId === filterWallet || 
        tx.fromWalletId === filterWallet || 
        tx.toWalletId === filterWallet
      );
    }
    
    return filtered;
  }, [transactions, filterType, filterWallet]);

  const getWalletName = (walletId?: string) => {
    if (!walletId) return 'N/A';
    const wallet = wallets.find(w => w.id === walletId);
    return wallet?.name || 'Unknown Wallet';
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'invoice_payment':
        return <Receipt className="w-4 h-4" />;
      case 'wallet_deposit':
        return <ArrowDownLeft className="w-4 h-4 text-success" />;
      case 'wallet_withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-destructive" />;
      case 'wallet_transfer':
        return <Wallet className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  const getTransactionBadge = (type: string) => {
    const badges = {
      invoice_payment: { label: 'Invoice Payment', variant: 'default' as const, className: 'bg-success text-success-foreground' },
      wallet_deposit: { label: 'Deposit', variant: 'default' as const, className: 'bg-primary text-primary-foreground' },
      wallet_withdrawal: { label: 'Withdrawal', variant: 'destructive' as const, className: '' },
      wallet_transfer: { label: 'Transfer', variant: 'secondary' as const, className: '' },
    };
    const badge = badges[type as keyof typeof badges] || badges.wallet_deposit;
    return <Badge variant={badge.variant} className={badge.className}>{badge.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Financial History</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-success/10 rounded-lg">
              <ArrowDownLeft className="w-5 h-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground">Total Income</p>
          </div>
          <p className="text-2xl font-bold">
            ₦{transactions
              .filter(tx => tx.type === 'invoice_payment' || tx.type === 'wallet_deposit')
              .reduce((sum, tx) => sum + tx.amount, 0)
              .toLocaleString()}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
          </div>
          <p className="text-2xl font-bold">
            ₦{transactions
              .filter(tx => tx.type === 'wallet_withdrawal')
              .reduce((sum, tx) => sum + tx.amount, 0)
              .toLocaleString()}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Total Transactions</p>
          </div>
          <p className="text-2xl font-bold">{transactions.length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Filter by Type</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="invoice_payment">Invoice Payments</SelectItem>
                <SelectItem value="wallet_deposit">Deposits</SelectItem>
                <SelectItem value="wallet_withdrawal">Withdrawals</SelectItem>
                <SelectItem value="wallet_transfer">Transfers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Filter by Wallet</label>
            <Select value={filterWallet} onValueChange={setFilterWallet}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wallets</SelectItem>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      {getTransactionBadge(transaction.type)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{transaction.description}</p>
                    {transaction.invoiceId && (
                      <p className="text-xs text-muted-foreground">Invoice: {transaction.invoiceId}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {transaction.type === 'wallet_transfer' ? (
                      <div className="text-sm">
                        <p>From: {getWalletName(transaction.fromWalletId)}</p>
                        <p>To: {getWalletName(transaction.toWalletId)}</p>
                      </div>
                    ) : (
                      <p className="text-sm">{getWalletName(transaction.walletId)}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(transaction.createdAt), 'dd MMM yyyy, HH:mm')}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    <span className={
                      transaction.type === 'wallet_withdrawal' 
                        ? 'text-destructive' 
                        : 'text-success'
                    }>
                      {transaction.type === 'wallet_withdrawal' ? '-' : '+'}
                      ₦{transaction.amount.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default History;
