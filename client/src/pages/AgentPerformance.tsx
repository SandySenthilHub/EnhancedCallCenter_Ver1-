import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  Phone,
  MessageCircle,
  Star,
  Target,
  Award,
  Activity,
  BarChart3,
  Calendar,
  Filter,
  Download,
  Eye,
  Settings,
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface AgentMetrics {
  id: string;
  name: string;
  email: string;
  department: string;
  shift: string;
  status: 'online' | 'offline' | 'break' | 'training';
  overallScore: number;
  callsHandled: number;
  avgHandleTime: number;
  firstCallResolution: number;
  customerSatisfaction: number;
  adherenceScore: number;
  qualityScore: number;
  coachingSessions: number;
  lastActivity: string;
  trend: 'up' | 'down' | 'stable';
}

interface PerformanceKPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

interface CoachingSession {
  id: string;
  agentName: string;
  supervisorName: string;
  date: string;
  topic: string;
  type: 'improvement' | 'skill_development' | 'recognition' | 'corrective';
  status: 'scheduled' | 'completed' | 'cancelled';
  score: number;
  followUpRequired: boolean;
}

const AgentPerformance: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Enterprise agent performance data
  const agents: AgentMetrics[] = [
    {
      id: 'agent-001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Technical Support',
      shift: 'Morning',
      status: 'online',
      overallScore: 94.2,
      callsHandled: 127,
      avgHandleTime: 4.2,
      firstCallResolution: 87.3,
      customerSatisfaction: 4.6,
      adherenceScore: 96.1,
      qualityScore: 92.8,
      coachingSessions: 3,
      lastActivity: '2025-05-23T14:32:15Z',
      trend: 'up'
    },
    {
      id: 'agent-002',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      department: 'Billing Support',
      shift: 'Afternoon',
      status: 'online',
      overallScore: 88.7,
      callsHandled: 143,
      avgHandleTime: 3.8,
      firstCallResolution: 82.1,
      customerSatisfaction: 4.3,
      adherenceScore: 91.4,
      qualityScore: 89.2,
      coachingSessions: 5,
      lastActivity: '2025-05-23T14:28:42Z',
      trend: 'stable'
    },
    {
      id: 'agent-003',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      department: 'Customer Service',
      shift: 'Evening',
      status: 'break',
      overallScore: 76.5,
      callsHandled: 98,
      avgHandleTime: 6.1,
      firstCallResolution: 68.4,
      customerSatisfaction: 3.8,
      adherenceScore: 82.3,
      qualityScore: 74.6,
      coachingSessions: 8,
      lastActivity: '2025-05-23T14:15:30Z',
      trend: 'down'
    },
    {
      id: 'agent-004',
      name: 'David Kim',
      email: 'david.kim@company.com',
      department: 'Sales Support',
      shift: 'Morning',
      status: 'online',
      overallScore: 91.3,
      callsHandled: 156,
      avgHandleTime: 3.5,
      firstCallResolution: 89.7,
      customerSatisfaction: 4.7,
      adherenceScore: 94.8,
      qualityScore: 88.9,
      coachingSessions: 2,
      lastActivity: '2025-05-23T14:30:22Z',
      trend: 'up'
    }
  ];

  const teamKPIs: PerformanceKPI[] = [
    { name: 'Average Handle Time', value: 4.4, target: 4.0, unit: 'min', trend: 'down', change: -0.3 },
    { name: 'First Call Resolution', value: 81.9, target: 85.0, unit: '%', trend: 'up', change: 2.1 },
    { name: 'Customer Satisfaction', value: 4.35, target: 4.5, unit: '/5', trend: 'stable', change: 0.0 },
    { name: 'Quality Score', value: 86.4, target: 90.0, unit: '%', trend: 'up', change: 1.8 },
    { name: 'Schedule Adherence', value: 91.1, target: 95.0, unit: '%', trend: 'up', change: 2.4 },
    { name: 'Agent Utilization', value: 87.6, target: 85.0, unit: '%', trend: 'stable', change: 0.2 }
  ];

  const coachingSessions: CoachingSession[] = [
    {
      id: 'coaching-001',
      agentName: 'Emily Rodriguez',
      supervisorName: 'Jennifer Smith',
      date: '2025-05-24T10:00:00Z',
      topic: 'Call Handling Efficiency',
      type: 'improvement',
      status: 'scheduled',
      score: 0,
      followUpRequired: true
    },
    {
      id: 'coaching-002',
      agentName: 'Sarah Johnson',
      supervisorName: 'Mark Wilson',
      date: '2025-05-23T14:00:00Z',
      topic: 'Excellence Recognition',
      type: 'recognition',
      status: 'completed',
      score: 95,
      followUpRequired: false
    },
    {
      id: 'coaching-003',
      agentName: 'Michael Chen',
      supervisorName: 'Jennifer Smith',
      date: '2025-05-25T09:30:00Z',
      topic: 'Advanced Product Knowledge',
      type: 'skill_development',
      status: 'scheduled',
      score: 0,
      followUpRequired: true
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Activity className="h-4 w-4 text-green-500" />;
      case 'offline': return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'break': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'training': return <Award className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      online: 'default',
      offline: 'secondary',
      break: 'outline',
      training: 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCoachingTypeBadge = (type: string) => {
    const variants: Record<string, any> = {
      improvement: 'destructive',
      skill_development: 'default',
      recognition: 'secondary',
      corrective: 'outline'
    };
    return variants[type] || 'secondary';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Performance Management</h1>
          <p className="text-muted-foreground">
            Comprehensive performance monitoring, coaching, and development for customer service excellence
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Agents
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">{agents.filter(a => a.status === 'online').length}</p>
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
                <p className="text-2xl font-bold">86.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Calls Today</p>
                <p className="text-2xl font-bold">524</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">FCR Rate</p>
                <p className="text-2xl font-bold">81.9%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Handle Time</p>
                <p className="text-2xl font-bold">4.4m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coaching Sessions</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual Performance</TabsTrigger>
          <TabsTrigger value="coaching">Coaching & Development</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance KPIs</CardTitle>
                <CardDescription>Key performance indicators with targets and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamKPIs.map((kpi, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{kpi.name}</span>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(kpi.trend)}
                          <span className="font-semibold">{kpi.value}{kpi.unit}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={(kpi.value / kpi.target) * 100} className="flex-1" />
                        <span className="text-sm text-muted-foreground">Target: {kpi.target}{kpi.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-green-600">
                        {agents.filter(a => a.status === 'online').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-yellow-600">
                        {agents.filter(a => a.status === 'break').length}
                      </p>
                      <p className="text-sm text-muted-foreground">On Break</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-blue-600">
                        {agents.filter(a => a.status === 'training').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Training</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-gray-600">
                        {agents.filter(a => a.status === 'offline').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Offline</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Leaderboard</CardTitle>
              <CardDescription>Top performing agents based on overall quality scores</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Overall Score</TableHead>
                    <TableHead>Calls Handled</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Customer Satisfaction</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.sort((a, b) => b.overallScore - a.overallScore).map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{agent.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(agent.status)}
                          <Badge variant={getStatusBadge(agent.status)}>
                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getScoreColor(agent.overallScore)}`}>
                          {agent.overallScore}%
                        </span>
                      </TableCell>
                      <TableCell>{agent.callsHandled}</TableCell>
                      <TableCell>{agent.qualityScore}%</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{agent.customerSatisfaction}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getTrendIcon(agent.trend)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Agent Analysis</CardTitle>
              <CardDescription>Detailed performance metrics and coaching recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {agents.map((agent) => (
                  <div key={agent.id} className="border rounded p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-semibold">{agent.name}</h4>
                          <p className="text-sm text-muted-foreground">{agent.department} • {agent.shift} Shift</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusBadge(agent.status)}>
                          {agent.status}
                        </Badge>
                        <div className="text-right">
                          <p className={`font-semibold ${getScoreColor(agent.overallScore)}`}>
                            {agent.overallScore}%
                          </p>
                          <p className="text-sm text-muted-foreground">Overall Score</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Calls Handled</p>
                        <p className="text-xl font-semibold">{agent.callsHandled}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg Handle Time</p>
                        <p className="text-xl font-semibold">{agent.avgHandleTime}m</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">FCR Rate</p>
                        <p className="text-xl font-semibold">{agent.firstCallResolution}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Adherence</p>
                        <p className="text-xl font-semibold">{agent.adherenceScore}%</p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Coaching
                      </Button>
                      <Button size="sm">
                        Performance Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coaching" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Coaching & Development Sessions</CardTitle>
                  <CardDescription>Scheduled and completed coaching sessions with performance tracking</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Session
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Supervisor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coachingSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.agentName}</TableCell>
                      <TableCell>{session.supervisorName}</TableCell>
                      <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                      <TableCell>{session.topic}</TableCell>
                      <TableCell>
                        <Badge variant={getCoachingTypeBadge(session.type)}>
                          {session.type.replace('_', ' ').charAt(0).toUpperCase() + session.type.replace('_', ' ').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={session.status === 'completed' ? 'default' : 'outline'}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {session.score > 0 ? `${session.score}%` : '--'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-green-600">↑ 5.2%</p>
                      <p className="text-sm text-muted-foreground">Quality Score Improvement</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-blue-600">↑ 12.8%</p>
                      <p className="text-sm text-muted-foreground">Agent Engagement</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-purple-600">↓ 8.3%</p>
                      <p className="text-sm text-muted-foreground">Coaching Hours Needed</p>
                    </div>
                    <div className="text-center p-3 border rounded">
                      <p className="text-2xl font-bold text-orange-600">↑ 3.7%</p>
                      <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coaching Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Coaching Impact:</strong> Agents with regular coaching sessions show 23% higher performance scores than those without.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Award className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Top Improvement:</strong> Emily Rodriguez improved quality score by 18% after targeted coaching on call efficiency.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Target className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Goal Achievement:</strong> 78% of agents are meeting or exceeding their individual performance targets this month.
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

export default AgentPerformance;