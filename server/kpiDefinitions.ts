/**
 * KPI Definitions for Contact Center and Mobile Banking
 * 
 * This file contains definitions for:
 * - 90 Contact Center KPIs (20 critical, 20 medium, 50 low priority)
 * - 100 Mobile Banking KPIs (20 critical, 20 medium, 60 low priority)
 * 
 * Each KPI has:
 * - id: Unique identifier
 * - name: Display name
 * - description: Detailed explanation
 * - type: 'contact_center' or 'mobile_banking'
 * - priority: 'critical', 'medium', or 'low'
 * - unit: Measurement unit (%, seconds, count, etc.)
 * - calculation: SQL query or formula to calculate the KPI
 * - target: Default target value
 * - threshold: Value that triggers alerts
 * - isRealTime: Whether it needs near real-time updates
 */

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
    isRealTime: true
  },
  {
    id: 'cc_csat',
    name: 'Customer Satisfaction',
    description: 'Average satisfaction score from post-call surveys',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: 'AVG(SatisfactionScore) * 100',
    target: 85,
    threshold: 70,
    isRealTime: true
  },
  {
    id: 'cc_fcr',
    name: 'First Call Resolution',
    description: 'Percentage of calls resolved without need for follow-up',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN IsResolved = 1 THEN 1 END) * 100.0 / COUNT(*)',
    target: 75,
    threshold: 60,
    isRealTime: true
  },
  {
    id: 'cc_sentiment',
    name: 'Average Call Sentiment',
    description: 'Average sentiment score from call transcripts',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: 'AVG(SentimentScore) * 100',
    target: 70,
    threshold: 50,
    isRealTime: true
  },
  {
    id: 'cc_agent_occupancy',
    name: 'Agent Occupancy',
    description: 'Percentage of time agents are actively handling calls',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: 'SUM(Duration) * 100.0 / (COUNT(DISTINCT AgentID) * 8 * 3600)',
    target: 85,
    threshold: 70,
    isRealTime: true
  },
  {
    id: 'cc_abandon_rate',
    name: 'Call Abandon Rate',
    description: 'Percentage of calls abandoned before agent connection',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN IsCompleted = 0 THEN 1 END) * 100.0 / COUNT(*)',
    target: 3,
    threshold: 7,
    isRealTime: true
  },
  {
    id: 'cc_avg_speed_answer',
    name: 'Average Speed of Answer',
    description: 'Average time for a call to be answered by an agent',
    type: 'contact_center',
    priority: 'critical',
    unit: 'seconds',
    calculation: 'AVG(AnswerTime)',
    target: 20,
    threshold: 40,
    isRealTime: true
  },
  {
    id: 'cc_agent_utilization',
    name: 'Agent Utilization',
    description: 'Percentage of scheduled time agents spend on call-related activities',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: '(SUM(Duration) + SUM(AfterCallWork)) * 100.0 / SUM(ScheduledTime)',
    target: 90,
    threshold: 80,
    isRealTime: false
  },
  {
    id: 'cc_service_level',
    name: 'Service Level',
    description: 'Percentage of calls answered within target time (e.g., 30 seconds)',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN AnswerTime <= 30 THEN 1 END) * 100.0 / COUNT(*)',
    target: 80,
    threshold: 70,
    isRealTime: true
  },
  {
    id: 'cc_transfer_rate',
    name: 'Call Transfer Rate',
    description: 'Percentage of calls transferred to another agent or department',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN IsTransferred = 1 THEN 1 END) * 100.0 / COUNT(*)',
    target: 10,
    threshold: 15,
    isRealTime: false
  },
  {
    id: 'cc_qa_score',
    name: 'Quality Assurance Score',
    description: 'Average score from call quality assessments',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: 'AVG(QAScore) * 100',
    target: 90,
    threshold: 80,
    isRealTime: false
  },
  {
    id: 'cc_call_volume',
    name: 'Daily Call Volume',
    description: 'Total number of calls handled per day',
    type: 'contact_center',
    priority: 'critical',
    unit: 'calls',
    calculation: 'COUNT(*)',
    target: 2000,
    threshold: 2500,
    isRealTime: true
  },
  {
    id: 'cc_peak_hour_calls',
    name: 'Peak Hour Call Volume',
    description: 'Maximum number of calls during peak hour',
    type: 'contact_center',
    priority: 'critical',
    unit: 'calls',
    calculation: 'MAX(HourlyCallCount)',
    target: 300,
    threshold: 400,
    isRealTime: true
  },
  {
    id: 'cc_hold_time',
    name: 'Average Hold Time',
    description: 'Average time callers spend on hold during a call',
    type: 'contact_center',
    priority: 'critical',
    unit: 'seconds',
    calculation: 'AVG(HoldTime)',
    target: 30,
    threshold: 60,
    isRealTime: true
  },
  {
    id: 'cc_schedule_adherence',
    name: 'Schedule Adherence',
    description: 'Percentage of time agents adhere to their scheduled activities',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: '(1 - (ABS(ScheduledTime - ActualTime) / ScheduledTime)) * 100',
    target: 95,
    threshold: 90,
    isRealTime: false
  },
  {
    id: 'cc_cost_per_call',
    name: 'Cost Per Call',
    description: 'Average cost of handling a single call',
    type: 'contact_center',
    priority: 'critical',
    unit: 'currency',
    calculation: 'TotalOperatingCost / COUNT(*)',
    target: 5,
    threshold: 8,
    isRealTime: false
  },
  {
    id: 'cc_agent_attrition',
    name: 'Agent Attrition Rate',
    description: 'Percentage of agents who leave the organization per period',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN IsActive = 0 THEN 1 END) * 100.0 / COUNT(*)',
    target: 5,
    threshold: 10,
    isRealTime: false
  },
  {
    id: 'cc_escalation_rate',
    name: 'Call Escalation Rate',
    description: 'Percentage of calls escalated to supervisors or managers',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN IsEscalated = 1 THEN 1 END) * 100.0 / COUNT(*)',
    target: 5,
    threshold: 10,
    isRealTime: true
  },
  {
    id: 'cc_active_agents',
    name: 'Active Agents',
    description: 'Number of agents currently handling calls',
    type: 'contact_center',
    priority: 'critical',
    unit: 'agents',
    calculation: 'COUNT(DISTINCT AgentID WHERE Status = "On Call")',
    target: 150,
    threshold: 100,
    isRealTime: true
  },
  {
    id: 'cc_silent_calls',
    name: 'Silent Call Percentage',
    description: 'Percentage of calls with minimal customer speech',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN CustomerWordCount < 50 THEN 1 END) * 100.0 / COUNT(*)',
    target: 3,
    threshold: 7,
    isRealTime: false
  }
];

// Contact Center KPIs - Medium (20)
export const contactCenterMediumKpis: KpiDefinition[] = [
  {
    id: 'cc_repeat_call_rate',
    name: 'Repeat Call Rate',
    description: 'Percentage of callers who call back within 7 days',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN DaysSinceLastCall <= 7 THEN 1 END) * 100.0 / COUNT(*)',
    target: 15,
    threshold: 25,
    isRealTime: false
  },
  {
    id: 'cc_after_call_work',
    name: 'Average After Call Work Time',
    description: 'Average time spent by agents on post-call processing',
    type: 'contact_center',
    priority: 'medium',
    unit: 'seconds',
    calculation: 'AVG(AfterCallWorkTime)',
    target: 60,
    threshold: 120,
    isRealTime: false
  },
  {
    id: 'cc_language_distribution',
    name: 'Call Language Distribution',
    description: 'Percentage breakdown of calls by language (English/Arabic)',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN Language = "english" THEN 1 END) * 100.0 / COUNT(*)',
    target: 70,
    threshold: 50,
    isRealTime: false
  },
  {
    id: 'cc_call_abandonment_time',
    name: 'Average Abandonment Time',
    description: 'Average time before callers abandon their calls',
    type: 'contact_center',
    priority: 'medium',
    unit: 'seconds',
    calculation: 'AVG(CASE WHEN IsCompleted = 0 THEN WaitTime END)',
    target: 30,
    threshold: 60,
    isRealTime: false
  },
  {
    id: 'cc_call_type_ratio',
    name: 'Inbound to Outbound Ratio',
    description: 'Ratio of inbound calls to outbound calls',
    type: 'contact_center',
    priority: 'medium',
    unit: 'ratio',
    calculation: 'COUNT(CASE WHEN CallType = "inbound" THEN 1 END) * 1.0 / COUNT(CASE WHEN CallType = "outbound" THEN 1 END)',
    target: 4,
    threshold: 6,
    isRealTime: false
  },
  {
    id: 'cc_avg_talk_time',
    name: 'Average Talk Time',
    description: 'Average time agents spend talking during calls',
    type: 'contact_center',
    priority: 'medium',
    unit: 'seconds',
    calculation: 'AVG(TalkTime)',
    target: 180,
    threshold: 240,
    isRealTime: false
  },
  {
    id: 'cc_callback_rate',
    name: 'Callback Rate',
    description: 'Percentage of callers who opt for callback instead of waiting',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN CallbackRequested = 1 THEN 1 END) * 100.0 / COUNT(*)',
    target: 20,
    threshold: 10,
    isRealTime: false
  },
  {
    id: 'cc_shrinkage',
    name: 'Agent Shrinkage',
    description: 'Percentage of time agents are unavailable for calls',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    calculation: 'SUM(UnavailableTime) * 100.0 / SUM(ScheduledTime)',
    target: 15,
    threshold: 25,
    isRealTime: false
  },
  {
    id: 'cc_avg_age_resolution',
    name: 'Average Age of Resolution',
    description: 'Average time to resolve customer issues across multiple calls',
    type: 'contact_center',
    priority: 'medium',
    unit: 'days',
    calculation: 'AVG(DaysToResolution)',
    target: 2,
    threshold: 4,
    isRealTime: false
  },
  {
    id: 'cc_escalation_time',
    name: 'Average Escalation Time',
    description: 'Average time before a call is escalated to a supervisor',
    type: 'contact_center',
    priority: 'medium',
    unit: 'seconds',
    calculation: 'AVG(TimeToEscalation)',
    target: 300,
    threshold: 600,
    isRealTime: false
  },
  {
    id: 'cc_shift_efficiency',
    name: 'Shift Efficiency',
    description: 'Comparison of call handling efficiency across different shifts',
    type: 'contact_center',
    priority: 'medium',
    unit: 'ratio',
    calculation: 'AVG(CallsPerHour) / MAX(CallsPerHour)',
    target: 0.85,
    threshold: 0.7,
    isRealTime: false
  },
  {
    id: 'cc_self_service_usage',
    name: 'Self-Service Rate',
    description: 'Percentage of callers who use IVR self-service successfully',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN SelfServiceCompleted = 1 THEN 1 END) * 100.0 / COUNT(*)',
    target: 25,
    threshold: 15,
    isRealTime: false
  },
  {
    id: 'cc_agent_training_hours',
    name: 'Agent Training Hours',
    description: 'Average training hours per agent per month',
    type: 'contact_center',
    priority: 'medium',
    unit: 'hours',
    calculation: 'AVG(TrainingHours)',
    target: 16,
    threshold: 8,
    isRealTime: false
  },
  {
    id: 'cc_customer_effort',
    name: 'Customer Effort Score',
    description: 'Rating of how much effort customers expend to resolve their issues',
    type: 'contact_center',
    priority: 'medium',
    unit: 'score',
    calculation: 'AVG(EffortScore)',
    target: 2,
    threshold: 3,
    isRealTime: false
  },
  {
    id: 'cc_avg_calls_per_agent',
    name: 'Average Calls Per Agent',
    description: 'Average number of calls handled by each agent per day',
    type: 'contact_center',
    priority: 'medium',
    unit: 'calls',
    calculation: 'COUNT(*) * 1.0 / COUNT(DISTINCT AgentID)',
    target: 50,
    threshold: 30,
    isRealTime: false
  },
  {
    id: 'cc_call_back_success',
    name: 'Callback Success Rate',
    description: 'Percentage of successful callbacks out of total callback requests',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN CallbackCompleted = 1 THEN 1 END) * 100.0 / COUNT(CASE WHEN CallbackRequested = 1 THEN 1 END)',
    target: 90,
    threshold: 80,
    isRealTime: false
  },
  {
    id: 'cc_concurrent_calls',
    name: 'Concurrent Calls',
    description: 'Average number of concurrent calls being handled',
    type: 'contact_center',
    priority: 'medium',
    unit: 'calls',
    calculation: 'AVG(ConcurrentCalls)',
    target: 150,
    threshold: 200,
    isRealTime: true
  },
  {
    id: 'cc_overflow_calls',
    name: 'Overflow Call Percentage',
    description: 'Percentage of calls routed to overflow or backup teams',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN IsOverflow = 1 THEN 1 END) * 100.0 / COUNT(*)',
    target: 5,
    threshold: 10,
    isRealTime: false
  },
  {
    id: 'cc_post_call_survey',
    name: 'Post-Call Survey Completion',
    description: 'Percentage of callers who complete post-call satisfaction surveys',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN SurveyCompleted = 1 THEN 1 END) * 100.0 / COUNT(*)',
    target: 30,
    threshold: 20,
    isRealTime: false
  },
  {
    id: 'cc_channel_switch',
    name: 'Channel Switch Rate',
    description: 'Percentage of interactions that switch channels (e.g., from chat to call)',
    type: 'contact_center',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN ChannelSwitched = 1 THEN 1 END) * 100.0 / COUNT(*)',
    target: 10,
    threshold: 20,
    isRealTime: false
  }
];

