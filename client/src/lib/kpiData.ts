// KPI type definitions
export interface KpiDefinition {
  id: string;
  name: string;
  description: string;
  type: 'contact_center' | 'mobile_banking';
  priority: 'critical' | 'medium' | 'low';
  unit: string;
  calculation: string;
  target: number;
  threshold: number;
  isRealTime: boolean;
  sqlQuery?: string;
}

// Contact Center KPIs - Critical (20)
export const contactCenterCriticalKpis: KpiDefinition[] = [
  {
    id: 'cc_aht',
    name: 'Average Handle Time',
    description: 'Average duration of a call including talk time and after-call work',
    type: 'contact_center',
    priority: 'critical',
    unit: 'seconds',
    calculation: 'AVG(DATEDIFF(second, StartTime, EndTime))',
    target: 180,
    threshold: 240,
    isRealTime: true,
    sqlQuery: 'SELECT AVG(DATEDIFF(second, StartTime, EndTime)) FROM Calls WHERE TenantId = @tenantId'
  },
  {
    id: 'cc_csat',
    name: 'Customer Satisfaction',
    description: 'Average customer satisfaction score from post-call surveys',
    type: 'contact_center',
    priority: 'critical',
    unit: 'score (1-5)',
    calculation: 'AVG(SatisfactionScore)',
    target: 4.5,
    threshold: 4.0,
    isRealTime: true,
    sqlQuery: 'SELECT AVG(SatisfactionScore) FROM Surveys WHERE TenantId = @tenantId'
  },
  {
    id: 'cc_fcr',
    name: 'First Call Resolution',
    description: 'Percentage of calls resolved without requiring a follow-up',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: '(SUM(CASE WHEN IsResolved = 1 THEN 1 ELSE 0 END) * 100.0) / COUNT(*)',
    target: 85,
    threshold: 75,
    isRealTime: true,
    sqlQuery: 'SELECT (SUM(CASE WHEN IsResolved = 1 THEN 1 ELSE 0 END) * 100.0) / COUNT(*) FROM Calls WHERE TenantId = @tenantId'
  },
  {
    id: 'cc_asr',
    name: 'Agent Success Rate',
    description: 'Percentage of calls successfully handled by agents',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: '(SUM(CASE WHEN CallOutcome = \'Success\' THEN 1 ELSE 0 END) * 100.0) / COUNT(*)',
    target: 92,
    threshold: 85,
    isRealTime: true,
    sqlQuery: 'SELECT (SUM(CASE WHEN CallOutcome = \'Success\' THEN 1 ELSE 0 END) * 100.0) / COUNT(*) FROM Calls WHERE TenantId = @tenantId'
  },
  {
    id: 'cc_att',
    name: 'Average Talk Time',
    description: 'Average time agents spend talking with customers',
    type: 'contact_center',
    priority: 'critical',
    unit: 'seconds',
    calculation: 'AVG(TalkTime)',
    target: 120,
    threshold: 180,
    isRealTime: true,
    sqlQuery: 'SELECT AVG(TalkTime) FROM CallDetails WHERE TenantId = @tenantId'
  }
];

// Contact Center KPIs - Medium Priority (15 of 20)
export const contactCenterMediumKpis: KpiDefinition[] = [
  {
    id: 'cc_ast',
    name: 'Average Speed to Answer',
    description: 'Average time taken to answer incoming calls',
    type: 'contact_center',
    priority: 'medium',
    unit: 'seconds',
    calculation: 'AVG(DATEDIFF(second, QueueTime, AnswerTime))',
    target: 20,
    threshold: 30,
    isRealTime: true,
    sqlQuery: 'SELECT AVG(DATEDIFF(second, QueueTime, AnswerTime)) FROM Calls WHERE TenantId = @tenantId'
  },
  {
    id: 'cc_acw',
    name: 'After Call Work Time',
    description: 'Average time spent by agents after call completion',
    type: 'contact_center',
    priority: 'medium',
    unit: 'seconds',
    calculation: 'AVG(AfterCallWorkTime)',
    target: 30,
    threshold: 45,
    isRealTime: true,
    sqlQuery: 'SELECT AVG(AfterCallWorkTime) FROM CallDetails WHERE TenantId = @tenantId'
  },
  {
    id: 'cc_aba',
    name: 'Abandon Rate',
    description: 'Percentage of callers who hang up before reaching an agent',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    calculation: '(SUM(CASE WHEN IsAbandoned = 1 THEN 1 ELSE 0 END) * 100.0) / COUNT(*)',
    target: 5,
    threshold: 8,
    isRealTime: true,
    sqlQuery: 'SELECT (SUM(CASE WHEN IsAbandoned = 1 THEN 1 ELSE 0 END) * 100.0) / COUNT(*) FROM Calls WHERE TenantId = @tenantId'
  },
  {
    id: 'cc_occ',
    name: 'Occupancy Rate',
    description: 'Percentage of time agents spend on call-related activities',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    calculation: '(SUM(TalkTime + AfterCallWorkTime) * 100.0) / SUM(TotalLoggedTime)',
    target: 85,
    threshold: 75,
    isRealTime: true,
    sqlQuery: 'SELECT (SUM(TalkTime + AfterCallWorkTime) * 100.0) / SUM(TotalLoggedTime) FROM AgentActivity WHERE TenantId = @tenantId'
  },
  {
    id: 'cc_aht_trend',
    name: 'AHT Trend',
    description: 'Trend of Average Handle Time over past 30 days',
    type: 'contact_center',
    priority: 'medium',
    unit: 'seconds',
    calculation: 'Custom trend calculation using 30-day moving average',
    target: -5,
    threshold: 5,
    isRealTime: false,
    sqlQuery: 'SELECT DATE(StartTime) as CallDate, AVG(DATEDIFF(second, StartTime, EndTime)) as DailyAHT FROM Calls WHERE TenantId = @tenantId GROUP BY DATE(StartTime) ORDER BY CallDate DESC LIMIT 30'
  }
];

// Contact Center KPIs - Low Priority (10 of 50)
export const contactCenterLowKpis: KpiDefinition[] = [
  {
    id: 'cc_cos',
    name: 'Cost per Call',
    description: 'Average cost to handle a single call',
    type: 'contact_center',
    priority: 'low',
    unit: '$',
    calculation: 'TotalOperatingCost / COUNT(*)',
    target: 2.5,
    threshold: 3.5,
    isRealTime: false,
    sqlQuery: 'SELECT SUM(Cost) / COUNT(*) FROM CallCosts WHERE TenantId = @tenantId'
  },
  {
    id: 'cc_tt',
    name: 'Transfer Rate',
    description: 'Percentage of calls transferred to another agent or department',
    type: 'contact_center',
    priority: 'low',
    unit: '%',
    calculation: '(SUM(CASE WHEN IsTransferred = 1 THEN 1 ELSE 0 END) * 100.0) / COUNT(*)',
    target: 10,
    threshold: 15,
    isRealTime: false,
    sqlQuery: 'SELECT (SUM(CASE WHEN IsTransferred = 1 THEN 1 ELSE 0 END) * 100.0) / COUNT(*) FROM Calls WHERE TenantId = @tenantId'
  },
  {
    id: 'cc_hld',
    name: 'Average Hold Time',
    description: 'Average time callers spend on hold during a call',
    type: 'contact_center',
    priority: 'low',
    unit: 'seconds',
    calculation: 'AVG(HoldTime)',
    target: 20,
    threshold: 40,
    isRealTime: false,
    sqlQuery: 'SELECT AVG(HoldTime) FROM CallDetails WHERE TenantId = @tenantId'
  },
  {
    id: 'cc_aca',
    name: 'Agent Call Adherence',
    description: 'Percentage of time agents follow their call schedule',
    type: 'contact_center',
    priority: 'low',
    unit: '%',
    calculation: '(ActualWorkTime * 100.0) / ScheduledWorkTime',
    target: 95,
    threshold: 90,
    isRealTime: false,
    sqlQuery: 'SELECT (SUM(ActualWorkTime) * 100.0) / SUM(ScheduledWorkTime) FROM AgentSchedule WHERE TenantId = @tenantId'
  },
  {
    id: 'cc_sl',
    name: 'Service Level',
    description: 'Percentage of calls answered within a defined time threshold',
    type: 'contact_center',
    priority: 'low',
    unit: '%',
    calculation: '(SUM(CASE WHEN DATEDIFF(second, QueueTime, AnswerTime) <= 30 THEN 1 ELSE 0 END) * 100.0) / COUNT(*)',
    target: 80,
    threshold: 70,
    isRealTime: true,
    sqlQuery: 'SELECT (SUM(CASE WHEN DATEDIFF(second, QueueTime, AnswerTime) <= 30 THEN 1 ELSE 0 END) * 100.0) / COUNT(*) FROM Calls WHERE TenantId = @tenantId'
  }
];

// Mobile Banking KPIs - Critical (20)
export const mobileBankingCriticalKpis: KpiDefinition[] = [
  {
    id: 'mb_dau',
    name: 'Daily Active Users',
    description: 'Number of unique users accessing the mobile app daily',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'users',
    calculation: 'COUNT(DISTINCT UserId)',
    target: 50000,
    threshold: 40000,
    isRealTime: true,
    sqlQuery: 'SELECT COUNT(DISTINCT UserId) FROM AppSessions WHERE TenantId = @tenantId AND DATE(SessionStart) = CURRENT_DATE'
  },
  {
    id: 'mb_mau',
    name: 'Monthly Active Users',
    description: 'Number of unique users accessing the mobile app in the past 30 days',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'users',
    calculation: 'COUNT(DISTINCT UserId)',
    target: 250000,
    threshold: 200000,
    isRealTime: false,
    sqlQuery: 'SELECT COUNT(DISTINCT UserId) FROM AppSessions WHERE TenantId = @tenantId AND SessionStart >= DATEADD(day, -30, GETDATE())'
  },
  {
    id: 'mb_tx',
    name: 'Transaction Success Rate',
    description: 'Percentage of successfully completed financial transactions',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    calculation: '(SUM(CASE WHEN Status = \'Success\' THEN 1 ELSE 0 END) * 100.0) / COUNT(*)',
    target: 99.5,
    threshold: 98,
    isRealTime: true,
    sqlQuery: 'SELECT (SUM(CASE WHEN Status = \'Success\' THEN 1 ELSE 0 END) * 100.0) / COUNT(*) FROM Transactions WHERE TenantId = @tenantId'
  },
  {
    id: 'mb_asr',
    name: 'App Stability Rate',
    description: 'Percentage of sessions without crashes',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    calculation: '(1 - (SUM(CASE WHEN HasCrashed = 1 THEN 1 ELSE 0 END) * 1.0) / COUNT(*)) * 100',
    target: 99.9,
    threshold: 99.5,
    isRealTime: true,
    sqlQuery: 'SELECT (1 - (SUM(CASE WHEN HasCrashed = 1 THEN 1 ELSE 0 END) * 1.0) / COUNT(*)) * 100 FROM AppSessions WHERE TenantId = @tenantId'
  },
  {
    id: 'mb_lat',
    name: 'Average Load Time',
    description: 'Average time for the app to load and become interactive',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'milliseconds',
    calculation: 'AVG(LoadTime)',
    target: 1500,
    threshold: 2500,
    isRealTime: true,
    sqlQuery: 'SELECT AVG(LoadTime) FROM AppPerformance WHERE TenantId = @tenantId'
  }
];

// Mobile Banking KPIs - Medium Priority (15 of 20)
export const mobileBankingMediumKpis: KpiDefinition[] = [
  {
    id: 'mb_rt',
    name: 'Response Time',
    description: 'Average time for the app to respond to user interactions',
    type: 'mobile_banking',
    priority: 'medium',
    unit: 'milliseconds',
    calculation: 'AVG(ResponseTime)',
    target: 300,
    threshold: 500,
    isRealTime: true,
    sqlQuery: 'SELECT AVG(ResponseTime) FROM AppPerformance WHERE TenantId = @tenantId'
  },
  {
    id: 'mb_ctr',
    name: 'Click-Through Rate',
    description: 'Percentage of users who click on promotions or offers in the app',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    calculation: '(SUM(CASE WHEN ActionType = \'Promotion_Click\' THEN 1 ELSE 0 END) * 100.0) / SUM(CASE WHEN ActionType = \'Promotion_View\' THEN 1 ELSE 0 END)',
    target: 15,
    threshold: 10,
    isRealTime: false,
    sqlQuery: 'SELECT (SUM(CASE WHEN ActionType = \'Promotion_Click\' THEN 1 ELSE 0 END) * 100.0) / NULLIF(SUM(CASE WHEN ActionType = \'Promotion_View\' THEN 1 ELSE 0 END), 0) FROM UserActions WHERE TenantId = @tenantId'
  },
  {
    id: 'mb_txv',
    name: 'Transaction Volume',
    description: 'Total number of transactions processed daily',
    type: 'mobile_banking',
    priority: 'medium',
    unit: 'count',
    calculation: 'COUNT(*)',
    target: 100000,
    threshold: 80000,
    isRealTime: true,
    sqlQuery: 'SELECT COUNT(*) FROM Transactions WHERE TenantId = @tenantId AND DATE(Timestamp) = CURRENT_DATE'
  },
  {
    id: 'mb_bnk',
    name: 'Bill Pay Success Rate',
    description: 'Percentage of bill payments completed successfully',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    calculation: '(SUM(CASE WHEN TransactionType = \'BillPay\' AND Status = \'Success\' THEN 1 ELSE 0 END) * 100.0) / SUM(CASE WHEN TransactionType = \'BillPay\' THEN 1 ELSE 0 END)',
    target: 99,
    threshold: 97,
    isRealTime: true,
    sqlQuery: 'SELECT (SUM(CASE WHEN TransactionType = \'BillPay\' AND Status = \'Success\' THEN 1 ELSE 0 END) * 100.0) / NULLIF(SUM(CASE WHEN TransactionType = \'BillPay\' THEN 1 ELSE 0 END), 0) FROM Transactions WHERE TenantId = @tenantId'
  },
  {
    id: 'mb_asr',
    name: 'App Store Rating',
    description: 'Average rating of the app in the app stores',
    type: 'mobile_banking',
    priority: 'medium',
    unit: 'rating (1-5)',
    calculation: 'Custom calculation from app store data',
    target: 4.5,
    threshold: 4.0,
    isRealTime: false,
    sqlQuery: 'SELECT AVG(Rating) FROM AppRatings WHERE TenantId = @tenantId'
  }
];

// Mobile Banking KPIs - Low Priority (10 of 60)
export const mobileBankingLowKpis: KpiDefinition[] = [
  {
    id: 'mb_upt',
    name: 'User Path Time',
    description: 'Average time to complete common user journeys',
    type: 'mobile_banking',
    priority: 'low',
    unit: 'seconds',
    calculation: 'AVG(DATEDIFF(second, PathStart, PathEnd))',
    target: 45,
    threshold: 60,
    isRealTime: false,
    sqlQuery: 'SELECT AVG(DATEDIFF(second, PathStart, PathEnd)) FROM UserJourneys WHERE TenantId = @tenantId'
  },
  {
    id: 'mb_ftu',
    name: 'First-Time Users',
    description: 'Number of first-time app users daily',
    type: 'mobile_banking',
    priority: 'low',
    unit: 'users',
    calculation: 'COUNT(*)',
    target: 1000,
    threshold: 700,
    isRealTime: false,
    sqlQuery: 'SELECT COUNT(*) FROM Users WHERE TenantId = @tenantId AND DATE(FirstLogin) = CURRENT_DATE'
  },
  {
    id: 'mb_upt',
    name: 'Update Adoption Rate',
    description: 'Percentage of users on the latest app version',
    type: 'mobile_banking',
    priority: 'low',
    unit: '%',
    calculation: '(SUM(CASE WHEN AppVersion = LatestVersion THEN 1 ELSE 0 END) * 100.0) / COUNT(*)',
    target: 85,
    threshold: 70,
    isRealTime: false,
    sqlQuery: 'SELECT (SUM(CASE WHEN AppVersion = (SELECT MAX(Version) FROM AppVersions) THEN 1 ELSE 0 END) * 100.0) / COUNT(*) FROM AppSessions WHERE TenantId = @tenantId'
  },
  {
    id: 'mb_nav',
    name: 'Navigation Depth',
    description: 'Average number of screens users navigate through per session',
    type: 'mobile_banking',
    priority: 'low',
    unit: 'screens',
    calculation: 'AVG(ScreenCount)',
    target: 5,
    threshold: 3,
    isRealTime: false,
    sqlQuery: 'SELECT AVG(ScreenCount) FROM AppSessions WHERE TenantId = @tenantId'
  },
  {
    id: 'mb_avi',
    name: 'Average Session Interval',
    description: 'Average time between user sessions',
    type: 'mobile_banking',
    priority: 'low',
    unit: 'hours',
    calculation: 'Custom calculation between sequential user sessions',
    target: 24,
    threshold: 48,
    isRealTime: false,
    sqlQuery: 'SELECT AVG(DATEDIFF(hour, PreviousSessionEnd, SessionStart)) FROM (SELECT UserId, SessionStart, LAG(SessionEnd) OVER (PARTITION BY UserId ORDER BY SessionStart) AS PreviousSessionEnd FROM AppSessions WHERE TenantId = @tenantId) AS SessionIntervals WHERE PreviousSessionEnd IS NOT NULL'
  }
];

// Combine all KPIs
export const allKpis = [
  ...contactCenterCriticalKpis,
  ...contactCenterMediumKpis,
  ...contactCenterLowKpis,
  ...mobileBankingCriticalKpis,
  ...mobileBankingMediumKpis,
  ...mobileBankingLowKpis
];