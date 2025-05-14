-- Setup Row-Level Security (RLS) for multi-tenancy

-- Create security schema if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'security')
BEGIN
    EXEC('CREATE SCHEMA security');
END;

-- Create a function for filtering by tenant ID
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'security.fn_tenantAccessPredicate') AND type in (N'FN', N'IF', N'TF', N'FS', N'FT'))
BEGIN
    EXEC('
    CREATE FUNCTION security.fn_tenantAccessPredicate(@TenantId int)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN
    (
        -- Access is granted if the user is part of the tenant
        -- or if the user has the CONTROL SERVER permission (typically admin)
        SELECT 1 AS hasAccess
        WHERE SESSION_CONTEXT(N''TenantId'') = CAST(@TenantId as nvarchar(50))
        OR IS_MEMBER(''db_owner'') = 1
        OR IS_MEMBER(''db_datawriter'') = 1
        OR HAS_PERMS_BY_NAME(NULL, NULL, ''CONTROL SERVER'') = 1
    )
    ');
END;

-- Apply RLS to tables with tenantId column

-- Users table
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.security_policies WHERE name = 'RLS_Users_Policy')
    BEGIN
        CREATE SECURITY POLICY RLS_Users_Policy
        ADD FILTER PREDICATE security.fn_tenantAccessPredicate(tenantId) ON dbo.Users
        WITH (STATE = ON);
    END;
END;

-- KpiMetrics table
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'KpiMetrics')
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.security_policies WHERE name = 'RLS_KpiMetrics_Policy')
    BEGIN
        CREATE SECURITY POLICY RLS_KpiMetrics_Policy
        ADD FILTER PREDICATE security.fn_tenantAccessPredicate(tenantId) ON dbo.KpiMetrics
        WITH (STATE = ON);
    END;
END;

-- DashboardCustomizations table
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'DashboardCustomizations')
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.security_policies WHERE name = 'RLS_DashboardCustomizations_Policy')
    BEGIN
        CREATE SECURITY POLICY RLS_DashboardCustomizations_Policy
        ADD FILTER PREDICATE security.fn_tenantAccessPredicate(tenantId) ON dbo.DashboardCustomizations
        WITH (STATE = ON);
    END;
END;

-- Calls table
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Calls')
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.security_policies WHERE name = 'RLS_Calls_Policy')
    BEGIN
        CREATE SECURITY POLICY RLS_Calls_Policy
        ADD FILTER PREDICATE security.fn_tenantAccessPredicate(tenantId) ON dbo.Calls
        WITH (STATE = ON);
    END;
END;

-- MobileTransactions table
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'MobileTransactions')
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.security_policies WHERE name = 'RLS_MobileTransactions_Policy')
    BEGIN
        CREATE SECURITY POLICY RLS_MobileTransactions_Policy
        ADD FILTER PREDICATE security.fn_tenantAccessPredicate(tenantId) ON dbo.MobileTransactions
        WITH (STATE = ON);
    END;
END;

-- IvrInteractions table
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'IvrInteractions')
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.security_policies WHERE name = 'RLS_IvrInteractions_Policy')
    BEGIN
        CREATE SECURITY POLICY RLS_IvrInteractions_Policy
        ADD FILTER PREDICATE security.fn_tenantAccessPredicate(tenantId) ON dbo.IvrInteractions
        WITH (STATE = ON);
    END;
END;

-- Agents table
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Agents')
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.security_policies WHERE name = 'RLS_Agents_Policy')
    BEGIN
        CREATE SECURITY POLICY RLS_Agents_Policy
        ADD FILTER PREDICATE security.fn_tenantAccessPredicate(tenantId) ON dbo.Agents
        WITH (STATE = ON);
    END;
END;

-- Alerts table
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Alerts')
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.security_policies WHERE name = 'RLS_Alerts_Policy')
    BEGIN
        CREATE SECURITY POLICY RLS_Alerts_Policy
        ADD FILTER PREDICATE security.fn_tenantAccessPredicate(tenantId) ON dbo.Alerts
        WITH (STATE = ON);
    END;
END;

-- Create a procedure to set the tenant context
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.sp_setTenantContext') AND type in (N'P', N'PC'))
BEGIN
    EXEC('
    CREATE PROCEDURE dbo.sp_setTenantContext
        @TenantId int
    AS
    BEGIN
        EXEC sp_set_session_context @key = N''TenantId'', @value = @TenantId;
    END
    ');
END;