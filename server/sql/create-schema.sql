-- Database schema for Call Center and Mobile Banking Analytics Platform

-- Enable Row-Level Security (RLS)
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'security')
BEGIN
    EXEC('CREATE SCHEMA security');
END;

-- Create Tenants table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tenants')
BEGIN
    CREATE TABLE Tenants (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        code NVARCHAR(50) NOT NULL,
        isActive BIT NOT NULL DEFAULT 1,
        createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
    
    -- Insert default tenants
    INSERT INTO Tenants (name, code, isActive)
    VALUES 
        ('X Bank', 'XBANK', 1),
        ('Y Bank', 'YBANK', 1);
END;

-- Create Users table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL,
        passwordHash NVARCHAR(255) NULL,
        displayName NVARCHAR(100) NOT NULL,
        email NVARCHAR(255) NULL,
        role NVARCHAR(50) NOT NULL,
        tenantId INT NOT NULL,
        isActive BIT NOT NULL DEFAULT 1,
        createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Users_Tenants FOREIGN KEY (tenantId) REFERENCES Tenants(id)
    );
    
    -- Insert default users
    INSERT INTO Users (username, displayName, role, tenantId)
    VALUES 
        ('admin', 'Admin User', 'admin', 1),
        ('manager', 'Manager User', 'manager', 1),
        ('analyst', 'Analyst User', 'analyst', 1),
        ('admin2', 'Admin User', 'admin', 2),
        ('manager2', 'Manager User', 'manager', 2),
        ('analyst2', 'Analyst User', 'analyst', 2);
END;

-- Create KpiCategories table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'KpiCategories')
BEGIN
    CREATE TABLE KpiCategories (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        description NVARCHAR(MAX) NULL,
        type NVARCHAR(50) NOT NULL,
        createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
    
    -- Insert default KPI categories
    INSERT INTO KpiCategories (name, description, type)
    VALUES 
        ('Performance', 'Key performance indicators for contact center', 'contact_center'),
        ('Quality', 'Call quality and customer satisfaction metrics', 'contact_center'),
        ('Efficiency', 'Operational efficiency metrics', 'contact_center'),
        ('Usage', 'App usage and user engagement metrics', 'mobile_banking'),
        ('Transactions', 'Financial transaction metrics', 'mobile_banking'),
        ('Technical', 'Technical performance metrics', 'mobile_banking');
END;

-- Create KpiMetrics table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'KpiMetrics')
BEGIN
    CREATE TABLE KpiMetrics (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tenantId INT NOT NULL,
        kpiId NVARCHAR(50) NOT NULL,
        name NVARCHAR(100) NOT NULL,
        description NVARCHAR(MAX) NULL,
        type NVARCHAR(50) NOT NULL,
        priority NVARCHAR(20) NOT NULL,
        unit NVARCHAR(20) NOT NULL,
        value FLOAT NULL,
        target FLOAT NOT NULL,
        threshold FLOAT NOT NULL,
        categoryId INT NULL,
        timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_KpiMetrics_Tenants FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        CONSTRAINT FK_KpiMetrics_KpiCategories FOREIGN KEY (categoryId) REFERENCES KpiCategories(id)
    );
    
    CREATE INDEX IX_KpiMetrics_TenantId ON KpiMetrics(tenantId);
    CREATE INDEX IX_KpiMetrics_KpiId ON KpiMetrics(kpiId);
    CREATE INDEX IX_KpiMetrics_Type ON KpiMetrics(type);
    CREATE INDEX IX_KpiMetrics_Priority ON KpiMetrics(priority);
END;

-- Create DashboardCustomizations table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'DashboardCustomizations')
BEGIN
    CREATE TABLE DashboardCustomizations (
        id INT IDENTITY(1,1) PRIMARY KEY,
        userId INT NOT NULL,
        tenantId INT NOT NULL,
        settings NVARCHAR(MAX) NOT NULL,
        createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_DashboardCustomizations_Users FOREIGN KEY (userId) REFERENCES Users(id),
        CONSTRAINT FK_DashboardCustomizations_Tenants FOREIGN KEY (tenantId) REFERENCES Tenants(id)
    );
    
    CREATE INDEX IX_DashboardCustomizations_UserId ON DashboardCustomizations(userId);
    CREATE INDEX IX_DashboardCustomizations_TenantId ON DashboardCustomizations(tenantId);
END;

-- Create Calls table for contact center data
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Calls')
BEGIN
    CREATE TABLE Calls (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tenantId INT NOT NULL,
        callId NVARCHAR(100) NOT NULL,
        agentId INT NULL,
        customerId NVARCHAR(100) NULL,
        startTime DATETIME2 NOT NULL,
        endTime DATETIME2 NULL,
        duration INT NULL,
        direction NVARCHAR(20) NOT NULL,
        callType NVARCHAR(50) NULL,
        phoneNumber NVARCHAR(20) NULL,
        status NVARCHAR(20) NOT NULL,
        recordingUrl NVARCHAR(255) NULL,
        notes NVARCHAR(MAX) NULL,
        createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Calls_Tenants FOREIGN KEY (tenantId) REFERENCES Tenants(id)
    );
    
    CREATE INDEX IX_Calls_TenantId ON Calls(tenantId);
    CREATE INDEX IX_Calls_CallId ON Calls(callId);
    CREATE INDEX IX_Calls_StartTime ON Calls(startTime);
