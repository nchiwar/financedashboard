import { Wallet as WalletIcon, CreditCard, Smartphone, Bitcoin, Trash2, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet } from '@/lib/wallets';

interface WalletCardProps {
  wallet: Wallet;
  onEdit: (wallet: Wallet) => void;
  onDelete: (id: string) => void;
}

const walletIcons = {
  bank: CreditCard,
  cash: WalletIcon,
  mobile: Smartphone,
  crypto: Bitcoin,
};

const WalletCard = ({ wallet, onEdit, onDelete }: WalletCardProps) => {
  const Icon = walletIcons[wallet.type];

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: wallet.color }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(wallet)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(wallet.id)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      <h3 className="font-semibold text-lg mb-1">{wallet.name}</h3>
      <p className="text-sm text-muted-foreground capitalize mb-4">{wallet.type} Account</p>

      {wallet.accountNumber && (
        <p className="text-sm text-muted-foreground mb-4">
          {wallet.accountNumber}
        </p>
      )}

      <div className="pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-1">Balance</p>
        <p className="text-2xl font-bold">
          {wallet.currency} {wallet.balance.toLocaleString()}
        </p>
      </div>
    </Card>
  );
};

export default WalletCard;
