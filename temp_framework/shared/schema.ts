import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  uuid,
  decimal,
  date,
  time,
  real,
} from "drizzle-orm/pg-core";
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

// Users table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  currentTenantId: integer("current_tenant_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tenants table for multi-tenancy
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Roles table
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

// User-Tenant-Role mapping
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

// Entities table
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

// Screen Assets table
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

// Transaction Definitions table
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

// Transaction Instances table
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

// **GEOGRAPHIC & REFERENCE TABLES**

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

// Zipcodes table
export const zipcodes = pgTable("zipcodes", {
  id: serial("id").primaryKey(),
  countryId: integer("country_id").references(() => countries.id).notNull(),
  regionId: integer("region_id").references(() => regions.id),
  cityId: integer("city_id").references(() => cities.id),
  code: varchar("code", { length: 20 }).notNull(),
  area: varchar("area", { length: 255 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Currencies table
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

// Languages table
export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 5 }).notNull().unique(), // ISO 639-1/639-2
  name: varchar("name", { length: 255 }).notNull(),
  nativeName: varchar("native_name", { length: 255 }),
  isRTL: boolean("is_rtl").default(false), // Right-to-left support
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// **SYSTEM LOGGING TABLES**

// Error Log table
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

// Exception Log table
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

// Access Log table (Audit function)
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

// Health Checks table
export const healthChecks = pgTable("health_checks", {
  id: serial("id").primaryKey(),
  serviceName: varchar("service_name", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(), // 'healthy', 'unhealthy', 'degraded'
  responseTime: integer("response_time"), // in milliseconds
  details: jsonb("details"),
  checkedAt: timestamp("checked_at").defaultNow(),
});

// **SECURITY & ACCESS CONTROL TABLES**

// User Restrictions table
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

// Modules table
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

// Role Exceptions table (Allow/Deny access beyond role permissions)
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

// Transaction Limits table
export const transactionLimits = pgTable("transaction_limits", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  transactionDefinitionId: integer("transaction_definition_id").references(() => transactionDefinitions.id).notNull(),
  roleId: integer("role_id").references(() => roles.id),
  userId: varchar("user_id").references(() => users.id),
  limitType: varchar("limit_type", { length: 20 }).notNull(), // 'daily', 'monthly', 'per_transaction'
  maxAmount: decimal("max_amount", { precision: 15, scale: 2 }),
  maxCount: integer("max_count"),
  currencyCode: varchar("currency_code", { length: 3 }).references(() => currencies.code),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// **BUSINESS LOGIC TABLES**

// Companies table
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

// Text Translations table (Internationalization)
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

// Inbox Items table (Workflow management)
export const inboxItems = pgTable("inbox_items", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  fromUserId: varchar("from_user_id").references(() => users.id).notNull(),
  toUserId: varchar("to_user_id").references(() => users.id).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message"),
  itemType: varchar("item_type", { length: 50 }).notNull(), // 'approval', 'notification', 'task', 'alert'
  status: varchar("status", { length: 20 }).notNull(), // 'pending', 'approved', 'rejected', 'forwarded', 'returned'
  priority: varchar("priority", { length: 20 }).default("medium"), // 'low', 'medium', 'high', 'urgent'
  entityType: varchar("entity_type", { length: 100 }),
  entityId: varchar("entity_id", { length: 50 }),
  actionData: jsonb("action_data"),
  dueDate: timestamp("due_date"),
  processedAt: timestamp("processed_at"),
  processedBy: varchar("processed_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sent Items table
export const sentItems = pgTable("sent_items", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  inboxItemId: integer("inbox_item_id").references(() => inboxItems.id).notNull(),
  fromUserId: varchar("from_user_id").references(() => users.id).notNull(),
  toUserId: varchar("to_user_id").references(() => users.id).notNull(),
  action: varchar("action", { length: 50 }).notNull(), // 'sent', 'forwarded', 'returned'
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notional Values table (Credits system)
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

// Credit Transactions table
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

// User Photos table
export const userPhotos = pgTable("user_photos", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  photoUrl: varchar("photo_url", { length: 500 }).notNull(),
  photoType: varchar("photo_type", { length: 20 }).notNull(), // 'profile', 'avatar'
  isActive: boolean("is_active").default(true),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  alertType: varchar("alert_type", { length: 50 }).notNull(), // 'system', 'security', 'business', 'notification'
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  severity: varchar("severity", { length: 20 }).notNull(), // 'info', 'warning', 'error', 'critical'
  isRead: boolean("is_read").default(false),
  actionRequired: boolean("action_required").default(false),
  actionUrl: varchar("action_url", { length: 500 }),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  userTenantRoles: many(userTenantRoles),
  currentTenant: one(tenants, {
    fields: [users.currentTenantId],
    references: [tenants.id],
  }),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  entities: many(entities),
  roles: many(roles),
  userTenantRoles: many(userTenantRoles),
  screenAssets: many(screenAssets),
  transactionDefinitions: many(transactionDefinitions),
  transactionInstances: many(transactionInstances),
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
  screenAssets: many(screenAssets),
}));

export const screenAssetsRelations = relations(screenAssets, ({ one }) => ({
  tenant: one(tenants, {
    fields: [screenAssets.tenantId],
    references: [tenants.id],
  }),
  entity: one(entities, {
    fields: [screenAssets.entityId],
    references: [entities.id],
  }),
}));

export const transactionDefinitionsRelations = relations(transactionDefinitions, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [transactionDefinitions.tenantId],
    references: [tenants.id],
  }),
  sourceEntity: one(entities, {
    fields: [transactionDefinitions.sourceEntityId],
    references: [entities.id],
  }),
  targetEntity: one(entities, {
    fields: [transactionDefinitions.targetEntityId],
    references: [entities.id],
  }),
  instances: many(transactionInstances),
}));

export const transactionInstancesRelations = relations(transactionInstances, ({ one }) => ({
  tenant: one(tenants, {
    fields: [transactionInstances.tenantId],
    references: [tenants.id],
  }),
  definition: one(transactionDefinitions, {
    fields: [transactionInstances.definitionId],
    references: [transactionDefinitions.id],
  }),
  executedByUser: one(users, {
    fields: [transactionInstances.executedBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRoleSchema = createInsertSchema(roles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export const insertUserTenantRoleSchema = createInsertSchema(userTenantRoles).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;
export type Role = typeof roles.$inferSelect;
export type InsertEntity = z.infer<typeof insertEntitySchema>;
export type Entity = typeof entities.$inferSelect;
export type InsertScreenAsset = z.infer<typeof insertScreenAssetSchema>;
export type ScreenAsset = typeof screenAssets.$inferSelect;
export type InsertTransactionDefinition = z.infer<typeof insertTransactionDefinitionSchema>;
export type TransactionDefinition = typeof transactionDefinitions.$inferSelect;
export type InsertTransactionInstance = z.infer<typeof insertTransactionInstanceSchema>;
export type TransactionInstance = typeof transactionInstances.$inferSelect;
export type InsertUserTenantRole = z.infer<typeof insertUserTenantRoleSchema>;
export type UserTenantRole = typeof userTenantRoles.$inferSelect;

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamMembershipSchema = createInsertSchema(teamMemberships).omit({
  id: true,
  joinedAt: true,
});

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeamMembership = z.infer<typeof insertTeamMembershipSchema>;
export type TeamMembership = typeof teamMemberships.$inferSelect;

// User Activity Tracking table
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

export const insertUserActivitySchema = createInsertSchema(userActivities).omit({
  id: true,
  createdAt: true,
});

export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
export type UserActivity = typeof userActivities.$inferSelect;
