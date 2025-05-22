import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ===== AI/ML SPECIFIC TABLES =====

// Enhanced Calls table for AI features
export const aiCalls = pgTable("ai_calls", {
  id: serial("id").primaryKey(),
  callId: text("call_id").notNull().unique(),
  tenantId: integer("tenant_id").notNull(),
  agentId: integer("agent_id"),
  customerId: text("customer_id"),
  audioPath: text("audio_path"),
  status: text("status").notNull(), // 'active', 'completed', 'abandoned'
  queueName: text("queue_name"),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Transcripts table
export const aiTranscripts = pgTable("ai_transcripts", {
  id: serial("id").primaryKey(),
  transcriptId: text("transcript_id").notNull().unique(),
  callId: integer("call_id").notNull(),
  text: text("text").notNull(),
  language: text("language").default('en-US'),
  confidence: real("confidence"),
  diarizationData: jsonb("diarization_data"),
  timestamps: jsonb("timestamps"),
  processingStatus: text("processing_status").default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sentiment Analysis table
export const aiSentimentAnalysis = pgTable("ai_sentiment_analysis", {
  id: serial("id").primaryKey(),
  sentimentId: text("sentiment_id").notNull().unique(),
  callId: integer("call_id").notNull(),
  overallScore: real("overall_score"),
  summary: text("summary"),
  emotions: jsonb("emotions"),
  customerSentiment: real("customer_sentiment"),
  agentSentiment: real("agent_sentiment"),
  sentimentTrend: jsonb("sentiment_trend"),
  keyPhrases: text("key_phrases").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quality Control table
export const aiQualityChecks = pgTable("ai_quality_checks", {
  id: serial("id").primaryKey(),
  qcId: text("qc_id").notNull().unique(),
  callId: integer("call_id").notNull(),
  agentId: integer("agent_id").notNull(),
  reviewerId: integer("reviewer_id"),
  overallScore: real("overall_score"),
  communicationScore: real("communication_score"),
  professionalismScore: real("professionalism_score"),
  resolutionScore: real("resolution_score"),
  complianceScore: real("compliance_score"),
  feedback: text("feedback"),
  actionItems: text("action_items").array(),
  status: text("status").default('pending'),
  reviewDate: timestamp("review_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Suggestions table
export const aiSuggestions = pgTable("ai_suggestions", {
  id: serial("id").primaryKey(),
  suggestionId: text("suggestion_id").notNull().unique(),
  callId: integer("call_id").notNull(),
  agentId: integer("agent_id").notNull(),
  suggestionType: text("suggestion_type").notNull(),
  content: text("content").notNull(),
  confidence: real("confidence"),
  isUsed: boolean("is_used").default(false),
  feedback: text("feedback"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// ML Models table
export const mlModels = pgTable("ml_models", {
  id: serial("id").primaryKey(),
  modelId: text("model_id").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'regression', 'classification', 'clustering', 'automl'
  description: text("description"),
  version: text("version").notNull(),
  accuracy: real("accuracy"),
  status: text("status").notNull(), // 'training', 'ready', 'failed', 'updating'
  modelPath: text("model_path"),
  features: jsonb("features"),
  hyperparameters: jsonb("hyperparameters"),
  metrics: jsonb("metrics"),
  createdAt: timestamp("created_at").defaultNow(),
  lastTrained: timestamp("last_trained"),
});

// Predictions table
export const mlPredictions = pgTable("ml_predictions", {
  id: serial("id").primaryKey(),
  predictionId: text("prediction_id").notNull().unique(),
  modelId: text("model_id").notNull(),
  tenantId: integer("tenant_id").notNull(),
  inputFeatures: jsonb("input_features"),
  prediction: jsonb("prediction"),
  confidence: real("confidence"),
  explanation: jsonb("explanation"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Speaker Segments table
export const aiSpeakerSegments = pgTable("ai_speaker_segments", {
  id: serial("id").primaryKey(),
  callId: integer("call_id").notNull(),
  transcriptId: integer("transcript_id").notNull(),
  speakerLabel: text("speaker_label").notNull(),
  startTime: real("start_time").notNull(),
  endTime: real("end_time").notNull(),
  text: text("text").notNull(),
  confidence: real("confidence"),
  emotionScore: real("emotion_score"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ===== INSERT SCHEMAS =====

export const insertAiCallSchema = createInsertSchema(aiCalls);
export const insertAiTranscriptSchema = createInsertSchema(aiTranscripts);
export const insertAiSentimentAnalysisSchema = createInsertSchema(aiSentimentAnalysis);
export const insertAiQualityCheckSchema = createInsertSchema(aiQualityChecks);
export const insertAiSuggestionSchema = createInsertSchema(aiSuggestions);
export const insertMlModelSchema = createInsertSchema(mlModels);
export const insertMlPredictionSchema = createInsertSchema(mlPredictions);
export const insertAiSpeakerSegmentSchema = createInsertSchema(aiSpeakerSegments);

// ===== TYPE EXPORTS =====

export type AiCall = typeof aiCalls.$inferSelect;
export type InsertAiCall = z.infer<typeof insertAiCallSchema>;

export type AiTranscript = typeof aiTranscripts.$inferSelect;
export type InsertAiTranscript = z.infer<typeof insertAiTranscriptSchema>;

export type AiSentimentAnalysis = typeof aiSentimentAnalysis.$inferSelect;
export type InsertAiSentimentAnalysis = z.infer<typeof insertAiSentimentAnalysisSchema>;

export type AiQualityCheck = typeof aiQualityChecks.$inferSelect;
export type InsertAiQualityCheck = z.infer<typeof insertAiQualityCheckSchema>;

export type AiSuggestion = typeof aiSuggestions.$inferSelect;
export type InsertAiSuggestion = z.infer<typeof insertAiSuggestionSchema>;

export type MlModel = typeof mlModels.$inferSelect;
export type InsertMlModel = z.infer<typeof insertMlModelSchema>;

export type MlPrediction = typeof mlPredictions.$inferSelect;
export type InsertMlPrediction = z.infer<typeof insertMlPredictionSchema>;

export type AiSpeakerSegment = typeof aiSpeakerSegments.$inferSelect;
export type InsertAiSpeakerSegment = z.infer<typeof insertAiSpeakerSegmentSchema>;