-- Create Tables for Contact Center and Mobile Banking Analytics Platform

-- Tenants Table
CREATE TABLE Tenants (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Code NVARCHAR(20) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1
);

-- Users Table
CREATE TABLE Users (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    DisplayName NVARCHAR(100) NOT NULL,
    Role NVARCHAR(20) NOT NULL,
    TenantID INT NOT NULL,
    CONSTRAINT FK_Users_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(ID)
);

-- KPI Categories Table
CREATE TABLE KpiCategories (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- contact_center, mobile_banking
    Priority NVARCHAR(20) NOT NULL -- critical, medium, low
);

-- KPI Metrics Table
CREATE TABLE KpiMetrics (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    TenantID INT NOT NULL,
    CategoryID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Value FLOAT NOT NULL,
    Target FLOAT NOT NULL,
    Threshold FLOAT NOT NULL,
    Unit NVARCHAR(20) NOT NULL,
    Trend NVARCHAR(20) NOT NULL, -- up, down, stable
    TrendValue FLOAT NULL,
    Date DATETIME NOT NULL,
    CONSTRAINT FK_KpiMetrics_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(ID),
    CONSTRAINT FK_KpiMetrics_Categories FOREIGN KEY (CategoryID) REFERENCES KpiCategories(ID)
);

-- Dashboard Customizations Table
CREATE TABLE DashboardCustomizations (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    TenantID INT NOT NULL,
    DashboardConfig NVARCHAR(MAX) NOT NULL,
    LastUpdated DATETIME NOT NULL,
    CONSTRAINT FK_DashboardCustomizations_Users FOREIGN KEY (UserID) REFERENCES Users(ID),
    CONSTRAINT FK_DashboardCustomizations_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(ID)
);

-- Agents Table
CREATE TABLE Agents (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    TenantID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    ShiftID INT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Agents_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(ID)
);

-- Calls Table
CREATE TABLE Calls (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    TenantID INT NOT NULL,
    AgentID INT NOT NULL,
    CallType NVARCHAR(20) NOT NULL, -- inbound, outbound
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    Duration INT NOT NULL, -- in seconds
    Language NVARCHAR(20) NOT NULL, -- english, arabic
    IsCompleted BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Calls_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(ID),
    CONSTRAINT FK_Calls_Agents FOREIGN KEY (AgentID) REFERENCES Agents(ID)
);

-- Call Transcriptions Table
CREATE TABLE CallTranscriptions (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    CallID INT NOT NULL,
    TranscriptText NVARCHAR(MAX) NOT NULL,
    SentimentScore FLOAT NULL,
    KeyPhrases NVARCHAR(MAX) NULL,
    Entities NVARCHAR(MAX) NULL,
    Tone NVARCHAR(50) NULL, -- positive, negative, neutral
    SpeakerDiarization NVARCHAR(MAX) NULL,
    Intent NVARCHAR(100) NULL,
    CONSTRAINT FK_CallTranscriptions_Calls FOREIGN KEY (CallID) REFERENCES Calls(ID)
);

-- Mobile Transactions Table
CREATE TABLE MobileTransactions (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    TenantID INT NOT NULL,
    UserID INT NOT NULL,
    TransactionType NVARCHAR(50) NOT NULL, -- transfer, bill_payment, withdrawal, deposit
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    Amount DECIMAL(18, 2) NULL,
    Status NVARCHAR(20) NOT NULL, -- completed, failed, pending
    DeviceType NVARCHAR(20) NOT NULL, -- ios, android
    SentimentScore FLOAT NULL,
    KeyPhrases NVARCHAR(MAX) NULL,
    Entities NVARCHAR(MAX) NULL,
    CONSTRAINT FK_MobileTransactions_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(ID),
    CONSTRAINT FK_MobileTransactions_Users FOREIGN KEY (UserID) REFERENCES Users(ID)
);

-- IVR Interactions Table
CREATE TABLE IvrInteractions (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    CallID INT NOT NULL,
    TenantID INT NOT NULL,
    NodeSequence NVARCHAR(MAX) NOT NULL,
    DropOffNode NVARCHAR(100) NULL,
    InteractionTime INT NOT NULL, -- in seconds
    StartTime DATETIME NOT NULL,
    Intent NVARCHAR(100) NULL,
    CONSTRAINT FK_IvrInteractions_Calls FOREIGN KEY (CallID) REFERENCES Calls(ID),
    CONSTRAINT FK_IvrInteractions_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(ID)
);

-- Alerts Table
CREATE TABLE Alerts (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    TenantID INT NOT NULL,
    AlertType NVARCHAR(50) NOT NULL, -- kpi_threshold, app_error, ml_model
    Message NVARCHAR(MAX) NOT NULL,
    Timestamp DATETIME NOT NULL,
    Severity NVARCHAR(20) NOT NULL, -- high, medium, low
    Status NVARCHAR(20) NOT NULL, -- active, acknowledged, resolved
    CONSTRAINT FK_Alerts_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(ID)
);

-- ML Models Table
CREATE TABLE MLModels (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    TenantID INT NOT NULL,
    ModelName NVARCHAR(100) NOT NULL,
    ModelType NVARCHAR(50) NOT NULL, -- regression, clustering, anomaly
    ModelVersion NVARCHAR(20) NOT NULL,
    Accuracy FLOAT NOT NULL,
    Status NVARCHAR(20) NOT NULL, -- active, training, error
    TrainedDate DATETIME NOT NULL,
    LastPredictionDate DATETIME NULL,
    ModelPath NVARCHAR(255) NOT NULL,
    CONSTRAINT FK_MLModels_Tenants FOREIGN KEY (TenantID) REFERENCES Tenants(ID)
);

-- Synthetic Data Logs Table
CREATE TABLE SyntheticDataLogs (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    DataType NVARCHAR(50) NOT NULL, -- call, transaction, transcription, ivr
    RecordsGenerated INT NOT NULL,
    GeneratedAt DATETIME NOT NULL,
    Parameters NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(20) NOT NULL -- completed, failed
);

-- Insert initial Tenants
INSERT INTO Tenants (Name, Code, IsActive) 
VALUES ('X Bank', 'XBANK', 1),
       ('Y Bank', 'YBANK', 1);

-- Insert initial users
INSERT INTO Users (Username, DisplayName, Role, TenantID)
VALUES 
    ('admin', 'Admin', 'admin', 1),
    ('hameed', 'Hameed', 'manager', 1),
    ('rishi', 'Rishi', 'analyst', 1),
    ('admin_y', 'Admin', 'admin', 2),
    ('hameed_y', 'Hameed', 'manager', 2),
    ('rishi_y', 'Rishi', 'analyst', 2);

-- Insert KPI Categories
INSERT INTO KpiCategories (Name, Type, Priority)
VALUES 
    ('Efficiency', 'contact_center', 'critical'),
    ('Quality', 'contact_center', 'critical'),
    ('Usage', 'mobile_banking', 'critical'),
    ('Performance', 'mobile_banking', 'critical');

-- Insert initial Agents
INSERT INTO Agents (TenantID, Name, ShiftID, IsActive)
VALUES 
    (1, 'Mohammed A.', 1, 1),
    (1, 'Sarah K.', 1, 1),
    (1, 'Ahmed R.', 2, 1),
    (1, 'Fatima H.', 2, 1),
    (1, 'Omar Y.', 3, 1);