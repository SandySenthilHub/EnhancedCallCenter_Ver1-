import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileAudio,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileX,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Filter,
  Download,
  Eye,
  TrendingUp,
  Activity,
  FileCheck,
  Timer
} from 'lucide-react';

interface FileProcessingJob {
  id: string;
  fileName: string;
  fileSize: number;
  format: 'WAV' | 'MP3';
  source: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'duplicate';
  startTime: string;
  completionTime?: string;
  processingTime?: number;
  errorMessage?: string;
  priority: 'high' | 'medium' | 'low';
  transcriptionProvider: string;
  duplicateOf?: string;
}

interface QueueMetrics {
  totalInQueue: number;
  processing: number;
  avgWaitTime: number;
  avgProcessingTime: number;
  throughputPerHour: number;
  successRate: number;
}

const FileProcessingPipeline: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('queue');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Enterprise production file processing data
  const processingJobs: FileProcessingJob[] = [
    {
      id: 'job-001',
      fileName: 'call_20250523_143015_agent2847.wav',
      fileSize: 45.2,
      format: 'WAV',
      source: 'Azure Blob - Production',
      status: 'processing',
      startTime: '2025-05-23T14:30:15Z',
      priority: 'high',
      transcriptionProvider: 'Azure Speech Services'
    },
    {
      id: 'job-002',
      fileName: 'ivr_session_20250523_142845.mp3',
      fileSize: 12.8,
      format: 'MP3',
      source: 'AWS S3 - Primary',
      status: 'completed',
      startTime: '2025-05-23T14:28:45Z',
      completionTime: '2025-05-23T14:29:32Z',
      processingTime: 47,
      priority: 'medium',
      transcriptionProvider: 'Deepgram'
    },
    {
      id: 'job-003',
      fileName: 'support_call_20250523_141230.wav',
      fileSize: 67.4,
      format: 'WAV',
      source: 'Local Server',
      status: 'failed',
      startTime: '2025-05-23T14:12:30Z',
      completionTime: '2025-05-23T14:15:18Z',
      processingTime: 168,
      errorMessage: 'Audio quality insufficient for transcription',
      priority: 'low',
      transcriptionProvider: 'AWS Transcribe'
    },
    {
      id: 'job-004',
      fileName: 'call_20250523_140845_duplicate.wav',
      fileSize: 34.1,
      format: 'WAV',
      source: 'Azure Blob - Production',
      status: 'duplicate',
      startTime: '2025-05-23T14:08:45Z',
      completionTime: '2025-05-23T14:08:47Z',
      processingTime: 2,
      priority: 'medium',
      transcriptionProvider: 'N/A',
      duplicateOf: 'call_20250523_140845_agent1234.wav'
    },
    {
      id: 'job-005',
      fileName: 'escalation_call_20250523_135620.mp3',
      fileSize: 89.3,
      format: 'MP3',
      source: 'AWS S3 - Primary',
      status: 'queued',
      startTime: '2025-05-23T13:56:20Z',
      priority: 'high',
      transcriptionProvider: 'Azure Speech Services'
    }
  ];

  const queueMetrics: QueueMetrics = {
    totalInQueue: 847,
    processing: 23,
    avgWaitTime: 4.2,
    avgProcessingTime: 52.3,
    throughputPerHour: 1850,
    successRate: 96.8
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'processing': return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'queued': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'duplicate': return <FileX className="h-4 w-4 text-orange-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      processing: 'secondary',
      failed: 'destructive',
      queued: 'outline',
      duplicate: 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return variants[priority] || 'secondary';
  };

  const formatFileSize = (sizeInMB: number) => {
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredJobs = filterStatus === 'all' 
    ? processingJobs 
    : processingJobs.filter(job => job.status === filterStatus);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File Processing Pipeline</h1>
          <p className="text-muted-foreground">
            Monitor file processing queue, compatibility checks, and duplicate detection
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Queue</p>
                <p className="text-2xl font-bold">{queueMetrics.totalInQueue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">{queueMetrics.processing}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Timer className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Wait</p>
                <p className="text-2xl font-bold">{queueMetrics.avgWaitTime}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Throughput/hr</p>
                <p className="text-2xl font-bold">{queueMetrics.throughputPerHour}</p>
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
                <p className="text-2xl font-bold">{queueMetrics.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileCheck className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Process</p>
                <p className="text-2xl font-bold">{queueMetrics.avgProcessingTime}s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Processing Queue</TabsTrigger>
          <TabsTrigger value="compatibility">Compatibility Checker</TabsTrigger>
          <TabsTrigger value="duplicates">Duplicate Detection</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>File Processing Queue</CardTitle>
                  <CardDescription>Real-time view of file processing pipeline</CardDescription>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border rounded px-3 py-1 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="queued">Queued</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="duplicate">Duplicate</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Processing Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <FileAudio className="h-4 w-4 text-blue-500" />
                          <span className="truncate max-w-48">{job.fileName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatFileSize(job.fileSize)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{job.format}</Badge>
                      </TableCell>
                      <TableCell className="truncate max-w-32">{job.source}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(job.status)}
                          <Badge variant={getStatusBadge(job.status)}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadge(job.priority)}>
                          {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="truncate max-w-24">{job.transcriptionProvider}</TableCell>
                      <TableCell>
                        {job.processingTime ? formatDuration(job.processingTime) : '--'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {job.status === 'failed' && (
                            <Button variant="ghost" size="sm">
                              <RotateCcw className="h-4 w-4" />
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

        <TabsContent value="compatibility" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>File Compatibility Checker</CardTitle>
                <CardDescription>Validation rules and format checking results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Supported Formats</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>WAV Files</span>
                        <Badge variant="default">Supported</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>MP3 Files</span>
                        <Badge variant="default">Supported</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>FLAC Files</span>
                        <Badge variant="secondary">Not Supported</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Quality Checks</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Sample Rate</span>
                        <span className="text-sm text-muted-foreground">≥ 8kHz</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Bit Depth</span>
                        <span className="text-sm text-muted-foreground">≥ 16-bit</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Duration</span>
                        <span className="text-sm text-muted-foreground">30s - 4hrs</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Processing Stats</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Files Validated Today</span>
                        <span className="font-semibold">2,847</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Format Failures</span>
                        <span className="font-semibold text-red-600">23</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <span>Quality Failures</span>
                        <span className="font-semibold text-orange-600">67</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Validation Failures</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Failure Reason</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>corrupt_audio_20250523.wav</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Corrupted File</Badge>
                      </TableCell>
                      <TableCell>Unable to read audio stream</TableCell>
                      <TableCell>2025-05-23 14:25:33</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>low_quality_call.mp3</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Quality Issue</Badge>
                      </TableCell>
                      <TableCell>Sample rate below minimum (4kHz)</TableCell>
                      <TableCell>2025-05-23 14:18:12</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>unsupported_format.m4a</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Format Error</Badge>
                      </TableCell>
                      <TableCell>M4A format not supported</TableCell>
                      <TableCell>2025-05-23 14:05:45</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="duplicates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Duplicate Detection System</CardTitle>
              <CardDescription>Advanced duplicate detection using content hashing and metadata analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold text-blue-600">1,234</p>
                  <p className="text-sm text-muted-foreground">Duplicates Detected</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold text-green-600">98.7%</p>
                  <p className="text-sm text-muted-foreground">Detection Accuracy</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold text-purple-600">234 GB</p>
                  <p className="text-sm text-muted-foreground">Storage Saved</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <p className="text-2xl font-bold text-orange-600">847</p>
                  <p className="text-sm text-muted-foreground">Processing Hours Saved</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Recent Duplicate Detections</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Duplicate File</TableHead>
                      <TableHead>Original File</TableHead>
                      <TableHead>Similarity</TableHead>
                      <TableHead>Detection Method</TableHead>
                      <TableHead>Action Taken</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>call_20250523_140845_duplicate.wav</TableCell>
                      <TableCell>call_20250523_140845_agent1234.wav</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={100} className="flex-1" />
                          <span className="text-sm">100%</span>
                        </div>
                      </TableCell>
                      <TableCell>Content Hash Match</TableCell>
                      <TableCell>
                        <Badge variant="outline">Skipped Processing</Badge>
                      </TableCell>
                      <TableCell>2025-05-23 14:08:47</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>support_escalation_copy.mp3</TableCell>
                      <TableCell>support_escalation_original.mp3</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={95} className="flex-1" />
                          <span className="text-sm">95%</span>
                        </div>
                      </TableCell>
                      <TableCell>Audio Fingerprint</TableCell>
                      <TableCell>
                        <Badge variant="outline">Skipped Processing</Badge>
                      </TableCell>
                      <TableCell>2025-05-23 13:45:23</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Pipeline performance metrics and optimization insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Processing Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Average Processing Time</span>
                        <span className="font-semibold">52.3 seconds</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Queue Wait Time</span>
                        <span className="font-semibold">4.2 minutes</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Peak Throughput</span>
                        <span className="font-semibold">2,340 files/hour</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Error Rate</span>
                        <span className="font-semibold text-green-600">3.2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Resource Utilization</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>CPU Usage</span>
                          <span>67%</span>
                        </div>
                        <Progress value={67} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Memory Usage</span>
                          <span>42%</span>
                        </div>
                        <Progress value={42} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Storage I/O</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Network Bandwidth</span>
                          <span>34%</span>
                        </div>
                        <Progress value={34} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Performance Optimization:</strong> Consider increasing parallel processing workers during peak hours (9 AM - 5 PM) to reduce queue wait times.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Resource Alert:</strong> Storage I/O utilization is approaching 80%. Consider adding additional storage throughput or implementing file compression.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Duplicate Detection:</strong> Current duplicate detection is saving 234 GB of storage and 847 processing hours monthly. Consider expanding detection algorithms.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileProcessingPipeline;