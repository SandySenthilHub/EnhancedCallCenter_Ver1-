import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings,
  Key,
  Cloud,
  Globe,
  Shield,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Save,
  TestTube,
  RefreshCw,
  Bell,
  Database,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';

interface ProviderCredential {
  id: string;
  name: string;
  type: 'azure' | 'aws' | 'openai' | 'deepgram';
  status: 'configured' | 'missing' | 'invalid';
  lastTested: string;
  fields: { name: string; label: string; type: 'text' | 'password' | 'select'; required: boolean; value?: string; options?: string[] }[];
}

interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  category: 'transcription' | 'analysis' | 'compliance' | 'performance';
  enabled: boolean;
  requiresCredentials: boolean;
  dependencies: string[];
}

interface ProcessingRule {
  id: string;
  name: string;
  type: 'quality' | 'routing' | 'redaction' | 'alert';
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
}

const ConfigurationCenter: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('credentials');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Provider credentials configuration
  const credentials: ProviderCredential[] = [
    {
      id: 'azure-creds',
      name: 'Azure Cognitive Services',
      type: 'azure',
      status: 'missing',
      lastTested: '2025-05-23T14:30:00Z',
      fields: [
        { name: 'subscription_key', label: 'Subscription Key', type: 'password', required: true, value: '' },
        { name: 'region', label: 'Region', type: 'select', required: true, value: 'eastus', options: ['eastus', 'westus', 'westeurope', 'southeastasia'] },
        { name: 'endpoint', label: 'Custom Endpoint', type: 'text', required: false, value: '' }
      ]
    },
    {
      id: 'aws-creds',
      name: 'AWS Transcribe',
      type: 'aws',
      status: 'missing',
      lastTested: '2025-05-23T14:25:00Z',
      fields: [
        { name: 'access_key_id', label: 'Access Key ID', type: 'text', required: true, value: '' },
        { name: 'secret_access_key', label: 'Secret Access Key', type: 'password', required: true, value: '' },
        { name: 'region', label: 'Region', type: 'select', required: true, value: 'us-east-1', options: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'] },
        { name: 'session_token', label: 'Session Token (Optional)', type: 'password', required: false, value: '' }
      ]
    },
    {
      id: 'openai-creds',
      name: 'OpenAI Whisper API',
      type: 'openai',
      status: 'missing',
      lastTested: '2025-05-23T14:20:00Z',
      fields: [
        { name: 'api_key', label: 'API Key', type: 'password', required: true, value: '' },
        { name: 'organization_id', label: 'Organization ID (Optional)', type: 'text', required: false, value: '' },
        { name: 'base_url', label: 'Base URL', type: 'text', required: false, value: 'https://api.openai.com/v1' }
      ]
    },
    {
      id: 'deepgram-creds',
      name: 'Deepgram API',
      type: 'deepgram',
      status: 'missing',
      lastTested: '2025-05-23T14:15:00Z',
      fields: [
        { name: 'api_key', label: 'API Key', type: 'password', required: true, value: '' },
        { name: 'project_id', label: 'Project ID (Optional)', type: 'text', required: false, value: '' }
      ]
    }
  ];

  // Feature toggles configuration
  const featureToggles: FeatureToggle[] = [
    {
      id: 'real-time-transcription',
      name: 'Real-time Transcription',
      description: 'Enable live transcription for ongoing calls',
      category: 'transcription',
      enabled: true,
      requiresCredentials: true,
      dependencies: ['streaming-api']
    },
    {
      id: 'sentiment-analysis',
      name: 'Sentiment Analysis',
      description: 'Analyze emotional tone and sentiment in conversations',
      category: 'analysis',
      enabled: true,
      requiresCredentials: false,
      dependencies: []
    },
    {
      id: 'speaker-diarization',
      name: 'Speaker Diarization',
      description: 'Identify and separate different speakers in audio',
      category: 'analysis',
      enabled: true,
      requiresCredentials: true,
      dependencies: ['enhanced-models']
    },
    {
      id: 'pii-redaction',
      name: 'PII Redaction',
      description: 'Automatically detect and redact personally identifiable information',
      category: 'compliance',
      enabled: true,
      requiresCredentials: false,
      dependencies: []
    },
    {
      id: 'quality-scoring',
      name: 'Quality Scoring',
      description: 'Automated quality assessment and scoring for calls',
      category: 'analysis',
      enabled: true,
      requiresCredentials: false,
      dependencies: ['sentiment-analysis']
    },
    {
      id: 'compliance-alerts',
      name: 'Compliance Alerts',
      description: 'Real-time alerts for compliance violations',
      category: 'compliance',
      enabled: false,
      requiresCredentials: false,
      dependencies: ['pii-redaction', 'quality-scoring']
    },
    {
      id: 'performance-analytics',
      name: 'Performance Analytics',
      description: 'Advanced analytics and reporting on transcription performance',
      category: 'performance',
      enabled: true,
      requiresCredentials: false,
      dependencies: []
    },
    {
      id: 'custom-models',
      name: 'Custom Model Training',
      description: 'Train custom models for industry-specific terminology',
      category: 'transcription',
      enabled: false,
      requiresCredentials: true,
      dependencies: ['enhanced-storage']
    }
  ];

  // Processing rules configuration
  const processingRules: ProcessingRule[] = [
    {
      id: 'high-priority-urgent',
      name: 'High Priority for Urgent Calls',
      type: 'routing',
      condition: 'file_name contains "urgent" OR file_name contains "escalation"',
      action: 'Set priority to HIGH and process immediately',
      priority: 1,
      enabled: true
    },
    {
      id: 'quality-threshold',
      name: 'Quality Score Threshold Alert',
      type: 'alert',
      condition: 'quality_score < 70',
      action: 'Send alert to quality assurance team',
      priority: 2,
      enabled: true
    },
    {
      id: 'pii-detection-alert',
      name: 'PII Detection Alert',
      type: 'alert',
      condition: 'pii_count > 5',
      action: 'Flag for compliance review and notify security team',
      priority: 1,
      enabled: true
    },
    {
      id: 'long-call-processing',
      name: 'Long Call Special Processing',
      type: 'routing',
      condition: 'duration > 3600',
      action: 'Use high-capacity processing queue with extended timeout',
      priority: 3,
      enabled: true
    }
  ];

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'azure': return <Cloud className="h-4 w-4 text-blue-500" />;
      case 'aws': return <Cloud className="h-4 w-4 text-orange-500" />;
      case 'openai': return <Globe className="h-4 w-4 text-green-500" />;
      case 'deepgram': return <Zap className="h-4 w-4 text-purple-500" />;
      default: return <Key className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      configured: 'default',
      missing: 'destructive',
      invalid: 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transcription': return <Brain className="h-4 w-4 text-blue-500" />;
      case 'analysis': return <Settings className="h-4 w-4 text-green-500" />;
      case 'compliance': return <Shield className="h-4 w-4 text-red-500" />;
      case 'performance': return <Database className="h-4 w-4 text-purple-500" />;
      default: return <Settings className="h-4 w-4 text-gray-500" />;
    }
  };

  const togglePasswordVisibility = (fieldId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuration Center</h1>
          <p className="text-muted-foreground">
            Manage provider credentials, feature toggles, and processing rules for the intelligence platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Test All Connections
          </Button>
          <Button className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="credentials">Provider Credentials</TabsTrigger>
          <TabsTrigger value="features">Feature Toggles</TabsTrigger>
          <TabsTrigger value="rules">Processing Rules</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-4">
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              <strong>API Credentials Required:</strong> To enable full intelligence capabilities, please provide your Azure, AWS, and OpenAI API credentials. These will be securely stored and encrypted.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            {credentials.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getProviderIcon(provider.type)}
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <CardDescription>
                          Last tested: {new Date(provider.lastTested).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={getStatusBadge(provider.status)}>
                      {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {provider.fields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <Label htmlFor={field.name}>
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </Label>
                        {field.type === 'select' ? (
                          <Select defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === 'password' ? (
                          <div className="relative">
                            <Input
                              id={field.name}
                              type={showPasswords[`${provider.id}-${field.name}`] ? 'text' : 'password'}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              defaultValue={field.value}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              onClick={() => togglePasswordVisibility(`${provider.id}-${field.name}`)}
                            >
                              {showPasswords[`${provider.id}-${field.name}`] ? 
                                <EyeOff className="h-4 w-4" /> : 
                                <Eye className="h-4 w-4" />
                              }
                            </Button>
                          </div>
                        ) : (
                          <Input
                            id={field.name}
                            type="text"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            defaultValue={field.value}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="outline" size="sm">
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Credentials
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Management</CardTitle>
              <CardDescription>
                Enable or disable intelligence features based on your requirements and available credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['transcription', 'analysis', 'compliance', 'performance'].map((category) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-semibold capitalize flex items-center space-x-2">
                      {getCategoryIcon(category)}
                      <span>{category} Features</span>
                    </h4>
                    <div className="grid gap-3">
                      {featureToggles.filter(feature => feature.category === category).map((feature) => (
                        <div key={feature.id} className="flex items-center justify-between p-4 border rounded">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-medium">{feature.name}</h5>
                              {feature.requiresCredentials && (
                                <Badge variant="outline" className="text-xs">
                                  Requires API Keys
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                            {feature.dependencies.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Dependencies: {feature.dependencies.join(', ')}
                              </p>
                            )}
                          </div>
                          <Switch
                            checked={feature.enabled}
                            disabled={feature.requiresCredentials}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Processing Rules & Policies</CardTitle>
                  <CardDescription>
                    Configure automated rules for processing, routing, and alerts
                  </CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Add New Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processingRules.map((rule) => (
                  <div key={rule.id} className="border rounded p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          Priority {rule.priority}
                        </Badge>
                        <Switch checked={rule.enabled} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="font-medium">Condition</Label>
                        <p className="text-muted-foreground mt-1 font-mono bg-gray-50 p-2 rounded">
                          {rule.condition}
                        </p>
                      </div>
                      <div>
                        <Label className="font-medium">Action</Label>
                        <p className="text-muted-foreground mt-1">
                          {rule.action}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Edit Rule
                      </Button>
                      <Button variant="outline" size="sm">
                        Test Rule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>External Integrations</CardTitle>
                <CardDescription>
                  Configure integrations with external systems and webhooks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Webhook Notifications</h4>
                        <p className="text-sm text-muted-foreground">Send processing results to external systems</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Configured</Badge>
                      <Switch checked={true} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">External Database Sync</h4>
                        <p className="text-sm text-muted-foreground">Synchronize results with external databases</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Not Configured</Badge>
                      <Switch checked={false} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="font-medium">Security Audit Logging</h4>
                        <p className="text-sm text-muted-foreground">Enhanced logging for compliance and security</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Active</Badge>
                      <Switch checked={true} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Language</Label>
                    <Select defaultValue="en-US">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                        <SelectItem value="de-DE">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Processing Timeout (seconds)</Label>
                    <Input type="number" defaultValue="300" min="60" max="3600" />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Concurrent Jobs</Label>
                    <Input type="number" defaultValue="10" min="1" max="50" />
                  </div>

                  <div className="space-y-2">
                    <Label>Retry Attempts</Label>
                    <Input type="number" defaultValue="3" min="1" max="10" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Enable Debug Logging</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Auto-restart Failed Jobs</Label>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Real-time Processing Alerts</Label>
                    <Switch checked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigurationCenter;