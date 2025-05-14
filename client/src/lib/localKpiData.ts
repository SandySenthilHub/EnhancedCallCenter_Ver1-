// Local KPI data for demonstration

export interface KpiDefinition {
  id: string;
  name: string;
  description: string;
  type: 'contact_center' | 'mobile_banking';
  priority: 'critical' | 'medium' | 'low';
  unit: string;
  target: number;
  threshold: number;
  calculation?: string;        // SQL query to calculate the KPI
  sourceTables?: string[];     // Source tables used for calculation
  sourceSchema?: string;       // Database schema for this KPI
  isRealTime?: boolean;        // Whether KPI requires real-time updates
}

// Contact Center Critical KPIs
export const contactCenterCriticalKpis: KpiDefinition[] = [
  {
    id: 'cc_aht',
    name: 'Average Handle Time',
    description: 'Average duration of a call including talk time and after-call work',
    type: 'contact_center',
    priority: 'critical',
    unit: 'seconds',
    target: 180,
    threshold: 240,
    calculation: `
      SELECT 
        AVG(duration) as average_handle_time
      FROM 
        Calls
      WHERE 
        tenantId = @tenantId
        AND startTime BETWEEN @startDate AND @endDate
        AND status = 'completed'
    `,
    sourceTables: ['Calls'],
    sourceSchema: `
      -- Calls table schema
      CREATE TABLE Calls (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tenantId INT NOT NULL,
        callId NVARCHAR(100) NOT NULL,
        startTime DATETIME2 NOT NULL,
        endTime DATETIME2 NULL,
        duration INT NULL,
        status NVARCHAR(20) NOT NULL
      )
    `,
    isRealTime: true
  },
  {
    id: 'cc_csat',
    name: 'Customer Satisfaction',
    description: 'Average satisfaction score from post-call surveys',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    target: 85,
    threshold: 70,
    calculation: `
      SELECT 
        AVG(sentiment) * 100 as csat_score
      FROM 
        CallTranscriptions ct
      JOIN 
        Calls c ON ct.callId = c.id
      WHERE 
        c.tenantId = @tenantId
        AND c.startTime BETWEEN @startDate AND @endDate
    `,
    sourceTables: ['Calls', 'CallTranscriptions'],
    sourceSchema: `
      -- CallTranscriptions table schema
      CREATE TABLE CallTranscriptions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        callId INT NOT NULL,
        text NVARCHAR(MAX) NOT NULL,
        sentiment FLOAT NULL,
        CONSTRAINT FK_CallTranscriptions_Calls FOREIGN KEY (callId) REFERENCES Calls(id)
      )
    `,
    isRealTime: false
  },
  {
    id: 'cc_fcr',
    name: 'First Call Resolution',
    description: 'Percentage of calls resolved without need for follow-up',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    target: 75,
    threshold: 60,
    calculation: `
      SELECT 
        (COUNT(CASE WHEN c.resolved_on_first = 1 THEN 1 END) * 100.0 / COUNT(*)) as fcr_percentage
      FROM 
        (
          SELECT 
            customerId,
            MIN(startTime) as first_call_time,
            CASE WHEN 
              (SELECT COUNT(*) FROM Calls c2 
               WHERE c2.customerId = c1.customerId 
               AND c2.startTime BETWEEN c1.startTime AND DATEADD(day, 7, c1.startTime)) = 1
            THEN 1 ELSE 0 END as resolved_on_first
          FROM 
            Calls c1
          WHERE 
            tenantId = @tenantId
            AND startTime BETWEEN @startDate AND @endDate
          GROUP BY 
            customerId
        ) c
    `,
    sourceTables: ['Calls'],
    isRealTime: false
  },
  {
    id: 'cc_sentiment',
    name: 'Average Call Sentiment',
    description: 'Average sentiment score from call transcripts',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    target: 70,
    threshold: 50
  },
  {
    id: 'cc_agent_occupancy',
    name: 'Agent Occupancy',
    description: 'Percentage of time agents are actively handling calls',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    target: 85,
    threshold: 70
  },
  {
    id: 'cc_abandon_rate',
    name: 'Call Abandon Rate',
    description: 'Percentage of calls abandoned before agent connection',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    target: 3,
    threshold: 7
  }
];

// Contact Center Medium KPIs
export const contactCenterMediumKpis: KpiDefinition[] = [
  {
    id: 'cc_repeat_call_rate',
    name: 'Repeat Call Rate',
    description: 'Percentage of callers who call back within 7 days',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    target: 15,
    threshold: 25
  },
  {
    id: 'cc_after_call_work',
    name: 'Average After Call Work Time',
    description: 'Average time spent by agents on post-call processing',
    type: 'contact_center',
    priority: 'medium',
    unit: 'seconds',
    target: 60,
    threshold: 120
  },
  {
    id: 'cc_language_distribution',
    name: 'Call Language Distribution',
    description: 'Percentage breakdown of calls by language (English/Arabic)',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    target: 70,
    threshold: 50
  },
  {
    id: 'cc_call_abandonment_time',
    name: 'Average Abandonment Time',
    description: 'Average time before callers abandon their calls',
    type: 'contact_center',
    priority: 'medium',
    unit: 'seconds',
    target: 30,
    threshold: 60
  },
  {
    id: 'cc_call_type_ratio',
    name: 'Inbound to Outbound Ratio',
    description: 'Ratio of inbound calls to outbound calls',
    type: 'contact_center',
    priority: 'medium',
    unit: 'ratio',
    target: 4,
    threshold: 6
  },
  {
    id: 'cc_avg_talk_time',
    name: 'Average Talk Time',
    description: 'Average time agents spend talking during calls',
    type: 'contact_center',
    priority: 'medium',
    unit: 'seconds',
    target: 180,
    threshold: 240
  }
];

// Contact Center Low KPIs
export const contactCenterLowKpis: KpiDefinition[] = [
  {
    id: 'cc_agent_csat',
    name: 'Agent-Specific CSAT',
    description: 'Average customer satisfaction score per agent',
    type: 'contact_center',
    priority: 'low',
    unit: '%',
    target: 85,
    threshold: 70
  },
  {
    id: 'cc_topic_distribution',
    name: 'Call Topic Distribution',
    description: 'Percentage breakdown of calls by main topic',
    type: 'contact_center',
    priority: 'low',
    unit: '%',
    target: 20,
    threshold: 10
  },
  {
    id: 'cc_transfers_by_agent',
    name: 'Transfers by Agent',
    description: 'Number of call transfers initiated by each agent',
    type: 'contact_center',
    priority: 'low',
    unit: 'transfers',
    target: 5,
    threshold: 10
  },
  {
    id: 'cc_silence_periods',
    name: 'Silence Periods',
    description: 'Average duration of silence periods during calls',
    type: 'contact_center',
    priority: 'low',
    unit: 'seconds',
    target: 10,
    threshold: 20
  },
  {
    id: 'cc_callback_adherence',
    name: 'Callback Adherence',
    description: 'Percentage of callbacks made within promised timeframe',
    type: 'contact_center',
    priority: 'low',
    unit: '%',
    target: 90,
    threshold: 80
  },
  {
    id: 'cc_cross_selling',
    name: 'Cross-Selling Success Rate',
    description: 'Success rate of cross-selling attempts during calls',
    type: 'contact_center',
    priority: 'low',
    unit: '%',
    target: 15,
    threshold: 5
  }
];

// Mobile Banking Critical KPIs
export const mobileBankingCriticalKpis: KpiDefinition[] = [
  {
    id: 'mb_login_success',
    name: 'App Login Success Rate',
    description: 'Percentage of successful logins to the mobile banking app',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    target: 98,
    threshold: 95,
    calculation: `
      SELECT 
        (COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0 / COUNT(*)) as login_success_rate
      FROM 
        AppSessions
      WHERE 
        tenantId = @tenantId
        AND startTime BETWEEN @startDate AND @endDate
    `,
    sourceTables: ['AppSessions'],
    sourceSchema: `
      -- AppSessions table schema
      CREATE TABLE AppSessions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tenantId INT NOT NULL,
        sessionId NVARCHAR(100) NOT NULL,
        userId NVARCHAR(100) NOT NULL,
        status NVARCHAR(20) NOT NULL,
        startTime DATETIME2 NOT NULL,
        endTime DATETIME2 NULL,
        duration INT NULL,
        crashes INT NULL DEFAULT 0
      )
    `,
    isRealTime: true
  },
  {
    id: 'mb_transaction_success',
    name: 'Transaction Success Rate',
    description: 'Percentage of successfully completed financial transactions',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    target: 99,
    threshold: 97,
    calculation: `
      SELECT 
        (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*)) as transaction_success_rate
      FROM 
        MobileTransactions
      WHERE 
        tenantId = @tenantId
        AND timestamp BETWEEN @startDate AND @endDate
    `,
    sourceTables: ['MobileTransactions'],
    sourceSchema: `
      -- MobileTransactions table schema
      CREATE TABLE MobileTransactions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tenantId INT NOT NULL,
        transactionId NVARCHAR(100) NOT NULL,
        userId NVARCHAR(100) NOT NULL,
        type NVARCHAR(50) NOT NULL,
        status NVARCHAR(20) NOT NULL,
        timestamp DATETIME2 NOT NULL
      )
    `,
    isRealTime: true
  },
  {
    id: 'mb_active_users',
    name: 'Daily Active Users',
    description: 'Number of unique users accessing the app per day',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'users',
    target: 50000,
    threshold: 30000,
    calculation: `
      SELECT 
        COUNT(DISTINCT userId) as daily_active_users
      FROM 
        AppSessions
      WHERE 
        tenantId = @tenantId
        AND startTime BETWEEN @startDate AND @endDate
    `,
    sourceTables: ['AppSessions'],
    isRealTime: false
  },
  {
    id: 'mb_transaction_volume',
    name: 'Daily Transaction Volume',
    description: 'Number of financial transactions processed per day',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'transactions',
    target: 100000,
    threshold: 70000
  },
  {
    id: 'mb_transaction_value',
    name: 'Daily Transaction Value',
    description: 'Total monetary value of transactions processed per day',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'currency',
    target: 10000000,
    threshold: 5000000
  },
  {
    id: 'mb_app_crash',
    name: 'App Crash Rate',
    description: 'Percentage of sessions that end with an app crash',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    target: 0.5,
    threshold: 2
  }
];

// Mobile Banking Medium KPIs
export const mobileBankingMediumKpis: KpiDefinition[] = [
  {
    id: 'mb_login_failure',
    name: 'Login Failure Rate',
    description: 'Percentage of failed login attempts',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    target: 2,
    threshold: 5,
    calculation: `
      SELECT 
        (COUNT(CASE WHEN status = 'failed' THEN 1 END) * 100.0 / COUNT(*)) as login_failure_rate
      FROM 
        AppSessions
      WHERE 
        tenantId = @tenantId
        AND startTime BETWEEN @startDate AND @endDate
    `,
    sourceTables: ['AppSessions'],
    sourceSchema: `
      -- AppSessions table schema
      CREATE TABLE AppSessions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tenantId INT NOT NULL,
        sessionId NVARCHAR(100) NOT NULL,
        userId NVARCHAR(100) NOT NULL,
        status NVARCHAR(20) NOT NULL,
        startTime DATETIME2 NOT NULL,
        endTime DATETIME2 NULL,
        duration INT NULL,
        crashes INT NULL DEFAULT 0
      )
    `,
    isRealTime: true
  },
  {
    id: 'mb_session_per_user',
    name: 'Average Sessions Per User',
    description: 'Average number of app sessions per user per day',
    type: 'mobile_banking',
    priority: 'medium',
    unit: 'sessions',
    target: 3,
    threshold: 1.5
  },
  {
    id: 'mb_funnel_conversion',
    name: 'Transaction Funnel Conversion',
    description: 'Completion rate through transaction initiation to submission',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    target: 85,
    threshold: 70
  },
  {
    id: 'mb_error_rate',
    name: 'Transaction Error Rate',
    description: 'Percentage of transactions resulting in errors',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    target: 0.5,
    threshold: 2
  },
  {
    id: 'mb_session_timeout',
    name: 'Session Timeout Rate',
    description: 'Percentage of sessions ending due to timeout',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    target: 10,
    threshold: 20
  },
  {
    id: 'mb_transaction_by_type',
    name: 'Transaction Type Distribution',
    description: 'Percentage breakdown of transactions by type',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    target: 25,
    threshold: 15
  }
];

// Mobile Banking Low KPIs
export const mobileBankingLowKpis: KpiDefinition[] = [
  {
    id: 'mb_tx_by_merchant',
    name: 'Transaction by Merchant Category',
    description: 'Percentage breakdown of transactions by merchant category',
    type: 'mobile_banking',
    priority: 'low',
    unit: '%',
    target: 25,
    threshold: 15
  },
  {
    id: 'mb_user_age_distribution',
    name: 'User Age Distribution',
    description: 'Percentage breakdown of users by age group',
    type: 'mobile_banking',
    priority: 'low',
    unit: '%',
    target: 25,
    threshold: 15
  },
  {
    id: 'mb_feature_usage',
    name: 'Feature Usage Distribution',
    description: 'Breakdown of app feature usage across user base',
    type: 'mobile_banking',
    priority: 'low',
    unit: '%',
    target: 30,
    threshold: 20
  },
  {
    id: 'mb_time_to_first_action',
    name: 'Time to First Action',
    description: 'Average time before user takes first action after login',
    type: 'mobile_banking',
    priority: 'low',
    unit: 'seconds',
    target: 10,
    threshold: 20
  },
  {
    id: 'mb_user_retention',
    name: 'User Retention Rate',
    description: 'Percentage of users who return within 30 days',
    type: 'mobile_banking',
    priority: 'low',
    unit: '%',
    target: 85,
    threshold: 70
  },
  {
    id: 'mb_feedback_sentiment',
    name: 'App Feedback Sentiment',
    description: 'Sentiment analysis of user feedback comments',
    type: 'mobile_banking',
    priority: 'low',
    unit: '%',
    target: 75,
    threshold: 60
  }
];

// Helper function to get all KPIs by type and priority
export function getKpisByTypeAndPriority(
  type: 'contact_center' | 'mobile_banking',
  priority?: 'critical' | 'medium' | 'low'
): KpiDefinition[] {
  let kpis: KpiDefinition[] = [];
  
  if (type === 'contact_center') {
    if (!priority || priority === 'critical') kpis = [...kpis, ...contactCenterCriticalKpis];
    if (!priority || priority === 'medium') kpis = [...kpis, ...contactCenterMediumKpis];
    if (!priority || priority === 'low') kpis = [...kpis, ...contactCenterLowKpis];
  } else if (type === 'mobile_banking') {
    if (!priority || priority === 'critical') kpis = [...kpis, ...mobileBankingCriticalKpis];
    if (!priority || priority === 'medium') kpis = [...kpis, ...mobileBankingMediumKpis];
    if (!priority || priority === 'low') kpis = [...kpis, ...mobileBankingLowKpis];
  }
  
  return kpis;
}

// Generate sample KPI values that vary by tenant
export function generateKpiValues(tenantId: number, kpis: KpiDefinition[]) {
  return kpis.map(kpi => {
    // Generate a value that's different for each tenant but still realistic
    const seed = (tenantId * 123) % 100;
    const randomFactor = Math.sin(seed * kpi.id.length) * 0.3 + 0.85; // Between 0.55 and 1.15
    
    const value = kpi.target * randomFactor;
    
    return {
      ...kpi,
      value: Math.round(value * 100) / 100, // Round to 2 decimal places
      timestamp: new Date().toISOString()
    };
  });
}