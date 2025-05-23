import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Cloud, 
  Database, 
  Folder, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Activity,
  FileText,
  Clock,
  TrendingUp,
  Settings,
  RefreshCw
} from 'lucide-react';

interface DataSourceMetrics {
  id: string;
  name: string;
  type: 'azure' | 'aws' | 'server';
  status: 'connected' | 'disconnected' | 'error';
  filesProcessed: number;
  filesInQueue: number;
  lastSync: string;
  throughput: number;
  errorRate: number;
  uptime: number;
}

interface FileProcessingStats {
  totalFiles: number;
  successfulProcessing: number;
  failedProcessing: number;
  avgProcessingTime: number;
  queueDepth: number;
}

const DataSourceConnectors: React.FC = () => {
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // Enterprise production data simulation
  const dataSources: DataSourceMetrics[] = [
    {
      id: 'azure-blob-prod',
      name: 'Azure Blob Storage - Production',
      type: 'azure',
      status: 'connected',
      filesProcessed: 15847,
      filesInQueue: 23,
      lastSync: '2025-05-23T14:32:15Z',
      throughput: 1250,
      errorRate: 0.8,
      uptime: 99.7
    },
    {
      id: 'aws-s3-primary',
      name: 'AWS S3 - Primary Bucket',
      type: 'aws',
      status: 'connected',
      filesProcessed: 8934,
      filesInQueue: 7,
      lastSync: '2025-05-23T14:31:45Z',
      throughput: 890,
      errorRate: 1.2,
      uptime: 99.5
    },
    {
      id: 'server-recordings',
      name: 'Local Server - Call Recordings',
      type: 'server',
      status: 'error',
      filesProcessed: 12456,
      filesInQueue: 156,
      lastSync: '2025-05-23T13:45:22Z',
      throughput: 340,
      errorRate: 15.3,
      uptime: 87.2
    },
    {
      id: 'azure-blob-backup',
      name: 'Azure Blob Storage - Backup',
      type: 'azure',
      status: 'connected',
      filesProcessed: 5623,
      filesInQueue: 2,
      lastSync: '2025-05-23T14:30:18Z',
      throughput: 450,
      errorRate: 0.5,
      uptime: 99.9
    }
  ];

  const processingStats: FileProcessingStats = {
    totalFiles: 42860,
    successfulProcessing: 41234,
    failedProcessing: 1626,
    avgProcessingTime: 2.8,
    queueDepth: 188
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'azure': return <Cloud className="h-5 w-5 text-blue-500" />;
      case 'aws': return <Cloud className="h-5 w-5 text-orange-500" />;
      default: return <Database className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Source Connectors</h1>
          <p className="text-muted-foreground">
            Monitor and manage enterprise data source connections for call center intelligence
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh All
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Files Processed</p>
                <p className="text-2xl font-bold">{processingStats.totalFiles.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {((processingStats.successfulProcessing / processingStats.totalFiles) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Processing Time</p>
                <p className="text-2xl font-bold">{processingStats.avgProcessingTime}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Queue Depth</p>
                <p className="text-2xl font-bold">{processingStats.queueDepth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="azure">Azure Sources</TabsTrigger>
          <TabsTrigger value="aws">AWS Sources</TabsTrigger>
          <TabsTrigger value="server">Server Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {dataSources.map((source) => (
              <Card key={source.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(source.type)}
                      <div>
                        <CardTitle className="text-lg">{source.name}</CardTitle>
                        <CardDescription>
                          Last sync: {new Date(source.lastSync).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getStatusBadgeVariant(source.status)}>
                        {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                      </Badge>
                      {getStatusIcon(source.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Files Processed</p>
                      <p className="text-xl font-semibold">{source.filesProcessed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Queue</p>
                      <p className="text-xl font-semibold">{source.filesInQueue}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Throughput/hr</p>
                      <p className="text-xl font-semibold">{source.throughput}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                      <p className="text-xl font-semibold text-red-500">{source.errorRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={source.uptime} className="flex-1" />
                        <span className="text-sm font-semibold">{source.uptime}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {source.status === 'error' && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Connection issues detected. High error rate and queue backlog require immediate attention.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      View Logs
                    </Button>
                    <Button size="sm">
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="azure" className="space-y-4">
          <div className="grid gap-4">
            {dataSources.filter(source => source.type === 'azure').map((source) => (
              <Card key={source.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cloud className="h-5 w-5 text-blue-500" />
                    <span>{source.name}</span>
                  </CardTitle>
                  <CardDescription>Azure Blob Storage Configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Storage Account</label>
                        <p className="text-sm text-muted-foreground">callcenterrecordings</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Container</label>
                        <p className="text-sm text-muted-foreground">production-calls</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Input Folder</label>
                        <p className="text-sm text-muted-foreground">/incoming/raw</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Output Folder</label>
                        <p className="text-sm text-muted-foreground">/processed/transcribed</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{source.filesProcessed}</p>
                        <p className="text-sm text-muted-foreground">Files Processed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{source.throughput}</p>
                        <p className="text-sm text-muted-foreground">Files/Hour</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{source.uptime}%</p>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="aws" className="space-y-4">
          <div className="grid gap-4">
            {dataSources.filter(source => source.type === 'aws').map((source) => (
              <Card key={source.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cloud className="h-5 w-5 text-orange-500" />
                    <span>{source.name}</span>
                  </CardTitle>
                  <CardDescription>AWS S3 Bucket Configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Bucket Name</label>
                        <p className="text-sm text-muted-foreground">call-center-recordings-primary</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Region</label>
                        <p className="text-sm text-muted-foreground">us-east-1</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Input Prefix</label>
                        <p className="text-sm text-muted-foreground">incoming/calls/</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Output Prefix</label>
                        <p className="text-sm text-muted-foreground">processed/transcripts/</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{source.filesProcessed}</p>
                        <p className="text-sm text-muted-foreground">Files Processed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{source.throughput}</p>
                        <p className="text-sm text-muted-foreground">Files/Hour</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{source.uptime}%</p>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="server" className="space-y-4">
          <div className="grid gap-4">
            {dataSources.filter(source => source.type === 'server').map((source) => (
              <Card key={source.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-gray-500" />
                    <span>{source.name}</span>
                  </CardTitle>
                  <CardDescription>Local Server Folder Configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Server Path</label>
                        <p className="text-sm text-muted-foreground">/mnt/call-recordings</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Watch Folder</label>
                        <p className="text-sm text-muted-foreground">/incoming</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Processed Folder</label>
                        <p className="text-sm text-muted-foreground">/processed</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Error Folder</label>
                        <p className="text-sm text-muted-foreground">/errors</p>
                      </div>
                    </div>
                    
                    {source.status === 'error' && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Server connectivity issues detected. Network path may be unavailable or permissions insufficient.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{source.filesProcessed}</p>
                        <p className="text-sm text-muted-foreground">Files Processed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{source.throughput}</p>
                        <p className="text-sm text-muted-foreground">Files/Hour</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{source.uptime}%</p>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataSourceConnectors;