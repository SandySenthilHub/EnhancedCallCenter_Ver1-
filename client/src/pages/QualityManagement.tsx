import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  Phone,
  MessageCircle,
  Clock,
  FileText,
  Eye,
  Play,
  Volume2,
  TrendingUp,
  BarChart3,
  Filter,
  Download,
  Calendar,
  Users,
  Target,
  Award,
  Activity
} from 'lucide-react';

interface QualityEvaluation {
  id: string;
  callId: string;
  agentName: string;
  customerName: string;
  evaluatorName: string;
  date: string;
  duration: number;
  channel: 'phone' | 'chat' | 'email';
  department: string;
  overallScore: number;
  criteriaScores: { 
    greeting: number;
    activeListening: number;
    problemSolving: number;
    productKnowledge: number;
    empathy: number;
    closure: number;
    compliance: number;
  };
  compliance: {
    scriptAdherence: number;
    callRecordingDisclosure: boolean;
    dataProtection: boolean;
    regulatoryCompliance: boolean;
  };
  feedback: string;
  actionItems: string[];
  status: 'draft' | 'completed' | 'disputed' | 'calibrated';
  calibrationScore?: number;
}

interface QualityMetrics {
  totalEvaluations: number;
  avgQualityScore: number;
  complianceRate: number;
  calibrationAccuracy: number;
  evaluationsConducted: number;
  agentsFeedbackProvided: number;
}

interface ComplianceAlert {
  id: string;
  type: 'script_deviation' | 'data_breach' | 'regulatory_violation' | 'policy_violation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  agentName: string;
  callId: string;
  description: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  assignedTo: string;
}

const QualityManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('evaluations');
  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null);

  // Enterprise quality evaluation data
  const evaluations: QualityEvaluation[] = [
    {
      id: 'eval-001',
      callId: 'call-20250523-001',
      agentName: 'Sarah Johnson',
      customerName: 'John Anderson',
      evaluatorName: 'Jennifer Smith',
      date: '2025-05-23T14:30:00Z',
      duration: 847,
      channel: 'phone',
      department: 'Technical Support',
      overallScore: 94.2,
      criteriaScores: {
        greeting: 95,
        activeListening: 92,
        problemSolving: 96,
        productKnowledge: 94,
        empathy: 93,
        closure: 95,
        compliance: 97
      },
      compliance: {
        scriptAdherence: 94,
        callRecordingDisclosure: true,
        dataProtection: true,
        regulatoryCompliance: true
      },
      feedback: 'Excellent call handling with strong technical knowledge and customer empathy. Minor improvement needed in call opening script.',
      actionItems: ['Review updated greeting script', 'Continue current approach'],
      status: 'completed',
      calibrationScore: 95.1
    },
    {
      id: 'eval-002',
      callId: 'call-20250523-002',
      agentName: 'Michael Chen',
      customerName: 'Lisa Rodriguez',
      evaluatorName: 'Mark Wilson',
      date: '2025-05-23T13:45:00Z',
      duration: 634,
      channel: 'phone',
      department: 'Billing Support',
      overallScore: 76.3,
      criteriaScores: {
        greeting: 85,
        activeListening: 72,
        problemSolving: 78,
        productKnowledge: 82,
        empathy: 68,
        closure: 75,
        compliance: 74
      },
      compliance: {
        scriptAdherence: 72,
        callRecordingDisclosure: true,
        dataProtection: false,
        regulatoryCompliance: true
      },
      feedback: 'Agent needs improvement in active listening and empathy. Failed to gather customer consent before accessing account details.',
      actionItems: ['Attend active listening training', 'Review data protection protocols', 'Shadow senior agent'],
      status: 'completed',
      calibrationScore: 78.1
    },
    {
      id: 'eval-003',
      callId: 'call-20250523-003',
      agentName: 'Emily Rodriguez',
      customerName: 'David Kim',
      evaluatorName: 'Jennifer Smith',
      date: '2025-05-23T12:15:00Z',
      duration: 1234,
      channel: 'chat',
      department: 'Customer Service',
      overallScore: 88.7,
      criteriaScores: {
        greeting: 90,
        activeListening: 85,
        problemSolving: 92,
        productKnowledge: 88,
        empathy: 89,
        closure: 87,
        compliance: 90
      },
      compliance: {
        scriptAdherence: 88,
        callRecordingDisclosure: true,
        dataProtection: true,
        regulatoryCompliance: true
      },
      feedback: 'Strong performance in chat support with good problem resolution. Could improve response time between messages.',
      actionItems: ['Practice typing efficiency', 'Use more chat shortcuts'],
      status: 'completed'
    }
  ];

  const qualityMetrics: QualityMetrics = {
    totalEvaluations: 247,
    avgQualityScore: 86.4,
    complianceRate: 91.2,
    calibrationAccuracy: 94.7,
    evaluationsConducted: 89,
    agentsFeedbackProvided: 67
  };

  const complianceAlerts: ComplianceAlert[] = [
    {
      id: 'alert-001',
      type: 'data_breach',
      severity: 'critical',
      agentName: 'Michael Chen',
      callId: 'call-20250523-002',
      description: 'Failed to obtain customer consent before accessing sensitive account information',
      timestamp: '2025-05-23T13:47:22Z',
      status: 'investigating',
      assignedTo: 'Security Team'
    },
    {
      id: 'alert-002',
      type: 'script_deviation',
      severity: 'medium',
      agentName: 'David Kim',
      callId: 'call-20250523-005',
      description: 'Skipped mandatory call recording disclosure during call opening',
      timestamp: '2025-05-23T11:32:15Z',
      status: 'resolved',
      assignedTo: 'Mark Wilson'
    },
    {
      id: 'alert-003',
      type: 'regulatory_violation',
      severity: 'high',
      agentName: 'Lisa Parker',
      callId: 'call-20250523-008',
      description: 'Provided financial advice without proper disclaimers required by regulation',
      timestamp: '2025-05-23T10:15:33Z',
      status: 'escalated',
      assignedTo: 'Compliance Officer'
    }
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'phone': return <Phone className="h-4 w-4 text-blue-500" />;
      case 'chat': return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'email': return <FileText className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, any> = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    };
    return variants[severity] || 'secondary';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      draft: 'outline',
      disputed: 'secondary',
      calibrated: 'default',
      open: 'destructive',
      investigating: 'secondary',
      resolved: 'default',
      escalated: 'destructive'
    };
    return variants[status] || 'secondary';
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
          <h1 className="text-3xl font-bold tracking-tight">Quality Management System</h1>
          <p className="text-muted-foreground">
            Comprehensive quality evaluation, compliance monitoring, and continuous improvement
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Results
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quality Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Evaluations</p>
                <p className="text-2xl font-bold">{qualityMetrics.totalEvaluations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Quality Score</p>
                <p className="text-2xl font-bold">{qualityMetrics.avgQualityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold">{qualityMetrics.complianceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Calibration Accuracy</p>
                <p className="text-2xl font-bold">{qualityMetrics.calibrationAccuracy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agents Evaluated</p>
                <p className="text-2xl font-bold">{qualityMetrics.agentsFeedbackProvided}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">{complianceAlerts.filter(a => a.status !== 'resolved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="evaluations">Quality Evaluations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Monitoring</TabsTrigger>
          <TabsTrigger value="calibration">Evaluator Calibration</TabsTrigger>
          <TabsTrigger value="analytics">Quality Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Quality Evaluations</CardTitle>
                  <CardDescription>Detailed quality assessments with scoring and feedback</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  New Evaluation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Call ID</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Overall Score</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell className="font-medium">{evaluation.callId}</TableCell>
                      <TableCell>{evaluation.agentName}</TableCell>
                      <TableCell>{evaluation.customerName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getChannelIcon(evaluation.channel)}
                          <span className="capitalize">{evaluation.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDuration(evaluation.duration)}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getScoreColor(evaluation.overallScore)}`}>
                          {evaluation.overallScore}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {evaluation.compliance.dataProtection && evaluation.compliance.regulatoryCompliance ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span>{evaluation.compliance.scriptAdherence}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(evaluation.status)}>
                          {evaluation.status.charAt(0).toUpperCase() + evaluation.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-green-600">34%</p>
                      <p className="text-sm text-muted-foreground">Excellent (90-100%)</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-blue-600">42%</p>
                      <p className="text-sm text-muted-foreground">Good (80-89%)</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-yellow-600">18%</p>
                      <p className="text-sm text-muted-foreground">Fair (70-79%)</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-red-600">6%</p>
                      <p className="text-sm text-muted-foreground">Poor (&lt;70%)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evaluation Criteria Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Product Knowledge</span>
                    <span className="font-semibold">88.2%</span>
                  </div>
                  <Progress value={88.2} />
                  
                  <div className="flex justify-between items-center">
                    <span>Problem Solving</span>
                    <span className="font-semibold">85.7%</span>
                  </div>
                  <Progress value={85.7} />
                  
                  <div className="flex justify-between items-center">
                    <span>Empathy & Listening</span>
                    <span className="font-semibold">82.4%</span>
                  </div>
                  <Progress value={82.4} />
                  
                  <div className="flex justify-between items-center">
                    <span>Compliance</span>
                    <span className="font-semibold">91.2%</span>
                  </div>
                  <Progress value={91.2} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Alerts & Violations</CardTitle>
              <CardDescription>Real-time monitoring of regulatory and policy compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className={`h-5 w-5 ${
                          alert.severity === 'critical' ? 'text-red-500' :
                          alert.severity === 'high' ? 'text-orange-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                        <div>
                          <h4 className="font-semibold">{alert.type.replace('_', ' ').toUpperCase()}</h4>
                          <p className="text-sm text-muted-foreground">
                            {alert.agentName} • {alert.callId} • {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityBadge(alert.severity)}>
                          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                        </Badge>
                        <Badge variant={getStatusBadge(alert.status)}>
                          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm">{alert.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Assigned to: {alert.assignedTo}</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        <Button size="sm">
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calibration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evaluator Calibration Sessions</CardTitle>
              <CardDescription>Ensuring consistency and accuracy across quality evaluators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Calibration Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-green-600">94.7%</p>
                      <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-blue-600">12</p>
                      <p className="text-sm text-muted-foreground">Sessions This Month</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-purple-600">8</p>
                      <p className="text-sm text-muted-foreground">Active Evaluators</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-orange-600">±2.3</p>
                      <p className="text-sm text-muted-foreground">Avg Score Variance</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Calibration Recommendations</h4>
                  <Alert>
                    <Target className="h-4 w-4" />
                    <AlertDescription>
                      <strong>High Variance:</strong> Mark Wilson's evaluations show 5.2% variance from team average. Schedule calibration session.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Excellent Consistency:</strong> Jennifer Smith maintains 98.1% calibration accuracy across all evaluations.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Positive Trend:</strong> Overall quality scores improved 3.7% this month compared to last month.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Star className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Top Department:</strong> Technical Support leads with 94.2% average quality score.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Compliance Excellence:</strong> 91.2% compliance rate exceeds industry benchmark of 85%.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Active Listening Skills</h4>
                    <p className="text-sm text-muted-foreground">18% of agents score below 80% in active listening</p>
                    <Badge variant="destructive" className="mt-1">High Priority</Badge>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Data Protection Compliance</h4>
                    <p className="text-sm text-muted-foreground">8.8% failure rate in data protection protocols</p>
                    <Badge variant="secondary" className="mt-1">Medium Priority</Badge>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Call Closure Techniques</h4>
                    <p className="text-sm text-muted-foreground">Average closure score could improve by 5%</p>
                    <Badge variant="outline" className="mt-1">Low Priority</Badge>
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

export default QualityManagement;