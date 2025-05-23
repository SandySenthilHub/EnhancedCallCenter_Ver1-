import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Cloud,
  Settings,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Activity,
  FileAudio,
  TrendingUp,
  Zap,
  Globe,
  RefreshCw,
  Play,
  Pause,
  Eye,
  Download
} from 'lucide-react';

interface TranscriptionProvider {
  id: string;
  name: string;
  type: 'azure' | 'aws' | 'deepgram' | 'openai' | 'open-source';
  status: 'active' | 'inactive' | 'error' | 'rate-limited';
  accuracy: number;
  speed: number;
  costPerMinute: number;
  languages: number;
  features: string[];
  dailyUsage: number;
  monthlyLimit: number;
  lastUsed: string;
  apiEndpoint: string;
}

interface TranscriptionJob {
  id: string;
  fileName: string;
  duration: number;
  provider: string;
  language: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  accuracy: number;
  startTime: string;
  completionTime?: string;
  processingTime?: number;
  confidence: number;
  wordCount: number;
}

interface TranscriptionMetrics {
  totalTranscriptions: number;
  todayTranscriptions: number;
  avgAccuracy: number;
  avgProcessingTime: number;
  successRate: number;
  totalMinutesProcessed: number;
}

const TranscriptionHub: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('providers');

  // Enterprise transcription provider data
  const providers: TranscriptionProvider[] = [
    {
      id: 'azure-speech',
      name: 'Azure Speech Services',
      type: 'azure',
      status: 'active',
      accuracy: 94.7,
      speed: 1.8,
      costPerMinute: 0.017,
      languages: 85,
      features: ['Speaker Diarization', 'Sentiment Analysis', 'PII Redaction', 'Custom Models'],
      dailyUsage: 847,
      monthlyLimit: 50000,
      lastUsed: '2025-05-23T14:32:15Z',
      apiEndpoint: 'https://eastus.api.cognitive.microsoft.com/sts/v1.0'
    },
    {
      id: 'aws-transcribe',
      name: 'AWS Transcribe',
      type: 'aws',
      status: 'active',
      accuracy: 92.3,
      speed: 2.1,
      costPerMinute: 0.024,
      languages: 31,
      features: ['Speaker Identification', 'Custom Vocabulary', 'Content Redaction', 'Medical Terminology'],
      dailyUsage: 634,
      monthlyLimit: 40000,
      lastUsed: '2025-05-23T14:28:42Z',
      apiEndpoint: 'https://transcribe.us-east-1.amazonaws.com'
    },
    {
      id: 'deepgram',
      name: 'Deepgram Nova-2',
      type: 'deepgram',
      status: 'active',
      accuracy: 96.1,
      speed: 1.2,
      costPerMinute: 0.043,
      languages: 47,
      features: ['Real-time Streaming', 'Punctuation & Formatting', 'Profanity Filter', 'Summarization'],
      dailyUsage: 423,
      monthlyLimit: 25000,
      lastUsed: '2025-05-23T14:15:33Z',
      apiEndpoint: 'https://api.deepgram.com/v1/listen'
    },
    {
      id: 'openai-whisper',
      name: 'OpenAI Whisper API',
      type: 'openai',
      status: 'rate-limited',
      accuracy: 95.2,
      speed: 3.4,
      costPerMinute: 0.006,
      languages: 99,
      features: ['Multilingual Support', 'Translation', 'Noise Robustness', 'Code-switching'],
      dailyUsage: 234,
      monthlyLimit: 10000,
      lastUsed: '2025-05-23T13:45:22Z',
      apiEndpoint: 'https://api.openai.com/v1/audio/transcriptions'
    },
    {
      id: 'vosk-os',
      name: 'Vosk Open Source',
      type: 'open-source',
      status: 'error',
      accuracy: 87.4,
      speed: 0.8,
      costPerMinute: 0.0,
      languages: 20,
      features: ['Offline Processing', 'Small Models', 'Real-time Recognition', 'Custom Training'],
      dailyUsage: 0,
      monthlyLimit: 999999,
      lastUsed: '2025-05-22T18:30:00Z',
      apiEndpoint: 'http://localhost:2700/transcribe'
    }
  ];

  const transcriptionJobs: TranscriptionJob[] = [
    {
      id: 'txn-001',
      fileName: 'customer_support_20250523_143015.wav',
      duration: 847,
      provider: 'Azure Speech Services',
      language: 'en-US',
      status: 'completed',
      accuracy: 94.8,
      startTime: '2025-05-23T14:30:15Z',
      completionTime: '2025-05-23T14:32:18Z',
      processingTime: 123,
      confidence: 0.948,
      wordCount: 2847
    },
    {
      id: 'txn-002',
      fileName: 'sales_call_20250523_142230.mp3',
      duration: 634,
      provider: 'Deepgram Nova-2',
      language: 'en-US',
      status: 'processing',
      accuracy: 0,
      startTime: '2025-05-23T14:22:30Z',
      confidence: 0,
      wordCount: 0
    },
    {
      id: 'txn-003',
      fileName: 'technical_support_20250523_141045.wav',
      duration: 1234,
      provider: 'AWS Transcribe',
      language: 'en-US',
      status: 'completed',
      accuracy: 92.1,
      startTime: '2025-05-23T14:10:45Z',
      completionTime: '2025-05-23T14:13:22Z',
      processingTime: 157,
      confidence: 0.921,
      wordCount: 4123
    },
    {
      id: 'txn-004',
      fileName: 'billing_inquiry_20250523_135820.wav',
      duration: 423,
      provider: 'OpenAI Whisper API',
      language: 'en-US',
      status: 'failed',
      accuracy: 0,
      startTime: '2025-05-23T13:58:20Z',
      completionTime: '2025-05-23T14:01:15Z',
      processingTime: 175,
      confidence: 0,
      wordCount: 0
    },
    {
      id: 'txn-005',
      fileName: 'complaint_resolution_20250523_134512.mp3',
      duration: 967,
      provider: 'Azure Speech Services',
      language: 'en-US',
      status: 'queued',
      accuracy: 0,
      startTime: '2025-05-23T13:45:12Z',
      confidence: 0,
      wordCount: 0
    }
  ];

  const metrics: TranscriptionMetrics = {
    totalTranscriptions: 28479,
    todayTranscriptions: 1847,
    avgAccuracy: 93.8,
    avgProcessingTime: 142,
    successRate: 96.2,
    totalMinutesProcessed: 524789
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'azure': return <Cloud className="h-4 w-4 text-blue-500" />;
      case 'aws': return <Cloud className="h-4 w-4 text-orange-500" />;
      case 'deepgram': return <Zap className="h-4 w-4 text-purple-500" />;
      case 'openai': return <Globe className="h-4 w-4 text-green-500" />;
      case 'open-source': return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <Cloud className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'processing': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'rate-limited': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'queued': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      completed: 'default',
      processing: 'secondary',
      error: 'destructive',
      failed: 'destructive',
      'rate-limited': 'secondary',
      queued: 'outline',
      inactive: 'outline'
    };
    return variants[status] || 'secondary';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatProcessingTime = (seconds?: number) => {
    if (!seconds) return '--';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transcription Hub</h1>
          <p className="text-muted-foreground">
            Multi-provider transcription management and quality monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configure Providers
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Transcription Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileAudio className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transcriptions</p>
                <p className="text-2xl font-bold">{metrics.totalTranscriptions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">{metrics.todayTranscriptions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Accuracy</p>
                <p className="text-2xl font-bold">{metrics.avgAccuracy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Processing</p>
                <p className="text-2xl font-bold">{metrics.avgProcessingTime}s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{metrics.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileAudio className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Minutes Processed</p>
                <p className="text-2xl font-bold">{(metrics.totalMinutesProcessed / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="providers">Provider Status</TabsTrigger>
          <TabsTrigger value="queue">Processing Queue</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid gap-4">
            {providers.map((provider) => (
              <Card key={provider.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getProviderIcon(provider.type)}
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <CardDescription>
                          {provider.languages} languages • Last used: {new Date(provider.lastUsed).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getStatusBadge(provider.status)}>
                        {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                      </Badge>
                      {getStatusIcon(provider.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                      <p className="text-xl font-semibold text-green-600">{provider.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Speed (x realtime)</p>
                      <p className="text-xl font-semibold">{provider.speed}x</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cost/minute</p>
                      <p className="text-xl font-semibold">${provider.costPerMinute}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Daily Usage</p>
                      <div className="space-y-1">
                        <Progress value={(provider.dailyUsage / provider.monthlyLimit) * 100 * 30} />
                        <span className="text-sm">{provider.dailyUsage} / {(provider.monthlyLimit / 30).toFixed(0)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Limit</p>
                      <div className="space-y-1">
                        <Progress value={(provider.dailyUsage * 30 / provider.monthlyLimit) * 100} />
                        <span className="text-sm">{((provider.dailyUsage * 30 / provider.monthlyLimit) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Features</p>
                      <p className="text-sm text-muted-foreground">{provider.features.length} available</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Key Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {provider.status === 'error' && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Provider connection failed. Check API credentials and endpoint configuration.
                      </AlertDescription>
                    </Alert>
                  )}

                  {provider.status === 'rate-limited' && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Rate limit exceeded. Provider usage will resume when quota resets.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
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

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transcription Processing Queue</CardTitle>
                  <CardDescription>Real-time transcription job monitoring and management</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                  <Button variant="outline" size="sm">
                    Clear Completed
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Processing Time</TableHead>
                    <TableHead>Word Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transcriptionJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <FileAudio className="h-4 w-4 text-blue-500" />
                          <span className="truncate max-w-48">{job.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDuration(job.duration)}</TableCell>
                      <TableCell className="truncate max-w-32">{job.provider}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.language}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(job.status)}
                          <Badge variant={getStatusBadge(job.status)}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {job.accuracy > 0 ? (
                          <span className="font-semibold text-green-600">{job.accuracy}%</span>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatProcessingTime(job.processingTime)}
                      </TableCell>
                      <TableCell>
                        {job.wordCount > 0 ? job.wordCount.toLocaleString() : '--'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {job.status === 'processing' && (
                            <Button variant="ghost" size="sm">
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          {job.status === 'failed' && (
                            <Button variant="ghost" size="sm">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Provider Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providers.filter(p => p.status === 'active').map((provider) => (
                    <div key={provider.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{provider.name}</span>
                        <span className="text-sm font-semibold">{provider.accuracy}%</span>
                      </div>
                      <Progress value={provider.accuracy} />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Speed: {provider.speed}x</span>
                        <span>Cost: ${provider.costPerMinute}/min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-green-600">93.8%</p>
                      <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-blue-600">142s</p>
                      <p className="text-sm text-muted-foreground">Avg Processing</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-purple-600">96.2%</p>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-orange-600">$247</p>
                      <p className="text-sm text-muted-foreground">Daily Cost</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Accuracy Breakdown by Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Jobs Completed</TableHead>
                    <TableHead>Average Accuracy</TableHead>
                    <TableHead>Best Accuracy</TableHead>
                    <TableHead>Worst Accuracy</TableHead>
                    <TableHead>Confidence Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providers.filter(p => p.status === 'active').map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell>{provider.dailyUsage}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">{provider.accuracy}%</span>
                      </TableCell>
                      <TableCell>{(provider.accuracy + 2.1).toFixed(1)}%</TableCell>
                      <TableCell>{(provider.accuracy - 3.4).toFixed(1)}%</TableCell>
                      <TableCell>0.{Math.floor(provider.accuracy)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provider Configuration</CardTitle>
              <CardDescription>Configure API credentials and settings for transcription providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Configuration Ready:</strong> All provider configurations are ready for your API keys. Please provide Azure, AWS, and OpenAI credentials to enable full functionality.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4">
                  {providers.map((provider) => (
                    <div key={provider.id} className="p-4 border rounded space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getProviderIcon(provider.type)}
                          <div>
                            <h4 className="font-semibold">{provider.name}</h4>
                            <p className="text-sm text-muted-foreground">{provider.apiEndpoint}</p>
                          </div>
                        </div>
                        <Badge variant={getStatusBadge(provider.status)}>
                          {provider.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Configuration Status:</span>
                          <span className={provider.status === 'active' ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                            {provider.status === 'active' ? 'Configured' : 'Needs API Key'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Default Language:</span>
                          <span className="ml-2">en-US</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          Configure API Keys
                        </Button>
                        <Button variant="outline" size="sm">
                          Test Connection
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TranscriptionHub;