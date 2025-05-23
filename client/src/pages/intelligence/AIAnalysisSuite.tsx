import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Brain,
  Users,
  Shield,
  FileText,
  TrendingUp,
  TrendingDown,
  Heart,
  Frown,
  Smile,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Download,
  Filter,
  BarChart3,
  Activity
} from 'lucide-react';

interface SentimentAnalysis {
  id: string;
  callId: string;
  fileName: string;
  overallSentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  confidence: number;
  duration: number;
  agentSentiment: number;
  customerSentiment: number;
  sentimentProgression: number[];
  emotionalPeaks: { timestamp: number; emotion: string; intensity: number }[];
  timestamp: string;
}

interface SpeakerDiarization {
  id: string;
  callId: string;
  fileName: string;
  speakerCount: number;
  speakerSegments: { speaker: string; startTime: number; endTime: number; text: string }[];
  talkTimeDistribution: { speaker: string; percentage: number; duration: number }[];
  interruptionCount: number;
  silencePeriods: number;
  timestamp: string;
}

interface PIIRedaction {
  id: string;
  callId: string;
  fileName: string;
  piiDetected: number;
  piiTypes: { type: string; count: number; confidence: number }[];
  redactionStatus: 'completed' | 'partial' | 'failed';
  originalWordCount: number;
  redactedWordCount: number;
  complianceScore: number;
  timestamp: string;
}

interface QAAnalysis {
  id: string;
  callId: string;
  fileName: string;
  overallScore: number;
  scriptAdherence: number;
  complianceIssues: { type: string; severity: 'high' | 'medium' | 'low'; description: string }[];
  qualityMetrics: { metric: string; score: number }[];
  recommendations: string[];
  timestamp: string;
}

const AIAnalysisSuite: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('sentiment');

  // Enterprise AI analysis data
  const sentimentAnalyses: SentimentAnalysis[] = [
    {
      id: 'sa-001',
      callId: 'call-20250523-001',
      fileName: 'customer_support_20250523_143015.wav',
      overallSentiment: 'positive',
      sentimentScore: 0.74,
      confidence: 0.89,
      duration: 847,
      agentSentiment: 0.82,
      customerSentiment: 0.66,
      sentimentProgression: [0.2, 0.3, 0.5, 0.7, 0.8, 0.9, 0.85, 0.9],
      emotionalPeaks: [
        { timestamp: 120, emotion: 'frustration', intensity: 0.8 },
        { timestamp: 340, emotion: 'satisfaction', intensity: 0.9 },
        { timestamp: 680, emotion: 'gratitude', intensity: 0.85 }
      ],
      timestamp: '2025-05-23T14:32:15Z'
    },
    {
      id: 'sa-002',
      callId: 'call-20250523-002',
      fileName: 'billing_inquiry_20250523_135820.wav',
      overallSentiment: 'negative',
      sentimentScore: 0.28,
      confidence: 0.92,
      duration: 634,
      agentSentiment: 0.45,
      customerSentiment: 0.11,
      sentimentProgression: [0.6, 0.4, 0.3, 0.2, 0.1, 0.15, 0.25, 0.3],
      emotionalPeaks: [
        { timestamp: 45, emotion: 'anger', intensity: 0.95 },
        { timestamp: 180, emotion: 'confusion', intensity: 0.7 },
        { timestamp: 520, emotion: 'resignation', intensity: 0.6 }
      ],
      timestamp: '2025-05-23T13:58:20Z'
    },
    {
      id: 'sa-003',
      callId: 'call-20250523-003',
      fileName: 'technical_support_20250523_141045.wav',
      overallSentiment: 'neutral',
      sentimentScore: 0.52,
      confidence: 0.76,
      duration: 1234,
      agentSentiment: 0.68,
      customerSentiment: 0.36,
      sentimentProgression: [0.4, 0.5, 0.6, 0.5, 0.4, 0.6, 0.7, 0.6],
      emotionalPeaks: [
        { timestamp: 200, emotion: 'concern', intensity: 0.7 },
        { timestamp: 600, emotion: 'relief', intensity: 0.8 },
        { timestamp: 1000, emotion: 'satisfaction', intensity: 0.75 }
      ],
      timestamp: '2025-05-23T14:10:45Z'
    }
  ];

  const speakerDiarizations: SpeakerDiarization[] = [
    {
      id: 'sd-001',
      callId: 'call-20250523-001',
      fileName: 'customer_support_20250523_143015.wav',
      speakerCount: 2,
      speakerSegments: [
        { speaker: 'Agent', startTime: 0, endTime: 15, text: 'Thank you for calling. How can I assist you today?' },
        { speaker: 'Customer', startTime: 15, endTime: 45, text: 'Hi, I have an issue with my recent transaction...' },
        { speaker: 'Agent', startTime: 45, endTime: 78, text: 'I understand your concern. Let me look into that for you.' }
      ],
      talkTimeDistribution: [
        { speaker: 'Agent', percentage: 58, duration: 491 },
        { speaker: 'Customer', percentage: 42, duration: 356 }
      ],
      interruptionCount: 3,
      silencePeriods: 12,
      timestamp: '2025-05-23T14:32:15Z'
    },
    {
      id: 'sd-002',
      callId: 'call-20250523-002',
      fileName: 'billing_inquiry_20250523_135820.wav',
      speakerCount: 2,
      speakerSegments: [
        { speaker: 'Agent', startTime: 0, endTime: 12, text: 'Good afternoon, billing department.' },
        { speaker: 'Customer', startTime: 12, endTime: 67, text: 'I need to dispute this charge on my account immediately!' }
      ],
      talkTimeDistribution: [
        { speaker: 'Agent', percentage: 35, duration: 222 },
        { speaker: 'Customer', percentage: 65, duration: 412 }
      ],
      interruptionCount: 8,
      silencePeriods: 4,
      timestamp: '2025-05-23T13:58:20Z'
    }
  ];

  const piiRedactions: PIIRedaction[] = [
    {
      id: 'pii-001',
      callId: 'call-20250523-001',
      fileName: 'customer_support_20250523_143015.wav',
      piiDetected: 12,
      piiTypes: [
        { type: 'Credit Card Number', count: 2, confidence: 0.98 },
        { type: 'SSN', count: 1, confidence: 0.95 },
        { type: 'Phone Number', count: 3, confidence: 0.92 },
        { type: 'Address', count: 2, confidence: 0.87 },
        { type: 'Email Address', count: 4, confidence: 0.94 }
      ],
      redactionStatus: 'completed',
      originalWordCount: 2847,
      redactedWordCount: 2823,
      complianceScore: 98.7,
      timestamp: '2025-05-23T14:32:15Z'
    },
    {
      id: 'pii-002',
      callId: 'call-20250523-002',
      fileName: 'billing_inquiry_20250523_135820.wav',
      piiDetected: 8,
      piiTypes: [
        { type: 'Account Number', count: 3, confidence: 0.99 },
        { type: 'Date of Birth', count: 1, confidence: 0.88 },
        { type: 'Address', count: 2, confidence: 0.91 },
        { type: 'Phone Number', count: 2, confidence: 0.96 }
      ],
      redactionStatus: 'completed',
      originalWordCount: 1634,
      redactedWordCount: 1619,
      complianceScore: 99.2,
      timestamp: '2025-05-23T13:58:20Z'
    }
  ];

  const qaAnalyses: QAAnalysis[] = [
    {
      id: 'qa-001',
      callId: 'call-20250523-001',
      fileName: 'customer_support_20250523_143015.wav',
      overallScore: 87,
      scriptAdherence: 92,
      complianceIssues: [
        { type: 'Verification Process', severity: 'medium', description: 'Customer identity verification incomplete' },
        { type: 'Call Recording Disclosure', severity: 'low', description: 'Recording notice given 15 seconds late' }
      ],
      qualityMetrics: [
        { metric: 'Courtesy & Professionalism', score: 95 },
        { metric: 'Problem Resolution', score: 88 },
        { metric: 'Product Knowledge', score: 82 },
        { metric: 'Call Control', score: 85 }
      ],
      recommendations: [
        'Improve product knowledge training for complex billing issues',
        'Ensure timely identity verification at call start',
        'Review call recording disclosure timing'
      ],
      timestamp: '2025-05-23T14:32:15Z'
    },
    {
      id: 'qa-002',
      callId: 'call-20250523-002',
      fileName: 'billing_inquiry_20250523_135820.wav',
      overallScore: 62,
      scriptAdherence: 45,
      complianceIssues: [
        { type: 'De-escalation Protocol', severity: 'high', description: 'Failed to follow de-escalation procedures' },
        { type: 'Manager Escalation', severity: 'high', description: 'Did not offer supervisor when requested' },
        { type: 'Resolution Timeline', severity: 'medium', description: 'No clear timeline provided for resolution' }
      ],
      qualityMetrics: [
        { metric: 'Courtesy & Professionalism', score: 45 },
        { metric: 'Problem Resolution', score: 38 },
        { metric: 'Product Knowledge', score: 72 },
        { metric: 'Call Control', score: 55 }
      ],
      recommendations: [
        'Immediate retraining on de-escalation techniques required',
        'Review manager escalation policies and procedures',
        'Implement stress management training for difficult calls'
      ],
      timestamp: '2025-05-23T13:58:20Z'
    }
  ];

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="h-4 w-4 text-green-500" />;
      case 'negative': return <Frown className="h-4 w-4 text-red-500" />;
      default: return <Heart className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const variants: Record<string, any> = {
      positive: 'default',
      negative: 'destructive',
      neutral: 'secondary'
    };
    return variants[sentiment] || 'secondary';
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, any> = {
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    };
    return variants[severity] || 'secondary';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Analysis Suite</h1>
          <p className="text-muted-foreground">
            Advanced AI-powered analysis including sentiment, speaker diarization, PII redaction, and QA
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Results
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* AI Analysis Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sentiment Analyses</p>
                <p className="text-2xl font-bold">{sentimentAnalyses.length.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Speaker Diarizations</p>
                <p className="text-2xl font-bold">{speakerDiarizations.length.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">PII Redactions</p>
                <p className="text-2xl font-bold">{piiRedactions.length.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">QA Analyses</p>
                <p className="text-2xl font-bold">{qaAnalyses.length.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="diarization">Speaker Diarization</TabsTrigger>
          <TabsTrigger value="pii">PII Redaction</TabsTrigger>
          <TabsTrigger value="qa">QA Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Smile className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-green-600">68%</p>
                <p className="text-sm text-muted-foreground">Positive Sentiment</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold text-yellow-600">22%</p>
                <p className="text-sm text-muted-foreground">Neutral Sentiment</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Frown className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold text-red-600">10%</p>
                <p className="text-sm text-muted-foreground">Negative Sentiment</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis Results</CardTitle>
              <CardDescription>Detailed sentiment analysis with emotional progression tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Call ID</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Overall Sentiment</TableHead>
                    <TableHead>Sentiment Score</TableHead>
                    <TableHead>Agent Sentiment</TableHead>
                    <TableHead>Customer Sentiment</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentimentAnalyses.map((analysis) => (
                    <TableRow key={analysis.id}>
                      <TableCell className="font-medium">{analysis.callId}</TableCell>
                      <TableCell>{formatDuration(analysis.duration)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getSentimentIcon(analysis.overallSentiment)}
                          <Badge variant={getSentimentBadge(analysis.overallSentiment)}>
                            {analysis.overallSentiment.charAt(0).toUpperCase() + analysis.overallSentiment.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={analysis.sentimentScore * 100} className="flex-1" />
                          <span className="text-sm font-semibold">{(analysis.sentimentScore * 100).toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{(analysis.agentSentiment * 100).toFixed(0)}%</TableCell>
                      <TableCell>{(analysis.customerSentiment * 100).toFixed(0)}%</TableCell>
                      <TableCell>{(analysis.confidence * 100).toFixed(0)}%</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diarization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Speaker Diarization Results</CardTitle>
              <CardDescription>Speaker identification and talk time analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {speakerDiarizations.map((diarization) => (
                  <div key={diarization.id} className="border rounded p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{diarization.callId}</h4>
                        <p className="text-sm text-muted-foreground">{diarization.fileName}</p>
                      </div>
                      <Badge variant="outline">{diarization.speakerCount} Speakers</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Talk Time Distribution</h5>
                        <div className="space-y-2">
                          {diarization.talkTimeDistribution.map((speaker, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{speaker.speaker}</span>
                                <span>{speaker.percentage}% ({formatDuration(speaker.duration)})</span>
                              </div>
                              <Progress value={speaker.percentage} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Conversation Metrics</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Interruptions:</span>
                            <span className="font-semibold">{diarization.interruptionCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Silence Periods:</span>
                            <span className="font-semibold">{diarization.silencePeriods}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Speaker Balance:</span>
                            <span className="font-semibold">
                              {Math.abs(diarization.talkTimeDistribution[0].percentage - 50) < 15 ? 'Balanced' : 'Imbalanced'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Speaker Segments Preview</h5>
                      <div className="space-y-1 text-sm">
                        {diarization.speakerSegments.slice(0, 3).map((segment, index) => (
                          <div key={index} className="flex items-start space-x-3 p-2 border rounded">
                            <Badge variant="outline" className="text-xs">{segment.speaker}</Badge>
                            <div className="flex-1">
                              <div className="text-xs text-muted-foreground mb-1">
                                {formatDuration(segment.startTime)} - {formatDuration(segment.endTime)}
                              </div>
                              <p>{segment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pii" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-green-600">98.9%</p>
                <p className="text-sm text-muted-foreground">Avg Compliance Score</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-blue-600">127</p>
                <p className="text-sm text-muted-foreground">PII Items Detected</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold text-purple-600">100%</p>
                <p className="text-sm text-muted-foreground">Redaction Success Rate</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>PII Redaction Results</CardTitle>
              <CardDescription>Personally Identifiable Information detection and redaction analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {piiRedactions.map((redaction) => (
                  <div key={redaction.id} className="border rounded p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{redaction.callId}</h4>
                        <p className="text-sm text-muted-foreground">{redaction.fileName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">
                          {redaction.piiDetected} PII Items
                        </Badge>
                        <Badge variant={redaction.redactionStatus === 'completed' ? 'default' : 'destructive'}>
                          {redaction.redactionStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">PII Types Detected</h5>
                        <div className="space-y-2">
                          {redaction.piiTypes.map((type, index) => (
                            <div key={index} className="flex justify-between items-center p-2 border rounded">
                              <span className="text-sm font-medium">{type.type}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">{type.count}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {(type.confidence * 100).toFixed(0)}% confidence
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Redaction Summary</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Original Word Count:</span>
                            <span className="font-semibold">{redaction.originalWordCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Redacted Word Count:</span>
                            <span className="font-semibold">{redaction.redactedWordCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Words Redacted:</span>
                            <span className="font-semibold">
                              {(redaction.originalWordCount - redaction.redactedWordCount).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Compliance Score:</span>
                            <span className={`font-semibold ${getComplianceColor(redaction.complianceScore)}`}>
                              {redaction.complianceScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Assurance Analysis</CardTitle>
              <CardDescription>Comprehensive call quality analysis and compliance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {qaAnalyses.map((qa) => (
                  <div key={qa.id} className="border rounded p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{qa.callId}</h4>
                        <p className="text-sm text-muted-foreground">{qa.fileName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={qa.overallScore >= 80 ? 'default' : qa.overallScore >= 60 ? 'secondary' : 'destructive'}>
                          Overall Score: {qa.overallScore}%
                        </Badge>
                        <Badge variant={qa.scriptAdherence >= 80 ? 'default' : 'secondary'}>
                          Script: {qa.scriptAdherence}%
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Quality Metrics</h5>
                        <div className="space-y-2">
                          {qa.qualityMetrics.map((metric, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{metric.metric}</span>
                                <span className="font-semibold">{metric.score}%</span>
                              </div>
                              <Progress value={metric.score} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Compliance Issues</h5>
                        <div className="space-y-2">
                          {qa.complianceIssues.map((issue, index) => (
                            <div key={index} className="p-3 border rounded space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">{issue.type}</span>
                                <Badge variant={getSeverityBadge(issue.severity)}>
                                  {issue.severity}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{issue.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Recommendations</h5>
                      <ul className="space-y-1 text-sm">
                        {qa.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-500">•</span>
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAnalysisSuite;