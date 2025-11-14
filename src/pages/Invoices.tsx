import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getInvoices, updateInvoice, deleteInvoice } from '@/lib/invoices';
import { updateWallet, getWallets } from '@/lib/wallets';
import { addTransaction } from '@/lib/transactions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MoreVertical, Trash2, Check } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import InvoiceDialog from '@/components/InvoiceDialog';

const Invoices = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid' | 'pending'>('all');
  const [invoices, setInvoices] = useState(() => getInvoices(user?.id || ''));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredInvoices = useMemo(() => {
    if (filter === 'all') return invoices;
    return invoices.filter(inv => inv.status === filter);
  }, [invoices, filter]);

  const handleMarkAsPaid = (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;

    updateInvoice(id, { status: 'paid' });
    
    // Update wallet balance if linked
    if (invoice.walletId) {
      const wallets = getWallets();
      const wallet = wallets.find(w => w.id === invoice.walletId);
      if (wallet) {
        updateWallet(wallet.id, { balance: wallet.balance + invoice.total });
        
        // Record transaction
        addTransaction({
          type: 'invoice_payment',
          amount: invoice.total,
          description: `Payment received from ${invoice.clientName}`,
          walletId: wallet.id,
          invoiceId: invoice.id,
          userId: user?.id || '',
        });
      }
    }
    
    setInvoices(getInvoices(user?.id || ''));
    toast({
      title: 'Invoice updated',
      description: 'Invoice marked as paid' + (invoice.walletId ? ' and wallet updated' : ''),
    });
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    setInvoices(getInvoices(user?.id || ''));
    toast({
      title: 'Invoice deleted',
      description: 'Invoice has been removed',
    });
  };

  const handleInvoiceCreated = () => {
    setInvoices(getInvoices(user?.id || ''));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Invoice
        </Button>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>VAT</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.clientName}</p>
                        <p className="text-sm text-muted-foreground">{invoice.clientEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(invoice.createdAt), 'dd MMM yyyy')}</p>
                        <p className="text-muted-foreground">Due: {format(new Date(invoice.dueDate), 'dd MMM')}</p>
                      </div>
                    </TableCell>
                    <TableCell>₦{invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>{invoice.vat}%</TableCell>
                    <TableCell className="font-semibold">₦{invoice.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={invoice.status === 'paid' ? 'default' : invoice.status === 'pending' ? 'secondary' : 'destructive'}
                        className={
                          invoice.status === 'paid'
                            ? 'bg-success text-success-foreground'
                            : invoice.status === 'pending'
                            ? 'bg-warning text-warning-foreground'
                            : ''
                        }
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {invoice.status !== 'paid' && (
                            <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>
                              <Check className="w-4 h-4 mr-2" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDelete(invoice.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <InvoiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onInvoiceCreated={handleInvoiceCreated}
      />
    </div>
  );
};

export default Invoices;
