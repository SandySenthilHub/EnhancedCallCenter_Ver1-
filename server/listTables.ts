import sql from 'mssql';

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

async function listTables() {
  console.log('Listing tables in the database...');
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
    
    // List all tables in the database
    console.log('Fetching table list...');
    const result = await pool.request().query(`
      SELECT 
        TABLE_SCHEMA,
        TABLE_NAME
      FROM 
        INFORMATION_SCHEMA.TABLES 
      WHERE 
        TABLE_TYPE = 'BASE TABLE'
      ORDER BY
        TABLE_SCHEMA, TABLE_NAME
    `);
    
    console.log('Tables in database:');
    console.log('-------------------');
    console.log('Schema\t\tTable Name');
    console.log('-------------------');
    
    for (const row of result.recordset) {
      console.log(`${row.TABLE_SCHEMA}\t\t${row.TABLE_NAME}`);
    }
    
    console.log('-------------------');
    console.log(`Total tables: ${result.recordset.length}`);
    
    // Try to determine which schema we should use
    const schemaResult = await pool.request().query(`
      SELECT SCHEMA_NAME AS name
      FROM INFORMATION_SCHEMA.SCHEMATA
      WHERE SCHEMA_NAME NOT IN ('sys', 'information_schema', 'guest', 'db_owner', 'db_accessadmin', 
                               'db_securityadmin', 'db_ddladmin', 'db_backupoperator', 
                               'db_datareader', 'db_datawriter', 'db_denydatareader', 'db_denydatawriter')
      ORDER BY SCHEMA_NAME
    `);
    
    console.log('\nAvailable schemas:');
    console.log('-------------------');
    for (const row of schemaResult.recordset) {
      console.log(row.name);
    }
    
  } catch (error) {
    console.error('Error listing tables:', error);
  } finally {
    if (pool) {
      await pool.close();
      console.log('\nDatabase connection closed');
    }
  }
}

// Run the list tables function
listTables().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});