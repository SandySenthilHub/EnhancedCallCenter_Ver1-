import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertDashboardCustomizationSchema,
  insertUserSchema,
  insertTenantSchema,
  insertKpiCategorySchema,
  insertKpiMetricSchema,
  insertCallSchema,
  insertCallTranscriptionSchema,
  insertMobileTransactionSchema,
  insertIvrInteractionSchema,
  insertAgentSchema,
  insertAlertSchema
} from "@shared/schema";
import { analyzeSentiment, detectIntent, detectTone, extractKeyPhrases, recognizeEntities, transcribeAudio } from "./cognitiveServices";

export async function registerRoutes(app: Express): Promise<Server> {
  // Tenants
  app.get('/api/tenants', async (req, res) => {
    try {
      const tenants = await storage.getTenants();
      res.json(tenants);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve tenants" });
    }
  });

  app.get('/api/tenants/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tenant = await storage.getTenantById(id);
      
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      
      res.json(tenant);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve tenant" });
    }
  });

  app.post('/api/tenants', async (req, res) => {
    try {
      const validated = insertTenantSchema.parse(req.body);
      const tenant = await storage.createTenant(validated);
      res.status(201).json(tenant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tenant data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tenant" });
    }
  });

  // Users
  app.get('/api/users', async (req, res) => {
    try {
      const tenantId = Number(req.query.tenantId);
      
      if (isNaN(tenantId)) {
        return res.status(400).json({ message: "Invalid tenant ID" });
      }
      
      const users = await storage.getUsers(tenantId);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve users" });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user" });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const validated = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validated);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // KPI Categories
  app.get('/api/kpi-categories', async (req, res) => {
    try {
      const type = String(req.query.type);
      
      if (!type) {
        return res.status(400).json({ message: "Type parameter is required" });
      }
      
      const categories = await storage.getKpiCategories(type);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve KPI categories" });
    }
  });

  app.post('/api/kpi-categories', async (req, res) => {
    try {
      const validated = insertKpiCategorySchema.parse(req.body);
      const category = await storage.createKpiCategory(validated);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create KPI category" });
    }
  });

  // KPI Metrics
  app.get('/api/kpi-metrics', async (req, res) => {
    try {
      const tenantId = Number(req.query.tenantId);
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
      
      if (isNaN(tenantId)) {
        return res.status(400).json({ message: "Invalid tenant ID" });
      }
      
      const metrics = await storage.getKpiMetrics(tenantId, categoryId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve KPI metrics" });
    }
  });

  app.post('/api/kpi-metrics', async (req, res) => {
    try {
      const validated = insertKpiMetricSchema.parse(req.body);
      const metric = await storage.createKpiMetric(validated);
      res.status(201).json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid metric data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create KPI metric" });
    }
  });

  // Dashboard Customizations
  app.get('/api/dashboard-customizations', async (req, res) => {
    try {
      const userId = Number(req.query.userId);
      const tenantId = Number(req.query.tenantId);
      
      if (isNaN(userId) || isNaN(tenantId)) {
        return res.status(400).json({ message: "Invalid user ID or tenant ID" });
      }
      
      const customization = await storage.getDashboardCustomizations(userId, tenantId);
      
      if (!customization) {
        return res.json({ dashboardConfig: '{"widgets":[]}' });
      }
      
      res.json(customization);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve dashboard customization" });
    }
  });

  app.post('/api/dashboard-customizations', async (req, res) => {
    try {
      const validated = insertDashboardCustomizationSchema.parse(req.body);
      
      // Check if customization already exists
      const existing = await storage.getDashboardCustomizations(validated.userId, validated.tenantId);
      
      let customization;
      if (existing) {
        customization = await storage.updateDashboardCustomization(existing.id, {
          ...validated,
          lastUpdated: new Date()
        });
      } else {
        customization = await storage.createDashboardCustomization({
          ...validated,
          lastUpdated: new Date()
        });
      }
      
      res.status(201).json(customization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid customization data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save dashboard customization" });
    }
  });

  // Calls
  app.get('/api/calls', async (req, res) => {
    try {
      const tenantId = Number(req.query.tenantId);
      const startDate = req.query.startDate ? new Date(String(req.query.startDate)) : undefined;
      const endDate = req.query.endDate ? new Date(String(req.query.endDate)) : undefined;
      
      if (isNaN(tenantId)) {
        return res.status(400).json({ message: "Invalid tenant ID" });
      }
      
      const calls = await storage.getCalls(tenantId, startDate, endDate);
      res.json(calls);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve calls" });
    }
  });

  app.post('/api/calls', async (req, res) => {
    try {
      const validated = insertCallSchema.parse(req.body);
      const call = await storage.createCall(validated);
      res.status(201).json(call);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid call data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create call" });
    }
  });

  // Call Transcriptions
  app.get('/api/call-transcriptions/:callId', async (req, res) => {
    try {
      const callId = parseInt(req.params.callId);
      const transcriptions = await storage.getCallTranscriptions(callId);
      res.json(transcriptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve call transcriptions" });
    }
  });

  app.post('/api/call-transcriptions', async (req, res) => {
    try {
      const validated = insertCallTranscriptionSchema.parse(req.body);
      const transcription = await storage.createCallTranscription(validated);
      res.status(201).json(transcription);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transcription data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create call transcription" });
    }
  });

  // Mobile Transactions
  app.get('/api/mobile-transactions', async (req, res) => {
    try {
      const tenantId = Number(req.query.tenantId);
      const startDate = req.query.startDate ? new Date(String(req.query.startDate)) : undefined;
      const endDate = req.query.endDate ? new Date(String(req.query.endDate)) : undefined;
      
      if (isNaN(tenantId)) {
        return res.status(400).json({ message: "Invalid tenant ID" });
      }
      
      const transactions = await storage.getMobileTransactions(tenantId, startDate, endDate);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve mobile transactions" });
    }
  });

  app.post('/api/mobile-transactions', async (req, res) => {
    try {
      const validated = insertMobileTransactionSchema.parse(req.body);
      const transaction = await storage.createMobileTransaction(validated);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create mobile transaction" });
    }
  });

  // IVR Interactions
  app.get('/api/ivr-interactions', async (req, res) => {
    try {
      const tenantId = Number(req.query.tenantId);
      const startDate = req.query.startDate ? new Date(String(req.query.startDate)) : undefined;
      const endDate = req.query.endDate ? new Date(String(req.query.endDate)) : undefined;
      
      if (isNaN(tenantId)) {
        return res.status(400).json({ message: "Invalid tenant ID" });
      }
      
      const interactions = await storage.getIvrInteractions(tenantId, startDate, endDate);
      res.json(interactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve IVR interactions" });
    }
  });

  app.post('/api/ivr-interactions', async (req, res) => {
    try {
      const validated = insertIvrInteractionSchema.parse(req.body);
      const interaction = await storage.createIvrInteraction(validated);
      res.status(201).json(interaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid interaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create IVR interaction" });
    }
  });

  // Agents
  app.get('/api/agents', async (req, res) => {
    try {
      const tenantId = Number(req.query.tenantId);
      
      if (isNaN(tenantId)) {
        return res.status(400).json({ message: "Invalid tenant ID" });
      }
      
      const agents = await storage.getAgents(tenantId);
      res.json(agents);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve agents" });
    }
  });

  app.post('/api/agents', async (req, res) => {
    try {
      const validated = insertAgentSchema.parse(req.body);
      const agent = await storage.createAgent(validated);
      res.status(201).json(agent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid agent data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create agent" });
    }
  });

  // Alerts
  app.get('/api/alerts', async (req, res) => {
    try {
      const tenantId = Number(req.query.tenantId);
      
      if (isNaN(tenantId)) {
        return res.status(400).json({ message: "Invalid tenant ID" });
      }
      
      const alerts = await storage.getAlerts(tenantId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve alerts" });
    }
  });

  app.post('/api/alerts', async (req, res) => {
    try {
      const validated = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validated);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  // Cognitive Services
  app.post('/api/cognitive/transcribe', async (req, res) => {
    try {
      const { audioUrl, language } = req.body;
      
      if (!audioUrl) {
        return res.status(400).json({ message: "Audio URL is required" });
      }
      
      const transcript = await transcribeAudio(audioUrl, language || 'en-US');
      res.json({ transcript });
    } catch (error) {
      res.status(500).json({ message: "Failed to transcribe audio" });
    }
  });

  app.post('/api/cognitive/sentiment', async (req, res) => {
    try {
      const { text, language } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const sentiment = await analyzeSentiment(text, language || 'en');
      res.json(sentiment);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze sentiment" });
    }
  });

  app.post('/api/cognitive/key-phrases', async (req, res) => {
    try {
      const { text, language } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const keyPhrases = await extractKeyPhrases(text, language || 'en');
      res.json({ keyPhrases });
    } catch (error) {
      res.status(500).json({ message: "Failed to extract key phrases" });
    }
  });

  app.post('/api/cognitive/entities', async (req, res) => {
    try {
      const { text, language } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const entities = await recognizeEntities(text, language || 'en');
      res.json({ entities });
    } catch (error) {
      res.status(500).json({ message: "Failed to recognize entities" });
    }
  });

  app.post('/api/cognitive/intent', async (req, res) => {
    try {
      const { text, language } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const intent = await detectIntent(text, language || 'en');
      res.json(intent);
    } catch (error) {
      res.status(500).json({ message: "Failed to detect intent" });
    }
  });

  app.post('/api/cognitive/tone', async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const tone = await detectTone(text);
      res.json({ tone });
    } catch (error) {
      res.status(500).json({ message: "Failed to detect tone" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
