const express = require('express');
const multer = require('multer');
const VoiceAuthService = require('./voiceAuth');
const AWSIntegrationService = require('./awsIntegration');
const TranscriptionService = require('./transcriptionService');
const { executeQuery } = require('./sqlUtils');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize services
const voiceAuth = new VoiceAuthService();
const awsService = new AWSIntegrationService();
const transcriptionService = new TranscriptionService();

// Voice Authentication Routes - Core GoodContact functionality

// Voice Enrollment endpoint
router.post('/voice/enroll', upload.single('audioFile'), async (req, res) => {
  try {
    const { userId, userName } = req.body;
    const audioBuffer = req.file.buffer;

    if (!audioBuffer || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Audio file and user ID are required'
      });
    }

    // Process voice enrollment
    const enrollmentResult = await voiceAuth.enrollVoice({
      userId,
      userName,
      audioBuffer
    });

    // Upload to AWS S3 for backup
    await awsService.uploadToS3(
      audioBuffer,
      `enrollment-${userId}-${Date.now()}.wav`,
      { userId, userName, type: 'enrollment' }
    );

    res.json(enrollmentResult);
  } catch (error) {
    console.error('Voice enrollment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Voice Authentication endpoint
router.post('/voice/authenticate', upload.single('audioFile'), async (req, res) => {
  try {
    const { userId } = req.body;
    const audioBuffer = req.file.buffer;

    if (!audioBuffer || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Audio file and user ID are required'
      });
    }

    // Process voice authentication
    const authResult = await voiceAuth.authenticateVoice({
      userId,
      audioBuffer
    });

    // Process with AWS Lambda for additional analysis
    const lambdaResult = await awsService.processVoiceWithLambda(
      audioBuffer,
      'authentication'
    );

    res.json({
      ...authResult,
      lambdaAnalysis: lambdaResult
    });
  } catch (error) {
    console.error('Voice authentication error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Speaker Identification for Call Centers
router.post('/voice/identify-speaker', upload.single('audioFile'), async (req, res) => {
  try {
    const { callId } = req.body;
    const audioBuffer = req.file.buffer;

    if (!audioBuffer || !callId) {
      return res.status(400).json({
        success: false,
        message: 'Audio file and call ID are required'
      });
    }

    // Identify speaker
    const identificationResult = await voiceAuth.identifySpeaker(audioBuffer, callId);

    // Store audio in AWS S3
    await awsService.uploadToS3(
      audioBuffer,
      `speaker-id-${callId}-${Date.now()}.wav`,
      { callId, type: 'speaker-identification' }
    );

    res.json(identificationResult);
  } catch (error) {
    console.error('Speaker identification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Transcription Routes - Deepgram Integration

// Transcribe from Azure Blob
router.post('/transcription/azure-blob', async (req, res) => {
  try {
    const { blobUrl, callId, options } = req.body;

    if (!blobUrl || !callId) {
      return res.status(400).json({
        success: false,
        message: 'Blob URL and call ID are required'
      });
    }

    const transcriptionResult = await transcriptionService.transcribeFromAzureBlob(
      blobUrl,
      callId,
      options
    );

    res.json(transcriptionResult);
  } catch (error) {
    console.error('Azure blob transcription error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Transcribe uploaded file
router.post('/transcription/upload', upload.single('audioFile'), async (req, res) => {
  try {
    const { callId, options } = req.body;
    const audioBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    if (!audioBuffer || !callId) {
      return res.status(400).json({
        success: false,
        message: 'Audio file and call ID are required'
      });
    }

    const transcriptionResult = await transcriptionService.transcribeUploadedFile(
      audioBuffer,
      fileName,
      callId,
      options ? JSON.parse(options) : {}
    );

    res.json(transcriptionResult);
  } catch (error) {
    console.error('File transcription error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Real-time transcription setup
router.post('/transcription/realtime/start', async (req, res) => {
  try {
    const { callId } = req.body;

    if (!callId) {
      return res.status(400).json({
        success: false,
        message: 'Call ID is required'
      });
    }

    const realtimeResult = await transcriptionService.startRealtimeTranscription(callId);
    res.json(realtimeResult);
  } catch (error) {
    console.error('Real-time transcription setup error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Analytics and Reporting Routes

// Voice authentication analytics
router.get('/analytics/voice-auth', async (req, res) => {
  try {
    const { dateRange = 7 } = req.query;

    const analytics = await executeQuery(`
      SELECT 
        COUNT(*) as totalAttempts,
        COUNT(CASE WHEN result = 'SUCCESS' THEN 1 END) as successfulAuth,
        COUNT(CASE WHEN result = 'FAILED' THEN 1 END) as failedAuth,
        AVG(confidence) as avgConfidence,
        COUNT(DISTINCT userId) as uniqueUsers
      FROM AuthenticationLogs 
      WHERE timestamp > DATEADD(day, -?, GETDATE())
    `, [dateRange]);

    const hourlyStats = await executeQuery(`
      SELECT 
        DATEPART(hour, timestamp) as hour,
        COUNT(*) as attempts,
        COUNT(CASE WHEN result = 'SUCCESS' THEN 1 END) as successes
      FROM AuthenticationLogs 
      WHERE timestamp > DATEADD(day, -?, GETDATE())
      GROUP BY DATEPART(hour, timestamp)
      ORDER BY hour
    `, [dateRange]);

    res.json({
      summary: analytics[0],
      hourlyStats,
      dateRange: parseInt(dateRange)
    });
  } catch (error) {
    console.error('Voice auth analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Transcription analytics
router.get('/analytics/transcription', async (req, res) => {
  try {
    const { dateRange = 7 } = req.query;
    const analytics = await transcriptionService.getTranscriptionAnalytics(dateRange);
    res.json(analytics);
  } catch (error) {
    console.error('Transcription analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Fraud detection alerts
router.get('/security/fraud-alerts', async (req, res) => {
  try {
    const { status = 'ACTIVE', limit = 50 } = req.query;

    const alerts = await executeQuery(`
      SELECT fa.*, vp.userName
      FROM FraudAlerts fa
      LEFT JOIN VoiceProfiles vp ON fa.userId = vp.userId
      WHERE fa.status = ?
      ORDER BY fa.timestamp DESC
      OFFSET 0 ROWS FETCH NEXT ? ROWS ONLY
    `, [status, limit]);

    res.json({
      alerts,
      count: alerts.length
    });
  } catch (error) {
    console.error('Fraud alerts error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// AWS Health Check
router.get('/aws/health', async (req, res) => {
  try {
    const healthStatus = await awsService.checkAWSHealth();
    res.json(healthStatus);
  } catch (error) {
    console.error('AWS health check error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Call Center Management Routes

// Get active calls with voice data
router.get('/callcenter/active-calls', async (req, res) => {
  try {
    const activeCalls = await executeQuery(`
      SELECT 
        c.callId,
        c.customerPhone,
        c.agentId,
        c.startTime,
        c.status,
        vp.userName as identifiedSpeaker,
        sil.confidence as speakerConfidence,
        t.transcript,
        sa.overallSentiment
      FROM ActiveCalls c
      LEFT JOIN SpeakerIdentificationLogs sil ON c.callId = sil.callId
      LEFT JOIN VoiceProfiles vp ON sil.identifiedUserId = vp.userId
      LEFT JOIN Transcriptions t ON c.callId = t.callId
      LEFT JOIN SentimentAnalysis sa ON t.id = sa.transcriptionId
      WHERE c.status = 'ACTIVE'
      ORDER BY c.startTime DESC
    `);

    res.json({
      activeCalls,
      count: activeCalls.length
    });
  } catch (error) {
    console.error('Active calls error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get call recordings with transcription
router.get('/callcenter/recordings', async (req, res) => {
  try {
    const { dateRange = 7, limit = 100 } = req.query;

    const recordings = await executeQuery(`
      SELECT 
        r.recordingId,
        r.callId,
        r.fileName,
        r.duration,
        r.recordingDate,
        r.fileLocation,
        t.transcript,
        t.confidence as transcriptionConfidence,
        sa.overallSentiment
      FROM CallRecordings r
      LEFT JOIN Transcriptions t ON r.callId = t.callId
      LEFT JOIN SentimentAnalysis sa ON t.id = sa.transcriptionId
      WHERE r.recordingDate > DATEADD(day, -?, GETDATE())
      ORDER BY r.recordingDate DESC
      OFFSET 0 ROWS FETCH NEXT ? ROWS ONLY
    `, [dateRange, limit]);

    res.json({
      recordings,
      count: recordings.length
    });
  } catch (error) {
    console.error('Recordings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Search functionality
router.get('/search/transcriptions', async (req, res) => {
  try {
    const { query, filters = '{}' } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchResults = await transcriptionService.searchTranscriptions(
      query,
      JSON.parse(filters)
    );

    res.json(searchResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// System Status and Monitoring
router.get('/system/status', async (req, res) => {
  try {
    // Check database connection
    await executeQuery('SELECT 1');

    // Check AWS services
    const awsHealth = await awsService.checkAWSHealth();

    // Get system metrics
    const metrics = await executeQuery(`
      SELECT 
        (SELECT COUNT(*) FROM VoiceProfiles WHERE isActive = 1) as activeProfiles,
        (SELECT COUNT(*) FROM AuthenticationLogs WHERE timestamp > DATEADD(hour, -1, GETDATE())) as authLastHour,
        (SELECT COUNT(*) FROM Transcriptions WHERE createdAt > DATEADD(hour, -1, GETDATE())) as transcriptionsLastHour,
        (SELECT COUNT(*) FROM FraudAlerts WHERE status = 'ACTIVE') as activeFraudAlerts
    `);

    res.json({
      status: 'operational',
      database: 'connected',
      aws: awsHealth,
      metrics: metrics[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('System status error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;