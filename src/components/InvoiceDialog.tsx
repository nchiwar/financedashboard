import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { addInvoice, calculateVAT } from '@/lib/invoices';
import { getWallets } from '@/lib/wallets';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvoiceCreated: () => void;
}

const InvoiceDialog = ({ open, onOpenChange, onInvoiceCreated }: InvoiceDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallets, setWallets] = useState(() => getWallets());
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    amount: '',
    vat: '7.5',
    dueDate: '',
    status: 'pending' as 'paid' | 'unpaid' | 'pending',
    walletId: 'none',
  });

  const [calculated, setCalculated] = useState({ vatAmount: 0, total: 0 });

  useEffect(() => {
    if (open) {
      setWallets(getWallets());
    }
  }, [open]);

  useEffect(() => {
    if (formData.amount && formData.vat) {
      const amount = parseFloat(formData.amount);
      const vat = parseFloat(formData.vat);
      if (!isNaN(amount) && !isNaN(vat)) {
        setCalculated(calculateVAT(amount, vat));
      }
    }
  }, [formData.amount, formData.vat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    addInvoice({
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      amount: parseFloat(formData.amount),
      vat: parseFloat(formData.vat),
      vatAmount: calculated.vatAmount,
      total: calculated.total,
      dueDate: formData.dueDate,
      status: formData.status,
      userId: user.id,
      walletId: formData.walletId !== 'none' ? formData.walletId : undefined,
    });

    toast({
      title: 'Invoice created',
      description: 'New invoice has been added successfully',
    });

    setFormData({
      clientName: '',
      clientEmail: '',
      amount: '',
      vat: '7.5',
      dueDate: '',
      status: 'pending',
      walletId: 'none',
    });

    onInvoiceCreated();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="clientEmail">Client Email</Label>
            <Input
              id="clientEmail"
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="vat">VAT (%)</Label>
            <Input
              id="vat"
              type="number"
              step="0.1"
              value={formData.vat}
              onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
              required
            />
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>VAT Amount:</span>
              <span className="font-medium">₦{calculated.vatAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span>Total:</span>
              <span>₦{calculated.total.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="wallet">Link to Wallet (Optional)</Label>
            <Select value={formData.walletId} onValueChange={(v) => setFormData({ ...formData, walletId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a wallet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.name} ({wallet.currency}{wallet.balance.toLocaleString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Invoice
            </Button>
          </div>
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
