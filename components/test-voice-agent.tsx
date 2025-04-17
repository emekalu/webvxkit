"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface TestVoiceAgentProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentTitle: string;
  description: string;
  gender?: 'male' | 'female' | 'neutral';
}

// Get API key directly 
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || "";

const TestVoiceAgent: React.FC<TestVoiceAgentProps> = ({
  isOpen,
  onClose,
  agentName,
  agentTitle,
  description,
  gender = 'neutral',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);

  // Simple logging function
  const addLog = (message: string) => {
    console.log(`[TEST-VOICE] ${message}`);
    setLogs(prev => [...prev, `${new Date().toISOString().slice(11, 23)} - ${message}`]);
  };

  useEffect(() => {
    // Create audio element when component mounts
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set event handlers
      audioRef.current.onloadeddata = () => {
        addLog("Audio data loaded");
        setIsLoading(false);
      };
      
      audioRef.current.onplay = () => {
        addLog("Audio playback started");
        setIsSpeaking(true);
      };
      
      audioRef.current.onended = () => {
        addLog("Audio playback ended");
        setIsSpeaking(false);
        setIsButtonDisabled(false);
      };
      
      audioRef.current.onerror = (e) => {
        addLog(`Audio error: ${e}`);
        console.error('Audio playback error:', e);
        setIsSpeaking(false);
        setIsLoading(false);
        setIsButtonDisabled(false);
      };
    }
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (currentAudioUrlRef.current) {
          URL.revokeObjectURL(currentAudioUrlRef.current);
          currentAudioUrlRef.current = null;
        }
      }
    };
  }, []);

  const speakText = async (text: string) => {
    try {
      // Don't start a new request if already speaking or loading
      if (isSpeaking || isLoading) {
        addLog('Already speaking or loading, ignoring new request');
        return;
      }
      
      setIsLoading(true);
      setIsSpeaking(true);
      setIsButtonDisabled(true);
      addLog('Starting speech synthesis');
      
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
      
      addLog(`Using voice ID: ${elevenLabsVoiceId} for gender: ${gender}`);
      addLog(`API key available: ${Boolean(ELEVENLABS_API_KEY)}`);
      
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
      
      addLog(`API response status: ${response.status}`);
      
      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = `${errorMessage} - ${JSON.stringify(errorData)}`;
        } catch (e) {
          // Ignore JSON parse errors
        }
        addLog(errorMessage);
        throw new Error(errorMessage);
      }
      
      // Get audio data
      const audioBlob = await response.blob();
      addLog(`Received audio blob: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
      
      if (audioBlob.size === 0) {
        throw new Error("Received empty audio data");
      }
      
      // Create audio URL
      const audioUrl = URL.createObjectURL(audioBlob);
      currentAudioUrlRef.current = audioUrl;
      addLog(`Created audio URL: ${audioUrl}`);
      
      // Set source and play
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        
        addLog("Attempting to play audio...");
        try {
          await audioRef.current.play();
          addLog("Play command accepted");
        } catch (playError) {
          addLog(`Play error: ${playError}`);
          setIsSpeaking(false);
          setIsLoading(false);
          setIsButtonDisabled(false);
        }
      }
    } catch (error) {
      addLog(`Error in speakText: ${error}`);
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };

  const handleButtonClick = () => {
    if (isButtonDisabled) {
      return;
    }
    
    addLog('Button clicked');
    
    const introduction = `Hi, I'm ${agentName}. ${description}`;
    speakText(introduction);
  };

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
          
          <div className="flex justify-center gap-4">
            <button
              onClick={handleButtonClick}
              disabled={isButtonDisabled}
              className={`px-4 py-2 rounded-md text-sm font-medium 
                  bg-blue-600 text-white hover:bg-blue-700
               ${(isButtonDisabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Loading...' : isSpeaking ? 'Speaking...' : 'Play Introduction'}
            </button>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-1">Debug Logs:</h3>
            <div className="bg-gray-50 p-2 rounded-md text-xs font-mono h-32 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))}
              {logs.length === 0 && <div className="text-gray-400">No logs yet.</div>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestVoiceAgent;