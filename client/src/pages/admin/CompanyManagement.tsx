import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Building, Plus, Search, Edit2, Globe, Users, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Company {
  id: number;
  tenantId: number;
  name: string;
  logoUrl: string;
  companyType: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const CompanyManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Sample company data for demonstration
  const sampleCompanies: Company[] = [
    {
      id: 1,
      tenantId: 1,
      name: 'Global Financial Services Inc.',
      logoUrl: '/api/placeholder/company-logo-1',
      companyType: 'public',
      description: 'Leading multinational financial services corporation providing banking, investment, and insurance solutions worldwide.',
      isActive: true,
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 2,
      tenantId: 1,
      name: 'TechStart Innovations Ltd.',
      logoUrl: '/api/placeholder/company-logo-2',
      companyType: 'private',
      description: 'Innovative fintech startup specializing in blockchain-based payment solutions and digital wallet services.',
      isActive: true,
      createdAt: '2024-01-16T10:30:00Z',
      updatedAt: '2024-01-19T16:45:00Z'
    },
    {
      id: 3,
      tenantId: 1,
      name: 'City Development Authority',
      logoUrl: '/api/placeholder/company-logo-3',
      companyType: 'government',
      description: 'Municipal government agency responsible for urban planning, infrastructure development, and public services.',
      isActive: true,
      createdAt: '2024-01-17T14:15:00Z',
      updatedAt: '2024-01-18T11:20:00Z'
    },
    {
      id: 4,
      tenantId: 1,
      name: 'Mom & Pop Corner Store',
      logoUrl: '/api/placeholder/company-logo-4',
      companyType: 'small_business',
      description: 'Family-owned retail business serving the local community with everyday essentials and friendly service.',
      isActive: true,
      createdAt: '2024-01-18T12:00:00Z',
      updatedAt: '2024-01-20T09:15:00Z'
    },
    {
      id: 5,
      tenantId: 1,
      name: 'John Smith Consulting',
      logoUrl: '/api/placeholder/company-logo-5',
      companyType: 'personal',
      description: 'Independent business consultant providing strategic advisory services to small and medium enterprises.',
      isActive: false,
      createdAt: '2024-01-12T08:30:00Z',
      updatedAt: '2024-01-15T17:00:00Z'
    }
  ];

  const filteredCompanies = sampleCompanies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || company.companyType === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-blue-100 text-blue-800';
      case 'private': return 'bg-purple-100 text-purple-800';
      case 'public': return 'bg-green-100 text-green-800';
      case 'small_business': return 'bg-orange-100 text-orange-800';
      case 'personal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'government': return <Globe className="h-4 w-4" />;
      case 'private': case 'public': return <Building className="h-4 w-4" />;
      case 'small_business': return <MapPin className="h-4 w-4" />;
      case 'personal': return <Users className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  const companyStats = {
    total: sampleCompanies.length,
    active: sampleCompanies.filter(c => c.isActive).length,
    government: sampleCompanies.filter(c => c.companyType === 'government').length,
    private: sampleCompanies.filter(c => c.companyType === 'private').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
          <p className="text-gray-600">Manage business entities and organizational profiles</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Company
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900">{companyStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Companies</p>
                <p className="text-2xl font-bold text-gray-900">{companyStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Government</p>
                <p className="text-2xl font-bold text-gray-900">{companyStats.government}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Private Sector</p>
                <p className="text-2xl font-bold text-gray-900">{companyStats.private}</p>
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
                  placeholder="Search companies by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Types</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="small_business">Small Business</option>
              <option value="personal">Personal</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTypeBadgeColor(company.companyType)}>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(company.companyType)}
                          {company.companyType.replace('_', ' ')}
                        </div>
                      </Badge>
                    </div>
                  </div>
                </div>
                <Badge className={company.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {company.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">{company.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Created: {new Date(company.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span>Updated: {new Date(company.updatedAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-4 w-4 mr-1" />
                    Users
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or add a new company.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add First Company
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyManagement;