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
    threshold: 240
  },
  {
    id: 'cc_csat',
    name: 'Customer Satisfaction',
    description: 'Average satisfaction score from post-call surveys',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    target: 85,
    threshold: 70
  },
  {
    id: 'cc_fcr',
    name: 'First Call Resolution',
    description: 'Percentage of calls resolved without need for follow-up',
    type: 'contact_center',
    priority: 'critical',
    unit: '%',
    target: 75,
    threshold: 60
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
    threshold: 95
  },
  {
    id: 'mb_transaction_success',
    name: 'Transaction Success Rate',
    description: 'Percentage of successfully completed financial transactions',
    type: 'mobile_banking',
    priority: 'critical',
    unit: '%',
    target: 99,
    threshold: 97
  },
  {
    id: 'mb_active_users',
    name: 'Daily Active Users',
    description: 'Number of unique users accessing the app per day',
    type: 'mobile_banking',
    priority: 'critical',
    unit: 'users',
    target: 50000,
    threshold: 30000
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
    threshold: 5
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