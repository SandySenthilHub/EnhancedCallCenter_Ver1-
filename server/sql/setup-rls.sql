-- Create schema for security functions
CREATE SCHEMA IF NOT EXISTS Security;
GO

-- Create function to verify TenantID
CREATE OR ALTER FUNCTION Security.fn_tenantAccessPredicate(@TenantID INT)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS fn_securitypredicate_result
    WHERE
        DATABASE_PRINCIPAL_ID() = DATABASE_PRINCIPAL_ID('dbo') -- Allow schema owner full access
        OR @TenantID = CAST(SESSION_CONTEXT(N'TenantID') AS INT) -- Restrict based on session context
        OR IS_MEMBER('db_owner') = 1; -- Allow db_owner full access
GO

-- Apply RLS to tables with TenantID
CREATE SECURITY POLICY TenantFilter
ADD FILTER PREDICATE Security.fn_tenantAccessPredicate(TenantID) ON dbo.Users,
ADD FILTER PREDICATE Security.fn_tenantAccessPredicate(TenantID) ON dbo.KpiMetrics,
ADD FILTER PREDICATE Security.fn_tenantAccessPredicate(TenantID) ON dbo.DashboardCustomizations,
ADD FILTER PREDICATE Security.fn_tenantAccessPredicate(TenantID) ON dbo.Calls,
ADD FILTER PREDICATE Security.fn_tenantAccessPredicate(TenantID) ON dbo.MobileTransactions,
ADD FILTER PREDICATE Security.fn_tenantAccessPredicate(TenantID) ON dbo.IvrInteractions,
ADD FILTER PREDICATE Security.fn_tenantAccessPredicate(TenantID) ON dbo.Agents,
ADD FILTER PREDICATE Security.fn_tenantAccessPredicate(TenantID) ON dbo.Alerts
WITH (STATE = ON);
GO

-- Procedure to set TenantID in session context
CREATE OR ALTER PROCEDURE SetTenantContext
    @TenantID INT
AS
BEGIN
    EXEC sp_set_session_context @key = N'TenantID', @value = @TenantID;
END;
GO