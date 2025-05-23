import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CreditCard, ArrowUpDown, Clock, CheckCircle, XCircle, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CreditTransaction {
  id: number;
  tenantId: number;
  notionalValueId: number;
  transactionType: string;
  amount: number;
  previousBalance: number;
  newBalance: number;
  description: string;
  referenceId: string;
  processedBy: string;
  createdAt: string;
}

interface NotionalValue {
  id: number;
  tenantId: number;
  entityType: string;
  entityId: string;
  credits: number;
  currencyCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const TransactionCenter: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('transactions');

  // Sample credit transactions
  const sampleTransactions: CreditTransaction[] = [
    {
      id: 1,
      tenantId: 1,
      notionalValueId: 1,
      transactionType: 'add',
      amount: 1000.00,
      previousBalance: 5000.00,
      newBalance: 6000.00,
      description: 'Monthly credit allocation for customer rewards',
      referenceId: 'REF-2024-001',
      processedBy: 'system_admin',
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      id: 2,
      tenantId: 1,
      notionalValueId: 2,
      transactionType: 'payment',
      amount: 250.00,
      previousBalance: 2500.00,
      newBalance: 2250.00,
      description: 'Customer redemption for cashback rewards',
      referenceId: 'PAY-2024-002',
      processedBy: 'agent_001',
      createdAt: '2024-01-20T11:15:00Z'
    },
    {
      id: 3,
      tenantId: 1,
      notionalValueId: 3,
      transactionType: 'bonus',
      amount: 500.00,
      previousBalance: 1200.00,
      newBalance: 1700.00,
      description: 'Referral bonus for new customer acquisition',
      referenceId: 'BON-2024-003',
      processedBy: 'marketing_system',
      createdAt: '2024-01-20T12:45:00Z'
    },
    {
      id: 4,
      tenantId: 1,
      notionalValueId: 1,
      transactionType: 'decrease',
      amount: 100.00,
      previousBalance: 6000.00,
      newBalance: 5900.00,
      description: 'Administrative adjustment for expired credits',
      referenceId: 'ADJ-2024-004',
      processedBy: 'admin_002',
      createdAt: '2024-01-20T14:20:00Z'
    }
  ];

  // Sample notional values
  const sampleNotionalValues: NotionalValue[] = [
    {
      id: 1,
      tenantId: 1,
      entityType: 'user',
      entityId: 'USER001',
      credits: 5900.00,
      currencyCode: 'USD',
      isActive: true,
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-20T14:20:00Z'
    },
    {
      id: 2,
      tenantId: 1,
      entityType: 'user',
      entityId: 'USER002',
      credits: 2250.00,
      currencyCode: 'USD',
      isActive: true,
      createdAt: '2024-01-16T10:30:00Z',
      updatedAt: '2024-01-20T11:15:00Z'
    },
    {
      id: 3,
      tenantId: 1,
      entityType: 'role',
      entityId: 'PREMIUM_CUSTOMER',
      credits: 1700.00,
      currencyCode: 'USD',
      isActive: true,
      createdAt: '2024-01-17T14:15:00Z',
      updatedAt: '2024-01-20T12:45:00Z'
    }
  ];

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'add': case 'bonus': case 'increase': return 'bg-green-100 text-green-800';
      case 'payment': case 'decrease': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'add': case 'bonus': case 'increase': return <TrendingUp className="h-4 w-4" />;
      case 'payment': case 'decrease': return <ArrowUpDown className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const transactionStats = {
    totalTransactions: sampleTransactions.length,
    totalCredits: sampleNotionalValues.reduce((sum, nv) => sum + nv.credits, 0),
    creditsAdded: sampleTransactions
      .filter(t => ['add', 'bonus', 'increase'].includes(t.transactionType))
      .reduce((sum, t) => sum + t.amount, 0),
    creditsUsed: sampleTransactions
      .filter(t => ['payment', 'decrease'].includes(t.transactionType))
      .reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Center</h1>
          <p className="text-gray-600">Manage credit transactions and notional value tracking</p>
        </div>
        <Button className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          New Transaction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{transactionStats.totalTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">${transactionStats.totalCredits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Credits Added</p>
                <p className="text-2xl font-bold text-gray-900">${transactionStats.creditsAdded.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ArrowUpDown className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Credits Used</p>
                <p className="text-2xl font-bold text-gray-900">${transactionStats.creditsUsed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Credit Transactions</TabsTrigger>
          <TabsTrigger value="notional">Notional Values</TabsTrigger>
          <TabsTrigger value="limits">Transaction Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <div className="space-y-4">
            {sampleTransactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {getTransactionIcon(transaction.transactionType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                        <p className="text-sm text-gray-600">Reference: {transaction.referenceId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge className={getTransactionTypeColor(transaction.transactionType)}>
                          {transaction.transactionType}
                        </Badge>
                        <span className={`text-lg font-bold ${
                          ['add', 'bonus', 'increase'].includes(transaction.transactionType) 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {['add', 'bonus', 'increase'].includes(transaction.transactionType) ? '+' : '-'}
                          ${transaction.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Balance: ${transaction.previousBalance.toLocaleString()} → ${transaction.newBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <span>Processed by: {transaction.processedBy}</span>
                    <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notional" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleNotionalValues.map((notional) => (
              <Card key={notional.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{notional.entityType.toUpperCase()}</CardTitle>
                    <Badge className={notional.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {notional.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription>Entity ID: {notional.entityId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        ${notional.credits.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">{notional.currencyCode}</div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Created: {new Date(notional.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(notional.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Add Credits
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        View History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="limits">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Limits</CardTitle>
              <CardDescription>Configure transaction limits by role, user, and transaction type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction Limits Manager</h3>
                <p className="text-gray-600 mb-4">Set daily, monthly, and per-transaction limits for enhanced security</p>
                <Button>Configure Limits</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionCenter;