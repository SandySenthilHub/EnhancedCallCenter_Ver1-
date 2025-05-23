const { db } = require('./db');
const { executeQuery } = require('./sqlUtils');
const axios = require('axios');
const crypto = require('crypto');

// Voice Authentication Service based on GoodContact requirements
class VoiceAuthService {
  constructor() {
    this.deepgramApiKey = process.env.DEEPGRAM_API_KEY || '9439264b3d03acbfd50fa23a896b8b1644032e6d';
    this.defaultPrompt = "My name is .... I am a computer engineer. I am great";
    this.confidenceThreshold = 0.8;
  }

  // Voice Enrollment Process
  async enrollVoice(userData) {
    try {
      const { userId, audioBuffer, userName } = userData;
      
      // Generate unique voice print ID
      const voicePrintId = crypto.randomUUID();
      
      // Process audio with Deepgram for voice analysis
      const voiceFeatures = await this.extractVoiceFeatures(audioBuffer);
      
      // Store voice profile in database
      const enrollmentResult = await executeQuery(`
        INSERT INTO VoiceProfiles (
          voicePrintId, userId, userName, voiceFeatures, 
          enrollmentDate, isActive, confidenceScore
        ) VALUES (?, ?, ?, ?, GETDATE(), 1, ?)
      `, [voicePrintId, userId, userName, JSON.stringify(voiceFeatures), voiceFeatures.confidence || 0.9]);

      // Log enrollment activity
      await this.logAuthActivity(userId, 'ENROLLMENT', 'SUCCESS', voiceFeatures.confidence);

      return {
        success: true,
        voicePrintId,
        confidence: voiceFeatures.confidence,
        message: 'Voice enrollment completed successfully'
      };
    } catch (error) {
      console.error('Voice enrollment error:', error);
      await this.logAuthActivity(userData.userId, 'ENROLLMENT', 'FAILED', 0);
      throw new Error(`Enrollment failed: ${error.message}`);
    }
  }

