import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain,
  Activity,
  TrendingUp,
  Clock,
  FileAudio,
  Users,
  Shield,
  BarChart3,
  Play,
  Pause,
  Volume2,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Headphones
} from 'lucide-react';

interface ProcessingStatus {
  totalJobs: number;
  inProgress: number;
  completed: number;
  failed: number;
  avgProcessingTime: number;
  queueDepth: number;
}

interface TranscriptViewer {
  id: string;
  callId: string;
  fileName: string;
  duration: number;
  transcript: string;
  speakers: { id: string; name: string; segments: { start: number; end: number; text: string; confidence: number }[] }[];
  sentimentData: { timestamp: number; score: number; emotion: string }[];
  piiRedacted: boolean;
  qualityScore: number;
  timestamp: string;
}

interface IntelligenceMetrics {
  totalTranscripts: number;
  avgAccuracy: number;
  avgSentimentScore: number;
  piiDetectionRate: number;
  qaComplianceScore: number;
  processingEfficiency: number;
}

const IntelligenceDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // Real-time processing status
  const processingStatus: ProcessingStatus = {
    totalJobs: 15847,
    inProgress: 23,
    completed: 15734,
    failed: 90,
    avgProcessingTime: 145,
    queueDepth: 47
  };

  // Intelligence metrics dashboard
  const metrics: IntelligenceMetrics = {
    totalTranscripts: 28479,
    avgAccuracy: 94.3,
    avgSentimentScore: 0.67,
    piiDetectionRate: 97.8,
    qaComplianceScore: 86.7,
    processingEfficiency: 98.9
  };

  // Sample transcript data with audio sync
  const transcripts: TranscriptViewer[] = [
    {
      id: 'ts-001',
      callId: 'call-20250523-001',
      fileName: 'customer_support_20250523_143015.wav',
      duration: 847,
      transcript: 'Thank you for calling. How can I assist you today? Hi, I have an issue with my recent transaction on my account. The charge appears to be incorrect. I understand your concern. Let me look into that for you. Can you please provide me with your account number? Sure, it\'s 1234-5678-9012. Thank you. I can see the transaction you\'re referring to. Let me check the details for you.',
      speakers: [
        {
          id: 'speaker-1',
          name: 'Agent',
          segments: [
            { start: 0, end: 15, text: 'Thank you for calling. How can I assist you today?', confidence: 0.94 },
            { start: 78, end: 120, text: 'I understand your concern. Let me look into that for you.', confidence: 0.92 },
            { start: 145, end: 175, text: 'Can you please provide me with your account number?', confidence: 0.96 }
          ]
        },
        {
          id: 'speaker-2',
          name: 'Customer',
          segments: [
            { start: 15, end: 78, text: 'Hi, I have an issue with my recent transaction on my account. The charge appears to be incorrect.', confidence: 0.89 },
            { start: 175, end: 195, text: 'Sure, it\'s [REDACTED].', confidence: 0.95 }
          ]
        }
      ],
      sentimentData: [
        { timestamp: 0, score: 0.7, emotion: 'neutral' },
        { timestamp: 60, score: 0.3, emotion: 'concern' },
        { timestamp: 120, score: 0.8, emotion: 'satisfaction' },
        { timestamp: 180, score: 0.9, emotion: 'relief' }
      ],
      piiRedacted: true,
      qualityScore: 87,
      timestamp: '2025-05-23T14:32:15Z'
    },
    {
      id: 'ts-002',
      callId: 'call-20250523-002',
      fileName: 'billing_inquiry_20250523_135820.wav',
      duration: 634,
      transcript: 'Good afternoon, billing department. I need to dispute this charge on my account immediately! This is completely unacceptable! I understand you\'re frustrated. Let me help you resolve this issue. Can you tell me more about the specific charge? The charge for [REDACTED] on [REDACTED] for $89.99. I never authorized this!',
      speakers: [
        {
          id: 'speaker-1',
          name: 'Agent',
          segments: [
            { start: 0, end: 12, text: 'Good afternoon, billing department.', confidence: 0.98 },
            { start: 67, end: 110, text: 'I understand you\'re frustrated. Let me help you resolve this issue.', confidence: 0.91 }
          ]
        },
        {
          id: 'speaker-2',
          name: 'Customer',
          segments: [
            { start: 12, end: 67, text: 'I need to dispute this charge on my account immediately! This is completely unacceptable!', confidence: 0.93 },
            { start: 140, end: 185, text: 'The charge for [REDACTED] on [REDACTED] for $89.99. I never authorized this!', confidence: 0.87 }
          ]
        }
      ],
      sentimentData: [
        { timestamp: 0, score: 0.5, emotion: 'neutral' },
        { timestamp: 30, score: 0.1, emotion: 'anger' },
        { timestamp: 90, score: 0.3, emotion: 'frustration' },
        { timestamp: 150, score: 0.2, emotion: 'anger' }
      ],
      piiRedacted: true,
      qualityScore: 62,
      timestamp: '2025-05-23T13:58:20Z'
    }
  ];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 0.7) return 'Positive';
    if (score >= 0.4) return 'Neutral';
    return 'Negative';
  };

  const handleTranscriptSelect = (transcriptId: string) => {
    setSelectedTranscript(transcriptId);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const selectedTranscriptData = transcripts.find(t => t.id === selectedTranscript);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Intelligence Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time intelligence processing and transcript analysis with audio synchronization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Transcripts
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Intelligence Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transcripts</p>
                <p className="text-2xl font-bold">{metrics.totalTranscripts.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
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
              <Activity className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Sentiment</p>
                <p className="text-2xl font-bold">{(metrics.avgSentimentScore * 100).toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">PII Detection</p>
                <p className="text-2xl font-bold">{metrics.piiDetectionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">QA Compliance</p>
                <p className="text-2xl font-bold">{metrics.qaComplianceScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-teal-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-bold">{metrics.processingEfficiency}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Processing Status</TabsTrigger>
          <TabsTrigger value="transcripts">Transcript Viewer</TabsTrigger>
          <TabsTrigger value="analytics">Intelligence Analytics</TabsTrigger>
          <TabsTrigger value="insights">Business Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <FileAudio className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{processingStatus.totalJobs.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{processingStatus.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">{processingStatus.completed.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold">{processingStatus.failed}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Processing Queue</CardTitle>
                <CardDescription>Current processing status and queue depth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Queue Depth</span>
                      <span className="font-semibold">{processingStatus.queueDepth} jobs</span>
                    </div>
                    <Progress value={(processingStatus.queueDepth / 100) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Success Rate</span>
                      <span className="font-semibold text-green-600">
                        {((processingStatus.completed / processingStatus.totalJobs) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={(processingStatus.completed / processingStatus.totalJobs) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Avg Processing Time</span>
                      <span className="font-semibold">{processingStatus.avgProcessingTime}s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intelligence Processing Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Transcription</span>
                    <Badge variant="default">94.3% accuracy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sentiment Analysis</span>
                    <Badge variant="default">91.7% confidence</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Speaker Diarization</span>
                    <Badge variant="default">89.2% accuracy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>PII Redaction</span>
                    <Badge variant="default">97.8% detection</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>QA Analysis</span>
                    <Badge variant="default">86.7% compliance</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transcripts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Recent Transcripts</CardTitle>
                <CardDescription>Select a transcript to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transcripts.map((transcript) => (
                    <div
                      key={transcript.id}
                      className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                        selectedTranscript === transcript.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => handleTranscriptSelect(transcript.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{transcript.callId}</p>
                          <p className="text-xs text-muted-foreground">{formatDuration(transcript.duration)}</p>
                        </div>
                        <Badge variant={transcript.qualityScore >= 80 ? 'default' : 'secondary'}>
                          {transcript.qualityScore}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Transcript Viewer</CardTitle>
                {selectedTranscriptData && (
                  <CardDescription>
                    {selectedTranscriptData.fileName} • {formatDuration(selectedTranscriptData.duration)}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {selectedTranscriptData ? (
                  <div className="space-y-4">
                    {/* Audio Player Controls */}
                    <div className="flex items-center space-x-4 p-4 border rounded bg-gray-50">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div className="flex-1">
                        <Progress value={(currentTime / selectedTranscriptData.duration) * 100} />
                      </div>
                      <span className="text-sm font-mono">
                        {formatDuration(currentTime)} / {formatDuration(selectedTranscriptData.duration)}
                      </span>
                      <Button variant="outline" size="sm">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Speaker Segments */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedTranscriptData.speakers.flatMap(speaker =>
                        speaker.segments.map((segment, index) => (
                          <div key={`${speaker.id}-${index}`} className="flex space-x-3 p-3 border rounded">
                            <div className="flex-shrink-0">
                              <Badge variant="outline">{speaker.name}</Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDuration(segment.start)} - {formatDuration(segment.end)}
                              </p>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{segment.text}</p>
                              <div className="flex items-center mt-1 space-x-2">
                                <span className="text-xs text-muted-foreground">
                                  Confidence: {(segment.confidence * 100).toFixed(0)}%
                                </span>
                                {selectedTranscriptData.piiRedacted && segment.text.includes('[REDACTED]') && (
                                  <Badge variant="secondary" className="text-xs">PII Redacted</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ).sort((a, b) => {
                        const aStart = selectedTranscriptData.speakers.flatMap(s => s.segments).find(seg => 
                          a.key?.includes(selectedTranscriptData.speakers.find(sp => sp.segments.includes(seg))?.id || '')
                        )?.start || 0;
                        const bStart = selectedTranscriptData.speakers.flatMap(s => s.segments).find(seg => 
                          b.key?.includes(selectedTranscriptData.speakers.find(sp => sp.segments.includes(seg))?.id || '')
                        )?.start || 0;
                        return aStart - bStart;
                      })}
                    </div>

                    {/* Sentiment Timeline */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Sentiment Timeline</h4>
                      <div className="flex items-center space-x-1 h-8 border rounded overflow-hidden">
                        {selectedTranscriptData.sentimentData.map((point, index) => (
                          <div
                            key={index}
                            className={`flex-1 h-full ${getSentimentColor(point.score)} opacity-75`}
                            style={{
                              backgroundColor: point.score >= 0.7 ? '#22c55e' : 
                                             point.score >= 0.4 ? '#eab308' : '#ef4444'
                            }}
                            title={`${formatDuration(point.timestamp)}: ${getSentimentLabel(point.score)} (${point.emotion})`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Headphones className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a transcript to view details and play audio</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Intelligence Metrics Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Transcription Accuracy</span>
                      <span className="font-semibold text-green-600">94.3%</span>
                    </div>
                    <Progress value={94.3} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Sentiment Analysis Confidence</span>
                      <span className="font-semibold text-blue-600">91.7%</span>
                    </div>
                    <Progress value={91.7} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>PII Detection Rate</span>
                      <span className="font-semibold text-purple-600">97.8%</span>
                    </div>
                    <Progress value={97.8} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>QA Compliance Score</span>
                      <span className="font-semibold text-orange-600">86.7%</span>
                    </div>
                    <Progress value={86.7} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded">
                    <p className="text-2xl font-bold text-blue-600">145s</p>
                    <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-2xl font-bold text-green-600">98.9%</p>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-2xl font-bold text-purple-600">1,847</p>
                    <p className="text-sm text-muted-foreground">Daily Transcripts</p>
                  </div>
                  <div className="text-center p-3 border rounded">
                    <p className="text-2xl font-bold text-orange-600">47</p>
                    <p className="text-sm text-muted-foreground">Queue Depth</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Intelligence Analysis Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">68%</p>
                  <p className="text-sm text-muted-foreground">Positive Sentiment</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">2.3</p>
                  <p className="text-sm text-muted-foreground">Avg Speakers</p>
                </div>
                <div className="text-center p-4 border rounded">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">127</p>
                  <p className="text-sm text-muted-foreground">PII Items Detected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Intelligence Insights</CardTitle>
              <CardDescription>AI-generated insights and recommendations for business improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Sentiment Trend:</strong> Customer sentiment has improved 12% over the past month, with positive interactions increasing during afternoon hours (2-5 PM).
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Agent Performance:</strong> Agents with higher talk-time ratios (60-70%) achieve better quality scores. Consider coaching for balanced conversation flow.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Compliance Alert:</strong> PII detection has identified 15% more sensitive data than previous period. Enhanced redaction protocols are working effectively.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <BarChart3 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Quality Insights:</strong> Calls with proper identity verification show 23% higher customer satisfaction scores. Emphasize verification training.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Improvement Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">De-escalation Training</h4>
                    <p className="text-sm text-muted-foreground">23% of negative sentiment calls could benefit from improved de-escalation techniques</p>
                    <Badge variant="destructive" className="mt-1">High Priority</Badge>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Product Knowledge</h4>
                    <p className="text-sm text-muted-foreground">Technical support calls show 15% longer resolution times</p>
                    <Badge variant="secondary" className="mt-1">Medium Priority</Badge>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Call Opening Scripts</h4>
                    <p className="text-sm text-muted-foreground">8% of calls miss recording disclosure requirements</p>
                    <Badge variant="outline" className="mt-1">Low Priority</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">Highest Quality Scores</p>
                      <p className="text-sm text-muted-foreground">Afternoon shift agents</p>
                    </div>
                    <Badge variant="default">92% avg</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">Best Sentiment Scores</p>
                      <p className="text-sm text-muted-foreground">Senior support team</p>
                    </div>
                    <Badge variant="default">84% positive</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">Fastest Resolution</p>
                      <p className="text-sm text-muted-foreground">Billing department</p>
                    </div>
                    <Badge variant="default">3.2 min avg</Badge>
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

export default IntelligenceDashboard;