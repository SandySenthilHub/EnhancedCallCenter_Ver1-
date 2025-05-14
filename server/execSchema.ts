import sql from 'mssql';
import * as fs from 'fs';
import * as path from 'path';

// SQL Server configuration
const sqlConfig = {
  user: process.env.SQL_USER || 'shahul',
  password: process.env.SQL_PASSWORD || 'apple123!@#',
  server: process.env.SQL_SERVER || 'callcenter1.database.windows.net',
  database: process.env.SQL_DATABASE || 'call',
  options: {
    encrypt: true,
    trustServerCertificate: false,
    port: parseInt(process.env.SQL_PORT || '1433'),
    connectTimeout: 30000,
    requestTimeout: 30000
  }
};

// Read SQL schema file contents
const schemaSQL = fs.readFileSync('./sql/create-schema.sql', 'utf8');
const rlsSQL = fs.readFileSync('./sql/setup-rls.sql', 'utf8');

async function setupSchema() {
  console.log('Setting up database schema...');
  console.log('Connection Parameters:');
  console.log(`Server: ${sqlConfig.server}`);
  console.log(`Database: ${sqlConfig.database}`);
  console.log(`User: ${sqlConfig.user}`);
  
  let pool: sql.ConnectionPool | null = null;
  
  try {
    // Connect to database
    console.log('Connecting to database...');
    pool = await sql.connect(sqlConfig);
    console.log('Connected successfully');
    
    // Check if our specific tables exist
    console.log('Checking for our application tables...');
    const tableResult = await pool.request().query(`
      SELECT COUNT(*) as tableCount 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME IN ('Tenants', 'Users', 'KpiCategories')
    `);
    
    const tableCount = tableResult.recordset[0].tableCount;
    console.log(`Found ${tableCount} of our application tables`);
    
    if (tableCount < 3) {
      // Execute schema creation script
      console.log('Creating database schema...');
      console.log('Schema SQL length:', schemaSQL.length);
      await pool.request().batch(schemaSQL);
      console.log('Schema created successfully');
      
      // Set up Row-Level Security
      try {
        console.log('Setting up Row-Level Security...');
        console.log('RLS SQL length:', rlsSQL.length);
        await pool.request().batch(rlsSQL);
        console.log('Row-Level Security set up successfully');
      } catch (rlsError) {
        console.warn('Warning: Failed to set up Row-Level Security. This is optional and may not be supported by your SQL Server version.');
        console.warn(rlsError);
      }
    } else {
      console.log('Our tables already exist, skipping schema creation');
    }
    
    // Verify tables were created
    try {
      const tenantResult = await pool.request().query('SELECT COUNT(*) as count FROM Tenants');
      console.log(`Found ${tenantResult.recordset[0].count} tenants in database`);
      
      const userResult = await pool.request().query('SELECT COUNT(*) as count FROM Users');
      console.log(`Found ${userResult.recordset[0].count} users in database`);
    } catch (verifyError) {
      console.error('Error verifying tables:', verifyError);
    }
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (pool) {
      await pool.close();
      console.log('Database connection closed');
    }
  }
}

// Run the setup
setupSchema().catch(err => {
  console.error('Fatal error during database setup:', err);
  process.exit(1);
});