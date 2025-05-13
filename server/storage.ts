// Import types, but utilize memory-based implementation due to SQL connection issues
import {
  User, InsertUser,
  Tenant, InsertTenant,
  KpiCategory, InsertKpiCategory,
  KpiMetric, InsertKpiMetric,
  DashboardCustomization, InsertDashboardCustomization,
  Call, InsertCall,
  CallTranscription, InsertCallTranscription,
  MobileTransaction, InsertMobileTransaction,
  IvrInteraction, InsertIvrInteraction,
  Agent, InsertAgent,
  Alert, InsertAlert
} from '@shared/schema';

export interface IStorage {
  // Users
  getUsers(tenantId: number): Promise<User[]>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tenants
  getTenants(): Promise<Tenant[]>;
  getTenantById(id: number): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  
  // KPI Categories
  getKpiCategories(type: string): Promise<KpiCategory[]>;
  getKpiCategoryById(id: number): Promise<KpiCategory | undefined>;
  createKpiCategory(category: InsertKpiCategory): Promise<KpiCategory>;
  
  // KPI Metrics
  getKpiMetrics(tenantId: number, categoryId?: number): Promise<KpiMetric[]>;
  getKpiMetricById(id: number): Promise<KpiMetric | undefined>;
  createKpiMetric(metric: InsertKpiMetric): Promise<KpiMetric>;
  
  // Dashboard Customizations
  getDashboardCustomizations(userId: number, tenantId: number): Promise<DashboardCustomization | undefined>;
  createDashboardCustomization(customization: InsertDashboardCustomization): Promise<DashboardCustomization>;
  updateDashboardCustomization(id: number, customization: InsertDashboardCustomization): Promise<DashboardCustomization>;
  
  // Calls
  getCalls(tenantId: number, startDate?: Date, endDate?: Date): Promise<Call[]>;
  getCallById(id: number): Promise<Call | undefined>;
  createCall(call: InsertCall): Promise<Call>;
  
  // Call Transcriptions
  getCallTranscriptions(callId: number): Promise<CallTranscription[]>;
  getCallTranscriptionById(id: number): Promise<CallTranscription | undefined>;
  createCallTranscription(transcription: InsertCallTranscription): Promise<CallTranscription>;
  
  // Mobile Transactions
  getMobileTransactions(tenantId: number, startDate?: Date, endDate?: Date): Promise<MobileTransaction[]>;
  getMobileTransactionById(id: number): Promise<MobileTransaction | undefined>;
  createMobileTransaction(transaction: InsertMobileTransaction): Promise<MobileTransaction>;
  
  // IVR Interactions
  getIvrInteractions(tenantId: number, startDate?: Date, endDate?: Date): Promise<IvrInteraction[]>;
  getIvrInteractionById(id: number): Promise<IvrInteraction | undefined>;
  createIvrInteraction(interaction: InsertIvrInteraction): Promise<IvrInteraction>;
  
  // Agents
  getAgents(tenantId: number): Promise<Agent[]>;
  getAgentById(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  
  // Alerts
  getAlerts(tenantId: number): Promise<Alert[]>;
  getAlertById(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
}

export class MemoryStorage implements IStorage {
  // In-memory data collections
  private users: User[] = [
    { id: 1, username: 'admin', displayName: 'Admin', role: 'admin', tenantId: 1 },
    { id: 2, username: 'hameed', displayName: 'Hameed', role: 'manager', tenantId: 1 },
    { id: 3, username: 'rishi', displayName: 'Rishi', role: 'analyst', tenantId: 1 },
    { id: 4, username: 'admin_y', displayName: 'Admin', role: 'admin', tenantId: 2 },
    { id: 5, username: 'hameed_y', displayName: 'Hameed', role: 'manager', tenantId: 2 },
    { id: 6, username: 'rishi_y', displayName: 'Rishi', role: 'analyst', tenantId: 2 }
  ];
  
  private tenants: Tenant[] = [
    { id: 1, name: 'X Bank', code: 'XBANK', isActive: true },
    { id: 2, name: 'Y Bank', code: 'YBANK', isActive: true }
  ];
  
  private kpiCategories: KpiCategory[] = [
    { id: 1, name: 'Efficiency', type: 'contact_center', priority: 'critical' },
    { id: 2, name: 'Quality', type: 'contact_center', priority: 'critical' },
    { id: 3, name: 'Usage', type: 'mobile_banking', priority: 'critical' },
    { id: 4, name: 'Performance', type: 'mobile_banking', priority: 'critical' }
  ];
  
  private kpiMetrics: KpiMetric[] = [
    { 
      id: 1, 
      tenantId: 1, 
      categoryId: 1, 
      name: 'Average Handle Time', 
      value: 504, 
      target: 390, 
      threshold: 480, 
      unit: 'seconds', 
      trend: 'up', 
      trendValue: 5.2, 
      date: new Date()
    },
    { 
      id: 2, 
      tenantId: 1, 
      categoryId: 2, 
      name: 'Customer Satisfaction', 
      value: 87.4, 
      target: 85, 
      threshold: 80, 
      unit: 'percentage', 
      trend: 'up', 
      trendValue: 2.1, 
      date: new Date()
    },
    { 
      id: 3, 
      tenantId: 1, 
      categoryId: 2, 
      name: 'First Call Resolution', 
      value: 78.2, 
      target: 75, 
      threshold: 70, 
      unit: 'percentage', 
      trend: 'up', 
      trendValue: 1.8, 
      date: new Date()
    },
    { 
      id: 4, 
      tenantId: 1, 
      categoryId: 3, 
      name: 'App Transaction Success', 
      value: 96.4, 
      target: 99, 
      threshold: 95, 
      unit: 'percentage', 
      trend: 'down', 
      trendValue: 1.3, 
      date: new Date()
    }
  ];
  
  private dashboardCustomizations: DashboardCustomization[] = [];
  
  private calls: Call[] = [
    { 
      id: 1, 
      tenantId: 1, 
      agentId: 1, 
      callType: 'inbound', 
      startTime: new Date(Date.now() - 30 * 60 * 1000), 
      endTime: new Date(Date.now() - 25 * 60 * 1000), 
      duration: 300, 
      language: 'english', 
      isCompleted: true 
    },
    { 
      id: 2, 
      tenantId: 1, 
      agentId: 2, 
      callType: 'inbound', 
      startTime: new Date(Date.now() - 60 * 60 * 1000), 
      endTime: new Date(Date.now() - 50 * 60 * 1000), 
      duration: 600, 
      language: 'english', 
      isCompleted: true 
    },
    { 
      id: 3, 
      tenantId: 1, 
      agentId: 1, 
      callType: 'outbound', 
      startTime: new Date(Date.now() - 120 * 60 * 1000), 
      endTime: new Date(Date.now() - 110 * 60 * 1000), 
      duration: 600, 
      language: 'arabic', 
      isCompleted: true 
    }
  ];
  
  private callTranscriptions: CallTranscription[] = [
    {
      id: 1,
      callId: 1,
      transcriptText: "Agent: Thank you for calling X Bank. My name is Mohammed. How may I help you today?\nCustomer: Hi Mohammed, I'd like to check my account balance please.\nAgent: I'd be happy to help you with that. For security purposes, can you please verify your identity?\nCustomer: Yes, my name is John Smith and my date of birth is May the 15th, 1985.\nAgent: Thank you Mr. Smith. Your checking account balance is 2,540 riyals and your savings account has 15,200 riyals. Is there anything else I can help you with today?\nCustomer: That's all, thank you for your help.\nAgent: You're welcome. Thank you for banking with X Bank. Have a great day!",
      sentimentScore: 0.85,
      keyPhrases: "account balance, checking account, savings account",
      entities: "John Smith, May 15th 1985, 2540 riyals, 15200 riyals",
      tone: "positive",
      speakerDiarization: "agent:0-98,customer:99-159,agent:160-260,customer:261-327,agent:328-486,customer:487-522,agent:523-596",
      intent: "check_balance"
    },
    {
      id: 2,
      callId: 2,
      transcriptText: "Agent: Good morning, X Bank customer service. This is Sarah speaking. How may I assist you today?\nCustomer: Hello, I'm trying to transfer money through the mobile app but it keeps showing an error.\nAgent: I apologize for the inconvenience. I'll help you resolve this issue. Could you tell me what error message you're seeing?\nCustomer: It says 'Transaction cannot be processed at this time. Please try again later.'\nAgent: Thank you for that information. Let me check our system status. It appears we're experiencing some technical difficulties with our mobile transfer service. Our IT team is working on it and it should be resolved within the next hour. In the meantime, would you like me to process this transfer for you over the phone?\nCustomer: Yes, please. I need to transfer 500 riyals to my brother's account.\nAgent: I'd be happy to help with that. Let me verify your information first, and then we can proceed with the transfer.",
      sentimentScore: 0.62,
      keyPhrases: "transfer money, mobile app, error, transaction cannot be processed, technical difficulties",
      entities: "Sarah, 500 riyals",
      tone: "neutral",
      speakerDiarization: "agent:0-94,customer:95-177,agent:178-293,customer:294-364,agent:365-667,customer:668-726,agent:727-833",
      intent: "technical_support"
    },
    {
      id: 3,
      callId: 3,
      transcriptText: "Agent: X Bank international services, this is Ahmed speaking. How can I help you?\nCustomer: Hi Ahmed, I'm traveling to Europe next week and I want to make sure my cards will work there.\nAgent: Thank you for letting us know about your travel plans. I'll make sure to put a travel notice on your account. Which countries will you be visiting?\nCustomer: I'll be going to France, Germany, and Spain.\nAgent: Perfect. I've noted these countries on your travel notice. Your debit and credit cards should work without any issues in these locations. However, I recommend carrying some cash as well for small purchases. Also, please remember that foreign transactions may incur additional fees.\nCustomer: What are the fees exactly?\nAgent: For ATM withdrawals, there's a 3% transaction fee plus a flat fee of 15 riyals per withdrawal. For credit card purchases, there's a 2.5% foreign transaction fee. Would you like me to waive some of these fees during your travel period?\nCustomer: Yes, that would be great.\nAgent: I've applied a promotional waiver to your account that reduces the foreign transaction fee to 1% for the next month. Is there anything else you'd like to know before your trip?",
      sentimentScore: 0.78,
      keyPhrases: "travel plans, travel notice, debit card, credit card, foreign transactions, fees",
      entities: "Ahmed, Europe, France, Germany, Spain, 3%, 15 riyals, 2.5%, 1%",
      tone: "positive",
      speakerDiarization: "agent:0-69,customer:70-159,agent:160-303,customer:304-349,agent:350-638,customer:639-665,agent:666-905,customer:906-933,agent:934-1110",
      intent: "travel_notification"
    }
  ];
  
  private mobileTransactions: MobileTransaction[] = [
    {
      id: 1,
      tenantId: 1,
      userId: 2,
      transactionType: 'transfer',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 35000),
      amount: 500.00,
      status: 'completed',
      deviceType: 'ios',
      sentimentScore: 0.85,
      keyPhrases: null,
      entities: null
    },
    {
      id: 2,
      tenantId: 1,
      userId: 3,
      transactionType: 'bill_payment',
      startTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 5 * 60 * 60 * 1000 + 42000),
      amount: 120.50,
      status: 'completed',
      deviceType: 'android',
      sentimentScore: 0.65,
      keyPhrases: null,
      entities: null
    },
    {
      id: 3,
      tenantId: 1,
      userId: 2,
      transactionType: 'withdrawal',
      startTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 8 * 60 * 60 * 1000 + 28000),
      amount: 200.00,
      status: 'completed',
      deviceType: 'ios',
      sentimentScore: 0.78,
      keyPhrases: null,
      entities: null
    },
    {
      id: 4,
      tenantId: 1,
      userId: 1,
      transactionType: 'deposit',
      startTime: new Date(Date.now() - 10 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 10 * 60 * 60 * 1000 + 45000),
      amount: 1000.00,
      status: 'completed',
      deviceType: 'android',
      sentimentScore: 0.92,
      keyPhrases: null,
      entities: null
    },
    {
      id: 5,
      tenantId: 1,
      userId: 3,
      transactionType: 'transfer',
      startTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 12 * 60 * 60 * 1000 + 38000),
      amount: 350.00,
      status: 'failed',
      deviceType: 'ios',
      sentimentScore: 0.35,
      keyPhrases: null,
      entities: null
    }
  ];
  
  private ivrInteractions: IvrInteraction[] = [
    {
      id: 1,
      tenantId: 1,
      callId: 1,
      startTime: new Date(Date.now() - 30 * 60 * 1000),
      nodeSequence: 'welcome,language_selection,main_menu,account_balance,end',
      dropOffNode: 'end',
      interactionTime: 120,
      intent: 'check_balance'
    },
    {
      id: 2,
      tenantId: 1,
      callId: 2,
      startTime: new Date(Date.now() - 60 * 60 * 1000),
      nodeSequence: 'welcome,language_selection,main_menu,transfer_funds,authentication,transfer_confirmation,end',
      dropOffNode: 'end',
      interactionTime: 240,
      intent: 'transfer_money'
    },
    {
      id: 3,
      tenantId: 1,
      callId: 3,
      startTime: new Date(Date.now() - 120 * 60 * 1000),
      nodeSequence: 'welcome,language_selection,main_menu,report_issue,agent_transfer',
      dropOffNode: 'agent_transfer',
      interactionTime: 180,
      intent: 'report_problem'
    },
    {
      id: 4,
      tenantId: 1,
      callId: 1,
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      nodeSequence: 'welcome,language_selection,main_menu',
      dropOffNode: 'main_menu',
      interactionTime: 45,
      intent: null
    },
    {
      id: 5,
      tenantId: 1,
      callId: 2,
      startTime: new Date(Date.now() - 25 * 60 * 60 * 1000),
      nodeSequence: 'welcome,language_selection,main_menu,bill_payment,authentication,bill_selection,payment_confirmation,end',
      dropOffNode: 'end',
      interactionTime: 300,
      intent: 'pay_bill'
    }
  ];
  
  private agents: Agent[] = [
    { id: 1, tenantId: 1, name: 'Mohammed A.', shiftId: 1, isActive: true },
    { id: 2, tenantId: 1, name: 'Sarah K.', shiftId: 1, isActive: true },
    { id: 3, tenantId: 1, name: 'Ahmed R.', shiftId: 2, isActive: true },
    { id: 4, tenantId: 1, name: 'Fatima H.', shiftId: 2, isActive: true },
    { id: 5, tenantId: 1, name: 'Omar Y.', shiftId: 3, isActive: true }
  ];
  
  private alerts: Alert[] = [
    {
      id: 1,
      tenantId: 1,
      alertType: 'kpi_threshold',
      message: 'Call volume exceeded threshold (250 calls/hour). Current: 272 calls/hour.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      severity: 'high',
      status: 'active'
    },
    {
      id: 2,
      tenantId: 1,
      alertType: 'app_error',
      message: 'Transaction failure rate at 3.6% (threshold: 3.0%). Investigating potential API timeout issues.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      severity: 'medium',
      status: 'active'
    },
    {
      id: 3,
      tenantId: 1,
      alertType: 'ml_model',
      message: 'Sentiment analysis model retrained with new data. Accuracy improved by 2.1%.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      severity: 'low',
      status: 'acknowledged'
    }
  ];
  
  // Utility functions
  private getNextId(items: any[]): number {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }
  
  // Users
  async getUsers(tenantId: number): Promise<User[]> {
    return Promise.resolve(this.users.filter(user => user.tenantId === tenantId));
  }
  
  async getUserById(id: number): Promise<User | undefined> {
    return Promise.resolve(this.users.find(user => user.id === id));
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find(user => user.username === username));
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      ...user,
      id: this.getNextId(this.users)
    };
    this.users.push(newUser);
    return Promise.resolve(newUser);
  }
  
  // Tenants
  async getTenants(): Promise<Tenant[]> {
    return Promise.resolve(this.tenants);
  }
  
  async getTenantById(id: number): Promise<Tenant | undefined> {
    return Promise.resolve(this.tenants.find(tenant => tenant.id === id));
  }
  
  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const newTenant: Tenant = {
      ...tenant,
      id: this.getNextId(this.tenants),
      isActive: tenant.isActive === undefined ? true : tenant.isActive
    };
    this.tenants.push(newTenant);
    return Promise.resolve(newTenant);
  }
  
  // KPI Categories
  async getKpiCategories(type: string): Promise<KpiCategory[]> {
    return Promise.resolve(this.kpiCategories.filter(category => category.type === type));
  }
  
  async getKpiCategoryById(id: number): Promise<KpiCategory | undefined> {
    return Promise.resolve(this.kpiCategories.find(category => category.id === id));
  }
  
  async createKpiCategory(category: InsertKpiCategory): Promise<KpiCategory> {
    const newCategory: KpiCategory = {
      ...category,
      id: this.getNextId(this.kpiCategories)
    };
    this.kpiCategories.push(newCategory);
    return Promise.resolve(newCategory);
  }
  
  // KPI Metrics
  async getKpiMetrics(tenantId: number, categoryId?: number): Promise<KpiMetric[]> {
    let metrics = this.kpiMetrics.filter(metric => metric.tenantId === tenantId);
    if (categoryId) {
      metrics = metrics.filter(metric => metric.categoryId === categoryId);
    }
    return Promise.resolve(metrics);
  }
  
  async getKpiMetricById(id: number): Promise<KpiMetric | undefined> {
    return Promise.resolve(this.kpiMetrics.find(metric => metric.id === id));
  }
  
  async createKpiMetric(metric: InsertKpiMetric): Promise<KpiMetric> {
    const newMetric: KpiMetric = {
      ...metric,
      id: this.getNextId(this.kpiMetrics),
      trendValue: metric.trendValue === undefined ? null : metric.trendValue
    };
    this.kpiMetrics.push(newMetric);
    return Promise.resolve(newMetric);
  }
  
  // Dashboard Customizations
  async getDashboardCustomizations(userId: number, tenantId: number): Promise<DashboardCustomization | undefined> {
    return Promise.resolve(
      this.dashboardCustomizations.find(
        customization => customization.userId === userId && customization.tenantId === tenantId
      )
    );
  }
  
  async createDashboardCustomization(customization: InsertDashboardCustomization): Promise<DashboardCustomization> {
    const newCustomization: DashboardCustomization = {
      ...customization,
      id: this.getNextId(this.dashboardCustomizations)
    };
    this.dashboardCustomizations.push(newCustomization);
    return Promise.resolve(newCustomization);
  }
  
  async updateDashboardCustomization(id: number, customization: InsertDashboardCustomization): Promise<DashboardCustomization> {
    const index = this.dashboardCustomizations.findIndex(c => c.id === id);
    if (index !== -1) {
      const updatedCustomization: DashboardCustomization = {
        ...customization,
        id
      };
      this.dashboardCustomizations[index] = updatedCustomization;
      return Promise.resolve(updatedCustomization);
    }
    throw new Error('Dashboard customization not found');
  }
  
  // Calls
  async getCalls(tenantId: number, startDate?: Date, endDate?: Date): Promise<Call[]> {
    let filteredCalls = this.calls.filter(call => call.tenantId === tenantId);
    
    if (startDate) {
      filteredCalls = filteredCalls.filter(
        call => new Date(call.startTime) >= startDate
      );
    }
    
    if (endDate) {
      filteredCalls = filteredCalls.filter(
        call => new Date(call.startTime) <= endDate
      );
    }
    
    return Promise.resolve(filteredCalls);
  }
  
  async getCallById(id: number): Promise<Call | undefined> {
    return Promise.resolve(this.calls.find(call => call.id === id));
  }
  
  async createCall(call: InsertCall): Promise<Call> {
    const newCall: Call = {
      ...call,
      id: this.getNextId(this.calls)
    };
    this.calls.push(newCall);
    return Promise.resolve(newCall);
  }
  
  // Call Transcriptions
  async getCallTranscriptions(callId: number): Promise<CallTranscription[]> {
    return Promise.resolve(this.callTranscriptions.filter(transcription => transcription.callId === callId));
  }
  
  async getCallTranscriptionById(id: number): Promise<CallTranscription | undefined> {
    return Promise.resolve(this.callTranscriptions.find(transcription => transcription.id === id));
  }
  
  async createCallTranscription(transcription: InsertCallTranscription): Promise<CallTranscription> {
    const newTranscription: CallTranscription = {
      ...transcription,
      id: this.getNextId(this.callTranscriptions),
      sentimentScore: transcription.sentimentScore === undefined ? null : transcription.sentimentScore,
      keyPhrases: transcription.keyPhrases === undefined ? null : transcription.keyPhrases,
      entities: transcription.entities === undefined ? null : transcription.entities,
      tone: transcription.tone === undefined ? null : transcription.tone,
      speakerDiarization: transcription.speakerDiarization === undefined ? null : transcription.speakerDiarization,
      intent: transcription.intent === undefined ? null : transcription.intent
    };
    this.callTranscriptions.push(newTranscription);
    return Promise.resolve(newTranscription);
  }
  
  // Mobile Transactions
  async getMobileTransactions(tenantId: number, startDate?: Date, endDate?: Date): Promise<MobileTransaction[]> {
    let filteredTransactions = this.mobileTransactions.filter(transaction => transaction.tenantId === tenantId);
    
    if (startDate) {
      filteredTransactions = filteredTransactions.filter(
        transaction => new Date(transaction.startTime) >= startDate
      );
    }
    
    if (endDate) {
      filteredTransactions = filteredTransactions.filter(
        transaction => new Date(transaction.startTime) <= endDate
      );
    }
    
    return Promise.resolve(filteredTransactions);
  }
  
  async getMobileTransactionById(id: number): Promise<MobileTransaction | undefined> {
    return Promise.resolve(this.mobileTransactions.find(transaction => transaction.id === id));
  }
  
  async createMobileTransaction(transaction: InsertMobileTransaction): Promise<MobileTransaction> {
    const newTransaction: MobileTransaction = {
      ...transaction,
      id: this.getNextId(this.mobileTransactions),
      sentimentScore: transaction.sentimentScore === undefined ? null : transaction.sentimentScore,
      keyPhrases: transaction.keyPhrases === undefined ? null : transaction.keyPhrases,
      entities: transaction.entities === undefined ? null : transaction.entities,
      amount: transaction.amount === undefined ? null : transaction.amount
    };
    this.mobileTransactions.push(newTransaction);
    return Promise.resolve(newTransaction);
  }
  
  // IVR Interactions
  async getIvrInteractions(tenantId: number, startDate?: Date, endDate?: Date): Promise<IvrInteraction[]> {
    let filteredInteractions = this.ivrInteractions.filter(interaction => interaction.tenantId === tenantId);
    
    if (startDate) {
      filteredInteractions = filteredInteractions.filter(
        interaction => new Date(interaction.startTime) >= startDate
      );
    }
    
    if (endDate) {
      filteredInteractions = filteredInteractions.filter(
        interaction => new Date(interaction.startTime) <= endDate
      );
    }
    
    return Promise.resolve(filteredInteractions);
  }
  
  async getIvrInteractionById(id: number): Promise<IvrInteraction | undefined> {
    return Promise.resolve(this.ivrInteractions.find(interaction => interaction.id === id));
  }
  
  async createIvrInteraction(interaction: InsertIvrInteraction): Promise<IvrInteraction> {
    const newInteraction: IvrInteraction = {
      ...interaction,
      id: this.getNextId(this.ivrInteractions),
      intent: interaction.intent === undefined ? null : interaction.intent,
      dropOffNode: interaction.dropOffNode === undefined ? null : interaction.dropOffNode
    };
    this.ivrInteractions.push(newInteraction);
    return Promise.resolve(newInteraction);
  }
  
  // Agents
  async getAgents(tenantId: number): Promise<Agent[]> {
    return Promise.resolve(this.agents.filter(agent => agent.tenantId === tenantId));
  }
  
  async getAgentById(id: number): Promise<Agent | undefined> {
    return Promise.resolve(this.agents.find(agent => agent.id === id));
  }
  
  async createAgent(agent: InsertAgent): Promise<Agent> {
    const newAgent: Agent = {
      ...agent,
      id: this.getNextId(this.agents),
      isActive: agent.isActive === undefined ? true : agent.isActive,
      shiftId: agent.shiftId === undefined ? null : agent.shiftId
    };
    this.agents.push(newAgent);
    return Promise.resolve(newAgent);
  }
  
  // Alerts
  async getAlerts(tenantId: number): Promise<Alert[]> {
    return Promise.resolve(
      this.alerts
        .filter(alert => alert.tenantId === tenantId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
  }
  
  async getAlertById(id: number): Promise<Alert | undefined> {
    return Promise.resolve(this.alerts.find(alert => alert.id === id));
  }
  
  async createAlert(alert: InsertAlert): Promise<Alert> {
    const newAlert: Alert = {
      ...alert,
      id: this.getNextId(this.alerts)
    };
    this.alerts.push(newAlert);
    return Promise.resolve(newAlert);
  }
}

// Using Memory Storage until Azure SQL connection is fixed
export const storage = new MemoryStorage();
