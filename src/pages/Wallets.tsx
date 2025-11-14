import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import WalletCard from '@/components/WalletCard';
import WalletDialog from '@/components/WalletDialog';
import { getWallets, addWallet, updateWallet, deleteWallet, getTotalBalance, Wallet } from '@/lib/wallets';
import { toast } from 'sonner';

const Wallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = () => {
    setWallets(getWallets());
  };

  const handleAddWallet = (walletData: Omit<Wallet, 'id' | 'createdAt'>) => {
    if (editingWallet) {
      updateWallet(editingWallet.id, walletData);
      toast.success('Wallet updated successfully');
      setEditingWallet(null);
    } else {
      addWallet(walletData);
      toast.success('Wallet added successfully');
    }
    loadWallets();
  };

  const handleEdit = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteWallet(id);
    toast.success('Wallet deleted successfully');
    loadWallets();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingWallet(null);
  };

  const totalBalance = getTotalBalance();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Wallets</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Wallet
        </Button>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <p className="text-sm opacity-90 mb-2">Total Balance Across All Wallets</p>
        <p className="text-4xl font-bold">₦ {totalBalance.toLocaleString()}</p>
      </Card>

      {wallets.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No wallets added yet</p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Wallet
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <WalletDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleAddWallet}
        editWallet={editingWallet}
      />
    </div>
  );
};

export default Wallets;
