import fetch from 'node-fetch';

// Azure Cognitive Services configuration
const SPEECH_KEY = process.env.AZURE_SPEECH_KEY || '';
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'eastus';
const TEXT_ANALYTICS_KEY = process.env.AZURE_TEXT_ANALYTICS_KEY || '';
const TEXT_ANALYTICS_ENDPOINT = process.env.AZURE_TEXT_ANALYTICS_ENDPOINT || 'https://eastus.api.cognitive.microsoft.com/';
const LANGUAGE_KEY = process.env.AZURE_LANGUAGE_KEY || '';
const LANGUAGE_ENDPOINT = process.env.AZURE_LANGUAGE_ENDPOINT || 'https://eastus.api.cognitive.microsoft.com/';

// Speech-to-Text API
export async function transcribeAudio(audioUrl: string, language: string = 'en-US'): Promise<string> {
  try {
    // In a real implementation, this would use Azure SDK to transcribe audio
    // For now, we'll simulate a response
    const response = await fetch(`${TEXT_ANALYTICS_ENDPOINT}/speech/recognition/conversation/cognitiveservices/v1?language=${language}`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': SPEECH_KEY,
        'Content-Type': 'audio/wav'
      },
      body: await (await fetch(audioUrl)).arrayBuffer()
    });
    
    if (!response.ok) {
      throw new Error(`Speech recognition failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.DisplayText || '';
  } catch (error) {
    console.error('Error in speech-to-text processing:', error);
    throw error;
  }
}

// Sentiment Analysis API
export async function analyzeSentiment(text: string, language: string = 'en'): Promise<{
  sentiment: string;
  positiveScore: number;
  neutralScore: number;
  negativeScore: number;
}> {
  try {
    const response = await fetch(`${TEXT_ANALYTICS_ENDPOINT}text/analytics/v3.1/sentiment`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': TEXT_ANALYTICS_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documents: [
          {
            id: '1',
            language,
            text
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Sentiment analysis failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    const result = data.documents[0];
    
    return {
      sentiment: result.sentiment,
      positiveScore: result.confidenceScores.positive,
      neutralScore: result.confidenceScores.neutral,
      negativeScore: result.confidenceScores.negative
    };
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    throw error;
  }
}

// Key Phrase Extraction API
export async function extractKeyPhrases(text: string, language: string = 'en'): Promise<string[]> {
  try {
    const response = await fetch(`${TEXT_ANALYTICS_ENDPOINT}text/analytics/v3.1/keyPhrases`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': TEXT_ANALYTICS_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documents: [
          {
            id: '1',
            language,
            text
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Key phrase extraction failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.documents[0].keyPhrases || [];
  } catch (error) {
    console.error('Error in key phrase extraction:', error);
    throw error;
  }
}

// Entity Recognition API
export async function recognizeEntities(text: string, language: string = 'en'): Promise<any[]> {
  try {
    const response = await fetch(`${TEXT_ANALYTICS_ENDPOINT}text/analytics/v3.1/entities/recognition/general`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': TEXT_ANALYTICS_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        documents: [
          {
            id: '1',
            language,
            text
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Entity recognition failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.documents[0].entities || [];
  } catch (error) {
    console.error('Error in entity recognition:', error);
    throw error;
  }
}

// Intent Detection (LUIS) API
export async function detectIntent(text: string, language: string = 'en'): Promise<{
  topIntent: string;
  intents: Record<string, number>;
  entities: any[];
}> {
  try {
    const appId = process.env.LUIS_APP_ID || '';
    const response = await fetch(`${LANGUAGE_ENDPOINT}luis/prediction/v3.0/apps/${appId}/slots/production/predict?verbose=true&log=true`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': LANGUAGE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: text,
        options: {
          datetimeReference: new Date().toISOString()
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Intent detection failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      topIntent: data.prediction.topIntent,
      intents: data.prediction.intents,
      entities: data.prediction.entities
    };
  } catch (error) {
    console.error('Error in intent detection:', error);
    throw error;
  }
}

// Custom Tone Detection using Azure ML
export async function detectTone(text: string): Promise<string> {
  try {
    // In a real implementation, this would call a deployed Azure ML model
    // For now, we'll use a simple rule-based approach
    
    const sentiment = await analyzeSentiment(text);
    
    if (sentiment.positiveScore > 0.7) return 'happy';
    if (sentiment.negativeScore > 0.7) return 'angry';
    if (sentiment.negativeScore > 0.4) return 'frustrated';
    if (sentiment.neutralScore > 0.7) return 'neutral';
    
    return 'neutral';
  } catch (error) {
    console.error('Error in tone detection:', error);
    throw error;
  }
}
