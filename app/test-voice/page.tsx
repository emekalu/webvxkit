"use client";

import React, { useState, useRef } from 'react';
import { textToSpeech } from '@/lib/voice-service';

export default function TestVoicePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().slice(11, 23)} - ${message}`]);
  };

  const playAudio = async () => {
    setLoading(true);
    setError(null);
    addLog("Starting voice test");

    try {
      addLog("Creating audio element");
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      addLog("Calling textToSpeech API");
      const text = "This is a test of the voice service. If you hear this, the voice service is working correctly.";
      const audioUrl = await textToSpeech(text, "echo");
      
      addLog(`Got audio URL: ${audioUrl}`);

      if (audioRef.current) {
        audioRef.current.oncanplaythrough = () => {
          addLog("Audio can play through");
          setLoading(false);
        };

        audioRef.current.onloadeddata = () => {
          addLog("Audio data loaded");
        };

        audioRef.current.onended = () => {
          addLog("Audio playback ended");
        };

        audioRef.current.onerror = (e) => {
          const errorMessage = `Audio error: ${e}`;
          addLog(errorMessage);
          setError(errorMessage);
          setLoading(false);
        };

        audioRef.current.src = audioUrl;
        addLog("Set audio source");

        try {
          addLog("Attempting to play audio");
          await audioRef.current.play();
          addLog("Audio playback started");
        } catch (playError) {
          const errorMessage = `Play error: ${playError}`;
          addLog(errorMessage);
          setError(errorMessage);
          setLoading(false);
        }
      }
    } catch (error) {
      const errorMessage = `Error: ${error}`;
      addLog(errorMessage);
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Voice Service Test Page</h1>
      
      <div className="mb-6">
        <button
          onClick={playAudio}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
        >
          {loading ? 'Loading...' : 'Test Voice Playback'}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="border rounded-md p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Debug Logs</h2>
        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
          {logs.length === 0 && <div className="text-gray-500">No logs yet. Click the button to start the test.</div>}
        </div>
      </div>
    </div>
  );
}