  // Voice Authentication Process
  async authenticateVoice(authData) {
    try {
      const { userId, audioBuffer } = authData;
      
      // Extract voice features from audio
      const currentFeatures = await this.extractVoiceFeatures(audioBuffer);
      
      // Retrieve stored voice profile
      const [storedProfile] = await executeQuery(`
        SELECT voicePrintId, voiceFeatures, userName 
        FROM VoiceProfiles 
        WHERE userId = ? AND isActive = 1
      `, [userId]);

      if (!storedProfile) {
        await this.logAuthActivity(userId, 'AUTHENTICATION', 'NO_PROFILE', 0);
        return {
          success: false,
          confidence: 0,
          message: 'No voice profile found for user'
        };
      }

      // Compare voice features
      const confidence = await this.compareVoiceFeatures(
        currentFeatures, 
        JSON.parse(storedProfile.voiceFeatures)
      );

      const isAuthenticated = confidence >= this.confidenceThreshold;
      
      // Log authentication attempt
      await this.logAuthActivity(
        userId, 
        'AUTHENTICATION', 
        isAuthenticated ? 'SUCCESS' : 'FAILED', 
        confidence
      );

      // Check for fraud patterns
      if (isAuthenticated) {
        await this.checkForFraud(userId, confidence);
      }

      return {
        success: isAuthenticated,
        confidence,
        voicePrintId: storedProfile.voicePrintId,
        userName: storedProfile.userName,
        message: isAuthenticated ? 'Authentication successful' : 'Authentication failed'
      };
    } catch (error) {
      console.error('Voice authentication error:', error);
      await this.logAuthActivity(authData.userId, 'AUTHENTICATION', 'ERROR', 0);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  // Speaker Identification for Call Centers
  async identifySpeaker(audioBuffer, callId) {
    try {
      // Extract voice features
      const voiceFeatures = await this.extractVoiceFeatures(audioBuffer);
      
      // Search for matching voice profiles
      const profiles = await executeQuery(`
        SELECT voicePrintId, userId, userName, voiceFeatures 
        FROM VoiceProfiles 
        WHERE isActive = 1
      `);

      let bestMatch = null;
      let bestConfidence = 0;

      // Compare against all profiles
      for (const profile of profiles) {
        const confidence = await this.compareVoiceFeatures(
          voiceFeatures,
          JSON.parse(profile.voiceFeatures)
        );

        if (confidence > bestConfidence && confidence >= this.confidenceThreshold) {
          bestConfidence = confidence;
          bestMatch = profile;
        }
      }

      // Log speaker identification
      await executeQuery(`
        INSERT INTO SpeakerIdentificationLogs (
          callId, identifiedUserId, confidence, timestamp
        ) VALUES (?, ?, ?, GETDATE())
      `, [callId, bestMatch?.userId || null, bestConfidence]);

      return {
        identified: bestMatch !== null,
        userId: bestMatch?.userId,
        userName: bestMatch?.userName,
        confidence: bestConfidence,
        callId
      };
    } catch (error) {
      console.error('Speaker identification error:', error);
      throw new Error(`Speaker identification failed: ${error.message}`);
    }
  }

  // Extract voice features using Deepgram
  async extractVoiceFeatures(audioBuffer) {
    try {
      const response = await axios.post(
        'https://api.deepgram.com/v1/listen',
        audioBuffer,
        {
          headers: {
            'Authorization': `Token ${this.deepgramApiKey}`,
            'Content-Type': 'audio/wav'
          },
          params: {
            model: 'nova-2',
            language: 'en-US',
            punctuate: true,
            diarize: true,
            smart_format: true
          }
        }
      );

      const transcript = response.data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
      const words = response.data.results?.channels?.[0]?.alternatives?.[0]?.words || [];
      
      // Calculate voice characteristics
      const voiceFeatures = {
        transcript,
        wordCount: words.length,
        averageWordDuration: this.calculateAverageWordDuration(words),
        speakingRate: this.calculateSpeakingRate(words),
        confidence: response.data.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0.8,
        voicePrint: this.generateVoicePrint(words),
        extractedAt: new Date().toISOString()
      };

      return voiceFeatures;
    } catch (error) {
      console.error('Deepgram API error:', error);
      throw new Error(`Voice feature extraction failed: ${error.message}`);
    }
  }

  // Compare voice features for authentication
  async compareVoiceFeatures(current, stored) {
    try {
      let confidence = 0;
      
      // Compare speaking rate
      const rateScore = this.calculateSimilarity(current.speakingRate, stored.speakingRate, 50);
      confidence += rateScore * 0.3;

      // Compare average word duration
      const durationScore = this.calculateSimilarity(current.averageWordDuration, stored.averageWordDuration, 0.5);
      confidence += durationScore * 0.3;

      // Compare voice print patterns
      const voicePrintScore = this.compareVoicePrints(current.voicePrint, stored.voicePrint);
      confidence += voicePrintScore * 0.4;

      return Math.min(confidence, 1.0);
    } catch (error) {
      console.error('Voice comparison error:', error);
      return 0;
    }
  }

  // Fraud Detection
  async checkForFraud(userId, confidence) {
    try {
      // Get recent authentication attempts
      const recentAttempts = await executeQuery(`
        SELECT confidence, timestamp, result 
        FROM AuthenticationLogs 
        WHERE userId = ? AND timestamp > DATEADD(hour, -24, GETDATE())
        ORDER BY timestamp DESC
      `, [userId]);

      // Check for suspicious patterns
      const fraudRisk = this.calculateFraudRisk(recentAttempts, confidence);
      
      if (fraudRisk > 0.7) {
        await this.createFraudAlert(userId, fraudRisk, 'Suspicious authentication pattern detected');
      }

      return fraudRisk;
    } catch (error) {
      console.error('Fraud detection error:', error);
      return 0;
    }
  }

  // Helper Methods
  calculateAverageWordDuration(words) {
    if (!words || words.length === 0) return 0;
    const totalDuration = words.reduce((sum, word) => sum + (word.end - word.start), 0);
    return totalDuration / words.length;
  }

  calculateSpeakingRate(words) {
    if (!words || words.length === 0) return 0;
    const totalTime = words[words.length - 1]?.end - words[0]?.start || 1;
    return words.length / totalTime; // words per second
  }

  generateVoicePrint(words) {
    // Create a simplified voice print based on word timing patterns
    return words.slice(0, 10).map(word => ({
      duration: word.end - word.start,
      confidence: word.confidence
    }));
  }

  calculateSimilarity(value1, value2, tolerance) {
    const difference = Math.abs(value1 - value2);
    return Math.max(0, 1 - (difference / tolerance));
  }

  compareVoicePrints(print1, print2) {
    if (!print1 || !print2) return 0;
    
    const minLength = Math.min(print1.length, print2.length);
    let totalSimilarity = 0;

    for (let i = 0; i < minLength; i++) {
      const durationSim = this.calculateSimilarity(print1[i].duration, print2[i].duration, 0.5);
      const confidenceSim = this.calculateSimilarity(print1[i].confidence, print2[i].confidence, 0.3);
      totalSimilarity += (durationSim + confidenceSim) / 2;
    }

    return totalSimilarity / minLength;
  }

  calculateFraudRisk(attempts, currentConfidence) {
    if (!attempts || attempts.length === 0) return 0;

    let riskScore = 0;
    
    // Check for multiple failed attempts
    const failedAttempts = attempts.filter(a => a.result === 'FAILED').length;
    riskScore += Math.min(failedAttempts * 0.2, 0.5);

    // Check for unusual confidence patterns
    const avgConfidence = attempts.reduce((sum, a) => sum + a.confidence, 0) / attempts.length;
    if (Math.abs(currentConfidence - avgConfidence) > 0.3) {
      riskScore += 0.3;
    }

    return Math.min(riskScore, 1.0);
  }

  async logAuthActivity(userId, action, result, confidence) {
    try {
      await executeQuery(`
        INSERT INTO AuthenticationLogs (
          userId, action, result, confidence, timestamp
        ) VALUES (?, ?, ?, ?, GETDATE())
      `, [userId, action, result, confidence]);
    } catch (error) {
      console.error('Failed to log auth activity:', error);
    }
  }

  async createFraudAlert(userId, riskScore, description) {
    try {
      await executeQuery(`
        INSERT INTO FraudAlerts (
          userId, riskScore, description, timestamp, status
        ) VALUES (?, ?, ?, GETDATE(), 'ACTIVE')
      `, [userId, riskScore, description]);
    } catch (error) {
      console.error('Failed to create fraud alert:', error);
    }
  }
}

module.exports = VoiceAuthService;