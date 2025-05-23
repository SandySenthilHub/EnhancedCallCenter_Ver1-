import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Inbox, Send, Clock, CheckCircle, AlertCircle, User, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InboxItem {
  id: number;
  fromUserId: string;
  toUserId: string;
  subject: string;
  message: string;
  itemType: string;
  priority: string;
  status: string;
  dueDate: string;
  completedAt: string | null;
  isRead: boolean;
  createdAt: string;
}

const WorkflowInbox: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('inbox');

  // Sample inbox data for demonstration
  const sampleInboxItems: InboxItem[] = [
    {
      id: 1,
      fromUserId: 'system',
      toUserId: 'current_user',
      subject: 'Customer Account Verification Required',
      message: 'Customer ID: C12345 requires manual verification for high-value transaction approval.',
      itemType: 'approval',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-01-25T17:00:00Z',
      completedAt: null,
      isRead: false,
      createdAt: '2024-01-20T09:30:00Z'
    },
    {
      id: 2,
      fromUserId: 'manager_001',
      toUserId: 'current_user',
      subject: 'Team Performance Review',
      message: 'Please review and approve the quarterly performance metrics for your team members.',
      itemType: 'task',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2024-01-30T23:59:00Z',
      completedAt: null,
      isRead: true,
      createdAt: '2024-01-18T14:22:00Z'
    },
    {
      id: 3,
      fromUserId: 'compliance_bot',
      toUserId: 'current_user',
      subject: 'KYC Document Validation',
      message: 'New KYC documents uploaded for customer require compliance officer review.',
      itemType: 'notification',
      priority: 'urgent',
      status: 'pending',
      dueDate: '2024-01-22T12:00:00Z',
      completedAt: null,
      isRead: false,
      createdAt: '2024-01-20T11:45:00Z'
    },
    {
      id: 4,
      fromUserId: 'audit_system',
      toUserId: 'current_user',
      subject: 'Monthly Audit Report Complete',
      message: 'The monthly audit report has been generated and is ready for review.',
      itemType: 'notification',
      priority: 'low',
      status: 'completed',
      dueDate: '2024-01-20T18:00:00Z',
      completedAt: '2024-01-20T16:30:00Z',
      isRead: true,
      createdAt: '2024-01-20T16:25:00Z'
    }
  ];

  const sampleOutboxItems: InboxItem[] = [
    {
      id: 5,
      fromUserId: 'current_user',
      toUserId: 'team_lead_002',
      subject: 'Transaction Anomaly Alert',
      message: 'Detected unusual transaction pattern for customer C98765. Please investigate urgently.',
      itemType: 'alert',
      priority: 'high',
      status: 'sent',
      dueDate: '2024-01-21T10:00:00Z',
      completedAt: null,
      isRead: true,
      createdAt: '2024-01-20T08:15:00Z'
    },
    {
      id: 6,
      fromUserId: 'current_user',
      toUserId: 'supervisor_003',
      subject: 'Shift Coverage Request',
      message: 'Requesting coverage for evening shift on January 25th due to medical appointment.',
      itemType: 'task',
      priority: 'medium',
      status: 'approved',
      dueDate: '2024-01-25T18:00:00Z',
      completedAt: '2024-01-20T13:22:00Z',
      isRead: true,
      createdAt: '2024-01-19T16:40:00Z'
    }
  ];

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="h-4 w-4" />;
      case 'task': return <Clock className="h-4 w-4" />;
      case 'notification': return <Inbox className="h-4 w-4" />;
      case 'alert': return <AlertCircle className="h-4 w-4" />;
      default: return <Inbox className="h-4 w-4" />;
    }
  };

  const inboxStats = {
    total: sampleInboxItems.length,
    unread: sampleInboxItems.filter(item => !item.isRead).length,
    urgent: sampleInboxItems.filter(item => item.priority === 'urgent').length,
    overdue: sampleInboxItems.filter(item => new Date(item.dueDate) < new Date() && item.status !== 'completed').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Inbox</h1>
          <p className="text-gray-600">Manage tasks, approvals, and notifications in your workflow queue</p>
        </div>
        <Button className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Compose Message
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Inbox className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inboxStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{inboxStats.unread}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-gray-900">{inboxStats.urgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{inboxStats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Inbox ({sampleInboxItems.length})
          </TabsTrigger>
          <TabsTrigger value="outbox" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Sent ({sampleOutboxItems.length})
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Active Workflows
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <div className="space-y-4">
            {sampleInboxItems.map((item) => (
              <Card key={item.id} className={`hover:shadow-md transition-shadow ${!item.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(item.itemType)}
                        <h3 className={`font-semibold ${!item.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {item.subject}
                        </h3>
                        <Badge className={getPriorityBadgeColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge className={getStatusBadgeColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{item.message}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          From: {item.fromUserId}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </div>
                        <div>
                          Created: {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {item.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            <Clock className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </>
                      )}
                      {item.status === 'in_progress' && (
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="outbox" className="space-y-4">
          <div className="space-y-4">
            {sampleOutboxItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Send className="h-4 w-4" />
                        <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                        <Badge className={getPriorityBadgeColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge className={getStatusBadgeColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{item.message}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          To: {item.toUserId}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Sent: {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        {item.completedAt && (
                          <div>
                            Completed: {new Date(item.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows">
          <Card>
            <CardHeader>
              <CardTitle>Active Workflow Processes</CardTitle>
              <CardDescription>Monitor and manage running business processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ArrowRight className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow Engine</h3>
                <p className="text-gray-600 mb-4">Advanced business process automation and monitoring</p>
                <Button>Launch Workflow Designer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowInbox;