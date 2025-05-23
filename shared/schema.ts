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

// Schemas for inserts
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
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

// Note: AI/ML tables moved to separate aiSchema.ts file to avoid conflicts
