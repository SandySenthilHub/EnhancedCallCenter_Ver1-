import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Search, Edit2, Database, FileText, Settings, Code, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Entity {
  id: number;
  tenantId: number;
  name: string;
  displayName: string;
  type: string;
  parentEntityId: number | null;
  description: string;
  schema: any;
  isActive: boolean;
  recordCount: number;
  lastModified: string;
  createdAt: string;
}

const EntityFramework: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Sample entity data for demonstration
  const sampleEntities: Entity[] = [
    {
      id: 1,
      tenantId: 1,
      name: 'customer',
      displayName: 'Customer Management',
      type: 'primary',
      parentEntityId: null,
      description: 'Core customer data and relationship management',
      schema: {
        fields: [
          { name: 'customerId', type: 'string', required: true },
          { name: 'firstName', type: 'string', required: true },
          { name: 'lastName', type: 'string', required: true },
          { name: 'email', type: 'email', required: true },
          { name: 'phone', type: 'phone', required: false },
          { name: 'dateOfBirth', type: 'date', required: false },
          { name: 'accountStatus', type: 'enum', options: ['active', 'inactive', 'suspended'] }
        ]
      },
      isActive: true,
      recordCount: 15248,
      lastModified: '2024-01-20T10:30:00Z',
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      id: 2,
      tenantId: 1,
      name: 'account',
      displayName: 'Banking Accounts',
      type: 'primary',
      parentEntityId: 1,
      description: 'Customer banking accounts and balances',
      schema: {
        fields: [
          { name: 'accountNumber', type: 'string', required: true },
          { name: 'customerId', type: 'reference', entity: 'customer', required: true },
          { name: 'accountType', type: 'enum', options: ['checking', 'savings', 'credit', 'loan'] },
          { name: 'balance', type: 'decimal', required: true },
          { name: 'currency', type: 'string', required: true },
          { name: 'openDate', type: 'date', required: true },
          { name: 'status', type: 'enum', options: ['active', 'closed', 'frozen'] }
        ]
      },
      isActive: true,
      recordCount: 23456,
      lastModified: '2024-01-19T14:22:00Z',
      createdAt: '2024-01-15T11:30:00Z'
    },
    {
      id: 3,
      tenantId: 1,
      name: 'transaction',
      displayName: 'Financial Transactions',
      type: 'sub',
      parentEntityId: 2,
      description: 'All financial transactions and movements',
      schema: {
        fields: [
          { name: 'transactionId', type: 'string', required: true },
          { name: 'accountId', type: 'reference', entity: 'account', required: true },
          { name: 'amount', type: 'decimal', required: true },
          { name: 'transactionType', type: 'enum', options: ['debit', 'credit', 'transfer'] },
          { name: 'description', type: 'text', required: false },
          { name: 'timestamp', type: 'datetime', required: true },
          { name: 'channel', type: 'enum', options: ['atm', 'online', 'mobile', 'branch'] }
        ]
      },
      isActive: true,
      recordCount: 156780,
      lastModified: '2024-01-20T16:45:00Z',
      createdAt: '2024-01-16T08:15:00Z'
    },
    {
      id: 4,
      tenantId: 1,
      name: 'call_record',
      displayName: 'Call Center Records',
      type: 'reference',
      parentEntityId: 1,
      description: 'Customer service call logs and interactions',
      schema: {
        fields: [
          { name: 'callId', type: 'string', required: true },
          { name: 'customerId', type: 'reference', entity: 'customer', required: true },
          { name: 'agentId', type: 'string', required: true },
          { name: 'startTime', type: 'datetime', required: true },
          { name: 'endTime', type: 'datetime', required: false },
          { name: 'duration', type: 'integer', required: false },
          { name: 'callType', type: 'enum', options: ['inquiry', 'complaint', 'support', 'sales'] },
          { name: 'resolution', type: 'text', required: false },
          { name: 'satisfaction', type: 'integer', min: 1, max: 5 }
        ]
      },
      isActive: true,
      recordCount: 8945,
      lastModified: '2024-01-20T12:10:00Z',
      createdAt: '2024-01-17T13:20:00Z'
    }
  ];

  const filteredEntities = sampleEntities.filter((entity) => {
    const matchesSearch = entity.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || entity.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'primary': return 'bg-blue-100 text-blue-800';
      case 'sub': return 'bg-green-100 text-green-800';
      case 'reference': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSchemaPreview = (schema: any) => {
    if (!schema || !schema.fields) return 'No schema defined';
    return `${schema.fields.length} fields: ${schema.fields.slice(0, 3).map((f: any) => f.name).join(', ')}${schema.fields.length > 3 ? '...' : ''}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Entity Framework</h1>
          <p className="text-gray-600">Define and manage dynamic business entities with flexible schemas</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Entity
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Entities</p>
                <p className="text-2xl font-bold text-gray-900">{sampleEntities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Layers className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Primary Entities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sampleEntities.filter(e => e.type === 'primary').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sampleEntities.reduce((sum, e) => sum + e.recordCount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Code className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Schema Fields</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sampleEntities.reduce((sum, e) => sum + (e.schema?.fields?.length || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="entities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entities">Entity Management</TabsTrigger>
          <TabsTrigger value="schema">Schema Designer</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
        </TabsList>

        <TabsContent value="entities" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search entities by name or description..."
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
                  <option value="primary">Primary</option>
                  <option value="sub">Sub Entity</option>
                  <option value="reference">Reference</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Entities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntities.map((entity) => (
              <Card key={entity.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{entity.displayName}</CardTitle>
                    <Badge className={getTypeBadgeColor(entity.type)}>
                      {entity.type}
                    </Badge>
                  </div>
                  <CardDescription>{entity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Entity Name:</span>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{entity.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Records:</span>
                      <span className="font-semibold">{entity.recordCount.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Schema:</span>
                      <p className="text-xs text-gray-500 mt-1">{renderSchemaPreview(entity.schema)}</p>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Modified: {new Date(entity.lastModified).toLocaleDateString()}</span>
                      <span className={entity.isActive ? 'text-green-600' : 'text-red-600'}>
                        {entity.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-4 w-4 mr-1" />
                        Schema
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle>Schema Designer</CardTitle>
              <CardDescription>Visual schema design and field management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Schema Designer</h3>
                <p className="text-gray-600 mb-4">Visual drag-and-drop schema builder with field validation</p>
                <Button>Launch Schema Designer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships">
          <Card>
            <CardHeader>
              <CardTitle>Entity Relationships</CardTitle>
              <CardDescription>Manage relationships and dependencies between entities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Layers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Relationship Manager</h3>
                <p className="text-gray-600 mb-4">Visual relationship mapping and dependency tracking</p>
                <Button>Launch Relationship Manager</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EntityFramework;