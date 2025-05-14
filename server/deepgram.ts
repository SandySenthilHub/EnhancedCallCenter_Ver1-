import fetch from 'node-fetch';

// Deepgram API Key
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || '';

/**
 * Transcribe audio using Deepgram's API
 * @param audioUrl URL to the audio file
 * @param language Language code (e.g., 'en-US')
 * @returns Transcript text
 */
export async function transcribeAudioWithDeepgram(audioUrl: string, language: string = 'en-US'): Promise<{
  transcript: string;
  confidence: number;
  words: { word: string; start: number; end: number; confidence: number }[];
}> {
  try {
    // First, fetch the audio file
    const audioResponse = await fetch(audioUrl);
    const audioBuffer = await audioResponse.arrayBuffer();
    
    // Prepare the API request to Deepgram
    const response = await fetch('https://api.deepgram.com/v1/listen', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'audio/wav'
      },
      body: Buffer.from(audioBuffer),
    });
    
    if (!response.ok) {
      throw new Error(`Deepgram API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Format the response
    const result = {
      transcript: data.results?.channels[0]?.alternatives[0]?.transcript || '',
      confidence: data.results?.channels[0]?.alternatives[0]?.confidence || 0,
      words: data.results?.channels[0]?.alternatives[0]?.words.map((word: any) => ({
        word: word.word,
        start: word.start,
        end: word.end,
        confidence: word.confidence
      })) || []
    };
    
    return result;
  } catch (error) {
    console.error('Error in Deepgram transcription:', error);
    throw error;
  }
}

/**
 * Detect speakers in an audio file using Deepgram's diarization feature
 * @param audioUrl URL to the audio file
 * @param language Language code (e.g., 'en-US')
 * @returns Speaker segments with transcripts
 */
export async function detectSpeakers(audioUrl: string, language: string = 'en-US'): Promise<{
  speakers: number;
  segments: { speaker: number; text: string; start: number; end: number }[];
}> {
  try {
    // First, fetch the audio file
    const audioResponse = await fetch(audioUrl);
    const audioBuffer = await audioResponse.arrayBuffer();
    
    // Prepare the API request to Deepgram with diarization
    const response = await fetch('https://api.deepgram.com/v1/listen?diarize=true', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'audio/wav'
      },
      body: Buffer.from(audioBuffer),
    });
    
    if (!response.ok) {
      throw new Error(`Deepgram API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract speaker segments
    const paragraphs = data.results?.channels[0]?.alternatives[0]?.paragraphs?.paragraphs || [];
    
    // Count unique speakers
    const speakerSet = new Set<number>();
    paragraphs.forEach((p: any) => speakerSet.add(p.speaker));
    
    // Format the response
    const result = {
      speakers: speakerSet.size,
      segments: paragraphs.map((p: any) => ({
        speaker: p.speaker,
        text: p.text,
        start: p.start,
        end: p.end
      }))
    };
    
    return result;
  } catch (error) {
    console.error('Error in Deepgram speaker detection:', error);
    throw error;
  }
}

/**
 * Check if Deepgram API is configured
 * @returns true if configured, false otherwise
 */
export function isDeepgramConfigured(): boolean {
  return !!DEEPGRAM_API_KEY;
}