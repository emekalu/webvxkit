// Type definitions for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

// Retry helper for network errors
async function fetchWithRetries(url: string, options: RequestInit, retries = 3, delay = 500): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries <= 1) throw error;
    
    // Wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry with exponential backoff (multiply delay by 2)
    return fetchWithRetries(url, options, retries - 1, delay * 2);
  }
}

// Debug helper
function debugLog(message: string, data?: any) {
  console.log(`[TTS DEBUG] ${message}`, data || '');
}

export async function textToSpeech(text: string, voice: string = "alloy"): Promise<string> {
  try {
    debugLog(`Requesting speech synthesis for voice type: ${voice}`);
    debugLog(`Text to speak: "${text.substring(0, 30)}..."`);
    
    // Call our internal API route instead of ElevenLabs directly
    debugLog("Sending request to API endpoint");
    const response = await fetchWithRetries(`/api/text-to-speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        voice
      })
    });
    
    debugLog(`Response status: ${response.status}`);
    debugLog(`Response type: ${response.headers.get('Content-Type')}`);
    
    if (!response.ok) {
      let errorMessage = `Failed to generate speech. Status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        debugLog("Error data:", errorData);
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        debugLog("Could not parse error JSON", e);
        // If we can't parse the JSON, just use the default error message
      }
      
      console.error("Speech synthesis error:", errorMessage);
      throw new Error(errorMessage);
    }
    
    const audioBlob = await response.blob();
    debugLog(`Audio blob size: ${audioBlob.size} bytes`);
    debugLog(`Audio blob type: ${audioBlob.type}`);
    
    const audioUrl = URL.createObjectURL(audioBlob);
    debugLog(`Created audio URL: ${audioUrl}`);
    return audioUrl;
  } catch (error) {
    console.error("Error in textToSpeech:", error);
    throw error;
  }
}

// Speech-to-text using browser's Web Speech API
export async function speechToText(audioBlob: Blob): Promise<string> {
  // Check if Web Speech API is available
  if (typeof window === 'undefined' || 
      (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window))) {
    throw new Error("Web Speech API (recognition) is not supported in this browser");
  }
  
  return new Promise((resolve, reject) => {
    try {
      console.log("Using browser Web Speech API for speech-to-text");
      
      // Create a speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      let transcript = '';
      
      // Set up event handlers
      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }
      };
      
      recognition.onerror = (event: any) => {
        recognition.stop();
        reject(new Error(`Speech recognition error: ${event.error}`));
      };
      
      recognition.onend = () => {
        if (transcript.trim()) {
          resolve(transcript.trim());
        } else {
          reject(new Error("No speech detected"));
        }
      };
      
      // Start recognition
      recognition.start();
      
      // Create a button to stop recording
      const stopButton = document.createElement('button');
      stopButton.textContent = 'Stop Recording';
      stopButton.style.position = 'fixed';
      stopButton.style.top = '50%';
      stopButton.style.left = '50%';
      stopButton.style.transform = 'translate(-50%, -50%)';
      stopButton.style.padding = '10px 20px';
      stopButton.style.backgroundColor = '#f44336';
      stopButton.style.color = 'white';
      stopButton.style.border = 'none';
      stopButton.style.borderRadius = '5px';
      stopButton.style.fontSize = '16px';
      stopButton.style.cursor = 'pointer';
      stopButton.style.zIndex = '10000';
      
      stopButton.onclick = () => {
        recognition.stop();
        document.body.removeChild(stopButton);
      };
      
      document.body.appendChild(stopButton);
    } catch (error) {
      reject(error);
    }
  });
} 