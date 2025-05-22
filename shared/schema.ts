import { pgTable, text, serial, integer, boolean, timestamp, real, varchar, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enhanced User schema with Call Center Intelligence roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // 'agent', 'supervisor', 'manager', 'admin'
  tenantId: integer("tenant_id").notNull(),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
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

// ===== CALL CENTER INTELLIGENCE TABLES =====

// Calls table - Core call data with audio paths
export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  callId: text("call_id").notNull().unique(),
  tenantId: integer("tenant_id").notNull(),
  agentId: integer("agent_id"),
  customerId: text("customer_id"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  audioPath: text("audio_path"),
  status: text("status").notNull(), // 'active', 'completed', 'abandoned'
  callType: text("call_type"), // 'inbound', 'outbound'
  queueName: text("queue_name"),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Transcripts table - AI-generated call transcriptions
export const transcripts = pgTable("transcripts", {
  id: serial("id").primaryKey(),
  transcriptId: text("transcript_id").notNull().unique(),
  callId: integer("call_id").notNull(),
  text: text("text").notNull(),
  language: text("language").default('en-US'),
  confidence: real("confidence"), // AI transcription confidence score
  diarizationData: jsonb("diarization_data"), // Speaker segments
  timestamps: jsonb("timestamps"), // Word-level timestamps
  processingStatus: text("processing_status").default('pending'), // 'pending', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

// Sentiment Analysis table - AI emotion detection
export const sentimentAnalysis = pgTable("sentiment_analysis", {
  id: serial("id").primaryKey(),
  sentimentId: text("sentiment_id").notNull().unique(),
  callId: integer("call_id").notNull(),
  overallScore: real("overall_score"), // -1 to 1 (negative to positive)
  summary: text("summary"),
  emotions: jsonb("emotions"), // {anger: 0.1, joy: 0.7, fear: 0.2}
  customerSentiment: real("customer_sentiment"),
  agentSentiment: real("agent_sentiment"),
  sentimentTrend: jsonb("sentiment_trend"), // Timeline of sentiment changes
  keyPhrases: text("key_phrases").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quality Control table - Call scoring and feedback
export const qualityChecks = pgTable("quality_checks", {
  id: serial("id").primaryKey(),
  qcId: text("qc_id").notNull().unique(),
  callId: integer("call_id").notNull(),
  agentId: integer("agent_id").notNull(),
  reviewerId: integer("reviewer_id"),
  overallScore: real("overall_score"), // 0-100
  communicationScore: real("communication_score"),
  professionalismScore: real("professionalism_score"),
  resolutionScore: real("resolution_score"),
  complianceScore: real("compliance_score"),
  feedback: text("feedback"),
  actionItems: text("action_items").array(),
  status: text("status").default('pending'), // 'pending', 'reviewed', 'approved'
  reviewDate: timestamp("review_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Suggestions table - Real-time agent assistance
export const aiSuggestions = pgTable("ai_suggestions", {
  id: serial("id").primaryKey(),
  suggestionId: text("suggestion_id").notNull().unique(),
  callId: integer("call_id").notNull(),
  agentId: integer("agent_id").notNull(),
  suggestionType: text("suggestion_type").notNull(), // 'response', 'escalation', 'compliance'
  content: text("content").notNull(),
  confidence: real("confidence"),
  isUsed: boolean("is_used").default(false),
  feedback: text("feedback"), // Agent feedback on suggestion
  timestamp: timestamp("timestamp").defaultNow(),
});

// Enhanced Dashboards table with role-based layouts
export const aiDashboards = pgTable("ai_dashboards", {
  id: serial("id").primaryKey(),
  dashboardId: text("dashboard_id").notNull().unique(),
  userId: integer("user_id").notNull(),
  tenantId: integer("tenant_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'agent', 'supervisor', 'manager', 'admin'
  layoutConfig: jsonb("layout_config"),
  widgetConfig: jsonb("widget_config"),
  filters: jsonb("filters"),
  isDefault: boolean("is_default").default(false),
  isShared: boolean("is_shared").default(false),
  lastModified: timestamp("last_modified").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Speaker Diarization table - Who spoke when
export const speakerSegments = pgTable("speaker_segments", {
  id: serial("id").primaryKey(),
  callId: integer("call_id").notNull(),
  transcriptId: integer("transcript_id").notNull(),
  speakerLabel: text("speaker_label").notNull(), // 'customer', 'agent', 'unknown'
  startTime: real("start_time").notNull(), // seconds
  endTime: real("end_time").notNull(), // seconds
  text: text("text").notNull(),
  confidence: real("confidence"),
  emotionScore: real("emotion_score"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== INSERT SCHEMAS =====

export const insertCallSchema = createInsertSchema(calls);
export const insertTranscriptSchema = createInsertSchema(transcripts);
export const insertSentimentAnalysisSchema = createInsertSchema(sentimentAnalysis);
export const insertQualityCheckSchema = createInsertSchema(qualityChecks);
export const insertAiSuggestionSchema = createInsertSchema(aiSuggestions);
export const insertAiDashboardSchema = createInsertSchema(aiDashboards);
export const insertSpeakerSegmentSchema = createInsertSchema(speakerSegments);

// ===== TYPE EXPORTS =====

export type Call = typeof calls.$inferSelect;
export type InsertCall = z.infer<typeof insertCallSchema>;

export type Transcript = typeof transcripts.$inferSelect;
export type InsertTranscript = z.infer<typeof insertTranscriptSchema>;

export type SentimentAnalysis = typeof sentimentAnalysis.$inferSelect;
export type InsertSentimentAnalysis = z.infer<typeof insertSentimentAnalysisSchema>;

export type QualityCheck = typeof qualityChecks.$inferSelect;
export type InsertQualityCheck = z.infer<typeof insertQualityCheckSchema>;

export type AiSuggestion = typeof aiSuggestions.$inferSelect;
export type InsertAiSuggestion = z.infer<typeof insertAiSuggestionSchema>;

export type AiDashboard = typeof aiDashboards.$inferSelect;
export type InsertAiDashboard = z.infer<typeof insertAiDashboardSchema>;

export type SpeakerSegment = typeof speakerSegments.$inferSelect;
export type InsertSpeakerSegment = z.infer<typeof insertSpeakerSegmentSchema>;
