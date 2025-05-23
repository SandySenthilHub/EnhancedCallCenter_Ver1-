import { pgTable, text, serial, integer, boolean, timestamp, real, varchar, jsonb, decimal, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enhanced User schema with Call Center Intelligence roles
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: text("username"),
  displayName: text("display_name"),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role"), // 'agent', 'supervisor', 'manager', 'admin'
  currentTenantId: integer("current_tenant_id"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced Tenants schema with framework foundation
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: text("code").notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Roles table for enhanced user management
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  permissions: jsonb("permissions").notNull(), // Array of permission strings
  isSystemRole: boolean("is_system_role").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User-Tenant-Role mapping for multi-tenant access control
export const userTenantRoles = pgTable("user_tenant_roles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  roleId: integer("role_id").references(() => roles.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Teams table for organizing users into groups
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  tenantId: integer("tenant_id").notNull().references(() => tenants.id),
  managerId: varchar("manager_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: varchar("created_by").references(() => users.id),
});

// Team memberships table for user-team relationships
export const teamMemberships = pgTable("team_memberships", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull().references(() => teams.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role", { length: 50 }).default("member"), // member, lead, admin
  joinedAt: timestamp("joined_at").defaultNow(),
  addedBy: varchar("added_by").references(() => users.id),
  isActive: boolean("is_active").default(true),
});

// Entities table for dynamic business objects
export const entities = pgTable("entities", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'primary', 'sub', 'reference'
  parentEntityId: integer("parent_entity_id").references(() => entities.id),
  description: text("description"),
  schema: jsonb("schema").notNull(), // JSON schema for fields
  isActive: boolean("is_active").default(true),
  recordCount: integer("record_count").default(0),
  lastModified: timestamp("last_modified").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// KPI Categories
export const kpiCategories = pgTable("kpi_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'contact_center' or 'mobile_banking'
  priority: text("priority").notNull(), // 'critical', 'medium', 'low'
});

// KPI Metrics
export const kpiMetrics = pgTable("kpi_metrics", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  value: real("value").notNull(),
  target: real("target").notNull(),
  threshold: real("threshold").notNull(),
  unit: text("unit").notNull(),
  trend: text("trend").notNull(), // 'up', 'down', 'neutral'
  trendValue: real("trend_value"),
  date: timestamp("date").notNull(),
});

// Dashboard Customizations
export const dashboardCustomizations = pgTable("dashboard_customizations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tenantId: integer("tenant_id").notNull(),
  dashboardConfig: text("dashboard_config").notNull(), // JSON string
  lastUpdated: timestamp("last_updated").notNull(),
});

// Call Data
export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull(),
  agentId: integer("agent_id").notNull(),
  callType: text("call_type").notNull(), // 'inbound', 'outbound'
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  duration: integer("duration").notNull(), // in seconds
  language: text("language").notNull(), // 'english', 'arabic'
  isCompleted: boolean("is_completed").notNull(),
});

// Call Transcriptions
export const callTranscriptions = pgTable("call_transcriptions", {
  id: serial("id").primaryKey(),
  callId: integer("call_id").notNull(),
  transcriptText: text("transcript_text").notNull(),
  sentimentScore: real("sentiment_score"),
  keyPhrases: text("key_phrases"), // JSON string
  entities: text("entities"), // JSON string
  tone: text("tone"),
  speakerDiarization: text("speaker_diarization"), // JSON string
  intent: text("intent"),
});

// Mobile Transactions
export const mobileTransactions = pgTable("mobile_transactions", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull(),
  userId: integer("user_id").notNull(),
  transactionType: text("transaction_type").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  amount: real("amount"),
  status: text("status").notNull(),
  deviceType: text("device_type").notNull(),
  sentimentScore: real("sentiment_score"),
  keyPhrases: text("key_phrases"), // JSON string
  entities: text("entities"), // JSON string
});

// IVR Interactions
export const ivrInteractions = pgTable("ivr_interactions", {
  id: serial("id").primaryKey(),
  callId: integer("call_id").notNull(),
  tenantId: integer("tenant_id").notNull(),
  nodeSequence: text("node_sequence").notNull(), // JSON string
  dropOffNode: text("drop_off_node"),
  interactionTime: integer("interaction_time").notNull(), // in seconds
  startTime: timestamp("start_time").notNull(),
  intent: text("intent"),
});

// Agents
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull(),
  name: text("name").notNull(),
  shiftId: integer("shift_id"),
  isActive: boolean("is_active").default(true),
});

// Enhanced Alerts with framework foundation
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  userId: varchar("user_id").references(() => users.id),
  alertType: varchar("alert_type", { length: 50 }).notNull(), // 'system', 'security', 'business', 'notification'
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  severity: varchar("severity", { length: 20 }).notNull(), // 'info', 'warning', 'error', 'critical'
  isRead: boolean("is_read").default(false),
  actionRequired: boolean("action_required").default(false),
  actionUrl: varchar("action_url", { length: 500 }),
  expiresAt: timestamp("expires_at"),
  timestamp: timestamp("timestamp").notNull(),
  status: text("status").notNull(), // 'active', 'acknowledged', 'resolved'
  createdAt: timestamp("created_at").defaultNow(),
});

// Geographic and Reference Tables for Global Banking Operations

// Countries table
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 3 }).notNull().unique(), // ISO 3166-1 alpha-3
  code2: varchar("code2", { length: 2 }).notNull().unique(), // ISO 3166-1 alpha-2
  dialCode: varchar("dial_code", { length: 10 }),
  currencyCode: varchar("currency_code", { length: 3 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Currencies table for multi-currency banking
export const currencies = pgTable("currencies", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 3 }).notNull().unique(), // ISO 4217
  name: varchar("name", { length: 255 }).notNull(),
  symbol: varchar("symbol", { length: 10 }),
  decimalPlaces: integer("decimal_places").default(2),
  exchangeRateToUSD: decimal("exchange_rate_to_usd", { precision: 15, scale: 6 }).default("1.000000"),
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// System Logging and Audit Tables

// Access Log table for comprehensive audit trails
export const accessLog = pgTable("access_log", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  userId: varchar("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 255 }).notNull(),
  resourceId: varchar("resource_id", { length: 50 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  requestData: jsonb("request_data"),
  responseStatus: integer("response_status"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Activity Tracking for enhanced analytics
export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  action: varchar("action", { length: 100 }).notNull(), // LOGIN, CREATE_TEAM, VIEW_DATA, etc.
  resource: varchar("resource", { length: 100 }), // Teams, Users, Countries, etc.
  resourceId: varchar("resource_id", { length: 100 }), // ID of the resource if applicable
  details: text("details"), // Additional details about the action
  ipAddress: varchar("ip_address", { length: 45 }), // IPv4 or IPv6
  userAgent: text("user_agent"), // Browser/client information
  status: varchar("status", { length: 20 }).default("SUCCESS"), // SUCCESS, FAILED, WARNING
  isAdminAction: boolean("is_admin_action").default(false), // Track admin vs regular user actions
  sessionId: varchar("session_id", { length: 255 }), // Session identifier
  duration: integer("duration"), // Action duration in milliseconds
  createdAt: timestamp("created_at").defaultNow(),
});

// **COMPLETE FRAMEWORK FOUNDATION TABLES**

// Screen Assets table for dynamic UI generation
export const screenAssets = pgTable("screen_assets", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  entityId: integer("entity_id").references(() => entities.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'list', 'form', 'detail'
  configuration: jsonb("configuration").notNull(), // UI configuration
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transaction Definitions for business processes
export const transactionDefinitions = pgTable("transaction_definitions", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  workflow: jsonb("workflow").notNull(), // Workflow steps and rules
  sourceEntityId: integer("source_entity_id").references(() => entities.id),
  targetEntityId: integer("target_entity_id").references(() => entities.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transaction Instances for business process execution
export const transactionInstances = pgTable("transaction_instances", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  definitionId: integer("definition_id").references(() => transactionDefinitions.id).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // 'pending', 'processing', 'completed', 'failed'
  data: jsonb("data").notNull(),
  executedBy: varchar("executed_by").references(() => users.id),
  executedAt: timestamp("executed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Geographic Data Tables for Global Operations

// Regions table
export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  countryId: integer("country_id").references(() => countries.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cities table
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  countryId: integer("country_id").references(() => countries.id).notNull(),
  regionId: integer("region_id").references(() => regions.id),
  name: varchar("name", { length: 255 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Languages table for internationalization
export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 5 }).notNull().unique(), // ISO 639-1/639-2
  name: varchar("name", { length: 255 }).notNull(),
  nativeName: varchar("native_name", { length: 255 }),
  isRTL: boolean("is_rtl").default(false), // Right-to-left support
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Security and Access Control Tables

// Modules table for permission management
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  permissions: jsonb("permissions").notNull(), // Array of permission strings
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Role Exceptions for granular access control
export const roleExceptions = pgTable("role_exceptions", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  roleId: integer("role_id").references(() => roles.id).notNull(),
  moduleId: integer("module_id").references(() => modules.id),
  permission: varchar("permission", { length: 255 }).notNull(),
  exceptionType: varchar("exception_type", { length: 10 }).notNull(), // 'allow', 'deny'
  isActive: boolean("is_active").default(true),
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Restrictions for enhanced security
export const userRestrictions = pgTable("user_restrictions", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  restrictionType: varchar("restriction_type", { length: 50 }).notNull(), // 'ip', 'time_window', 'geo'
  restrictionValue: text("restriction_value").notNull(),
  isActive: boolean("is_active").default(true),
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Business Logic Tables

// Companies table for business entities
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: varchar("logo_url", { length: 500 }),
  companyType: varchar("company_type", { length: 50 }).notNull(), // 'government', 'private', 'public', 'small_business', 'personal'
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Text Translations for internationalization
export const textTranslations = pgTable("text_translations", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  languageId: integer("language_id").references(() => languages.id).notNull(),
  textKey: varchar("text_key", { length: 255 }).notNull(),
  translatedText: text("translated_text").notNull(),
  context: varchar("context", { length: 100 }), // 'field_label', 'button', 'message', etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inbox Items for workflow management
export const inboxItems = pgTable("inbox_items", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  fromUserId: varchar("from_user_id").references(() => users.id).notNull(),
  toUserId: varchar("to_user_id").references(() => users.id).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message"),
  itemType: varchar("item_type", { length: 50 }).notNull(), // 'task', 'notification', 'approval'
  priority: varchar("priority", { length: 20 }).default("medium"), // 'low', 'medium', 'high', 'urgent'
  status: varchar("status", { length: 20 }).default("pending"), // 'pending', 'in_progress', 'completed', 'cancelled'
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Credits and Financial Management Tables

// Notional Values for credits system
export const notionalValues = pgTable("notional_values", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(), // 'user', 'role', 'entity'
  entityId: varchar("entity_id", { length: 50 }).notNull(),
  credits: decimal("credits", { precision: 15, scale: 2 }).default("0.00"),
  currencyCode: varchar("currency_code", { length: 3 }).references(() => currencies.code),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Credit Transactions for financial tracking
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  notionalValueId: integer("notional_value_id").references(() => notionalValues.id).notNull(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // 'add', 'bonus', 'increase', 'decrease', 'payment'
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  previousBalance: decimal("previous_balance", { precision: 15, scale: 2 }),
  newBalance: decimal("new_balance", { precision: 15, scale: 2 }),
  description: text("description"),
  referenceId: varchar("reference_id", { length: 100 }),
  processedBy: varchar("processed_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// System Health and Monitoring Tables

// Error Log for comprehensive error tracking
export const errorLog = pgTable("error_log", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  userId: varchar("user_id").references(() => users.id),
  errorCode: varchar("error_code", { length: 50 }),
  description: text("description").notNull(),
  severity: varchar("severity", { length: 20 }).notNull(), // 'low', 'medium', 'high', 'critical'
  criticality: varchar("criticality", { length: 20 }).notNull(), // 'minor', 'major', 'critical', 'blocker'
  stackTrace: text("stack_trace"),
  requestData: jsonb("request_data"),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Exception Log for system exceptions
export const exceptionLog = pgTable("exception_log", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  userId: varchar("user_id").references(() => users.id),
  functionName: varchar("function_name", { length: 255 }),
  exceptionType: varchar("exception_type", { length: 100 }),
  message: text("message").notNull(),
  stackTrace: text("stack_trace"),
  parameters: jsonb("parameters"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Checks for system monitoring
export const healthChecks = pgTable("health_checks", {
  id: serial("id").primaryKey(),
  serviceName: varchar("service_name", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(), // 'healthy', 'unhealthy', 'degraded'
  responseTime: integer("response_time"), // in milliseconds
  details: jsonb("details"),
  checkedAt: timestamp("checked_at").defaultNow(),
});

// Complete Framework Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  userTenantRoles: many(userTenantRoles),
  currentTenant: one(tenants, {
    fields: [users.currentTenantId],
    references: [tenants.id],
  }),
  teamMemberships: many(teamMemberships),
  managedTeams: many(teams),
  userActivities: many(userActivities),
  alerts: many(alerts),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  entities: many(entities),
  roles: many(roles),
  userTenantRoles: many(userTenantRoles),
  teams: many(teams),
  alerts: many(alerts),
  accessLogs: many(accessLog),
  userActivities: many(userActivities),
}));

export const rolesRelations = relations(roles, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [roles.tenantId],
    references: [tenants.id],
  }),
  userTenantRoles: many(userTenantRoles),
}));

export const userTenantRolesRelations = relations(userTenantRoles, ({ one }) => ({
  user: one(users, {
    fields: [userTenantRoles.userId],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [userTenantRoles.tenantId],
    references: [tenants.id],
  }),
  role: one(roles, {
    fields: [userTenantRoles.roleId],
    references: [roles.id],
  }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [teams.tenantId],
    references: [tenants.id],
  }),
  manager: one(users, {
    fields: [teams.managerId],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [teams.createdBy],
    references: [users.id],
  }),
  memberships: many(teamMemberships),
}));

export const teamMembershipsRelations = relations(teamMemberships, ({ one }) => ({
  team: one(teams, {
    fields: [teamMemberships.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMemberships.userId],
    references: [users.id],
  }),
  addedByUser: one(users, {
    fields: [teamMemberships.addedBy],
    references: [users.id],
  }),
}));

export const entitiesRelations = relations(entities, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [entities.tenantId],
    references: [tenants.id],
  }),
  parentEntity: one(entities, {
    fields: [entities.parentEntityId],
    references: [entities.id],
  }),
  subEntities: many(entities),
}));

// Complete Framework Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Complete Framework Insert Schemas
export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserTenantRoleSchema = createInsertSchema(userTenantRoles).omit({
  id: true,
  createdAt: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamMembershipSchema = createInsertSchema(teamMemberships).omit({
  id: true,
  joinedAt: true,
});

export const insertEntitySchema = createInsertSchema(entities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastModified: true,
  recordCount: true,
});

export const insertScreenAssetSchema = createInsertSchema(screenAssets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionDefinitionSchema = createInsertSchema(transactionDefinitions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionInstanceSchema = createInsertSchema(transactionInstances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
  createdAt: true,
});

export const insertRegionSchema = createInsertSchema(regions).omit({
  id: true,
  createdAt: true,
});

export const insertCitySchema = createInsertSchema(cities).omit({
  id: true,
  createdAt: true,
});

export const insertCurrencySchema = createInsertSchema(currencies).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertLanguageSchema = createInsertSchema(languages).omit({
  id: true,
  createdAt: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRoleExceptionSchema = createInsertSchema(roleExceptions).omit({
  id: true,
  createdAt: true,
});

export const insertUserRestrictionSchema = createInsertSchema(userRestrictions).omit({
  id: true,
  createdAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTextTranslationSchema = createInsertSchema(textTranslations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInboxItemSchema = createInsertSchema(inboxItems).omit({
  id: true,
  createdAt: true,
});

export const insertNotionalValueSchema = createInsertSchema(notionalValues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCreditTransactionSchema = createInsertSchema(creditTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertErrorLogSchema = createInsertSchema(errorLog).omit({
  id: true,
  createdAt: true,
});

export const insertExceptionLogSchema = createInsertSchema(exceptionLog).omit({
  id: true,
  createdAt: true,
});

export const insertHealthCheckSchema = createInsertSchema(healthChecks).omit({
  id: true,
  checkedAt: true,
});

export const insertAccessLogSchema = createInsertSchema(accessLog).omit({
  id: true,
  createdAt: true,
});

export const insertUserActivitySchema = createInsertSchema(userActivities).omit({
  id: true,
  createdAt: true,
});

export const insertKpiCategorySchema = createInsertSchema(kpiCategories).omit({
  id: true,
});

export const insertKpiMetricSchema = createInsertSchema(kpiMetrics).omit({
  id: true,
});

export const insertDashboardCustomizationSchema = createInsertSchema(dashboardCustomizations).omit({
  id: true,
});

export const insertCallSchema = createInsertSchema(calls).omit({
  id: true,
});

export const insertCallTranscriptionSchema = createInsertSchema(callTranscriptions).omit({
  id: true,
});

export const insertMobileTransactionSchema = createInsertSchema(mobileTransactions).omit({
  id: true,
});

export const insertIvrInteractionSchema = createInsertSchema(ivrInteractions).omit({
  id: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;

export type KpiCategory = typeof kpiCategories.$inferSelect;
export type InsertKpiCategory = z.infer<typeof insertKpiCategorySchema>;

export type KpiMetric = typeof kpiMetrics.$inferSelect;
export type InsertKpiMetric = z.infer<typeof insertKpiMetricSchema>;

export type DashboardCustomization = typeof dashboardCustomizations.$inferSelect;
export type InsertDashboardCustomization = z.infer<typeof insertDashboardCustomizationSchema>;

export type Call = typeof calls.$inferSelect;
export type InsertCall = z.infer<typeof insertCallSchema>;

export type CallTranscription = typeof callTranscriptions.$inferSelect;
export type InsertCallTranscription = z.infer<typeof insertCallTranscriptionSchema>;

export type MobileTransaction = typeof mobileTransactions.$inferSelect;
export type InsertMobileTransaction = z.infer<typeof insertMobileTransactionSchema>;

export type IvrInteraction = typeof ivrInteractions.$inferSelect;
export type InsertIvrInteraction = z.infer<typeof insertIvrInteractionSchema>;

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

// Complete Framework Foundation Types
export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type UserTenantRole = typeof userTenantRoles.$inferSelect;
export type InsertUserTenantRole = z.infer<typeof insertUserTenantRoleSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type TeamMembership = typeof teamMemberships.$inferSelect;
export type InsertTeamMembership = z.infer<typeof insertTeamMembershipSchema>;
export type Entity = typeof entities.$inferSelect;
export type InsertEntity = z.infer<typeof insertEntitySchema>;

// UI and Transaction Types
export type ScreenAsset = typeof screenAssets.$inferSelect;
export type InsertScreenAsset = z.infer<typeof insertScreenAssetSchema>;
export type TransactionDefinition = typeof transactionDefinitions.$inferSelect;
export type InsertTransactionDefinition = z.infer<typeof insertTransactionDefinitionSchema>;
export type TransactionInstance = typeof transactionInstances.$inferSelect;
export type InsertTransactionInstance = z.infer<typeof insertTransactionInstanceSchema>;

// Geographic Types
export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Region = typeof regions.$inferSelect;
export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type City = typeof cities.$inferSelect;
export type InsertCity = z.infer<typeof insertCitySchema>;
export type Currency = typeof currencies.$inferSelect;
export type InsertCurrency = z.infer<typeof insertCurrencySchema>;
export type Language = typeof languages.$inferSelect;
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;

// Security and Access Control Types
export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type RoleException = typeof roleExceptions.$inferSelect;
export type InsertRoleException = z.infer<typeof insertRoleExceptionSchema>;
export type UserRestriction = typeof userRestrictions.$inferSelect;
export type InsertUserRestriction = z.infer<typeof insertUserRestrictionSchema>;

// Business Logic Types
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type TextTranslation = typeof textTranslations.$inferSelect;
export type InsertTextTranslation = z.infer<typeof insertTextTranslationSchema>;
export type InboxItem = typeof inboxItems.$inferSelect;
export type InsertInboxItem = z.infer<typeof insertInboxItemSchema>;

// Financial Types
export type NotionalValue = typeof notionalValues.$inferSelect;
export type InsertNotionalValue = z.infer<typeof insertNotionalValueSchema>;
export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;

// System Monitoring Types
export type ErrorLog = typeof errorLog.$inferSelect;
export type InsertErrorLog = z.infer<typeof insertErrorLogSchema>;
export type ExceptionLog = typeof exceptionLog.$inferSelect;
export type InsertExceptionLog = z.infer<typeof insertExceptionLogSchema>;
export type HealthCheck = typeof healthChecks.$inferSelect;
export type InsertHealthCheck = z.infer<typeof insertHealthCheckSchema>;
export type AccessLog = typeof accessLog.$inferSelect;
export type InsertAccessLog = z.infer<typeof insertAccessLogSchema>;
export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;

// Note: AI/ML tables moved to separate aiSchema.ts file to avoid conflicts
