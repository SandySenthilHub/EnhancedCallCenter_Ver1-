import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Play, Pause, Square, Edit2, Workflow, Clock, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WorkflowDefinition {
  id: number;
  tenantId: number;
  name: string;
  description: string;
  workflow: any;
  sourceEntityId: number;
  targetEntityId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowInstance {
  id: number;
  definitionId: number;
  status: string;
  data: any;
  executedBy: string;
  executedAt: string;
  createdAt: string;
}

const WorkflowManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('definitions');

  // Sample workflow definitions
  const sampleDefinitions: WorkflowDefinition[] = [
    {
      id: 1,
      tenantId: 1,
      name: 'Customer Onboarding',
      description: 'Complete customer verification and account setup process',
      workflow: {
        steps: [
          { id: 1, name: 'Identity Verification', type: 'approval', assignee: 'compliance_team' },
          { id: 2, name: 'Credit Check', type: 'automated', service: 'credit_bureau' },
          { id: 3, name: 'Account Creation', type: 'automated', service: 'core_banking' },
          { id: 4, name: 'Welcome Package', type: 'notification', template: 'welcome_email' }
        ],
        rules: [
          { condition: 'credit_score < 600', action: 'require_manager_approval' },
          { condition: 'high_risk_customer', action: 'additional_verification' }
        ]
      },
      sourceEntityId: 1,
      targetEntityId: 2,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-18T14:30:00Z'
    },
    {
      id: 2,
      tenantId: 1,
      name: 'Transaction Approval',
      description: 'High-value transaction verification and approval workflow',
      workflow: {
        steps: [
          { id: 1, name: 'Fraud Detection', type: 'automated', service: 'fraud_engine' },
          { id: 2, name: 'Risk Assessment', type: 'automated', service: 'risk_calculator' },
          { id: 3, name: 'Manager Approval', type: 'approval', assignee: 'transaction_manager' },
          { id: 4, name: 'Execute Transaction', type: 'automated', service: 'payment_processor' }
        ],
        rules: [
          { condition: 'amount > 10000', action: 'require_dual_approval' },
          { condition: 'suspicious_pattern', action: 'hold_for_investigation' }
        ]
      },
      sourceEntityId: 2,
      targetEntityId: 3,
      isActive: true,
      createdAt: '2024-01-16T09:30:00Z',
      updatedAt: '2024-01-19T11:15:00Z'
    },
    {
      id: 3,
      tenantId: 1,
      name: 'Complaint Resolution',
      description: 'Customer complaint handling and resolution process',
      workflow: {
        steps: [
          { id: 1, name: 'Initial Assessment', type: 'manual', assignee: 'customer_service' },
          { id: 2, name: 'Investigation', type: 'manual', assignee: 'investigation_team' },
          { id: 3, name: 'Resolution Proposal', type: 'approval', assignee: 'supervisor' },
          { id: 4, name: 'Customer Communication', type: 'notification', template: 'resolution_email' }
        ],
        rules: [
          { condition: 'severity = high', action: 'escalate_to_manager' },
          { condition: 'financial_impact > 1000', action: 'legal_review' }
        ]
      },
      sourceEntityId: 4,
      targetEntityId: 1,
      isActive: true,
      createdAt: '2024-01-17T13:45:00Z',
      updatedAt: '2024-01-20T08:20:00Z'
    }
  ];

  // Sample workflow instances
  const sampleInstances: WorkflowInstance[] = [
    {
      id: 1,
      definitionId: 1,
      status: 'in_progress',
      data: { customerId: 'C12345', currentStep: 2 },
      executedBy: 'agent_001',
      executedAt: '2024-01-20T09:00:00Z',
      createdAt: '2024-01-20T09:00:00Z'
    },
    {
      id: 2,
      definitionId: 2,
      status: 'pending_approval',
      data: { transactionId: 'T98765', amount: 15000, currentStep: 3 },
      executedBy: 'system',
      executedAt: '2024-01-20T10:30:00Z',
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      id: 3,
      definitionId: 1,
      status: 'completed',
      data: { customerId: 'C54321', currentStep: 4 },
      executedBy: 'agent_002',
      executedAt: '2024-01-19T16:45:00Z',
      createdAt: '2024-01-19T16:45:00Z'
    },
    {
      id: 4,
      definitionId: 3,
      status: 'failed',
      data: { complaintId: 'CP789', currentStep: 2, error: 'Investigation timeout' },
      executedBy: 'agent_003',
      executedAt: '2024-01-18T14:20:00Z',
      createdAt: '2024-01-18T14:20:00Z'
    }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Play className="h-4 w-4" />;
      case 'pending_approval': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  const workflowStats = {
    totalDefinitions: sampleDefinitions.length,
    activeInstances: sampleInstances.filter(i => i.status === 'in_progress').length,
    completedToday: sampleInstances.filter(i => 
      i.status === 'completed' && 
      new Date(i.executedAt).toDateString() === new Date().toDateString()
    ).length,
    pendingApproval: sampleInstances.filter(i => i.status === 'pending_approval').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Management</h1>
          <p className="text-gray-600">Design, execute, and monitor business process automation</p>
        </div>
        <Button className="flex items-center gap-2">
          <Workflow className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Workflow className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{workflowStats.totalDefinitions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Instances</p>
                <p className="text-2xl font-bold text-gray-900">{workflowStats.activeInstances}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{workflowStats.completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{workflowStats.pendingApproval}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="definitions">Workflow Definitions</TabsTrigger>
          <TabsTrigger value="instances">Active Instances</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="definitions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sampleDefinitions.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <Badge className={workflow.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {workflow.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Workflow Steps:</h4>
                      <div className="space-y-2">
                        {workflow.workflow.steps.map((step: any, index: number) => (
                          <div key={step.id} className="flex items-center text-sm">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mr-3">
                              {index + 1}
                            </div>
                            <span className="text-gray-700">{step.name}</span>
                            <Badge className="ml-auto text-xs" variant="outline">
                              {step.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Created: {new Date(workflow.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="instances" className="space-y-4">
          <div className="space-y-4">
            {sampleInstances.map((instance) => {
              const definition = sampleDefinitions.find(d => d.id === instance.definitionId);
              return (
                <Card key={instance.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(instance.status)}
                          <h3 className="font-semibold text-gray-900">
                            {definition?.name || 'Unknown Workflow'}
                          </h3>
                          <Badge className={getStatusBadgeColor(instance.status)}>
                            {instance.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{definition?.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div>Instance ID: {instance.id}</div>
                          <div>Executed by: {instance.executedBy}</div>
                          <div>Started: {new Date(instance.createdAt).toLocaleDateString()}</div>
                        </div>
                        {instance.data && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <div className="text-sm font-medium text-gray-700 mb-1">Instance Data:</div>
                            <div className="text-xs text-gray-600 font-mono">
                              {JSON.stringify(instance.data, null, 2)}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        {instance.status === 'in_progress' && (
                          <Button size="sm" variant="outline">
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                        )}
                        {instance.status === 'pending_approval' && (
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        {instance.status === 'failed' && (
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Analytics</CardTitle>
              <CardDescription>Performance metrics and insights for your workflow processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
                <p className="text-gray-600 mb-4">Comprehensive workflow performance analysis and optimization insights</p>
                <Button>Launch Analytics Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowManagement;