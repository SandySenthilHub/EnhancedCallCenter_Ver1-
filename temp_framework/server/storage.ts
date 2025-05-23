import {
  users,
  tenants,
  roles,
  entities,
  screenAssets,
  transactionDefinitions,
  transactionInstances,
  userTenantRoles,
  countries,
  currencies,
  languages,
  cities,
  inboxItems,
  sentItems,
  teams,
  teamMemberships,
  type User,
  type UpsertUser,
  type Team,
  type InsertTeam,
  type TeamMembership,
  type InsertTeamMembership,
  type Tenant,
  type InsertTenant,
  type Role,
  type InsertRole,
  type Entity,
  type InsertEntity,
  type ScreenAsset,
  type InsertScreenAsset,
  type TransactionDefinition,
  type InsertTransactionDefinition,
  type TransactionInstance,
  type InsertTransactionInstance,
  type UserTenantRole,
  type InsertUserTenantRole,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserTenants(userId: string): Promise<Tenant[]>;
  getUserRoles(userId: string, tenantId: number): Promise<Role[]>;

  // Tenant operations
  getTenants(): Promise<Tenant[]>;
  getTenant(id: number): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: number, tenant: Partial<InsertTenant>): Promise<Tenant>;

  // Role operations
  getRoles(tenantId: number): Promise<Role[]>;
  getRole(id: number): Promise<Role | undefined>;
  createRole(role: InsertRole): Promise<Role>;
  updateRole(id: number, role: Partial<InsertRole>): Promise<Role>;
  deleteRole(id: number): Promise<void>;

  // Entity operations
  getEntities(tenantId: number): Promise<Entity[]>;
  getEntity(id: number): Promise<Entity | undefined>;
  createEntity(entity: InsertEntity): Promise<Entity>;
  updateEntity(id: number, entity: Partial<InsertEntity>): Promise<Entity>;
  deleteEntity(id: number): Promise<void>;

  // Screen Asset operations
  getScreenAssets(tenantId: number): Promise<ScreenAsset[]>;
  getScreenAsset(id: number): Promise<ScreenAsset | undefined>;
  createScreenAsset(screenAsset: InsertScreenAsset): Promise<ScreenAsset>;
  updateScreenAsset(id: number, screenAsset: Partial<InsertScreenAsset>): Promise<ScreenAsset>;
  deleteScreenAsset(id: number): Promise<void>;

  // Transaction operations
  getTransactionDefinitions(tenantId: number): Promise<TransactionDefinition[]>;
  getTransactionDefinition(id: number): Promise<TransactionDefinition | undefined>;
  createTransactionDefinition(definition: InsertTransactionDefinition): Promise<TransactionDefinition>;
  updateTransactionDefinition(id: number, definition: Partial<InsertTransactionDefinition>): Promise<TransactionDefinition>;
  deleteTransactionDefinition(id: number): Promise<void>;

  getTransactionInstances(tenantId: number): Promise<TransactionInstance[]>;
  createTransactionInstance(instance: InsertTransactionInstance): Promise<TransactionInstance>;

  // User-Tenant-Role operations
  assignUserRole(assignment: InsertUserTenantRole): Promise<UserTenantRole>;
  removeUserRole(userId: string, tenantId: number, roleId: number): Promise<void>;
  getUsersInTenant(tenantId: number): Promise<(User & { roles: Role[] })[]>;

  // Reference Data operations
  getCountries(): Promise<any[]>;
  createCountry(country: any): Promise<any>;
  updateCountry(id: number, country: any): Promise<any>;
  deleteCountry(id: number): Promise<void>;
  
  getCurrencies(): Promise<any[]>;
  createCurrency(currency: any): Promise<any>;
  
  getLanguages(): Promise<any[]>;
  createLanguage(language: any): Promise<any>;
  
  getCities(): Promise<any[]>;
  createCity(city: any): Promise<any>;
  
  // Workflow operations
  getInboxItems(userId: string): Promise<any[]>;
  getSentItems(userId: string): Promise<any[]>;

  // Team operations
  getTeams(tenantId: number): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team>;
  deleteTeam(id: number): Promise<void>;
  
  // Team membership operations
  getTeamMembers(teamId: number): Promise<(User & { membership: TeamMembership })[]>;
  addUserToTeam(membership: InsertTeamMembership): Promise<TeamMembership>;
  removeUserFromTeam(teamId: number, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Only use fields that actually exist in the current database
    const safeUserData = {
      id: userData.id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      updatedAt: new Date(),
    };
    
    const [user] = await db
      .insert(users)
      .values(safeUserData)
      .onConflictDoUpdate({
        target: users.id,
        set: safeUserData,
      })
      .returning();
    return user;
  }

  async getUserTenants(userId: string): Promise<Tenant[]> {
    const userTenants = await db
      .select({ tenant: tenants })
      .from(userTenantRoles)
      .innerJoin(tenants, eq(userTenantRoles.tenantId, tenants.id))
      .where(eq(userTenantRoles.userId, userId));
    
    return userTenants.map(ut => ut.tenant);
  }

  async getUserRoles(userId: string, tenantId: number): Promise<Role[]> {
    const userRoles = await db
      .select({ role: roles })
      .from(userTenantRoles)
      .innerJoin(roles, eq(userTenantRoles.roleId, roles.id))
      .where(and(
        eq(userTenantRoles.userId, userId),
        eq(userTenantRoles.tenantId, tenantId)
      ));
    
    return userRoles.map(ur => ur.role);
  }

  // Tenant operations
  async getTenants(): Promise<Tenant[]> {
    return await db.select().from(tenants).orderBy(desc(tenants.createdAt));
  }

  async getTenant(id: number): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const [newTenant] = await db.insert(tenants).values(tenant).returning();
    return newTenant;
  }

  async updateTenant(id: number, tenant: Partial<InsertTenant>): Promise<Tenant> {
    const [updatedTenant] = await db
      .update(tenants)
      .set({ ...tenant, updatedAt: new Date() })
      .where(eq(tenants.id, id))
      .returning();
    return updatedTenant;
  }

  // Role operations
  async getRoles(tenantId: number): Promise<Role[]> {
    return await db
      .select()
      .from(roles)
      .where(eq(roles.tenantId, tenantId))
      .orderBy(desc(roles.createdAt));
  }

  async getRole(id: number): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role;
  }

  async createRole(role: InsertRole): Promise<Role> {
    const [newRole] = await db.insert(roles).values(role).returning();
    return newRole;
  }

  async updateRole(id: number, role: Partial<InsertRole>): Promise<Role> {
    const [updatedRole] = await db
      .update(roles)
      .set({ ...role, updatedAt: new Date() })
      .where(eq(roles.id, id))
      .returning();
    return updatedRole;
  }

  async deleteRole(id: number): Promise<void> {
    await db.delete(roles).where(eq(roles.id, id));
  }

  // Entity operations
  async getEntities(tenantId: number): Promise<Entity[]> {
    return await db
      .select()
      .from(entities)
      .where(eq(entities.tenantId, tenantId))
      .orderBy(desc(entities.createdAt));
  }

  async getEntity(id: number): Promise<Entity | undefined> {
    const [entity] = await db.select().from(entities).where(eq(entities.id, id));
    return entity;
  }

  async createEntity(entity: InsertEntity): Promise<Entity> {
    const [newEntity] = await db.insert(entities).values(entity).returning();
    return newEntity;
  }

  async updateEntity(id: number, entity: Partial<InsertEntity>): Promise<Entity> {
    const [updatedEntity] = await db
      .update(entities)
      .set({ ...entity, updatedAt: new Date(), lastModified: new Date() })
      .where(eq(entities.id, id))
      .returning();
    return updatedEntity;
  }

  async deleteEntity(id: number): Promise<void> {
    await db.delete(entities).where(eq(entities.id, id));
  }

  // Screen Asset operations
  async getScreenAssets(tenantId: number): Promise<ScreenAsset[]> {
    return await db
      .select()
      .from(screenAssets)
      .where(eq(screenAssets.tenantId, tenantId))
      .orderBy(desc(screenAssets.createdAt));
  }

  async getScreenAsset(id: number): Promise<ScreenAsset | undefined> {
    const [screenAsset] = await db.select().from(screenAssets).where(eq(screenAssets.id, id));
    return screenAsset;
  }

  async createScreenAsset(screenAsset: InsertScreenAsset): Promise<ScreenAsset> {
    const [newScreenAsset] = await db.insert(screenAssets).values(screenAsset).returning();
    return newScreenAsset;
  }

  async updateScreenAsset(id: number, screenAsset: Partial<InsertScreenAsset>): Promise<ScreenAsset> {
    const [updatedScreenAsset] = await db
      .update(screenAssets)
      .set({ ...screenAsset, updatedAt: new Date() })
      .where(eq(screenAssets.id, id))
      .returning();
    return updatedScreenAsset;
  }

  async deleteScreenAsset(id: number): Promise<void> {
    await db.delete(screenAssets).where(eq(screenAssets.id, id));
  }

  // Transaction operations
  async getTransactionDefinitions(tenantId: number): Promise<TransactionDefinition[]> {
    return await db
      .select()
      .from(transactionDefinitions)
      .where(eq(transactionDefinitions.tenantId, tenantId))
      .orderBy(desc(transactionDefinitions.createdAt));
  }

  async getTransactionDefinition(id: number): Promise<TransactionDefinition | undefined> {
    const [definition] = await db.select().from(transactionDefinitions).where(eq(transactionDefinitions.id, id));
    return definition;
  }

  async createTransactionDefinition(definition: InsertTransactionDefinition): Promise<TransactionDefinition> {
    const [newDefinition] = await db.insert(transactionDefinitions).values(definition).returning();
    return newDefinition;
  }

  async updateTransactionDefinition(id: number, definition: Partial<InsertTransactionDefinition>): Promise<TransactionDefinition> {
    const [updatedDefinition] = await db
      .update(transactionDefinitions)
      .set({ ...definition, updatedAt: new Date() })
      .where(eq(transactionDefinitions.id, id))
      .returning();
    return updatedDefinition;
  }

  async deleteTransactionDefinition(id: number): Promise<void> {
    await db.delete(transactionDefinitions).where(eq(transactionDefinitions.id, id));
  }

  async getTransactionInstances(tenantId: number): Promise<TransactionInstance[]> {
    return await db
      .select()
      .from(transactionInstances)
      .where(eq(transactionInstances.tenantId, tenantId))
      .orderBy(desc(transactionInstances.createdAt));
  }

  async createTransactionInstance(instance: InsertTransactionInstance): Promise<TransactionInstance> {
    const [newInstance] = await db.insert(transactionInstances).values(instance).returning();
    return newInstance;
  }

  // User-Tenant-Role operations
  async assignUserRole(assignment: InsertUserTenantRole): Promise<UserTenantRole> {
    const [newAssignment] = await db.insert(userTenantRoles).values(assignment).returning();
    return newAssignment;
  }

  async removeUserRole(userId: string, tenantId: number, roleId: number): Promise<void> {
    await db.delete(userTenantRoles).where(
      and(
        eq(userTenantRoles.userId, userId),
        eq(userTenantRoles.tenantId, tenantId),
        eq(userTenantRoles.roleId, roleId)
      )
    );
  }

  async getUsersInTenant(tenantId: number): Promise<(User & { roles: Role[] })[]> {
    const usersWithRoles = await db
      .select({
        user: users,
        role: roles,
      })
      .from(userTenantRoles)
      .innerJoin(users, eq(userTenantRoles.userId, users.id))
      .innerJoin(roles, eq(userTenantRoles.roleId, roles.id))
      .where(eq(userTenantRoles.tenantId, tenantId));

    const userMap = new Map<string, User & { roles: Role[] }>();
    
    usersWithRoles.forEach(({ user, role }) => {
      if (!userMap.has(user.id)) {
        userMap.set(user.id, { ...user, roles: [] });
      }
      userMap.get(user.id)!.roles.push(role);
    });

    return Array.from(userMap.values());
  }

  // Reference Data operations - IMPLEMENTING THE MISSING METHODS!
  async getCountries(): Promise<any[]> {
    const result = await db.select().from(countries).orderBy(countries.name);
    return result;
  }

  async createCountry(country: any): Promise<any> {
    const [result] = await db.insert(countries).values(country).returning();
    return result;
  }

  async updateCountry(id: number, country: any): Promise<any> {
    const [result] = await db.update(countries).set(country).where(eq(countries.id, id)).returning();
    return result;
  }

  async deleteCountry(id: number): Promise<void> {
    await db.delete(countries).where(eq(countries.id, id));
  }

  async getCurrencies(): Promise<any[]> {
    const result = await db.select().from(currencies).orderBy(currencies.name);
    return result;
  }

  async createCurrency(currency: any): Promise<any> {
    const [result] = await db.insert(currencies).values(currency).returning();
    return result;
  }

  async getLanguages(): Promise<any[]> {
    const result = await db.select().from(languages).orderBy(languages.name);
    return result;
  }

  async createLanguage(language: any): Promise<any> {
    const [result] = await db.insert(languages).values(language).returning();
    return result;
  }

  async getCities(): Promise<any[]> {
    const result = await db.select().from(cities).orderBy(cities.name);
    return result;
  }

  async createCity(city: any): Promise<any> {
    const [result] = await db.insert(cities).values(city).returning();
    return result;
  }

  // Workflow operations
  async getInboxItems(userId: string): Promise<any[]> {
    const result = await db.select().from(inboxItems).where(eq(inboxItems.toUserId, userId)).orderBy(desc(inboxItems.createdAt));
    return result;
  }

  async getSentItems(userId: string): Promise<any[]> {
    const result = await db.select().from(sentItems).where(eq(sentItems.fromUserId, userId)).orderBy(desc(sentItems.createdAt));
    return result;
  }

  // Team operations
  async getTeams(tenantId: number): Promise<Team[]> {
    const result = await db.select().from(teams).where(eq(teams.tenantId, tenantId)).orderBy(teams.name);
    return result;
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [result] = await db.insert(teams).values(team).returning();
    return result;
  }

  async updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team> {
    const [result] = await db.update(teams).set({ ...team, updatedAt: new Date() }).where(eq(teams.id, id)).returning();
    return result;
  }

  async deleteTeam(id: number): Promise<void> {
    await db.delete(teams).where(eq(teams.id, id));
  }

  // Team membership operations
  async getTeamMembers(teamId: number): Promise<(User & { membership: TeamMembership })[]> {
    const result = await db
      .select({
        user: users,
        membership: teamMemberships
      })
      .from(teamMemberships)
      .innerJoin(users, eq(teamMemberships.userId, users.id))
      .where(and(eq(teamMemberships.teamId, teamId), eq(teamMemberships.isActive, true)));

    return result.map(row => ({ ...row.user, membership: row.membership }));
  }

  async addUserToTeam(membership: InsertTeamMembership): Promise<TeamMembership> {
    const [result] = await db.insert(teamMemberships).values(membership).returning();
    return result;
  }

  async removeUserFromTeam(teamId: number, userId: string): Promise<void> {
    await db.update(teamMemberships)
      .set({ isActive: false })
      .where(and(eq(teamMemberships.teamId, teamId), eq(teamMemberships.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
