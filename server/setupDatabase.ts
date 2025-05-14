import sql from 'mssql';
import fs from 'fs';
import path from 'path';

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

async function setupDatabase() {
  console.log('Setting up database schema...');
  console.log('Connection Parameters:');
  console.log(`Server: ${sqlConfig.server}`);
  console.log(`Database: ${sqlConfig.database}`);
  console.log(`User: ${sqlConfig.user}`);
  console.log(`Port: ${sqlConfig.options.port}`);
  
  let pool: sql.ConnectionPool | null = null;
  
  try {
    // Connect to database
    console.log('Connecting to database...');
    pool = await sql.connect(sqlConfig);
    console.log('Connected successfully');
    
    // Check if tables exist
    console.log('Checking for existing tables...');
    const tableResult = await pool.request().query(`
      SELECT COUNT(*) as tableCount 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);
    
    const tableCount = tableResult.recordset[0].tableCount;
    console.log(`Found ${tableCount} existing tables`);
    
    if (tableCount === 0) {
      // Read and execute schema creation script
      console.log('Creating database schema...');
      const schemaPath = path.join(__dirname, 'sql', 'create-schema.sql');
      console.log(`Reading schema file from ${schemaPath}`);
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      
      console.log('Executing schema creation script...');
      await pool.request().batch(schemaSQL);
      console.log('Schema created successfully');
      
      // Set up Row-Level Security
      console.log('Setting up Row-Level Security...');
      const rlsPath = path.join(__dirname, 'sql', 'setup-rls.sql');
      console.log(`Reading RLS file from ${rlsPath}`);
      const rlsSQL = fs.readFileSync(rlsPath, 'utf8');
      
      try {
        await pool.request().batch(rlsSQL);
        console.log('Row-Level Security set up successfully');
      } catch (rlsError) {
        console.warn('Warning: Failed to set up Row-Level Security. This is optional and may not be supported by your SQL Server version.');
        console.warn(rlsError);
      }
    } else {
      console.log('Tables already exist, skipping schema creation');
    }
    
    // Verify tables were created
    const tenantResult = await pool.request().query('SELECT COUNT(*) as count FROM Tenants');
    console.log(`Found ${tenantResult.recordset[0].count} tenants in database`);
    
    const userResult = await pool.request().query('SELECT COUNT(*) as count FROM Users');
    console.log(`Found ${userResult.recordset[0].count} users in database`);
    
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
setupDatabase().catch(err => {
  console.error('Fatal error during database setup:', err);
  process.exit(1);
});