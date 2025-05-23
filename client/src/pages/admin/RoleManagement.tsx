import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Search, Edit2, Shield, Users, Settings, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { queryClient } from '@/lib/queryClient';

interface Role {
  id: number;
  tenantId: number;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

const RoleManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Sample role data with banking-specific permissions
  const sampleRoles: Role[] = [
    {
      id: 1,
      tenantId: 1,
      name: 'System Administrator',
      description: 'Full system access with complete administrative privileges',
      permissions: [
        'user.create', 'user.read', 'user.update', 'user.delete',
        'role.manage', 'tenant.manage', 'system.configure',
        'audit.view', 'reports.generate', 'security.manage'
      ],
      isSystemRole: true,
      userCount: 2,
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 2,
      tenantId: 1,
      name: 'Branch Manager',
      description: 'Manages branch operations and customer accounts',
      permissions: [
        'customer.create', 'customer.read', 'customer.update',
        'account.manage', 'transaction.approve', 'team.manage',
        'reports.branch', 'kpi.view'
      ],
      isSystemRole: false,
      userCount: 8,
      createdAt: '2024-01-16T10:30:00Z',
      updatedAt: '2024-01-19T16:45:00Z'
    },
    {
      id: 3,
      tenantId: 1,
      name: 'Customer Service Agent',
      description: 'Handles customer inquiries and basic account operations',
      permissions: [
        'customer.read', 'account.view', 'transaction.view',
        'call.manage', 'ticket.create', 'knowledge.access'
      ],
      isSystemRole: false,
      userCount: 25,
      createdAt: '2024-01-17T14:15:00Z',
      updatedAt: '2024-01-18T11:20:00Z'
    },
    {
      id: 4,
      tenantId: 1,
      name: 'Compliance Officer',
      description: 'Ensures regulatory compliance and risk management',
      permissions: [
        'compliance.monitor', 'audit.conduct', 'risk.assess',
        'report.regulatory', 'alert.manage', 'investigation.lead'
      ],
      isSystemRole: false,
      userCount: 4,
      createdAt: '2024-01-18T12:00:00Z',
      updatedAt: '2024-01-20T09:15:00Z'
    },
    {
      id: 5,
      tenantId: 1,
      name: 'Financial Analyst',
      description: 'Analyzes financial data and generates insights',
      permissions: [
        'analytics.view', 'reports.financial', 'dashboard.access',
        'kpi.analyze', 'forecast.generate', 'data.export'
      ],
      isSystemRole: false,
      userCount: 6,
      createdAt: '2024-01-19T08:30:00Z',
      updatedAt: '2024-01-20T17:00:00Z'
    }
  ];

  const filteredRoles = sampleRoles.filter((role) => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || 
                       (selectedType === 'system' && role.isSystemRole) ||
                       (selectedType === 'custom' && !role.isSystemRole);
    return matchesSearch && matchesType;
  });

  const getRoleBadgeColor = (isSystemRole: boolean) => {
    return isSystemRole ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  const getPermissionCount = (permissions: string[]) => {
    return permissions.length;
  };

  const roleStats = {
    total: sampleRoles.length,
    systemRoles: sampleRoles.filter(r => r.isSystemRole).length,
    customRoles: sampleRoles.filter(r => !r.isSystemRole).length,
    totalUsers: sampleRoles.reduce((sum, r) => sum + r.userCount, 0)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-600">Configure role-based access control and permissions</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Role
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900">{roleStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Lock className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Roles</p>
                <p className="text-2xl font-bold text-gray-900">{roleStats.systemRoles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Custom Roles</p>
                <p className="text-2xl font-bold text-gray-900">{roleStats.customRoles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{roleStats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles ({filteredRoles.length})</CardTitle>
          <CardDescription>
            Manage roles and their associated permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search roles by name or description..."
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
              <option value="all">All Roles</option>
              <option value="system">System Roles</option>
              <option value="custom">Custom Roles</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-900">Role</th>
                  <th className="text-left p-4 font-medium text-gray-900">Type</th>
                  <th className="text-left p-4 font-medium text-gray-900">Permissions</th>
                  <th className="text-left p-4 font-medium text-gray-900">Users</th>
                  <th className="text-left p-4 font-medium text-gray-900">Created</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{role.name}</div>
                          <div className="text-sm text-gray-500">{role.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getRoleBadgeColor(role.isSystemRole)}>
                        {role.isSystemRole ? 'System' : 'Custom'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          {getPermissionCount(role.permissions)}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">permissions</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {role.permissions.slice(0, 2).join(', ')}
                        {role.permissions.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{role.userCount}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {new Date(role.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4" />
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

export default RoleManagement;