// We'll define 50 more Contact Center KPIs with low priority
export const contactCenterLowKpis: KpiDefinition[] = [
  // Adding the first 10 low priority KPIs as examples
  {
    id: 'cc_agent_csat',
    name: 'Agent-Specific CSAT',
    description: 'Average customer satisfaction score per agent',
    type: 'contact_center',
    priority: 'low',
    unit: '%',
    calculation: 'AVG(SatisfactionScore) * 100 GROUP BY AgentID',
    target: 85,
    threshold: 70,
    isRealTime: false
  },
  {
    id: 'cc_topic_distribution',
    name: 'Call Topic Distribution',
    description: 'Percentage breakdown of calls by main topic',
    type: 'contact_center',
    priority: 'low',
    unit: '%',
    calculation: 'COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() GROUP BY Topic',
    target: null,
    threshold: null,
    isRealTime: false
  },
  // ... 48 more low priority KPIs would be defined here
];

// Mobile Banking KPIs - Critical (20)
export const mobileBankingCriticalKpis: KpiDefinition[] = [
  {
    id: 'mb_login_success',
    name: 'App Login Success Rate',
    description: 'Percentage of successful logins to the mobile banking app',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN Status = "completed" AND TransactionType = "login" THEN 1 END) * 100.0 / COUNT(CASE WHEN TransactionType = "login" THEN 1 END)',
    target: 98,
    threshold: 95,
    isRealTime: true
  },
  {
    id: 'mb_transaction_success',
    name: 'Transaction Success Rate',
    description: 'Percentage of successfully completed financial transactions',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN Status = "completed" AND TransactionType IN ("transfer", "bill_payment", "withdrawal", "deposit") THEN 1 END) * 100.0 / COUNT(CASE WHEN TransactionType IN ("transfer", "bill_payment", "withdrawal", "deposit") THEN 1 END)',
    target: 99,
    threshold: 97,
    isRealTime: true
  },
  {
    id: 'mb_active_users',
    name: 'Daily Active Users',
    description: 'Number of unique users accessing the app per day',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'users',
    calculation: 'COUNT(DISTINCT UserID)',
    target: 50000,
    threshold: 30000,
    isRealTime: true
  },
  {
    id: 'mb_transaction_volume',
    name: 'Daily Transaction Volume',
    description: 'Number of financial transactions processed per day',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'transactions',
    calculation: 'COUNT(CASE WHEN TransactionType IN ("transfer", "bill_payment", "withdrawal", "deposit") THEN 1 END)',
    target: 100000,
    threshold: 70000,
    isRealTime: true
  },
  {
    id: 'mb_transaction_value',
    name: 'Daily Transaction Value',
    description: 'Total monetary value of transactions processed per day',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'currency',
    calculation: 'SUM(Amount)',
    target: 10000000,
    threshold: 5000000,
    isRealTime: true
  },
  {
    id: 'mb_app_crash',
    name: 'App Crash Rate',
    description: 'Percentage of sessions that end with an app crash',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN EndReason = "crash" THEN 1 END) * 100.0 / COUNT(*)',
    target: 0.5,
    threshold: 2,
    isRealTime: true
  },
  {
    id: 'mb_session_duration',
    name: 'Average Session Duration',
    description: 'Average time users spend per app session',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'seconds',
    calculation: 'AVG(DATEDIFF(second, StartTime, EndTime))',
    target: 180,
    threshold: 120,
    isRealTime: false
  },
  {
    id: 'mb_app_latency',
    name: 'App Response Time',
    description: 'Average time for the app to respond to user actions',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'milliseconds',
    calculation: 'AVG(ResponseTime)',
    target: 300,
    threshold: 700,
    isRealTime: true
  },
  {
    id: 'mb_user_retention',
    name: '30-Day User Retention',
    description: 'Percentage of users who return to the app within 30 days',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(DISTINCT UserID WHERE LastLogin >= DATEADD(day, -30, GETDATE())) * 100.0 / COUNT(DISTINCT UserID)',
    target: 80,
    threshold: 60,
    isRealTime: false
  },
  {
    id: 'mb_app_rating',
    name: 'App Store Rating',
    description: 'Average rating of the app in app stores (iOS and Android)',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'stars',
    calculation: 'AVG(Rating)',
    target: 4.5,
    threshold: 4,
    isRealTime: false
  },
  {
    id: 'mb_support_requests',
    name: 'In-App Support Requests',
    description: 'Number of support requests submitted through the app',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'requests',
    calculation: 'COUNT(CASE WHEN TransactionType = "support_request" THEN 1 END)',
    target: 100,
    threshold: 200,
    isRealTime: true
  },
  {
    id: 'mb_security_alerts',
    name: 'Security Incident Rate',
    description: 'Rate of security-related incidents (suspicious logins, etc.)',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'incidents per 1000 users',
    calculation: 'COUNT(CASE WHEN SecurityFlag = 1 THEN 1 END) * 1000.0 / COUNT(DISTINCT UserID)',
    target: 0.5,
    threshold: 2,
    isRealTime: true
  },
  {
    id: 'mb_transaction_time',
    name: 'Average Transaction Time',
    description: 'Average time to complete a financial transaction',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'seconds',
    calculation: 'AVG(DATEDIFF(second, TransactionStart, TransactionEnd))',
    target: 5,
    threshold: 10,
    isRealTime: true
  },
  {
    id: 'mb_peak_transactions',
    name: 'Peak Hour Transaction Count',
    description: 'Maximum number of transactions processed during peak hour',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'transactions',
    calculation: 'MAX(HourlyTransactionCount)',
    target: 10000,
    threshold: 15000,
    isRealTime: true
  },
  {
    id: 'mb_feature_adoption',
    name: 'New Feature Adoption',
    description: 'Percentage of users who use newly introduced features',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(DISTINCT UserID WHERE UsedNewFeature = 1) * 100.0 / COUNT(DISTINCT UserID)',
    target: 20,
    threshold: 10,
    isRealTime: false
  },
  {
    id: 'mb_bill_payment',
    name: 'Bill Payment Success Rate',
    description: 'Percentage of bill payments completed successfully',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN Status = "completed" AND TransactionType = "bill_payment" THEN 1 END) * 100.0 / COUNT(CASE WHEN TransactionType = "bill_payment" THEN 1 END)',
    target: 99,
    threshold: 97,
    isRealTime: true
  },
  {
    id: 'mb_user_satisfaction',
    name: 'User Satisfaction Score',
    description: 'Average satisfaction rating from in-app feedback',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    calculation: 'AVG(SatisfactionScore) * 100',
    target: 85,
    threshold: 70,
    isRealTime: false
  },
  {
    id: 'mb_api_latency',
    name: 'API Response Time',
    description: 'Average response time of backend APIs serving the mobile app',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'milliseconds',
    calculation: 'AVG(APIResponseTime)',
    target: 200,
    threshold: 500,
    isRealTime: true
  },
  {
    id: 'mb_fraud_detection',
    name: 'Fraud Detection Rate',
    description: 'Percentage of transactions flagged for potential fraud',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN FraudFlag = 1 THEN 1 END) * 100.0 / COUNT(*)',
    target: 0.1,
    threshold: 0.5,
    isRealTime: true
  },
  {
    id: 'mb_device_distribution',
    name: 'Device Type Distribution',
    description: 'Percentage breakdown of transactions by device type (iOS/Android)',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    calculation: 'COUNT(CASE WHEN DeviceType = "ios" THEN 1 END) * 100.0 / COUNT(*)',
    target: 50,
    threshold: null,
    isRealTime: false
  }
];

// Mobile Banking KPIs - Medium (20)
export const mobileBankingMediumKpis: KpiDefinition[] = [
  {
    id: 'mb_login_failure',
    name: 'Login Failure Rate',
    description: 'Percentage of failed login attempts',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN Status = "failed" AND TransactionType = "login" THEN 1 END) * 100.0 / COUNT(CASE WHEN TransactionType = "login" THEN 1 END)',
    target: 2,
    threshold: 5,
    isRealTime: true
  },
  {
    id: 'mb_session_per_user',
    name: 'Average Sessions Per User',
    description: 'Average number of app sessions per user per day',
    type: 'mobile_banking',
    priority: 'medium',
    unit: 'sessions',
    calculation: 'COUNT(*) * 1.0 / COUNT(DISTINCT UserID)',
    target: 3,
    threshold: 1.5,
    isRealTime: false
  },
  {
    id: 'mb_funnel_conversion',
    name: 'Transaction Funnel Conversion',
    description: 'Completion rate through transaction initiation to submission',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN FunnelStage = "completed" THEN 1 END) * 100.0 / COUNT(CASE WHEN FunnelStage = "initiated" THEN 1 END)',
    target: 85,
    threshold: 70,
    isRealTime: false
  },
  {
    id: 'mb_error_rate',
    name: 'Transaction Error Rate',
    description: 'Percentage of transactions resulting in errors',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN ErrorCode IS NOT NULL THEN 1 END) * 100.0 / COUNT(*)',
    target: 0.5,
    threshold: 2,
    isRealTime: true
  },
  {
    id: 'mb_session_timeout',
    name: 'Session Timeout Rate',
    description: 'Percentage of sessions ending due to timeout',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN EndReason = "timeout" THEN 1 END) * 100.0 / COUNT(*)',
    target: 10,
    threshold: 20,
    isRealTime: false
  },
  {
    id: 'mb_transaction_by_type',
    name: 'Transaction Type Distribution',
    description: 'Percentage breakdown of transactions by type',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() GROUP BY TransactionType',
    target: null,
    threshold: null,
    isRealTime: false
  },
  {
    id: 'mb_update_adoption',
    name: 'App Update Adoption',
    description: 'Percentage of users on the latest app version',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(DISTINCT UserID WHERE AppVersion = LatestVersion) * 100.0 / COUNT(DISTINCT UserID)',
    target: 80,
    threshold: 60,
    isRealTime: false
  },
  {
    id: 'mb_network_errors',
    name: 'Network Error Rate',
    description: 'Percentage of transactions failing due to network issues',
    type: 'mobile_banking',
    priority: 'medium',
    unit: '%',
    calculation: 'COUNT(CASE WHEN ErrorType = "network" THEN 1 END) * 100.0 / COUNT(*)',
    target: 1,
    threshold: 3,
    isRealTime: true
  },
  {
    id: 'mb_peak_users',
    name: 'Peak Hour User Count',
    description: 'Maximum number of concurrent users during peak hour',
    type: 'mobile_banking',
    priority: 'medium',
    unit: 'users',
    calculation: 'MAX(ConcurrentUsers)',
    target: 5000,
    threshold: 8000,
    isRealTime: true
  },
  {
    id: 'mb_avg_tx_amount',
    name: 'Average Transaction Amount',
    description: 'Average monetary value per transaction',
    type: 'mobile_banking',
    priority: 'medium',
    unit: 'currency',
    calculation: 'AVG(Amount)',
    target: 500,
    threshold: 1000,
    isRealTime: false
  },
  // ... 10 more medium priority KPIs would be defined here
];

// We'll define 60 more Mobile Banking KPIs with low priority
export const mobileBankingLowKpis: KpiDefinition[] = [
  // Adding the first 10 low priority KPIs as examples
  {
    id: 'mb_tx_by_merchant',
    name: 'Transaction by Merchant Category',
    description: 'Percentage breakdown of transactions by merchant category',
    type: 'mobile_banking',
    priority: 'low',
    unit: '%',
    calculation: 'COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() GROUP BY MerchantCategory',
    target: null,
    threshold: null,
    isRealTime: false
  },
  {
    id: 'mb_user_age_distribution',
    name: 'User Age Distribution',
    description: 'Percentage breakdown of users by age group',
    type: 'mobile_banking',
    priority: 'low',
    unit: '%',
    calculation: 'COUNT(DISTINCT UserID) * 100.0 / SUM(COUNT(DISTINCT UserID)) OVER() GROUP BY AgeGroup',
    target: null,
    threshold: null,
    isRealTime: false
  },
  // ... 58 more low priority KPIs would be defined here
];

// Combine all KPIs
export const allKpis: KpiDefinition[] = [
  ...contactCenterCriticalKpis,
  ...contactCenterMediumKpis,
  ...contactCenterLowKpis,
  ...mobileBankingCriticalKpis,
  ...mobileBankingMediumKpis,
  ...mobileBankingLowKpis
];

// Helper function to get KPIs by type and priority
export function getKpisByTypeAndPriority(
  type: 'contact_center' | 'mobile_banking',
  priority?: 'critical' | 'medium' | 'low'
): KpiDefinition[] {
  if (priority) {
    return allKpis.filter(kpi => kpi.type === type && kpi.priority === priority);
  }
  return allKpis.filter(kpi => kpi.type === type);
}

// Helper function to get KPI by ID
export function getKpiById(id: string): KpiDefinition | undefined {
  return allKpis.find(kpi => kpi.id === id);
}

// Helper function to calculate a KPI for a specific tenant
export async function calculateKpi(
  kpiId: string,
  tenantId: number,
  startDate?: Date,
  endDate?: Date
): Promise<{ value: number; target: number; threshold: number; unit: string }> {
  const kpi = getKpiById(kpiId);
  
  if (!kpi) {
    throw new Error(`KPI with ID ${kpiId} not found`);
  }
  
  // In a real implementation, this would execute the SQL query
  // and calculate the actual KPI value
  
  // For now, return a sample value
  return {
    value: kpi.target * (0.7 + Math.random() * 0.6), // Random value around target
    target: kpi.target,
    threshold: kpi.threshold,
    unit: kpi.unit
  };
}