import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet } from '@/lib/wallets';

interface WalletDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (wallet: Omit<Wallet, 'id' | 'createdAt'>) => void;
  editWallet?: Wallet | null;
}

const walletColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#14b8a6'
];

const WalletDialog = ({ open, onClose, onSave, editWallet }: WalletDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank' as 'bank' | 'cash' | 'mobile' | 'crypto',
    balance: '',
    accountNumber: '',
    currency: '₦',
    color: walletColors[0],
  });

  useEffect(() => {
    if (editWallet) {
      setFormData({
        name: editWallet.name,
        type: editWallet.type,
        balance: editWallet.balance.toString(),
        accountNumber: editWallet.accountNumber || '',
        currency: editWallet.currency,
        color: editWallet.color,
      });
    } else {
      setFormData({
        name: '',
        type: 'bank',
        balance: '',
        accountNumber: '',
        currency: '₦',
        color: walletColors[0],
      });
    }
  }, [editWallet, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance) || 0,
      accountNumber: formData.accountNumber,
      currency: formData.currency,
      color: formData.color,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editWallet ? 'Edit Wallet' : 'Add New Wallet'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Wallet Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Main Business Account"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Account Type</Label>
            <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Account</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="mobile">Mobile Money</SelectItem>
                <SelectItem value="crypto">Cryptocurrency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accountNumber">Account Number (Optional)</Label>
            <Input
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              placeholder="0123456789"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="₦">₦ Naira</SelectItem>
                  <SelectItem value="$">$ Dollar</SelectItem>
                  <SelectItem value="€">€ Euro</SelectItem>
                  <SelectItem value="£">£ Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="balance">Current Balance</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <Label>Wallet Color</Label>
            <div className="flex gap-2 mt-2">
              {walletColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{ 
                    backgroundColor: color,
                    borderColor: formData.color === color ? 'hsl(var(--foreground))' : 'transparent'
                  }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editWallet ? 'Update' : 'Add'} Wallet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WalletDialog;
