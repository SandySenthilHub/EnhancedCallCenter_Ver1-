const axios = require('axios');
const { executeQuery } = require('./sqlUtils');
const AWSIntegrationService = require('./awsIntegration');

// Transcription Service with Deepgram integration as per GoodContact SRS
class TranscriptionService {
  constructor() {
    this.deepgramApiKey = process.env.DEEPGRAM_API_KEY || '9439264b3d03acbfd50fa23a896b8b1644032e6d';
    this.awsService = new AWSIntegrationService();
    this.baseUrl = 'https://api.deepgram.com/v1';
  }

  // Direct transcription from Azure Storage Blobs
  async transcribeFromAzureBlob(blobUrl, callId, options = {}) {
    try {
      const transcriptionOptions = {
        model: options.model || 'nova-2',
        language: options.language || 'en-US',
        punctuate: true,
        diarize: true,
        smart_format: true,
        paragraphs: true,
        sentiment: true,
        summarize: true,
        detect_language: true,
        keywords: options.keywords || []
      };

      const response = await axios.post(
        `${this.baseUrl}/listen`,
        { url: blobUrl },
        {
          headers: {
            'Authorization': `Token ${this.deepgramApiKey}`,
            'Content-Type': 'application/json'
          },
          params: transcriptionOptions
        }
      );

      const transcriptionData = this.processTranscriptionResponse(response.data);
      
      // Store transcription results
      const transcriptionId = await this.storeTranscription(callId, transcriptionData, blobUrl);
      
      // Extract and store sentences and paragraphs
      await this.storeSentencesAndParagraphs(transcriptionId, transcriptionData);
      
      // Backup to AWS S3
      await this.awsService.uploadToS3(
        Buffer.from(JSON.stringify(transcriptionData)),
        `transcriptions/${transcriptionId}.json`,
        { callId, source: 'azure-blob' }
      );

      return {
        success: true,
        transcriptionId,
        data: transcriptionData
      };
    } catch (error) {
      console.error('Azure blob transcription error:', error);
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  // Transcription of uploaded audio files
  async transcribeUploadedFile(audioBuffer, fileName, callId, options = {}) {
    try {
      const transcriptionOptions = {
        model: options.model || 'nova-2',
        language: options.language || 'en-US',
        punctuate: true,
        diarize: true,
        smart_format: true,
        paragraphs: true,
        sentiment: true,
        summarize: true,
        detect_language: true,
        keywords: options.keywords || [],
        redact: options.redact || ['pci', 'ssn']
      };

      // Upload to AWS S3 first
      const s3Upload = await this.awsService.uploadToS3(
        audioBuffer,
        fileName,
        { callId, originalName: fileName }
      );

      const response = await axios.post(
        `${this.baseUrl}/listen`,
        audioBuffer,
        {
          headers: {
            'Authorization': `Token ${this.deepgramApiKey}`,
            'Content-Type': 'audio/wav'
          },
          params: transcriptionOptions
        }
      );

      const transcriptionData = this.processTranscriptionResponse(response.data);
      
      // Store transcription results
      const transcriptionId = await this.storeTranscription(callId, transcriptionData, s3Upload.location);
      
      // Extract and store detailed analysis
      await this.storeSentencesAndParagraphs(transcriptionId, transcriptionData);
      await this.storeKeywords(transcriptionId, transcriptionData.keywords);
      await this.storeSentimentAnalysis(transcriptionId, transcriptionData.sentiment);

      return {
        success: true,
        transcriptionId,
        data: transcriptionData,
        s3Location: s3Upload.location
      };
    } catch (error) {
      console.error('File transcription error:', error);
      throw new Error(`File transcription failed: ${error.message}`);
    }
  }

  // Real-time transcription for live calls
  async startRealtimeTranscription(callId, websocketConnection) {
    try {
      const realtimeOptions = {
        model: 'nova-2',
        language: 'en-US',
        punctuate: true,
        diarize: true,
        interim_results: true,
        endpointing: 300,
        utterance_end_ms: 1000
      };

      // Initialize real-time session
      const sessionId = await this.initializeRealtimeSession(callId);
      
      // Set up WebSocket connection to Deepgram
      const wsUrl = `wss://api.deepgram.com/v1/listen?${new URLSearchParams(realtimeOptions)}`;
      
      return {
        success: true,
        sessionId,
        wsUrl,
        headers: {
          'Authorization': `Token ${this.deepgramApiKey}`
        }
      };
    } catch (error) {
      console.error('Real-time transcription setup error:', error);
      throw new Error(`Real-time transcription setup failed: ${error.message}`);
    }
  }

  // Process Deepgram API response
  processTranscriptionResponse(deepgramResponse) {
    const channel = deepgramResponse.results?.channels?.[0];
    if (!channel) {
      throw new Error('No transcription results found');
    }

    const alternative = channel.alternatives?.[0];
    if (!alternative) {
      throw new Error('No transcription alternative found');
    }

    return {
      transcript: alternative.transcript,
      confidence: alternative.confidence,
      words: alternative.words || [],
      paragraphs: alternative.paragraphs?.paragraphs || [],
      sentiment: deepgramResponse.results?.sentiment || null,
      summary: alternative.summaries?.[0]?.summary || null,
      keywords: alternative.keywords || [],
      language: deepgramResponse.results?.language || 'en',
      duration: deepgramResponse.metadata?.duration || 0,
      channels: deepgramResponse.metadata?.channels || 1,
      processedAt: new Date().toISOString()
    };
  }

  // Store transcription in database
  async storeTranscription(callId, transcriptionData, sourceUrl) {
    try {
      const [result] = await executeQuery(`
        INSERT INTO Transcriptions (
          callId, transcript, confidence, sourceUrl, language,
          duration, channels, keywords, sentiment, summary,
          processedAt, createdAt
        ) OUTPUT INSERTED.id VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE()
        )
      `, [
        callId,
        transcriptionData.transcript,
        transcriptionData.confidence,
        sourceUrl,
        transcriptionData.language,
        transcriptionData.duration,
        transcriptionData.channels,
        JSON.stringify(transcriptionData.keywords),
        JSON.stringify(transcriptionData.sentiment),
        transcriptionData.summary,
        transcriptionData.processedAt
      ]);

      return result.id;
    } catch (error) {
      console.error('Store transcription error:', error);
      throw new Error(`Failed to store transcription: ${error.message}`);
    }
  }

  // Store sentences and paragraphs
  async storeSentencesAndParagraphs(transcriptionId, transcriptionData) {
    try {
      // Store paragraphs
      for (const paragraph of transcriptionData.paragraphs) {
        await executeQuery(`
          INSERT INTO TranscriptionParagraphs (
            transcriptionId, paragraphIndex, text, startTime, endTime, confidence
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          transcriptionId,
          paragraph.paragraph_number || 0,
          paragraph.text,
          paragraph.start || 0,
          paragraph.end || 0,
          paragraph.confidence || 0
        ]);

        // Store sentences within each paragraph
        if (paragraph.sentences) {
          for (const sentence of paragraph.sentences) {
            await executeQuery(`
              INSERT INTO TranscriptionSentences (
                transcriptionId, paragraphIndex, sentenceIndex, text,
                startTime, endTime, confidence
              ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
              transcriptionId,
              paragraph.paragraph_number || 0,
              sentence.sentence_number || 0,
              sentence.text,
              sentence.start || 0,
              sentence.end || 0,
              sentence.confidence || 0
            ]);
          }
        }
      }

      // Store individual words for detailed analysis
      for (const word of transcriptionData.words) {
        await executeQuery(`
          INSERT INTO TranscriptionWords (
            transcriptionId, word, startTime, endTime, confidence, speaker
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          transcriptionId,
          word.word,
          word.start,
          word.end,
          word.confidence,
          word.speaker || 0
        ]);
      }
    } catch (error) {
      console.error('Store sentences/paragraphs error:', error);
      throw new Error(`Failed to store detailed transcription data: ${error.message}`);
    }
  }

  // Store keywords and phrases
  async storeKeywords(transcriptionId, keywords) {
    try {
      for (const keyword of keywords) {
        await executeQuery(`
          INSERT INTO TranscriptionKeywords (
            transcriptionId, keyword, confidence, count
          ) VALUES (?, ?, ?, ?)
        `, [
          transcriptionId,
          keyword.text || keyword,
          keyword.confidence || 0,
          keyword.count || 1
        ]);
      }
    } catch (error) {
      console.error('Store keywords error:', error);
    }
  }

  // Store sentiment analysis
  async storeSentimentAnalysis(transcriptionId, sentiment) {
    try {
      if (sentiment) {
        await executeQuery(`
          INSERT INTO SentimentAnalysis (
            transcriptionId, overallSentiment, positive, negative, neutral
          ) VALUES (?, ?, ?, ?, ?)
        `, [
          transcriptionId,
          sentiment.sentiment || 'neutral',
          sentiment.sentiment_score?.positive || 0,
          sentiment.sentiment_score?.negative || 0,
          sentiment.sentiment_score?.neutral || 0
        ]);
      }
    } catch (error) {
      console.error('Store sentiment analysis error:', error);
    }
  }

  // Initialize real-time transcription session
  async initializeRealtimeSession(callId) {
    try {
      const [result] = await executeQuery(`
        INSERT INTO RealtimeTranscriptionSessions (
          callId, status, startTime
        ) OUTPUT INSERTED.id VALUES (?, 'ACTIVE', GETDATE())
      `, [callId]);

      return result.id;
    } catch (error) {
      console.error('Initialize real-time session error:', error);
      throw new Error(`Failed to initialize real-time session: ${error.message}`);
    }
  }

  // Get transcription analytics
  async getTranscriptionAnalytics(dateRange = 7) {
    try {
      const analytics = await executeQuery(`
        SELECT 
          COUNT(*) as totalTranscriptions,
          AVG(confidence) as avgConfidence,
          AVG(duration) as avgDuration,
          COUNT(DISTINCT callId) as uniqueCalls,
          COUNT(CASE WHEN confidence > 0.9 THEN 1 END) as highConfidenceCount,
          COUNT(CASE WHEN sentiment LIKE '%positive%' THEN 1 END) as positiveCount,
          COUNT(CASE WHEN sentiment LIKE '%negative%' THEN 1 END) as negativeCount
        FROM Transcriptions 
        WHERE createdAt > DATEADD(day, -?, GETDATE())
      `, [dateRange]);

      const languageDistribution = await executeQuery(`
        SELECT language, COUNT(*) as count
        FROM Transcriptions 
        WHERE createdAt > DATEADD(day, -?, GETDATE())
        GROUP BY language
      `, [dateRange]);

      return {
        summary: analytics[0],
        languageDistribution,
        dateRange
      };
    } catch (error) {
      console.error('Get analytics error:', error);
      throw new Error(`Failed to get transcription analytics: ${error.message}`);
    }
  }

  // Search transcriptions
  async searchTranscriptions(searchQuery, filters = {}) {
    try {
      let whereClause = "WHERE transcript LIKE ?";
      let params = [`%${searchQuery}%`];

      if (filters.callId) {
        whereClause += " AND callId = ?";
        params.push(filters.callId);
      }

      if (filters.dateFrom) {
        whereClause += " AND createdAt >= ?";
        params.push(filters.dateFrom);
      }

      if (filters.dateTo) {
        whereClause += " AND createdAt <= ?";
        params.push(filters.dateTo);
      }

      if (filters.minConfidence) {
        whereClause += " AND confidence >= ?";
        params.push(filters.minConfidence);
      }

      const results = await executeQuery(`
        SELECT id, callId, transcript, confidence, language, duration, createdAt
        FROM Transcriptions 
        ${whereClause}
        ORDER BY createdAt DESC
        OFFSET ${filters.offset || 0} ROWS 
        FETCH NEXT ${filters.limit || 50} ROWS ONLY
      `, params);

      return {
        results,
        query: searchQuery,
        filters
      };
    } catch (error) {
      console.error('Search transcriptions error:', error);
      throw new Error(`Transcription search failed: ${error.message}`);
    }
  }
}

module.exports = TranscriptionService;