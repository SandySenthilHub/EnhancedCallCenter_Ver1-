import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Search, Edit2, Globe, MapPin, Phone, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Country {
  id: number;
  name: string;
  code: string;
  code2: string;
  dialCode: string;
  currencyCode: string;
  isActive: boolean;
  regionCount: number;
  cityCount: number;
  createdAt: string;
}

interface Region {
  id: number;
  countryId: number;
  countryName: string;
  name: string;
  code: string;
  isActive: boolean;
  cityCount: number;
  createdAt: string;
}

const CountryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTab, setSelectedTab] = useState('countries');

  // Sample countries data
  const sampleCountries: Country[] = [
    {
      id: 1,
      name: 'United States',
      code: 'USA',
      code2: 'US',
      dialCode: '+1',
      currencyCode: 'USD',
      isActive: true,
      regionCount: 50,
      cityCount: 19354,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 2,
      name: 'United Kingdom',
      code: 'GBR',
      code2: 'GB',
      dialCode: '+44',
      currencyCode: 'GBP',
      isActive: true,
      regionCount: 4,
      cityCount: 51,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 3,
      name: 'United Arab Emirates',
      code: 'ARE',
      code2: 'AE',
      dialCode: '+971',
      currencyCode: 'AED',
      isActive: true,
      regionCount: 7,
      cityCount: 12,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 4,
      name: 'Germany',
      code: 'DEU',
      code2: 'DE',
      dialCode: '+49',
      currencyCode: 'EUR',
      isActive: true,
      regionCount: 16,
      cityCount: 2056,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 5,
      name: 'Japan',
      code: 'JPN',
      code2: 'JP',
      dialCode: '+81',
      currencyCode: 'JPY',
      isActive: true,
      regionCount: 47,
      cityCount: 792,
      createdAt: '2024-01-15T09:00:00Z'
    }
  ];

  // Sample regions data
  const sampleRegions: Region[] = [
    {
      id: 1,
      countryId: 1,
      countryName: 'United States',
      name: 'California',
      code: 'CA',
      isActive: true,
      cityCount: 482,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 2,
      countryId: 1,
      countryName: 'United States',
      name: 'New York',
      code: 'NY',
      isActive: true,
      cityCount: 1522,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 3,
      countryId: 3,
      countryName: 'United Arab Emirates',
      name: 'Dubai',
      code: 'DU',
      isActive: true,
      cityCount: 5,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 4,
      countryId: 3,
      countryName: 'United Arab Emirates',
      name: 'Abu Dhabi',
      code: 'AD',
      isActive: true,
      cityCount: 3,
      createdAt: '2024-01-15T09:00:00Z'
    }
  ];

  const filteredCountries = sampleCountries.filter((country) => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && country.isActive) ||
                         (selectedStatus === 'inactive' && !country.isActive);
    return matchesSearch && matchesStatus;
  });

  const filteredRegions = sampleRegions.filter((region) => {
    const matchesSearch = region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         region.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         region.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const countryStats = {
    totalCountries: sampleCountries.length,
    activeCountries: sampleCountries.filter(c => c.isActive).length,
    totalRegions: sampleRegions.length,
    totalCities: sampleCountries.reduce((sum, c) => sum + c.cityCount, 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Countries & Regions</h1>
          <p className="text-gray-600">Manage global geographic data and regional hierarchies</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Country
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Countries</p>
                <p className="text-2xl font-bold text-gray-900">{countryStats.totalCountries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Countries</p>
                <p className="text-2xl font-bold text-gray-900">{countryStats.activeCountries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Regions</p>
                <p className="text-2xl font-bold text-gray-900">{countryStats.totalRegions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cities</p>
                <p className="text-2xl font-bold text-gray-900">{countryStats.totalCities.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="countries">Countries ({filteredCountries.length})</TabsTrigger>
          <TabsTrigger value="regions">Regions ({filteredRegions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="countries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Country Management</CardTitle>
              <CardDescription>
                Manage country information, codes, and regional data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search countries by name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="all">All Countries</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-gray-900">Country</th>
                      <th className="text-left p-4 font-medium text-gray-900">Codes</th>
                      <th className="text-left p-4 font-medium text-gray-900">Contact</th>
                      <th className="text-left p-4 font-medium text-gray-900">Regions</th>
                      <th className="text-left p-4 font-medium text-gray-900">Cities</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCountries.map((country) => (
                      <tr key={country.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Globe className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{country.name}</div>
                              <div className="text-sm text-gray-500">ISO: {country.code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                              {country.code2}
                            </span>
                            <div className="text-xs text-gray-500">{country.code}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm">{country.dialCode}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm">{country.currencyCode}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-lg font-semibold text-gray-900">{country.regionCount}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-lg font-semibold text-gray-900">{country.cityCount.toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusBadgeColor(country.isActive)}>
                            {country.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MapPin className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Management</CardTitle>
              <CardDescription>
                Manage regions, states, and provinces within countries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-6">
                <div className="flex-1 mr-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search regions by name or country..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Region
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-gray-900">Region</th>
                      <th className="text-left p-4 font-medium text-gray-900">Country</th>
                      <th className="text-left p-4 font-medium text-gray-900">Code</th>
                      <th className="text-left p-4 font-medium text-gray-900">Cities</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegions.map((region) => (
                      <tr key={region.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <MapPin className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="ml-3 text-sm font-medium text-gray-900">{region.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-900">{region.countryName}</td>
                        <td className="p-4">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {region.code}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-gray-900">{region.cityCount}</span>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusBadgeColor(region.isActive)}>
                            {region.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Globe className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CountryManagement;