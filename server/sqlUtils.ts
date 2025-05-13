import sql from 'mssql';

// Configuration for Azure SQL Server connection
const sqlConfig = {
  user: process.env.SQL_USER || 'shahul',
  password: process.env.SQL_PASSWORD || 'apple123!@#',
  server: process.env.SQL_SERVER || 'callcenter1.database.windows.net',
  database: process.env.SQL_DATABASE || 'call',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    port: 1433,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    tdsVersion: '7.3'
  }
};

// Get connection pool
let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(sqlConfig);
    console.log('Connected to Azure SQL Server');
  }
  return pool;
}

// Execute a query with parameters
export async function executeQuery<T>(query: string, params: any = {}): Promise<T[]> {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Add parameters to request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    const result = await request.query(query);
    return result.recordset as T[];
  } catch (error) {
    console.error('SQL Error:', error);
    throw error;
  }
}

// Execute a stored procedure
export async function executeStoredProcedure<T>(procedureName: string, params: any = {}): Promise<T[]> {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Add parameters to request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    const result = await request.execute(procedureName);
    return result.recordset as T[];
  } catch (error) {
    console.error('SQL Error:', error);
    throw error;
  }
}

// Close pool on application shutdown
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('SQL connection pool closed');
  }
}

// Utility to ensure TenantID is applied to all queries for multi-tenancy
export function withTenantFilter(query: string, tenantIdParam: string = 'tenantId'): string {
  if (!query.toLowerCase().includes('where')) {
    return `${query} WHERE TenantID = @${tenantIdParam}`;
  } else {
    return `${query} AND TenantID = @${tenantIdParam}`;
  }
}
