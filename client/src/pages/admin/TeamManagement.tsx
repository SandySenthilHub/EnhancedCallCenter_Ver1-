import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Search, Edit2, Users, UserCheck, Calendar, Crown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { queryClient } from '@/lib/queryClient';

interface Team {
  id: number;
  name: string;
  description: string;
  tenantId: number;
  managerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  memberCount: number;
}

interface TeamMembership {
  id: number;
  teamId: number;
  userId: string;
  role: string;
  joinedAt: string;
  isActive: boolean;
}

const TeamManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample team data
  const sampleTeams: Team[] = [
    {
      id: 1,
      name: 'Customer Service Team',
      description: 'Front-line customer support and service representatives',
      tenantId: 1,
      managerId: 'manager_001',
      isActive: true,
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      createdBy: 'admin',
      memberCount: 12
    },
    {
      id: 2,
      name: 'Technical Support',
      description: 'Advanced technical assistance and problem resolution',
      tenantId: 1,
      managerId: 'manager_002',
      isActive: true,
      createdAt: '2024-01-16T10:30:00Z',
      updatedAt: '2024-01-19T16:45:00Z',
      createdBy: 'admin',
      memberCount: 8
    },
    {
      id: 3,
      name: 'Sales Team',
      description: 'Business development and customer acquisition specialists',
      tenantId: 1,
      managerId: 'manager_003',
      isActive: true,
      createdAt: '2024-01-17T14:15:00Z',
      updatedAt: '2024-01-18T11:20:00Z',
      createdBy: 'admin',
      memberCount: 15
    },
    {
      id: 4,
      name: 'Compliance Team',
      description: 'Regulatory compliance and risk management officers',
      tenantId: 1,
      managerId: 'manager_004',
      isActive: true,
      createdAt: '2024-01-18T12:00:00Z',
      updatedAt: '2024-01-20T09:15:00Z',
      createdBy: 'admin',
      memberCount: 6
    },
    {
      id: 5,
      name: 'Legacy Systems Team',
      description: 'Maintenance of deprecated banking systems',
      tenantId: 1,
      managerId: 'manager_005',
      isActive: false,
      createdAt: '2024-01-12T08:30:00Z',
      updatedAt: '2024-01-15T17:00:00Z',
      createdBy: 'admin',
      memberCount: 3
    }
  ];

  const filteredTeams = sampleTeams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && team.isActive) ||
                         (selectedStatus === 'inactive' && !team.isActive);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const teamStats = {
    total: sampleTeams.length,
    active: sampleTeams.filter(t => t.isActive).length,
    totalMembers: sampleTeams.reduce((sum, t) => sum + t.memberCount, 0),
    averageSize: Math.round(sampleTeams.reduce((sum, t) => sum + t.memberCount, 0) / sampleTeams.length)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Organize users into teams and manage team memberships</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Team
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                <p className="text-2xl font-bold text-gray-900">{teamStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Teams</p>
                <p className="text-2xl font-bold text-gray-900">{teamStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Size</p>
                <p className="text-2xl font-bold text-gray-900">{teamStats.averageSize}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teams ({filteredTeams.length})</CardTitle>
          <CardDescription>
            Manage team structure and member assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search teams by name or description..."
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
              <option value="all">All Teams</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-900">Team</th>
                  <th className="text-left p-4 font-medium text-gray-900">Manager</th>
                  <th className="text-left p-4 font-medium text-gray-900">Members</th>
                  <th className="text-left p-4 font-medium text-gray-900">Status</th>
                  <th className="text-left p-4 font-medium text-gray-900">Created</th>
                  <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{team.name}</div>
                          <div className="text-sm text-gray-500">{team.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Crown className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="ml-2 text-sm text-gray-900">{team.managerId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900">{team.memberCount}</span>
                        <span className="ml-1 text-sm text-gray-500">members</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusBadgeColor(team.isActive)}>
                        {team.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Crown className="h-4 w-4" />
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

export default TeamManagement;