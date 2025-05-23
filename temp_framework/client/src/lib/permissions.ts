// Define all available permissions
export const AVAILABLE_PERMISSIONS: Record<string, string> = {
  // Entity Management
  'entities.create': 'Create Entities',
  'entities.read': 'View Entities',
  'entities.update': 'Edit Entities',
  'entities.delete': 'Delete Entities',
  'entities.manage_schema': 'Manage Entity Schema',

  // User Management
  'users.create': 'Add Users',
  'users.read': 'View Users',
  'users.update': 'Edit Users',
  'users.delete': 'Remove Users',
  'users.assign_roles': 'Assign User Roles',

  // Role Management
  'roles.create': 'Create Roles',
  'roles.read': 'View Roles',
  'roles.update': 'Edit Roles',
  'roles.delete': 'Delete Roles',
  'roles.assign_permissions': 'Assign Permissions',

  // Transaction Management
  'transactions.create': 'Create Transactions',
  'transactions.read': 'View Transactions',
  'transactions.update': 'Edit Transactions',
  'transactions.delete': 'Delete Transactions',
  'transactions.execute': 'Execute Transactions',

  // Screen Asset Management
  'screens.create': 'Create Screen Assets',
  'screens.read': 'View Screen Assets',
  'screens.update': 'Edit Screen Assets',
  'screens.delete': 'Delete Screen Assets',
  'screens.configure': 'Configure Screen Layouts',

  // Tenant Management
  'tenants.read': 'View Tenant Info',
  'tenants.update': 'Edit Tenant Settings',
  'tenants.manage': 'Full Tenant Management',

  // Reports & Analytics
  'reports.read': 'View Reports',
  'reports.export': 'Export Reports',
  'reports.advanced': 'Advanced Analytics',

  // System Administration
  'system.admin': 'System Administration',
  'system.audit': 'View Audit Logs',
  'system.backup': 'Manage Backups',
};

// Group permissions by functional area
export const PERMISSION_GROUPS = {
  entity_management: {
    label: 'Entity Management',
    description: 'Manage data entities and their schemas',
    permissions: [
      'entities.create',
      'entities.read',
      'entities.update',
      'entities.delete',
      'entities.manage_schema',
    ],
  },
  user_management: {
    label: 'User Management',
    description: 'Manage users and their access',
    permissions: [
      'users.create',
      'users.read',
      'users.update',
      'users.delete',
      'users.assign_roles',
    ],
  },
  role_management: {
    label: 'Role & Permission Management',
    description: 'Manage roles and permissions',
    permissions: [
      'roles.create',
      'roles.read',
      'roles.update',
      'roles.delete',
      'roles.assign_permissions',
    ],
  },
  transaction_management: {
    label: 'Transaction Management',
    description: 'Manage transaction workflows',
    permissions: [
      'transactions.create',
      'transactions.read',
      'transactions.update',
      'transactions.delete',
      'transactions.execute',
    ],
  },
  screen_management: {
    label: 'Screen Asset Management',
    description: 'Manage user interface screens',
    permissions: [
      'screens.create',
      'screens.read',
      'screens.update',
      'screens.delete',
      'screens.configure',
    ],
  },
  reporting: {
    label: 'Reports & Analytics',
    description: 'Access reports and analytics',
    permissions: [
      'reports.read',
      'reports.export',
      'reports.advanced',
    ],
  },
  tenant_management: {
    label: 'Tenant Management',
    description: 'Manage tenant settings and configuration',
    permissions: [
      'tenants.read',
      'tenants.update',
      'tenants.manage',
    ],
  },
  system_administration: {
    label: 'System Administration',
    description: 'Advanced system management capabilities',
    permissions: [
      'system.admin',
      'system.audit',
      'system.backup',
    ],
  },
} as const;

// Predefined role templates
export const ROLE_TEMPLATES = {
  system_admin: {
    name: 'System Administrator',
    description: 'Full system access and control',
    permissions: Object.keys(AVAILABLE_PERMISSIONS),
    isSystemRole: true,
  },
  tenant_admin: {
    name: 'Tenant Administrator',
    description: 'Full access within the tenant',
    permissions: [
      'entities.create', 'entities.read', 'entities.update', 'entities.delete', 'entities.manage_schema',
      'users.create', 'users.read', 'users.update', 'users.delete', 'users.assign_roles',
      'roles.create', 'roles.read', 'roles.update', 'roles.delete', 'roles.assign_permissions',
      'transactions.create', 'transactions.read', 'transactions.update', 'transactions.delete', 'transactions.execute',
      'screens.create', 'screens.read', 'screens.update', 'screens.delete', 'screens.configure',
      'reports.read', 'reports.export', 'reports.advanced',
      'tenants.read', 'tenants.update',
    ],
    isSystemRole: false,
  },
  entity_manager: {
    name: 'Entity Manager',
    description: 'Manage entities and configurations',
    permissions: [
      'entities.create', 'entities.read', 'entities.update', 'entities.delete', 'entities.manage_schema',
      'screens.create', 'screens.read', 'screens.update', 'screens.configure',
      'reports.read',
    ],
    isSystemRole: false,
  },
  user_manager: {
    name: 'User Manager',
    description: 'Manage users and their roles',
    permissions: [
      'users.create', 'users.read', 'users.update', 'users.assign_roles',
      'roles.read',
      'reports.read',
    ],
    isSystemRole: false,
  },
  transaction_operator: {
    name: 'Transaction Operator',
    description: 'Execute and monitor transactions',
    permissions: [
      'transactions.create', 'transactions.read', 'transactions.execute',
      'entities.read',
      'reports.read',
    ],
    isSystemRole: false,
  },
  read_only_user: {
    name: 'Read Only User',
    description: 'View-only access to data',
    permissions: [
      'entities.read',
      'users.read',
      'roles.read',
      'transactions.read',
      'screens.read',
      'reports.read',
    ],
    isSystemRole: false,
  },
} as const;

// Utility functions for permission checking
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('system.admin');
};

export const hasAnyPermission = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  return requiredPermissions.some(permission => hasPermission(userPermissions, permission));
};

export const hasAllPermissions = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  return requiredPermissions.every(permission => hasPermission(userPermissions, permission));
};

export const getPermissionsByGroup = (groupName: keyof typeof PERMISSION_GROUPS): string[] => {
  return PERMISSION_GROUPS[groupName]?.permissions || [];
};

export const getPermissionDescription = (permission: string): string => {
  return AVAILABLE_PERMISSIONS[permission] || permission.replace(/_/g, ' ');
};