END;

-- Create CallTranscriptions table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CallTranscriptions')
BEGIN
    CREATE TABLE CallTranscriptions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        callId INT NOT NULL,
        text NVARCHAR(MAX) NOT NULL,
        language NVARCHAR(10) NOT NULL DEFAULT 'en-US',
        speakerType NVARCHAR(20) NULL,
        sentiment FLOAT NULL,
        startTime INT NULL,
        endTime INT NULL,
        createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_CallTranscriptions_Calls FOREIGN KEY (callId) REFERENCES Calls(id)
    );
    
    CREATE INDEX IX_CallTranscriptions_CallId ON CallTranscriptions(callId);
END;

-- Create MobileTransactions table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MobileTransactions')
BEGIN
    CREATE TABLE MobileTransactions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tenantId INT NOT NULL,
        transactionId NVARCHAR(100) NOT NULL,
        userId NVARCHAR(100) NOT NULL,
        type NVARCHAR(50) NOT NULL,
        amount DECIMAL(18, 2) NULL,
        currency NVARCHAR(3) NULL,
        status NVARCHAR(20) NOT NULL,
        merchantCategory NVARCHAR(50) NULL,
        deviceType NVARCHAR(50) NULL,
        appVersion NVARCHAR(20) NULL,
        latitude FLOAT NULL,
        longitude FLOAT NULL,
        timestamp DATETIME2 NOT NULL,
        processingTime INT NULL,
        createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_MobileTransactions_Tenants FOREIGN KEY (tenantId) REFERENCES Tenants(id)
    );
    
    CREATE INDEX IX_MobileTransactions_TenantId ON MobileTransactions(tenantId);
    CREATE INDEX IX_MobileTransactions_TransactionId ON MobileTransactions(transactionId);
    CREATE INDEX IX_MobileTransactions_Timestamp ON MobileTransactions(timestamp);
END;

-- Create IvrInteractions table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'IvrInteractions')
BEGIN
    CREATE TABLE IvrInteractions (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tenantId INT NOT NULL,
        sessionId NVARCHAR(100) NOT NULL,
        callId NVARCHAR(100) NULL,
        customerId NVARCHAR(100) NULL,
        startTime DATETIME2 NOT NULL,
        endTime DATETIME2 NULL,
        duration INT NULL,
        pathTaken NVARCHAR(MAX) NULL,
        exitPoint NVARCHAR(50) NULL,
        language NVARCHAR(10) NULL,
        successful BIT NULL,
        createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_IvrInteractions_Tenants FOREIGN KEY (tenantId) REFERENCES Tenants(id)
    );
    
    CREATE INDEX IX_IvrInteractions_TenantId ON IvrInteractions(tenantId);
    CREATE INDEX IX_IvrInteractions_SessionId ON IvrInteractions(sessionId);
    CREATE INDEX IX_IvrInteractions_StartTime ON IvrInteractions(startTime);
END;

-- Create Agents table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Agents')
BEGIN
    CREATE TABLE Agents (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tenantId INT NOT NULL,
        agentId NVARCHAR(50) NOT NULL,
        name NVARCHAR(100) NOT NULL,
        email NVARCHAR(255) NULL,
        department NVARCHAR(50) NULL,
        skills NVARCHAR(MAX) NULL,
        isActive BIT NOT NULL DEFAULT 1,
        createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Agents_Tenants FOREIGN KEY (tenantId) REFERENCES Tenants(id)
    );
    
    CREATE INDEX IX_Agents_TenantId ON Agents(tenantId);
    CREATE INDEX IX_Agents_AgentId ON Agents(agentId);
END;

-- Create Alerts table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Alerts')
BEGIN
    CREATE TABLE Alerts (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tenantId INT NOT NULL,
        kpiId NVARCHAR(50) NOT NULL,
        title NVARCHAR(255) NOT NULL,
        message NVARCHAR(MAX) NULL,
        severity NVARCHAR(20) NOT NULL,
        timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        isRead BIT NOT NULL DEFAULT 0,
        createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Alerts_Tenants FOREIGN KEY (tenantId) REFERENCES Tenants(id)
    );
    
    CREATE INDEX IX_Alerts_TenantId ON Alerts(tenantId);
    CREATE INDEX IX_Alerts_KpiId ON Alerts(kpiId);
    CREATE INDEX IX_Alerts_Timestamp ON Alerts(timestamp);
END;