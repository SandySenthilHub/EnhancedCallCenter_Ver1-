const AWS = require('aws-sdk');
const { executeQuery } = require('./sqlUtils');

// AWS Integration Service for GoodContact enhancement
class AWSIntegrationService {
  constructor() {
    // Configure AWS services as per SRS requirements
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    this.lambda = new AWS.Lambda({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    this.cognito = new AWS.CognitoIdentityServiceProvider({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    this.cloudWatch = new AWS.CloudWatch({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    this.bucketName = process.env.AWS_S3_BUCKET || 'goodcontact-voice-storage';
  }

  // S3 Integration for redundant audio file storage
  async uploadToS3(audioBuffer, fileName, metadata = {}) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: `voice-recordings/${fileName}`,
        Body: audioBuffer,
        ContentType: 'audio/wav',
        Metadata: {
          ...metadata,
          uploadedAt: new Date().toISOString(),
          source: 'goodcontact-voice-auth'
        }
      };

      const result = await this.s3.upload(params).promise();
      
      // Log upload to database
      await executeQuery(`
        INSERT INTO AWSStorageLogs (
          fileName, s3Location, uploadTime, fileSize, metadata
        ) VALUES (?, ?, GETDATE(), ?, ?)
      `, [fileName, result.Location, audioBuffer.length, JSON.stringify(metadata)]);

      return {
        success: true,
        location: result.Location,
        key: result.Key,
        bucket: this.bucketName
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error(`Failed to upload to S3: ${error.message}`);
    }
  }

  // Retrieve audio files from S3
  async getFromS3(fileName) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: `voice-recordings/${fileName}`
      };

      const result = await this.s3.getObject(params).promise();
      return {
        success: true,
        data: result.Body,
        metadata: result.Metadata,
        contentType: result.ContentType
      };
    } catch (error) {
      console.error('S3 retrieval error:', error);
      throw new Error(`Failed to retrieve from S3: ${error.message}`);
    }
  }

  // Lambda function for voice processing
  async processVoiceWithLambda(audioData, processingType = 'authentication') {
    try {
      const params = {
        FunctionName: 'goodcontact-voice-processor',
        Payload: JSON.stringify({
          audioData: audioData.toString('base64'),
          processingType,
          timestamp: new Date().toISOString()
        })
      };

      const result = await this.lambda.invoke(params).promise();
      const payload = JSON.parse(result.Payload);

      // Log Lambda processing
      await executeQuery(`
        INSERT INTO LambdaProcessingLogs (
          functionName, processingType, executionTime, success, result
        ) VALUES (?, ?, GETDATE(), ?, ?)
      `, ['goodcontact-voice-processor', processingType, payload.success || false, JSON.stringify(payload)]);

      return payload;
    } catch (error) {
      console.error('Lambda processing error:', error);
      throw new Error(`Lambda processing failed: ${error.message}`);
    }
  }

  // Cognito integration for additional authentication
  async createCognitoUser(userData) {
    try {
      const params = {
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
        Username: userData.username,
        UserAttributes: [
          {
            Name: 'email',
            Value: userData.email
          },
          {
            Name: 'custom:voiceEnabled',
            Value: 'true'
          },
          {
            Name: 'custom:enrollmentDate',
            Value: new Date().toISOString()
          }
        ],
        TemporaryPassword: userData.temporaryPassword,
        MessageAction: 'SUPPRESS'
      };

      const result = await this.cognito.adminCreateUser(params).promise();
      
      // Store Cognito user mapping
      await executeQuery(`
        INSERT INTO CognitoUserMapping (
          cognitoUserId, localUserId, username, createdAt
        ) VALUES (?, ?, ?, GETDATE())
      `, [result.User.Username, userData.localUserId, userData.username]);

      return {
        success: true,
        cognitoUserId: result.User.Username,
        userStatus: result.User.UserStatus
      };
    } catch (error) {
      console.error('Cognito user creation error:', error);
      throw new Error(`Failed to create Cognito user: ${error.message}`);
    }
  }

  // CloudWatch monitoring and logging
  async sendMetricsToCloudWatch(metricData) {
    try {
      const params = {
        Namespace: 'GoodContact/VoiceAuth',
        MetricData: [
          {
            MetricName: metricData.name,
            Value: metricData.value,
            Unit: metricData.unit || 'Count',
            Timestamp: new Date(),
            Dimensions: metricData.dimensions || []
          }
        ]
      };

      await this.cloudWatch.putMetricData(params).promise();
      
      return { success: true };
    } catch (error) {
      console.error('CloudWatch metrics error:', error);
      throw new Error(`Failed to send metrics to CloudWatch: ${error.message}`);
    }
  }

  // CloudWatch alarm setup for system monitoring
  async createCloudWatchAlarm(alarmConfig) {
    try {
      const params = {
        AlarmName: alarmConfig.name,
        AlarmDescription: alarmConfig.description,
        MetricName: alarmConfig.metricName,
        Namespace: 'GoodContact/VoiceAuth',
        Statistic: alarmConfig.statistic || 'Average',
        Period: alarmConfig.period || 300,
        EvaluationPeriods: alarmConfig.evaluationPeriods || 2,
        Threshold: alarmConfig.threshold,
        ComparisonOperator: alarmConfig.comparisonOperator,
        AlarmActions: alarmConfig.alarmActions || []
      };

      await this.cloudWatch.putMetricAlarm(params).promise();
      
      return { success: true, alarmName: alarmConfig.name };
    } catch (error) {
      console.error('CloudWatch alarm creation error:', error);
      throw new Error(`Failed to create CloudWatch alarm: ${error.message}`);
    }
  }

  // Health check for AWS services
  async checkAWSHealth() {
    const healthStatus = {
      s3: false,
      lambda: false,
      cognito: false,
      cloudWatch: false,
      timestamp: new Date().toISOString()
    };

    try {
      // Check S3
      await this.s3.headBucket({ Bucket: this.bucketName }).promise();
      healthStatus.s3 = true;
    } catch (error) {
      console.error('S3 health check failed:', error.message);
    }

    try {
      // Check Lambda
      await this.lambda.listFunctions({ MaxItems: 1 }).promise();
      healthStatus.lambda = true;
    } catch (error) {
      console.error('Lambda health check failed:', error.message);
    }

    try {
      // Check Cognito
      if (process.env.AWS_COGNITO_USER_POOL_ID) {
        await this.cognito.describeUserPool({
          UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID
        }).promise();
        healthStatus.cognito = true;
      }
    } catch (error) {
      console.error('Cognito health check failed:', error.message);
    }

    try {
      // Check CloudWatch
      await this.cloudWatch.listMetrics({ Namespace: 'GoodContact/VoiceAuth', MaxRecords: 1 }).promise();
      healthStatus.cloudWatch = true;
    } catch (error) {
      console.error('CloudWatch health check failed:', error.message);
    }

    // Log health status
    await executeQuery(`
      INSERT INTO AWSHealthLogs (
        s3Status, lambdaStatus, cognitoStatus, cloudWatchStatus, checkTime
      ) VALUES (?, ?, ?, ?, GETDATE())
    `, [healthStatus.s3, healthStatus.lambda, healthStatus.cognito, healthStatus.cloudWatch]);

    return healthStatus;
  }

  // Backup voice data to AWS
  async backupVoiceData(voiceProfileId) {
    try {
      // Get voice profile data
      const [voiceProfile] = await executeQuery(`
        SELECT * FROM VoiceProfiles WHERE voicePrintId = ?
      `, [voiceProfileId]);

      if (!voiceProfile) {
        throw new Error('Voice profile not found');
      }

      // Create backup object
      const backupData = {
        voiceProfile,
        backupDate: new Date().toISOString(),
        version: '1.0'
      };

      // Upload backup to S3
      const backupKey = `backups/voice-profiles/${voiceProfileId}-${Date.now()}.json`;
      const uploadResult = await this.s3.upload({
        Bucket: this.bucketName,
        Key: backupKey,
        Body: JSON.stringify(backupData),
        ContentType: 'application/json'
      }).promise();

      // Log backup
      await executeQuery(`
        INSERT INTO VoiceDataBackups (
          voicePrintId, backupLocation, backupDate, success
        ) VALUES (?, ?, GETDATE(), 1)
      `, [voiceProfileId, uploadResult.Location]);

      return {
        success: true,
        backupLocation: uploadResult.Location,
        backupKey
      };
    } catch (error) {
      console.error('Voice data backup error:', error);
      throw new Error(`Failed to backup voice data: ${error.message}`);
    }
  }
}

module.exports = AWSIntegrationService;