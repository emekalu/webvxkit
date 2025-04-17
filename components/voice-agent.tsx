"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { speechToText } from '@/lib/voice-service';

// Get API key directly 
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || "";

interface VoiceAgentProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentTitle: string;
  description: string;
  gender?: 'male' | 'female' | 'neutral';
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({
  isOpen,
  onClose,
  agentName,
  agentTitle,
  description,
  gender = 'neutral',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);
  const buttonTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simple logging function
  const debugLog = (message: string) => {
    console.log(`[VOICE AGENT] ${message}`);
  };

  useEffect(() => {
    // Create audio element when component mounts
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set event handlers
      audioRef.current.onloadeddata = () => {
        debugLog("Audio data loaded");
        setIsAudioLoading(false);
      };
      
      audioRef.current.onplay = () => {
        debugLog("Audio playback started");
        setIsSpeaking(true);
      };
      
      audioRef.current.onended = () => {
        debugLog("Audio playback ended");
        setIsSpeaking(false);
        setIsButtonDisabled(false);
      };
      
      audioRef.current.onerror = (e) => {
        debugLog(`Audio error: ${e}`);
        console.error('Audio playback error:', e);
        setIsSpeaking(false);
        setIsAudioLoading(false);
        setIsButtonDisabled(false);
      };
    }
    
    // Cleanup function
    return () => {
      // Cleanup function
      if (audioRef.current) {
        audioRef.current.pause();
        if (currentAudioUrlRef.current) {
          URL.revokeObjectURL(currentAudioUrlRef.current);
          currentAudioUrlRef.current = null;
        }
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (buttonTimeoutRef.current) {
        clearTimeout(buttonTimeoutRef.current);
      }
    };
  }, []);

  const speakText = async (text: string) => {
    try {
      // Don't start a new request if already speaking or loading
      if (isSpeaking || isAudioLoading) {
        debugLog('Already speaking or loading, ignoring new request');
        return;
      }
      
      setIsAudioLoading(true);
      setIsSpeaking(true);
      setIsButtonDisabled(true);
      debugLog('Starting speech synthesis');
      
      // Stop any current playback
      if (audioRef.current) {
        audioRef.current.pause();
        if (currentAudioUrlRef.current) {
          URL.revokeObjectURL(currentAudioUrlRef.current);
        }
      }
      
      // Choose correct voice ID based on gender
      let elevenLabsVoiceId: string;
      if (gender === 'male') {
        elevenLabsVoiceId = "TxGEqnHWrfWFTfGW9XjX"; // Josh
      } else if (gender === 'female') {
        elevenLabsVoiceId = "EXAVITQu4vr4xnSDxMaL"; // Elli
      } else {
        elevenLabsVoiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel (neutral)
      }
      
      debugLog(`Using voice ID: ${elevenLabsVoiceId} for gender: ${gender}`);
      debugLog(`API key available: ${Boolean(ELEVENLABS_API_KEY)}`);
      
      // Make direct call to ElevenLabs API
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`, {
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
      });
      
      debugLog(`API response status: ${response.status}`);
      
      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = `${errorMessage} - ${JSON.stringify(errorData)}`;
        } catch (e) {
          // Ignore JSON parse errors
        }
        debugLog(errorMessage);
        throw new Error(errorMessage);
      }
      
      // Get audio data
      const audioBlob = await response.blob();
      debugLog(`Received audio blob: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
      
      if (audioBlob.size === 0) {
        throw new Error("Received empty audio data");
      }
      
      // Create audio URL
      const audioUrl = URL.createObjectURL(audioBlob);
      currentAudioUrlRef.current = audioUrl;
      debugLog(`Created audio URL: ${audioUrl}`);
      
      // Set source and play
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        
        debugLog("Attempting to play audio...");
        try {
          await audioRef.current.play();
          debugLog("Play command accepted");
        } catch (playError) {
          debugLog(`Play error: ${playError}`);
          setIsSpeaking(false);
          setIsAudioLoading(false);
          setIsButtonDisabled(false);
        }
      }
    } catch (error) {
      debugLog(`Error in speakText: ${error}`);
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
      setIsAudioLoading(false);
      setIsButtonDisabled(false);
    }
  };

  const startListening = async () => {
    if (isButtonDisabled) {
      return;
    }
    
    try {
      // Don't start listening if already speaking
      if (isSpeaking || isAudioLoading) {
        console.log('Cannot start listening while speaking');
        return;
      }

      setIsButtonDisabled(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        try {
          const text = await speechToText(audioBlob);
          setTranscript(text);
          
          // Wait a moment before responding
          setTimeout(() => {
            // Generate a response based on the transcript
            const response = `I understand you said: "${text}". How can I help you with that?`;
            speakText(response);
          }, 500);
        } catch (error) {
          console.error('Error processing speech:', error);
          setIsButtonDisabled(false);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsButtonDisabled(false);
    }
  };

  const stopListening = () => {
    if (isButtonDisabled && !isListening) {
      return;
    }
    
    setIsButtonDisabled(true);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsListening(false);
    } else {
      buttonTimeoutRef.current = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 500);
    }
  };

  const handleButtonClick = () => {
    if (isButtonDisabled) {
      return;
    }
    
    debugLog('Button clicked');
    
    if (isListening) {
      stopListening();
    } else {
      // Play introduction
      const introduction = `Hi, I'm ${agentName}. ${description}`;
      speakText(introduction);
    }
  };

  // Auto play intro after a short delay when dialog opens
  useEffect(() => {
    if (isOpen && !isSpeaking && !isAudioLoading) {
      // Delay auto-play to give time for dialog to open
      const timer = setTimeout(() => {
        const introduction = `Hi, I'm ${agentName}. ${description}`;
        debugLog('Auto-playing introduction');
        speakText(introduction);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        // Clean up audio when closing
        if (audioRef.current) {
          audioRef.current.pause();
          if (currentAudioUrlRef.current) {
            URL.revokeObjectURL(currentAudioUrlRef.current);
            currentAudioUrlRef.current = null;
          }
        }
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {agentName}
            <span className="text-sm font-normal text-gray-500">({agentTitle})</span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          {transcript && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">You said: {transcript}</p>
            </div>
          )}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleButtonClick}
              disabled={isButtonDisabled || isSpeaking}
              className={`rounded-md px-6 py-3 text-center font-medium text-sm transition-colors duration-150 
                ${isButtonDisabled || isSpeaking
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-vx-black text-white hover:bg-opacity-90'
                }`}
            >
              {isAudioLoading ? 'Loading...' : isSpeaking ? 'Listening...' : isListening ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceAgent; 