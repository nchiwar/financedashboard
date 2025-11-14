import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getInvoices } from '@/lib/invoices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, FileText, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const invoices = useMemo(() => getInvoices(user?.id || ''), [user]);

  const stats = useMemo(() => {
    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const pendingAmount = invoices
      .filter(inv => inv.status === 'pending' || inv.status === 'unpaid')
      .reduce((sum, inv) => sum + inv.total, 0);
    const totalVAT = paidInvoices.reduce((sum, inv) => sum + inv.vatAmount, 0);

    return {
      totalInvoices,
      totalPaid,
      pendingAmount,
      totalVAT,
    };
  }, [invoices]);

  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    
    invoices.forEach(inv => {
      if (inv.status === 'paid') {
        const month = new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + inv.total;
      }
    });

    return Object.entries(monthlyData).map(([name, value]) => ({ name, value }));
  }, [invoices]);

  const recentInvoices = useMemo(() => 
    invoices
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
    [invoices]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-foreground text-background">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Working Capital</CardTitle>
            <DollarSign className="w-4 h-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₦{stats.totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total VAT Collected</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₦{stats.totalVAT.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₦{stats.pendingAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Working Capital</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{invoice.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(invoice.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold">₦{invoice.total.toLocaleString()}</p>
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
                </div>
              </div>
            ))}
            {recentInvoices.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No invoices yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
