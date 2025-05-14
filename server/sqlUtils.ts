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
    trustServerCertificate: false, // Changed to false for Azure SQL
    port: parseInt(process.env.SQL_PORT || '1433'),
    connectionTimeout: 30000, // Reduced timeout
    requestTimeout: 30000, // Reduced timeout
    enableArithAbort: true,
    connectTimeout: 30000 // Reduced timeout
  }
};

// Track connection status to avoid excessive retry attempts
let isConnecting = false;
let lastConnectionAttempt = 0;
const CONNECTION_COOLDOWN = 60000; // 1 minute

// Get connection pool
let pool: sql.ConnectionPool | null = null;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export async function getPool(): Promise<sql.ConnectionPool> {
  // If we already have a pool, return it
  if (pool) {
    return pool;
  }
  
  // Check if we're already trying to connect or if we tried too recently
  const now = Date.now();
  if (isConnecting || (now - lastConnectionAttempt < CONNECTION_COOLDOWN)) {
    console.log('SQL connection already in progress or attempted recently');
    throw new Error('SQL connection unavailable');
  }
  
  // Mark that we're starting a connection attempt
  isConnecting = true;
  lastConnectionAttempt = now;
  
  let retries = 0;
  let lastError;

  try {
    while (retries < MAX_RETRIES) {
      try {
        // Try to connect
        pool = await sql.connect(sqlConfig);
        console.log('Connected to Azure SQL Server');
        isConnecting = false;
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
  } finally {
    // Mark that we're done connecting regardless of success or failure
    isConnecting = false;
  }
}

// Execute a query with parameters and graceful fallback
export async function executeQuery<T>(query: string, params: any = {}): Promise<T[]> {
  try {
    // Try to get a connection pool 
    const pool = await getPool();
    const request = pool.request();
    
    // Add parameters to request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    // Execute the query
    const result = await request.query(query);
    return result.recordset as T[];
  } catch (error) {
    console.error('SQL Query Error:', error);
    console.error('Failed Query:', query);
    console.error('Query Parameters:', params);
    
    // Return empty array as fallback
    // This allows the application to continue functioning with missing data
    // rather than completely failing when SQL Server is unavailable
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
