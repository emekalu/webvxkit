"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { MicrophoneIcon, PhoneIcon, XMarkIcon } from '@heroicons/react/24/outline';
// Import the correct Retell SDK
import { RetellWebClient } from 'retell-client-js-sdk';
// Import our new animated avatar component
import { AnimatedAvatar } from './animated-avatar';

interface VoiceAssistantProps {
  userInfo?: {
    userId?: string;
    userName?: string;
    userEmail?: string;
  };
  initialOpen?: boolean;
  onClose?: () => void;
  onConversationEnd?: (conversationId: string, transcript: any) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  userInfo = {},
  initialOpen = false,
  onClose,
  onConversationEnd
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'connecting' | 'speaking' | 'listening' | 'greeting'>('idle');
  const [error, setError] = useState<string | null>(null);
  const retellClient = useRef<RetellWebClient | null>(null);
  const initialGreetingComplete = useRef<boolean>(false);
  // Add audio reference for connecting sound
  const connectingSoundRef = useRef<HTMLAudioElement | null>(null);
  
  const params = useParams();
  const industry = params.industry as string;

  // Function to get industry-specific assistant name
  const getAssistantName = () => {
    const industryNames: Record<string, string> = {
      automotive: "Auto Assistant",
      beauty: "Beauty Advisor",
      health: "Health Guide",
      dental: "Dental Assistant",
      restaurant: "Food Concierge",
      fitness: "Fitness Coach",
      realestate: "Property Advisor",
      education: "Education Guide"
    };
    
    return industryNames[industry] || "AI Assistant";
  };

  const handleOpenAssistant = useCallback(async () => {
    setIsOpen(true);
    setIsLoading(true);
    setError(null);
    
    // Reset state from any previous call
    setCallId(null);
    setAccessToken(null);
    setAudioStatus('idle');
    
    // Initialize the audio here, when user has interacted with the page
    try {
      if (!connectingSoundRef.current) {
        console.log('Initializing connecting sound');
        connectingSoundRef.current = new Audio('/sounds/connecting.mp3');
        connectingSoundRef.current.loop = true;
        connectingSoundRef.current.volume = 0.3;
        // Preload the audio
        connectingSoundRef.current.load();
      }
    } catch (audioErr) {
      console.error('Error initializing audio:', audioErr);
    }
    
    // Log for debugging
    console.log('Opening assistant for industry:', industry);
    
    // Ensure we have an industry value
    const currentIndustry = industry || 'default';

    // PRODUCTION: Built-in retry mechanism
    const MAX_RETRIES = 2;
    let retryCount = 0;
    
    const attemptAPICall = async () => {
      try {
        // Start a conversation with Retell through our API route
        console.log(`Sending request to /api/retell (attempt ${retryCount + 1} of ${MAX_RETRIES + 1})`);
        
        // Add a timeout to the fetch call
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
        
        const response = await fetch('/api/retell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'start-conversation',
            industry: currentIndustry,
            userId: userInfo.userId || `anonymous-${Date.now()}`,
            userName: userInfo.userName,
            userEmail: userInfo.userEmail,
          }),
          signal: controller.signal
        }).finally(() => {
          clearTimeout(timeoutId);
        });

        // Log response status
        console.log('API response status:', response.status);
        
        // Get response data
        let data;
        try {
          data = await response.json();
          console.log('API response data:', data);
          // Detailed logging of the response structure
          console.log('Response contains callId:', !!data.callId);
          console.log('Response contains accessToken:', !!data.accessToken);
          console.log('Response structure:', Object.keys(data).join(', '));
        } catch (parseError) {
          console.error('Error parsing API response:', parseError);
          throw new Error('Invalid response from server');
        }
        
        if (!response.ok) {
          throw new Error(data.error || `Failed to start conversation: ${response.status}`);
        }
        
        // Check for the required data from the web call API
        if (!data.callId || !data.accessToken) {
          throw new Error('Missing required data from web call API');
        }
        
        // Set the call ID and access token
        setCallId(data.callId);
        setAccessToken(data.accessToken);
        setAudioStatus('connecting');
        
        // Set a timeout for connection - if we don't connect within 15 seconds, show an error
        const connectionTimeout = setTimeout(() => {
          if (audioStatus === 'connecting') {
            console.log('Connection timed out');
            setError('Connection is taking longer than expected. Please try again.');
            // Don't close automatically - let user retry or close
          }
        }, 15000);
        
        // Clean up timeout
        return () => clearTimeout(connectionTimeout);
      } catch (error) {
        console.error(`Failed to start conversation (attempt ${retryCount + 1}):`, error);
        
        // PRODUCTION: Retry logic for specific errors
        if (retryCount < MAX_RETRIES && (
          error instanceof TypeError || 
          error instanceof DOMException || 
          (error instanceof Error && error.message.includes('Failed to fetch'))
        )) {
          retryCount++;
          const delay = 1000 * Math.pow(2, retryCount); // Exponential backoff: 2s, 4s
          console.log(`Retrying in ${delay}ms...`);
          setError(`Connection issue. Retrying... (${retryCount}/${MAX_RETRIES})`);
          
          // Wait and retry
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptAPICall();
        }
        
        // If we've reached max retries or it's not a retryable error, handle appropriately
        // Handle specific error types
        if (error instanceof TypeError && error.message.includes('fetch')) {
          setError('Network error. Please check your internet connection.');
        } else if (error instanceof DOMException && error.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError(error instanceof Error ? error.message : 'Failed to connect to assistant');
        }
        
        setIsLoading(false);
        return null;
      }
    };
    
    // Start the API call process with retry capability
    return attemptAPICall();
  }, [industry, userInfo, audioStatus]);

  // Define critical functions before useEffect
  const handleCloseAssistant = useCallback(async () => {
    // Stop the call if it's active
    if (retellClient.current) {
      try {
        console.log('Stopping call with Retell client');
        retellClient.current.stopCall();
      } catch (err) {
        console.error('Error stopping Retell call:', err);
      }
    }
    
    setAudioStatus('idle');
    
    // For web calls, we don't need to explicitly end the call on the server
    // Just notify about the end if callback is provided
    if (callId && onConversationEnd) {
      onConversationEnd(callId, {});
    }
    
    // Reset state
    setCallId(null);
    setAccessToken(null);
    setIsOpen(false);
    
    // Call the onClose callback if provided
    if (onClose) {
      onClose();
    }
  }, [callId, onConversationEnd, onClose]);

  // Effect to handle initialOpen prop changes
  useEffect(() => {
    if (initialOpen && !isOpen) {
      handleOpenAssistant();
    }
  }, [initialOpen, isOpen, handleOpenAssistant]);

  // Initialize the RetellWebClient
  useEffect(() => {
    // Only initialize when the modal is open and we have valid callId and accessToken
    if (!isOpen || !callId || !accessToken) {
      console.log("Skipping Retell client initialization: Modal not open or missing credentials");
      return;
    }

    console.log("Initializing Retell Web Client");

    // Check browser support
    if (
      !window.AudioContext && 
      !(window as any).webkitAudioContext
    ) {
      setError("Your browser does not support AudioContext, which is required for calls.");
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser does not support getUserMedia, which is required for calls.");
      return;
    }

    // Clean up any existing client
    if (retellClient.current) {
      console.log("Cleaning up existing Retell client before creating new one");
      try {
        // Remove event listeners
        ['call_started', 'call_ended', 'agent_start_talking', 'agent_stop_talking'].forEach(event => {
          retellClient.current?.off(event as any);
        });

        // Stop any active call
        if (retellClient.current) {
          console.log("Stopping active call before creating new client");
          retellClient.current.stopCall();
        }
      } catch (cleanupError) {
        console.error("Error during cleanup of existing Retell client:", cleanupError);
      }
    }

    // Create a new client (with no arguments as per the API)
    console.log("Creating new RetellWebClient instance");
    retellClient.current = new RetellWebClient();

    // Set up event listeners
    setupEventListeners();

    // Function to set up event listeners
    function setupEventListeners() {
      console.log("Setting up Retell event listeners");
      
      retellClient.current?.on("call_started", () => {
        console.log("Retell call_started event received");
        setAudioStatus("listening");
        setError(null);
      });

      retellClient.current?.on("call_ended", () => {
        console.log("Retell call_ended event received");
        setAudioStatus("idle");
        setError(null);
      });

      retellClient.current?.on("agent_start_talking", () => {
        console.log("Retell agent_start_talking event received");
        setAudioStatus('speaking');
      });

      retellClient.current?.on("agent_stop_talking", () => {
        console.log("Retell agent_stop_talking event received");
        setAudioStatus('listening');
      });
    }

    // Handle LiveKit participant errors
    const handleLiveKitError = () => {
      console.log("Handling LiveKit participant error - will recreate client and retry");
      setError("Connection issue detected. Please wait while we reconnect...");
      setIsLoading(true); // Show loading state during reconnection
      
      // Stop current call if active
      if (retellClient.current) {
        console.log("Stopping active call due to LiveKit error");
        try {
          retellClient.current.stopCall();
        } catch (e) {
          console.error("Error stopping call:", e);
          // Continue with recovery regardless of stop error
        }
      }
      
      // Clean up existing client
      if (retellClient.current) {
        console.log("Removing event listeners from existing client");
        try {
          ['call_started', 'call_ended', 'agent_start_talking', 'agent_stop_talking'].forEach(event => {
            retellClient.current?.off(event as any);
          });
        } catch (e) {
          console.error("Error removing event listeners:", e);
          // Continue with recovery regardless of listener removal errors
        }
      }
      
      // Production-ready recovery: retry with exponential backoff
      // First retry after 1.5s, if that fails try again after longer delay
      let retryCount = 0;
      const maxRetries = 2;
      
      const attemptRecovery = () => {
        if (retryCount >= maxRetries) {
          console.error("Max retry attempts reached. Please try again later.");
          setError("Connection could not be established after multiple attempts. Please try again.");
          setIsLoading(false);
          return;
        }
        
        retryCount++;
        console.log(`LiveKit error recovery attempt ${retryCount} of ${maxRetries}`);
        
        // Recreate client
        try {
          console.log("Recreating RetellWebClient");
          retellClient.current = new RetellWebClient();
          
          // Set up new event listeners
          setupEventListeners();
          
          // Try to start call again
          console.log("Attempting to restart call after client recreation");
          requestMicrophonePermission();
        } catch (e) {
          console.error("Error during client recreation:", e);
          // If recreation fails, try again with longer delay
          const nextDelay = 1500 * Math.pow(2, retryCount);
          console.log(`Recovery attempt failed. Trying again in ${nextDelay}ms`);
          setTimeout(attemptRecovery, nextDelay);
        }
      };
      
      // Start recovery process with initial delay
      setTimeout(attemptRecovery, 1500);
    };

    // Handle unexpected connection state errors
    const handleUnexpectedConnectionState = () => {
      console.log("Handling unexpected connection state error");
      setError("Connection state error detected. Attempting to reconnect...");
      
      // Similar process to LiveKit error handler
      if (retellClient.current) {
        console.log("Stopping active call due to connection state error");
        retellClient.current.stopCall();
      }
      
      if (retellClient.current) {
        console.log("Removing event listeners from existing client");
        ['call_started', 'call_ended', 'agent_start_talking', 'agent_stop_talking'].forEach(event => {
          retellClient.current?.off(event as any);
        });
      }
      
      setTimeout(() => {
        console.log("Recreating RetellWebClient after connection state error");
        retellClient.current = new RetellWebClient();
        
        setupEventListeners();
        console.log("Attempting to restart call after client recreation");
        requestMicrophonePermission();
      }, 2000);
    };

    // Function to request microphone permission and start call
    const requestMicrophonePermission = () => {
      setAudioStatus("connecting");
      console.log("Requesting microphone permission");
      
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          console.log("Microphone permission granted");
          // Stop the stream immediately, we just needed permission
          stream.getTracks().forEach((track) => track.stop());
          
          // Add a slight delay before starting the call
          setTimeout(() => {
            startCall();
          }, 500);
        })
        .catch((err) => {
          console.error("Error getting microphone permission:", err);
          setError("Microphone access is required for voice calls.");
          setAudioStatus("idle");
        });
    };

    // Function to start the call with error handling
    const startCall = () => {
      if (!retellClient.current) {
        console.error("Cannot start call: Retell client not initialized");
        setError("Call setup failed. Please try again.");
        setAudioStatus("idle");
        return;
      }

      console.log("Starting Retell call with accessToken:", accessToken?.substring(0, 10) + "...");
      
      try {
        // Start call with hard-coded configuration for production reliability
        retellClient.current.startCall({
          accessToken: accessToken,
          // Fixed sample rate that works reliably
          sampleRate: 24000,
          // No additional properties that aren't supported by the type
        })
        .catch((error: any) => {
          console.error("Retell call error:", error);
          const errorMessage = error?.message || String(error);
          console.error("Error message:", errorMessage);
          
          // Update UI
          setAudioStatus("idle");
          
          // Handle specific error types with more detailed logging
          if (errorMessage.includes("UnexpectedConnectionState")) {
            console.log("Detected UnexpectedConnectionState error - attempting recovery");
            handleUnexpectedConnectionState();
          } 
          else if (errorMessage.includes("add a track for a participant") || 
                  errorMessage.includes("PA_") || 
                  errorMessage.includes("participant") ||
                  errorMessage.includes("LiveKit") ||
                  errorMessage.includes("not present") ||
                  errorMessage.includes("onTrackAdded") ||
                  errorMessage.includes("Room.reconnectedHandler")) {
            console.log("Detected LiveKit participant error - attempting recovery");
            handleLiveKitError();
          } else {
           // Generic error handling with more context
           console.error("Unhandled call error type:", errorMessage);
           setError(`Connection error: ${errorMessage}`);
          }
        });
      } catch (e) {
        console.error("Exception during startCall:", e);
        setError(`Call setup failed: ${e}`);
        setAudioStatus("idle");
      }
    };

    // Request microphone permissions to start the process
    requestMicrophonePermission();

    // Cleanup function
    return () => {
      console.log("Cleaning up Retell client on component unmount/re-render");
      if (retellClient.current) {
        try {
          // Remove all event listeners
          ['call_started', 'call_ended', 'agent_start_talking', 'agent_stop_talking'].forEach(event => {
            retellClient.current?.off(event as any);
          });
          
          // Stop any active call
          if (retellClient.current) {
            console.log("Stopping active call during cleanup");
            retellClient.current.stopCall();
          }
        } catch (cleanupError) {
          console.error("Error during Retell client cleanup:", cleanupError);
        }
      }
    };
  }, [isOpen, callId, accessToken]);

  // Updated effect to play connecting sound when status changes to connecting
  useEffect(() => {
    // Play sound when connecting, stop when not connecting
    if (audioStatus === 'connecting') {
      console.log('Attempting to play connecting sound');
      
      if (connectingSoundRef.current) {
        // Reset in case it was already playing
        connectingSoundRef.current.pause();
        connectingSoundRef.current.currentTime = 0;
        
        // Set initial volume
        connectingSoundRef.current.volume = 0;
        
        // Use a promise to handle play
        const playPromise = connectingSoundRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Successfully playing connecting sound');
              
              // Gradually increase volume for a fade-in effect
              let vol = 0;
              const interval = setInterval(() => {
                if (vol < 0.3) {
                  vol += 0.05;
                  if (connectingSoundRef.current) {
                    connectingSoundRef.current.volume = vol;
                  }
                } else {
                  clearInterval(interval);
                }
              }, 100);
            })
            .catch(err => {
              console.error('Error playing connecting sound:', err);
              // Try an alternative method for Safari
              if (connectingSoundRef.current) {
                try {
                  // For Safari and iOS, try this workaround
                  connectingSoundRef.current.muted = true;
                  connectingSoundRef.current.play()
                    .then(() => {
                      if (connectingSoundRef.current) {
                        connectingSoundRef.current.muted = false;
                        connectingSoundRef.current.volume = 0.3;
                      }
                      console.log('Safari workaround successful');
                    })
                    .catch(e => console.error('Safari workaround failed:', e));
                } catch (e) {
                  console.error('Alternative method failed:', e);
                }
              }
            });
        }
      }
    } else {
      if (connectingSoundRef.current) {
        console.log('Stopping connecting sound');
        connectingSoundRef.current.pause();
        connectingSoundRef.current.currentTime = 0;
      }
    }
    
    // Cleanup function
    return () => {
      if (connectingSoundRef.current) {
        connectingSoundRef.current.pause();
        connectingSoundRef.current.currentTime = 0;
      }
    };
  }, [audioStatus]);

  // Define the getStatusMessage function to return appropriate status messages
  const getStatusMessage = () => {
    if (error) {
      return "Connection error occurred";
    }
    
    if (isLoading) {
      return "Connecting to voice assistant...";
    }
    
    switch (audioStatus) {
      case 'speaking':
        return "Assistant is speaking";
      case 'listening':
        return "Assistant is listening";
      case 'connecting':
        return "Establishing connection...";
      case 'greeting':
        return "Starting conversation...";
      case 'idle':
      default:
        return "Ready to start a conversation";
    }
  };

  // Fix the handleStartCall reference issue by using handleOpenAssistant
  const handleStartCall = () => {
    if (audioStatus === 'idle') {
      handleOpenAssistant();
    }
  };

  // Handle stopping the call
  const handleStopCall = () => {
    console.log('Handling stop call, current status:', audioStatus);
    // Force stop call regardless of status
    handleCloseAssistant();
    // Manually reset UI state in case the callback didn't work
    setAudioStatus('idle');
    setIsLoading(false);
    setError(null);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          onClick={handleOpenAssistant}
          className="fixed z-50 flex items-center justify-center p-3 text-white rounded-full shadow-lg bottom-6 right-6 bg-teal-500 hover:bg-teal-600 transition-colors"
          aria-label="Open voice assistant"
        >
          <PhoneIcon className="w-6 h-6" />
        </motion.button>
      )}

      {/* Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={handleCloseAssistant}
              className="absolute p-1 text-gray-500 bg-white rounded-full hover:bg-gray-100 top-2 right-2"
              aria-label="Close voice assistant"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center justify-center mb-4">
              <h2 className="text-xl font-bold text-center text-gray-800 font-inter">{getAssistantName()}</h2>
              <p className="mt-1 text-sm text-center text-gray-500 font-inter">{getStatusMessage()}</p>
            </div>

            {/* Replace old audio status indicator with animated avatar */}
            <div className="flex flex-col items-center justify-center mb-6">
              <AnimatedAvatar 
                audioStatus={audioStatus === 'greeting' ? 'speaking' : audioStatus} 
                industry={industry}
                size="lg"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded">
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-center mt-4 space-x-3">
              {/* Disconnect button */}
              {audioStatus !== 'idle' && (
                <button
                  onClick={handleStopCall}
                  className="flex items-center justify-center px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 font-medium shadow-sm"
                >
                  End Call
                </button>
              )}
              
              {/* Connect button */}
              {audioStatus === 'idle' && (
                <button
                  onClick={handleStartCall}
                  className="flex items-center justify-center px-4 py-2 text-white rounded-lg bg-teal-500 hover:bg-teal-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Connecting...' : 'Start Call'}
                  {!isLoading && <MicrophoneIcon className="w-4 h-4 ml-2" />}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}; 