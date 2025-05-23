import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { db } from "./db";
import { 
  insertTenantSchema, 
  insertRoleSchema, 
  insertEntitySchema,
  insertScreenAssetSchema,
  insertTransactionDefinitionSchema,
  insertTransactionInstanceSchema,
  insertUserTenantRoleSchema,
  insertTeamSchema,
  insertTeamMembershipSchema,
  countries,
  currencies,
  languages,
  cities
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const tenants = await storage.getUserTenants(userId);
      res.json({ ...user, tenants });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tenant routes
  app.get('/api/tenants', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tenants = await storage.getUserTenants(userId);
      res.json(tenants);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      res.status(500).json({ message: "Failed to fetch tenants" });
    }
  });

  app.post('/api/tenants', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertTenantSchema.parse(req.body);
      const tenant = await storage.createTenant(validatedData);
      res.json(tenant);
    } catch (error) {
      console.error("Error creating tenant:", error);
      res.status(500).json({ message: "Failed to create tenant" });
    }
  });

  app.put('/api/tenants/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTenantSchema.partial().parse(req.body);
      const tenant = await storage.updateTenant(id, validatedData);
      res.json(tenant);
    } catch (error) {
      console.error("Error updating tenant:", error);
      res.status(500).json({ message: "Failed to update tenant" });
    }
  });

  // Role routes
  app.get('/api/tenants/:tenantId/roles', isAuthenticated, async (req: any, res) => {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const roles = await storage.getRoles(tenantId);
      res.json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "Failed to fetch roles" });
    }
  });

  app.post('/api/tenants/:tenantId/roles', isAuthenticated, async (req: any, res) => {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const validatedData = insertRoleSchema.parse({ ...req.body, tenantId });
      const role = await storage.createRole(validatedData);
      res.json(role);
    } catch (error) {
      console.error("Error creating role:", error);
      res.status(500).json({ message: "Failed to create role" });
    }
  });

  app.put('/api/roles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertRoleSchema.partial().parse(req.body);
      const role = await storage.updateRole(id, validatedData);
      res.json(role);
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ message: "Failed to update role" });
    }
  });

  app.delete('/api/roles/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteRole(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting role:", error);
      res.status(500).json({ message: "Failed to delete role" });
    }
  });

  // Entity routes
  app.get('/api/tenants/:tenantId/entities', isAuthenticated, async (req: any, res) => {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const entities = await storage.getEntities(tenantId);
      res.json(entities);
    } catch (error) {
      console.error("Error fetching entities:", error);
      res.status(500).json({ message: "Failed to fetch entities" });
    }
  });

  app.post('/api/tenants/:tenantId/entities', isAuthenticated, async (req: any, res) => {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const validatedData = insertEntitySchema.parse({ ...req.body, tenantId });
      const entity = await storage.createEntity(validatedData);
      res.json(entity);
    } catch (error) {
      console.error("Error creating entity:", error);
      res.status(500).json({ message: "Failed to create entity" });
    }
  });

  app.put('/api/entities/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertEntitySchema.partial().parse(req.body);
      const entity = await storage.updateEntity(id, validatedData);
      res.json(entity);
    } catch (error) {
      console.error("Error updating entity:", error);
      res.status(500).json({ message: "Failed to update entity" });
    }
  });

  app.delete('/api/entities/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEntity(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting entity:", error);
      res.status(500).json({ message: "Failed to delete entity" });
    }
  });

  // Screen Asset routes
  app.get('/api/tenants/:tenantId/screen-assets', isAuthenticated, async (req: any, res) => {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const screenAssets = await storage.getScreenAssets(tenantId);
      res.json(screenAssets);
    } catch (error) {
      console.error("Error fetching screen assets:", error);
      res.status(500).json({ message: "Failed to fetch screen assets" });
    }
  });

  app.post('/api/tenants/:tenantId/screen-assets', isAuthenticated, async (req: any, res) => {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const validatedData = insertScreenAssetSchema.parse({ ...req.body, tenantId });
      const screenAsset = await storage.createScreenAsset(validatedData);
      res.json(screenAsset);
    } catch (error) {
      console.error("Error creating screen asset:", error);
      res.status(500).json({ message: "Failed to create screen asset" });
    }
  });

  app.put('/api/screen-assets/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertScreenAssetSchema.partial().parse(req.body);
      const screenAsset = await storage.updateScreenAsset(id, validatedData);
      res.json(screenAsset);
    } catch (error) {
      console.error("Error updating screen asset:", error);
      res.status(500).json({ message: "Failed to update screen asset" });
    }
  });

  app.delete('/api/screen-assets/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteScreenAsset(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting screen asset:", error);
      res.status(500).json({ message: "Failed to delete screen asset" });
    }
  });

  // Transaction Definition routes
  app.get('/api/tenants/:tenantId/transaction-definitions', isAuthenticated, async (req: any, res) => {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const definitions = await storage.getTransactionDefinitions(tenantId);
      res.json(definitions);
    } catch (error) {
      console.error("Error fetching transaction definitions:", error);
      res.status(500).json({ message: "Failed to fetch transaction definitions" });
    }
  });

  app.post('/api/tenants/:tenantId/transaction-definitions', isAuthenticated, async (req: any, res) => {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const validatedData = insertTransactionDefinitionSchema.parse({ ...req.body, tenantId });
      const definition = await storage.createTransactionDefinition(validatedData);
      res.json(definition);
    } catch (error) {
      console.error("Error creating transaction definition:", error);
      res.status(500).json({ message: "Failed to create transaction definition" });
    }
  });

  app.put('/api/transaction-definitions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTransactionDefinitionSchema.partial().parse(req.body);
      const definition = await storage.updateTransactionDefinition(id, validatedData);
      res.json(definition);
    } catch (error) {
      console.error("Error updating transaction definition:", error);
      res.status(500).json({ message: "Failed to update transaction definition" });
    }
  });

  app.delete('/api/transaction-definitions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTransactionDefinition(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting transaction definition:", error);
      res.status(500).json({ message: "Failed to delete transaction definition" });
    }
  });

  // Transaction Instance routes
  app.get('/api/tenants/:tenantId/transaction-instances', isAuthenticated, async (req: any, res) => {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const instances = await storage.getTransactionInstances(tenantId);
      res.json(instances);
    } catch (error) {
      console.error("Error fetching transaction instances:", error);
      res.status(500).json({ message: "Failed to fetch transaction instances" });
    }
  });

  app.post('/api/tenants/:tenantId/transaction-instances', isAuthenticated, async (req: any, res) => {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const userId = req.user.claims.sub;
      const validatedData = insertTransactionInstanceSchema.parse({ 
        ...req.body, 
        tenantId, 
        executedBy: userId,
        executedAt: new Date()
      });
      const instance = await storage.createTransactionInstance(validatedData);
      res.json(instance);
    } catch (error) {
      console.error("Error creating transaction instance:", error);
      res.status(500).json({ message: "Failed to create transaction instance" });
    }
  });

  // User Management routes
  app.get('/api/tenants/:tenantId/users', isAuthenticated, async (req: any, res) => {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const users = await storage.getUsersInTenant(tenantId);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post('/api/user-roles', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertUserTenantRoleSchema.parse(req.body);
      const assignment = await storage.assignUserRole(validatedData);
      res.json(assignment);
    } catch (error) {
      console.error("Error assigning user role:", error);
      res.status(500).json({ message: "Failed to assign user role" });
    }
  });

  app.delete('/api/user-roles/:userId/:tenantId/:roleId', isAuthenticated, async (req: any, res) => {
    try {
      const { userId, tenantId, roleId } = req.params;
      await storage.removeUserRole(userId, parseInt(tenantId), parseInt(roleId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing user role:", error);
      res.status(500).json({ message: "Failed to remove user role" });
    }
  });

  // Update user's current tenant
  app.put('/api/auth/user/current-tenant', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { tenantId } = req.body;
      const user = await storage.upsertUser({ id: userId, currentTenantId: tenantId });
      res.json(user);
    } catch (error) {
      console.error("Error updating current tenant:", error);
      res.status(500).json({ message: "Failed to update current tenant" });
    }
  });

  // **REFERENCE DATA ROUTES** - Countries, Currencies, Languages, Cities

  // Countries routes
  app.get('/api/countries', async (req, res) => {
    try {
      const result = await db.select().from(countries).orderBy(countries.name);
      res.json(result);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });

  app.post('/api/countries', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCountrySchema.parse(req.body);
      const country = await storage.createCountry(validatedData);
      res.json(country);
    } catch (error) {
      console.error("Error creating country:", error);
      res.status(500).json({ message: "Failed to create country" });
    }
  });

  app.put('/api/countries/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCountrySchema.partial().parse(req.body);
      const country = await storage.updateCountry(id, validatedData);
      res.json(country);
    } catch (error) {
      console.error("Error updating country:", error);
      res.status(500).json({ message: "Failed to update country" });
    }
  });

  app.delete('/api/countries/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCountry(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting country:", error);
      res.status(500).json({ message: "Failed to delete country" });
    }
  });

  // Currencies routes
  app.get('/api/currencies', async (req, res) => {
    try {
      const result = await db.select().from(currencies).orderBy(currencies.name);
      res.json(result);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      res.status(500).json({ message: "Failed to fetch currencies" });
    }
  });

  app.post('/api/currencies', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCurrencySchema.parse(req.body);
      const currency = await storage.createCurrency(validatedData);
      res.json(currency);
    } catch (error) {
      console.error("Error creating currency:", error);
      res.status(500).json({ message: "Failed to create currency" });
    }
  });

  // Languages routes
  app.get('/api/languages', async (req, res) => {
    try {
      const result = await db.select().from(languages).orderBy(languages.name);
      res.json(result);
    } catch (error) {
      console.error("Error fetching languages:", error);
      res.status(500).json({ message: "Failed to fetch languages" });
    }
  });

  app.post('/api/languages', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertLanguageSchema.parse(req.body);
      const language = await storage.createLanguage(validatedData);
      res.json(language);
    } catch (error) {
      console.error("Error creating language:", error);
      res.status(500).json({ message: "Failed to create language" });
    }
  });

  // Cities routes
  app.get('/api/cities', async (req, res) => {
    try {
      const cities = await storage.getCities();
      res.json(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });

  app.post('/api/cities', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCitySchema.parse(req.body);
      const city = await storage.createCity(validatedData);
      res.json(city);
    } catch (error) {
      console.error("Error creating city:", error);
      res.status(500).json({ message: "Failed to create city" });
    }
  });

  // Inbox/Workflow routes
  app.get('/api/inbox', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const inboxItems = await storage.getInboxItems(userId);
      res.json(inboxItems);
    } catch (error) {
      console.error("Error fetching inbox items:", error);
      res.status(500).json({ message: "Failed to fetch inbox items" });
    }
  });

  app.get('/api/sent-items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sentItems = await storage.getSentItems(userId);
      res.json(sentItems);
    } catch (error) {
      console.error("Error fetching sent items:", error);
      res.status(500).json({ message: "Failed to fetch sent items" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
