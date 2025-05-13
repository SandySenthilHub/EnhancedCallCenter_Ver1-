import sql from 'mssql';

// Configuration for Azure SQL Server connection
const sqlConfig = {
  user: process.env.SQL_USER || 'shahul',
  password: process.env.SQL_PASSWORD || 'apple123!@#',
  server: process.env.SQL_SERVER || 'callcenter1.database.windows.net',
  database: process.env.SQL_DATABASE || 'call',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    port: 1433,
    connectionTimeout: 60000,
    requestTimeout: 60000,
    tdsVersion: '7.3',
    enableArithAbort: true,
    connectTimeout: 60000
  },
  connectionRetryCount: 5,
  connectionRetryInterval: 5000
};

// Get connection pool
let pool: sql.ConnectionPool | null = null;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    let retries = 0;
    let lastError;

    while (retries < MAX_RETRIES) {
      try {
        pool = await sql.connect(sqlConfig);
        console.log('Connected to Azure SQL Server');
        return pool;
      } catch (error) {
        lastError = error;
        console.error(`SQL connection attempt ${retries + 1} failed:`, error);
        retries++;

        if (retries < MAX_RETRIES) {
          console.log(`Retrying connection in ${RETRY_DELAY_MS / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }
    }

    console.error(`Failed to connect to SQL Server after ${MAX_RETRIES} attempts. Using fallback.`);
    throw lastError;
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
    console.error('SQL Query Error:', error);
    console.error('Failed Query:', query);
    console.error('Query Parameters:', JSON.stringify(params, null, 2));
    
    // For now, return empty array instead of throwing,
    // this allows the application to continue functioning with missing data
    // rather than completely failing
    return [] as T[];
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
    console.error('SQL Stored Procedure Error:', error);
    console.error('Failed Procedure:', procedureName);
    console.error('Procedure Parameters:', JSON.stringify(params, null, 2));
    
    // Return empty array instead of throwing to maintain application functionality
    return [] as T[];
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
