import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || "";

// Function to get a human-readable error message based on status code
function getErrorMessageForStatus(status: number): string {
  switch (status) {
    case 401:
      return "Authentication error: Your API key may be invalid or expired";
    case 403:
      return "Authorization error: You don't have permission to use this API";
    case 404:
      return "Not found: The requested resource doesn't exist";
    case 429:
      return "Rate limit exceeded: You've sent too many requests in a short period";
    case 500:
    case 502:
    case 503:
    case 504:
      return "Server error: Please try again later";
    default:
      return `Error with status code: ${status}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Received text-to-speech request");
    
    // Extract request body
    const { text, voice = "alloy" } = await request.json();
    
    console.log(`Text-to-speech request: voice=${voice}, text length=${text?.length || 0}`);
    
    if (!text) {
      console.log("Text-to-speech error: Text is required");
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    
    if (!ELEVENLABS_API_KEY) {
      console.log("Text-to-speech error: API key is missing");
      return NextResponse.json(
        { error: "ElevenLabs API key is missing" }, 
        { status: 500 }
      );
    }
    
    console.log("ElevenLabs API key is available");
    
    // Map voice types to ElevenLabs voice IDs
    let elevenLabsVoiceId: string;
    
    // Gender-based voice mapping
    switch (voice) {
      // Male voices
      case "echo": // Male voice
        elevenLabsVoiceId = "TxGEqnHWrfWFTfGW9XjX"; // Josh - professional male voice
        break;
      case "onyx": // Deep male voice
        elevenLabsVoiceId = "VR6AewLTigWG4xSOukaG"; // Arnold - deep male voice
        break;
        
      // Female voices
      case "nova": // Female voice
        elevenLabsVoiceId = "EXAVITQu4vr4xnSDxMaL"; // Elli - clear female voice
        break;
      case "shimmer": // Warm female voice
        elevenLabsVoiceId = "D38z5RcWu1voky8WS1ja"; // Dorothy - warm female voice
        break;
      case "fable": // Female soft voice
        elevenLabsVoiceId = "flq6f7yk4E4fJM5XTYuZ"; // Freya - soft female voice
        break;
        
      // Neutral voices
      case "alloy": // Neutral voice
        elevenLabsVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel - neutral female voice
        break;
        
      // Default to a neutral voice if not specified
      default:
        elevenLabsVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel - default
    }
    
    console.log(`Using ElevenLabs voice: ${elevenLabsVoiceId} for requested voice type: ${voice}`);
    
    // Call ElevenLabs API
    const elevenLabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    );
    
    if (!elevenLabsResponse.ok) {
      const errorData = await elevenLabsResponse.json().catch(() => null);
      const statusMessage = getErrorMessageForStatus(elevenLabsResponse.status);
      const apiErrorMessage = errorData?.detail || '';
      const errorMessage = `${statusMessage}. ${apiErrorMessage}`.trim();
      
      console.error("ElevenLabs API Error:", {
        status: elevenLabsResponse.status,
        statusText: elevenLabsResponse.statusText,
        errorMessage,
        details: errorData
      });
      
      return NextResponse.json(
        { error: errorMessage || `Failed to generate speech. Status: ${elevenLabsResponse.status}` }, 
        { status: elevenLabsResponse.status }
      );
    }
    
    // Get audio data from ElevenLabs
    const audioData = await elevenLabsResponse.arrayBuffer();
    
    console.log(`Received audio data, size: ${audioData.byteLength} bytes`);
    
    if (audioData.byteLength === 0) {
      console.log("Received empty audio data from ElevenLabs");
      return NextResponse.json(
        { error: "Received empty audio data from ElevenLabs" }, 
        { status: 500 }
      );
    }
    
    // Return audio data with proper headers
    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error("Error processing text-to-speech request:", error);
    return NextResponse.json(
      { error: "Failed to process text-to-speech request" }, 
      { status: 500 }
    );
  }
}