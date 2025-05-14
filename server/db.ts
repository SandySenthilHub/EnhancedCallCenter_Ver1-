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
      console.log('Database schema not found. Initializing schema...');
      try {
        // Read and execute schema creation script
        const fs = require('fs');
        const path = require('path');
        
        const schemaPath = path.join(__dirname, 'sql', 'create-schema.sql');
        console.log(`Reading schema file from ${schemaPath}`);
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        
        const pool = await getPool();
        console.log('Executing schema creation script...');
        await pool.request().batch(schemaSQL);
        console.log('Schema created successfully');
        
        // Set up Row-Level Security
        const rlsPath = path.join(__dirname, 'sql', 'setup-rls.sql');
        console.log(`Reading RLS file from ${rlsPath}`);
        const rlsSQL = fs.readFileSync(rlsPath, 'utf8');
        
        console.log('Setting up Row-Level Security...');
        await pool.request().batch(rlsSQL);
        console.log('Row-Level Security set up successfully');
        
        return true;
      } catch (error) {
        console.error('Failed to initialize database schema:', error);
        return false;
      }
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