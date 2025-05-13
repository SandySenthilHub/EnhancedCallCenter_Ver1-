// Dashboard configuration types
export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: number;
  config: any;
}

export interface DashboardConfig {
  widgets: DashboardWidget[];
}

// User types
export interface User {
  id: number;
  username: string;
  displayName: string;
  role: string;
  tenantId: number;
}

// Tenant types
export interface Tenant {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

// KPI types
export interface KpiCategory {
  id: number;
  name: string;
  type: 'contact_center' | 'mobile_banking';
  priority: 'critical' | 'medium' | 'low';
}

export interface KpiMetric {
  id: number;
  tenantId: number;
  categoryId: number;
  name: string;
  value: number;
  target: number;
  threshold: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  date: string;
}

// Call types
export interface Call {
  id: number;
  tenantId: number;
  agentId: number;
  callType: 'inbound' | 'outbound';
  startTime: string;
  endTime: string;
  duration: number;
  language: 'english' | 'arabic';
  isCompleted: boolean;
}

export interface CallTranscription {
  id: number;
  callId: number;
  transcriptText: string;
  sentimentScore: number;
  keyPhrases: string;
  entities: string;
  tone: string;
  speakerDiarization: string;
  intent: string;
}

// Mobile Transaction types
export interface MobileTransaction {
  id: number;
  tenantId: number;
  userId: number;
  transactionType: string;
  startTime: string;
  endTime: string;
  amount: number;
  status: string;
  deviceType: string;
  sentimentScore: number;
  keyPhrases: string;
  entities: string;
}

// IVR types
export interface IvrInteraction {
  id: number;
  callId: number;
  tenantId: number;
  nodeSequence: string;
  dropOffNode: string;
  interactionTime: number;
  startTime: string;
  intent: string;
}

// Agent types
export interface Agent {
  id: number;
  tenantId: number;
  name: string;
  shiftId: number;
  isActive: boolean;
}

// Alert types
export interface Alert {
  id: number;
  tenantId: number;
  alertType: string;
  message: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  status: 'active' | 'acknowledged' | 'resolved';
}

// Cognitive Service types
export interface SentimentAnalysis {
  sentiment: string;
  positiveScore: number;
  neutralScore: number;
  negativeScore: number;
}

export interface KeyPhrasesResult {
  keyPhrases: string[];
}

export interface EntitiesResult {
  entities: any[];
}

export interface IntentResult {
  topIntent: string;
  intents: Record<string, number>;
  entities: any[];
}

export interface ToneResult {
  tone: string;
}

// Time range options
export type TimeRange = 'today' | 'yesterday' | 'week' | 'month' | 'custom';

// Dashboard widget types
export type WidgetType = 
  | 'kpi' 
  | 'call-volume' 
  | 'sentiment-analysis'
  | 'mobile-banking-metrics'
  | 'ivr-flow'
  | 'agent-performance'
  | 'key-phrases'
  | 'alerts';

// AgentPerformance type
export interface AgentPerformanceData {
  agent: string;
  calls: number;
  averageHandleTime: string;
  csat: string;
  fcr: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

// Sentiment distribution type
export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

// Call volume data type
export interface CallVolumeData {
  time: string;
  inbound: number;
  outbound: number;
}

// IVR Flow Node type
export interface IvrFlowNode {
  id: string;
  name: string;
  value: number;
  children?: IvrFlowNode[];
}
