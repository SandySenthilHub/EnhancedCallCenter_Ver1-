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

// Function to test the connection
async function testSqlConnection() {
  console.log('Testing SQL Server connection...');
  console.log('Connection Parameters:');
  console.log(`Server: ${sqlConfig.server}`);
  console.log(`Database: ${sqlConfig.database}`);
  console.log(`User: ${sqlConfig.user}`);
  console.log(`Port: ${sqlConfig.options.port}`);
  
  try {
    console.log('Attempting to connect...');
    const pool = await sql.connect(sqlConfig);
    console.log('Connection successful!');
    
    // Test a simple query to verify full connectivity
    console.log('Executing test query...');
    const result = await pool.request().query('SELECT @@VERSION AS Version');
    console.log('Query executed successfully');
    console.log(`SQL Server Version: ${result.recordset[0].Version}`);
    
    // Close the connection
    await pool.close();
    console.log('Connection closed');
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
}

// Run the test
testSqlConnection()
  .then(success => {
    if (success) {
      console.log('SQL Server connection test completed successfully.');
    } else {
      console.log('SQL Server connection test failed.');
    }
  })
  .catch(err => {
    console.error('Error in test execution:', err);
  });