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
  
  private callTranscriptions: CallTranscription[] = [];
  
  private mobileTransactions: MobileTransaction[] = [];
  
  private ivrInteractions: IvrInteraction[] = [];
  
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
      id: this.getNextId(this.mobileTransactions)
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
      id: this.getNextId(this.ivrInteractions)
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
      id: this.getNextId(this.agents)
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
