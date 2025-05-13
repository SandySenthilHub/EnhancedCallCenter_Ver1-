import sql from 'mssql';
import { executeQuery, closePool, getPool } from './sqlUtils';

// Initialize database and check connection
export async function initializeDatabase(): Promise<boolean> {
  try {
    console.log('Initializing database connection...');
    
    // Test database connection
    await getPool();
    
    // Check if database schema is initialized
    const tables = await executeQuery<{TABLE_NAME: string}>(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`
    );
    
    if (tables.length === 0) {
      console.log('Database schema not found. Schema initialization required.');
      return false;
    }
    
    // Get current row counts for important tables
    const tenantCount = await executeQuery<{count: number}>('SELECT COUNT(*) as count FROM Tenants');
    console.log(`Found ${tenantCount[0]?.count || 0} tenants in database.`);
    
    const userCount = await executeQuery<{count: number}>('SELECT COUNT(*) as count FROM Users');
    console.log(`Found ${userCount[0]?.count || 0} users in database.`);
    
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

// Check database health
export async function checkDatabaseHealth(): Promise<{
  isHealthy: boolean;
  latency: number;
  message: string;
}> {
  const startTime = Date.now();
  
  try {
    // Simple query to check database responsiveness
    await executeQuery('SELECT 1 as test');
    
    const latency = Date.now() - startTime;
    return {
      isHealthy: true,
      latency,
      message: `Database is healthy (latency: ${latency}ms)`
    };
  } catch (error) {
    const latency = Date.now() - startTime;
    return {
      isHealthy: false,
      latency,
      message: `Database health check failed: ${error}`
    };
  }
}

// Gracefully shutdown database connection on application exit
export function setupDatabaseShutdown(): void {
  process.on('SIGINT', async () => {
    console.log('Closing database connections before shutdown...');
    await closePool();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('Closing database connections before termination...');
    await closePool();
    process.exit(0);
  });
}

// Run the database initialization when this module is imported
initializeDatabase().then(isInitialized => {
  if (isInitialized) {
    console.log('Database initialization completed successfully');
  } else {
    console.warn('Database initialization completed with warnings');
  }
});

// Setup shutdown handlers
setupDatabaseShutdown();