import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { DollarSign, Plus, Search, Edit2, TrendingUp, TrendingDown, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
  exchangeRateToUSD: number;
  isActive: boolean;
  lastUpdated: string;
  createdAt: string;
}

const CurrencyManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showActive, setShowActive] = useState(true);

  // Sample currency data with real exchange rates
  const sampleCurrencies: Currency[] = [
    {
      id: 1,
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      decimalPlaces: 2,
      exchangeRateToUSD: 1.000000,
      isActive: true,
      lastUpdated: '2024-01-20T15:30:00Z',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 2,
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      decimalPlaces: 2,
      exchangeRateToUSD: 1.085400,
      isActive: true,
      lastUpdated: '2024-01-20T15:30:00Z',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 3,
      code: 'GBP',
      name: 'British Pound Sterling',
      symbol: '£',
      decimalPlaces: 2,
      exchangeRateToUSD: 1.270800,
      isActive: true,
      lastUpdated: '2024-01-20T15:30:00Z',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 4,
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      decimalPlaces: 0,
      exchangeRateToUSD: 0.006750,
      isActive: true,
      lastUpdated: '2024-01-20T15:30:00Z',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 5,
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'C$',
      decimalPlaces: 2,
      exchangeRateToUSD: 0.740200,
      isActive: true,
      lastUpdated: '2024-01-20T15:30:00Z',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 6,
      code: 'AUD',
      name: 'Australian Dollar',
      symbol: 'A$',
      decimalPlaces: 2,
      exchangeRateToUSD: 0.655300,
      isActive: true,
      lastUpdated: '2024-01-20T15:30:00Z',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 7,
      code: 'CHF',
      name: 'Swiss Franc',
      symbol: 'CHF',
      decimalPlaces: 2,
      exchangeRateToUSD: 1.087500,
      isActive: true,
      lastUpdated: '2024-01-20T15:30:00Z',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 8,
      code: 'CNY',
      name: 'Chinese Yuan',
      symbol: '¥',
      decimalPlaces: 2,
      exchangeRateToUSD: 0.138900,
      isActive: true,
      lastUpdated: '2024-01-20T15:30:00Z',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 9,
      code: 'AED',
      name: 'UAE Dirham',
      symbol: 'د.إ',
      decimalPlaces: 2,
      exchangeRateToUSD: 0.272300,
      isActive: true,
      lastUpdated: '2024-01-20T15:30:00Z',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 10,
      code: 'INR',
      name: 'Indian Rupee',
      symbol: '₹',
      decimalPlaces: 2,
      exchangeRateToUSD: 0.012030,
      isActive: false,
      lastUpdated: '2024-01-18T12:00:00Z',
      createdAt: '2024-01-15T09:00:00Z'
    }
  ];

  const filteredCurrencies = sampleCurrencies.filter((currency) => {
    const matchesSearch = currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         currency.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !showActive || currency.isActive;
    return matchesSearch && matchesStatus;
  });

  const getRateChangeColor = (rate: number) => {
    if (rate > 1.0) return 'text-green-600';
    if (rate < 1.0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRateChangeIcon = (rate: number) => {
    if (rate > 1.0) return <TrendingUp className="h-4 w-4" />;
    if (rate < 1.0) return <TrendingDown className="h-4 w-4" />;
    return <DollarSign className="h-4 w-4" />;
  };

  const currencyStats = {
    total: sampleCurrencies.length,
    active: sampleCurrencies.filter(c => c.isActive).length,
    strongerThanUSD: sampleCurrencies.filter(c => c.exchangeRateToUSD > 1.0).length,
    lastUpdated: new Date().toLocaleString()
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Currency Management</h1>
          <p className="text-gray-600">Manage multi-currency support with real-time exchange rates</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Currency
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Currencies</p>
                <p className="text-2xl font-bold text-gray-900">{currencyStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Currencies</p>
                <p className="text-2xl font-bold text-gray-900">{currencyStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stronger than USD</p>
                <p className="text-2xl font-bold text-gray-900">{currencyStats.strongerThanUSD}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Edit2 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-sm font-bold text-gray-900">{currencyStats.lastUpdated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search currencies by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showActive}
                  onChange={(e) => setShowActive(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Show active only</span>
              </label>
              <Button variant="outline" size="sm">
                Update All Rates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currencies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Exchange Rates</CardTitle>
          <CardDescription>
            Real-time exchange rates relative to USD base currency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-900">Currency</th>
                  <th className="text-left p-4 font-medium text-gray-900">Exchange Rate</th>
                  <th className="text-left p-4 font-medium text-gray-900">Symbol</th>
                  <th className="text-left p-4 font-medium text-gray-900">Decimals</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Last Updated</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCurrencies.map((currency) => (
                  <tr key={currency.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-blue-600">{currency.code}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{currency.name}</div>
                          <div className="text-sm text-gray-500">{currency.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-semibold ${getRateChangeColor(currency.exchangeRateToUSD)}`}>
                          {currency.exchangeRateToUSD.toFixed(6)}
                        </span>
                        <div className={getRateChangeColor(currency.exchangeRateToUSD)}>
                          {getRateChangeIcon(currency.exchangeRateToUSD)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        1 {currency.code} = ${currency.exchangeRateToUSD.toFixed(6)} USD
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-lg font-semibold">{currency.symbol}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{currency.decimalPlaces}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={currency.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {currency.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(currency.lastUpdated).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyManagement;