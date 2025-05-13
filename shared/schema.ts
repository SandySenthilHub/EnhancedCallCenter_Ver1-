import { pgTable, text, serial, integer, boolean, timestamp, real, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema - for dashboard customization without authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull(),
  tenantId: integer("tenant_id").notNull(),
});

// Tenants schema
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  isActive: boolean("is_active").default(true),
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

// Alerts
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull(),
  alertType: text("alert_type").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  severity: text("severity").notNull(), // 'high', 'medium', 'low'
  status: text("status").notNull(), // 'active', 'acknowledged', 'resolved'
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
