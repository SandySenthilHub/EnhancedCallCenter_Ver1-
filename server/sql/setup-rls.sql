-- SQL Script to set up Row-Level Security for Multi-Tenant Architecture

-- Create a database schema for security
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Security')
BEGIN
    EXEC('CREATE SCHEMA Security');
END
GO

-- Create function to get current tenant context
IF OBJECT_ID('Security.GetTenantContext', 'FN') IS NOT NULL
    DROP FUNCTION Security.GetTenantContext;
GO

CREATE FUNCTION Security.GetTenantContext()
RETURNS INT
AS
BEGIN
    DECLARE @TenantID INT;
    
    -- Get the tenant ID from session context if it exists
    SELECT @TenantID = CAST(SESSION_CONTEXT(N'TenantID') AS INT);
    
    -- Return the tenant ID, or -1 if not set
    RETURN ISNULL(@TenantID, -1);
END;
GO

-- Create stored procedure to set tenant context
IF OBJECT_ID('SetTenantContext', 'P') IS NOT NULL
    DROP PROCEDURE SetTenantContext;
GO

CREATE PROCEDURE SetTenantContext
    @TenantID INT
AS
BEGIN
    -- Set the tenant ID in the session context
    EXEC sp_set_session_context @key = N'TenantID', @value = @TenantID;
END;
GO

-- Create a security policy for the Users table
IF EXISTS (SELECT * FROM sys.security_policies WHERE name = 'UserSecurityPolicy')
    DROP SECURITY POLICY UserSecurityPolicy;
GO

IF EXISTS (SELECT * FROM sys.security_predicates WHERE name = 'UserSecurityPredicate')
    DROP FUNCTION Security.UserSecurityPredicate;
GO

CREATE FUNCTION Security.UserSecurityPredicate(@TenantID INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS Result
    WHERE 
        @TenantID = Security.GetTenantContext() -- Match the tenant ID
        OR Security.GetTenantContext() = -1     -- Special case for system operations
        OR IS_MEMBER('db_owner') = 1;          -- Database owners bypass RLS
GO

CREATE SECURITY POLICY UserSecurityPolicy
ADD FILTER PREDICATE Security.UserSecurityPredicate(TenantID) ON dbo.Users,
ADD BLOCK PREDICATE Security.UserSecurityPredicate(TenantID) ON dbo.Users
WITH (STATE = ON);
GO

-- Apply RLS to other tables that have TenantID
-- KPI Metrics
IF EXISTS (SELECT * FROM sys.security_policies WHERE name = 'KpiMetricsSecurityPolicy')
    DROP SECURITY POLICY KpiMetricsSecurityPolicy;
GO

IF EXISTS (SELECT * FROM sys.security_predicates WHERE name = 'KpiMetricsSecurityPredicate')
    DROP FUNCTION Security.KpiMetricsSecurityPredicate;
GO

CREATE FUNCTION Security.KpiMetricsSecurityPredicate(@TenantID INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS Result
    WHERE 
        @TenantID = Security.GetTenantContext() 
        OR Security.GetTenantContext() = -1     
        OR IS_MEMBER('db_owner') = 1;         
GO

CREATE SECURITY POLICY KpiMetricsSecurityPolicy
ADD FILTER PREDICATE Security.KpiMetricsSecurityPredicate(TenantID) ON dbo.KpiMetrics,
ADD BLOCK PREDICATE Security.KpiMetricsSecurityPredicate(TenantID) ON dbo.KpiMetrics
WITH (STATE = ON);
GO

-- Dashboard Customizations
IF EXISTS (SELECT * FROM sys.security_policies WHERE name = 'DashboardCustomizationsSecurityPolicy')
    DROP SECURITY POLICY DashboardCustomizationsSecurityPolicy;
GO

IF EXISTS (SELECT * FROM sys.security_predicates WHERE name = 'DashboardCustomizationsSecurityPredicate')
    DROP FUNCTION Security.DashboardCustomizationsSecurityPredicate;
GO

CREATE FUNCTION Security.DashboardCustomizationsSecurityPredicate(@TenantID INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS Result
    WHERE 
        @TenantID = Security.GetTenantContext() 
        OR Security.GetTenantContext() = -1     
        OR IS_MEMBER('db_owner') = 1;         
GO

CREATE SECURITY POLICY DashboardCustomizationsSecurityPolicy
ADD FILTER PREDICATE Security.DashboardCustomizationsSecurityPredicate(TenantID) ON dbo.DashboardCustomizations,
ADD BLOCK PREDICATE Security.DashboardCustomizationsSecurityPredicate(TenantID) ON dbo.DashboardCustomizations
WITH (STATE = ON);
GO

-- Calls
IF EXISTS (SELECT * FROM sys.security_policies WHERE name = 'CallsSecurityPolicy')
    DROP SECURITY POLICY CallsSecurityPolicy;
GO

IF EXISTS (SELECT * FROM sys.security_predicates WHERE name = 'CallsSecurityPredicate')
    DROP FUNCTION Security.CallsSecurityPredicate;
GO

CREATE FUNCTION Security.CallsSecurityPredicate(@TenantID INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS Result
    WHERE 
        @TenantID = Security.GetTenantContext() 
        OR Security.GetTenantContext() = -1     
        OR IS_MEMBER('db_owner') = 1;         
GO

CREATE SECURITY POLICY CallsSecurityPolicy
ADD FILTER PREDICATE Security.CallsSecurityPredicate(TenantID) ON dbo.Calls,
ADD BLOCK PREDICATE Security.CallsSecurityPredicate(TenantID) ON dbo.Calls
WITH (STATE = ON);
GO

-- Mobile Transactions
IF EXISTS (SELECT * FROM sys.security_policies WHERE name = 'MobileTransactionsSecurityPolicy')
    DROP SECURITY POLICY MobileTransactionsSecurityPolicy;
GO

IF EXISTS (SELECT * FROM sys.security_predicates WHERE name = 'MobileTransactionsSecurityPredicate')
    DROP FUNCTION Security.MobileTransactionsSecurityPredicate;
GO

CREATE FUNCTION Security.MobileTransactionsSecurityPredicate(@TenantID INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS Result
    WHERE 
        @TenantID = Security.GetTenantContext() 
        OR Security.GetTenantContext() = -1     
        OR IS_MEMBER('db_owner') = 1;         
GO

CREATE SECURITY POLICY MobileTransactionsSecurityPolicy
ADD FILTER PREDICATE Security.MobileTransactionsSecurityPredicate(TenantID) ON dbo.MobileTransactions,
ADD BLOCK PREDICATE Security.MobileTransactionsSecurityPredicate(TenantID) ON dbo.MobileTransactions
WITH (STATE = ON);
GO

-- IVR Interactions
IF EXISTS (SELECT * FROM sys.security_policies WHERE name = 'IvrInteractionsSecurityPolicy')
    DROP SECURITY POLICY IvrInteractionsSecurityPolicy;
GO

IF EXISTS (SELECT * FROM sys.security_predicates WHERE name = 'IvrInteractionsSecurityPredicate')
    DROP FUNCTION Security.IvrInteractionsSecurityPredicate;
GO

CREATE FUNCTION Security.IvrInteractionsSecurityPredicate(@TenantID INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS Result
    WHERE 
        @TenantID = Security.GetTenantContext() 
        OR Security.GetTenantContext() = -1     
        OR IS_MEMBER('db_owner') = 1;         
GO

CREATE SECURITY POLICY IvrInteractionsSecurityPolicy
ADD FILTER PREDICATE Security.IvrInteractionsSecurityPredicate(TenantID) ON dbo.IvrInteractions,
ADD BLOCK PREDICATE Security.IvrInteractionsSecurityPredicate(TenantID) ON dbo.IvrInteractions
WITH (STATE = ON);
GO

-- Agents
IF EXISTS (SELECT * FROM sys.security_policies WHERE name = 'AgentsSecurityPolicy')
    DROP SECURITY POLICY AgentsSecurityPolicy;
GO

IF EXISTS (SELECT * FROM sys.security_predicates WHERE name = 'AgentsSecurityPredicate')
    DROP FUNCTION Security.AgentsSecurityPredicate;
GO

CREATE FUNCTION Security.AgentsSecurityPredicate(@TenantID INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS Result
    WHERE 
        @TenantID = Security.GetTenantContext() 
        OR Security.GetTenantContext() = -1     
        OR IS_MEMBER('db_owner') = 1;         
GO

CREATE SECURITY POLICY AgentsSecurityPolicy
ADD FILTER PREDICATE Security.AgentsSecurityPredicate(TenantID) ON dbo.Agents,
ADD BLOCK PREDICATE Security.AgentsSecurityPredicate(TenantID) ON dbo.Agents
WITH (STATE = ON);
GO

-- Alerts
IF EXISTS (SELECT * FROM sys.security_policies WHERE name = 'AlertsSecurityPolicy')
    DROP SECURITY POLICY AlertsSecurityPolicy;
GO

IF EXISTS (SELECT * FROM sys.security_predicates WHERE name = 'AlertsSecurityPredicate')
    DROP FUNCTION Security.AlertsSecurityPredicate;
GO

CREATE FUNCTION Security.AlertsSecurityPredicate(@TenantID INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS Result
    WHERE 
        @TenantID = Security.GetTenantContext() 
        OR Security.GetTenantContext() = -1     
        OR IS_MEMBER('db_owner') = 1;         
GO

CREATE SECURITY POLICY AlertsSecurityPolicy
ADD FILTER PREDICATE Security.AlertsSecurityPredicate(TenantID) ON dbo.Alerts,
ADD BLOCK PREDICATE Security.AlertsSecurityPredicate(TenantID) ON dbo.Alerts
WITH (STATE = ON);
GO

-- ML Models
IF EXISTS (SELECT * FROM sys.security_policies WHERE name = 'MLModelsSecurityPolicy')
    DROP SECURITY POLICY MLModelsSecurityPolicy;
GO

IF EXISTS (SELECT * FROM sys.security_predicates WHERE name = 'MLModelsSecurityPredicate')
    DROP FUNCTION Security.MLModelsSecurityPredicate;
GO

CREATE FUNCTION Security.MLModelsSecurityPredicate(@TenantID INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS Result
    WHERE 
        @TenantID = Security.GetTenantContext() 
        OR Security.GetTenantContext() = -1     
        OR IS_MEMBER('db_owner') = 1;         
GO

CREATE SECURITY POLICY MLModelsSecurityPolicy
ADD FILTER PREDICATE Security.MLModelsSecurityPredicate(TenantID) ON dbo.MLModels,
ADD BLOCK PREDICATE Security.MLModelsSecurityPredicate(TenantID) ON dbo.MLModels
WITH (STATE = ON);
GO

-- Create test to validate RLS
-- Run these commands with different tenant contexts to verify RLS is working
/*
-- Set tenant context to Tenant 1
EXEC SetTenantContext 1;
SELECT * FROM Users;  -- Should only see Tenant 1 users

-- Set tenant context to Tenant 2
EXEC SetTenantContext 2;
SELECT * FROM Users;  -- Should only see Tenant 2 users

-- Clear tenant context
EXEC sp_set_session_context @key = N'TenantID', @value = NULL;
*/