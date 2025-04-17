import React, { useState, useEffect, useRef } from 'react';
import { WebVXClient, AudioStatus, ConversationResponse } from './webvx-client';

/**
 * Props for the VoiceAssistant component
 */
export interface VoiceAssistantProps {
  /** Your API key */
  apiKey: string;
  
  /** Base URL for the API */
  apiBaseUrl?: string;
  
  /** Industry vertical for the voice assistant */
  industry: string;
  
  /** Unique identifier for the user */
  userId: string;
  
  /** User's name for personalized interactions */
  userName?: string;
  
  /** User's email for identification */
  userEmail?: string;
  
  /** Additional client options */
  clientOptions?: Record<string, any>;
  
  /** Whether the assistant is initially open */
  initialOpen?: boolean;
  
  /** Callback when the assistant is closed */
  onClose?: () => void;
  
  /** Callback when a conversation ends */
  onConversationEnd?: (callId: string) => void;
  
  /** Custom style for the floating button */
  floatingButtonStyle?: React.CSSProperties;
  
  /** Custom style for the modal */
  modalStyle?: React.CSSProperties;
  
  /** Text for the floating button */
  floatingButtonText?: string;
  
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * VoiceAssistant Component
 * 
 * A phone-like UI for voice interactions with the WebVX Voice Assistant.
 * Displays a floating call button that opens a modal with call controls.
 */
export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  apiKey,
  apiBaseUrl,
  industry,
  userId,
  userName,
  userEmail,
  clientOptions,
  initialOpen = false,
  onClose,
  onConversationEnd,
  floatingButtonStyle,
  modalStyle,
  floatingButtonText = 'Talk to Assistant',
  debug = false,
}) => {
  // State variables
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationResponse | null>(null);
  
  // Refs
  const clientRef = useRef<WebVXClient | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Initialize client
  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new WebVXClient({
        apiKey,
        apiBaseUrl,
        debug,
      });
      
      // Set up audio status listener
      const removeListener = clientRef.current.onAudioStatusChange(status => {
        setAudioStatus(status);
        
        if (status === 'error') {
          setError('An error occurred with the voice connection');
        }
      });
      
      return () => {
        removeListener();
        if (clientRef.current) {
          clientRef.current.cleanup();
          clientRef.current = null;
        }
      };
    }
  }, [apiKey, apiBaseUrl, debug]);
  
  // Handle opening the assistant
  const handleOpen = () => {
    setIsOpen(true);
  };
  
  // Handle closing the assistant
  const handleClose = () => {
    if (conversation) {
      handleEndCall();
    }
    
    setIsOpen(false);
    
    if (onClose) {
      onClose();
    }
  };
  
  // Handle starting a call
  const handleStartCall = async () => {
    if (!clientRef.current) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Start a conversation
      const conversationData = await clientRef.current.startConversation({
        industry,
        userId,
        userName,
        userEmail,
        clientOptions,
      });
      
      setConversation(conversationData);
      
      // Connect to the conversation
      await clientRef.current.connectToConversation(
        conversationData.callId,
        conversationData.accessToken,
        canvasRef.current
      );
      
      setIsLoading(false);
    } catch (error) {
      if (debug) {
        console.error('Error starting call:', error);
      }
      
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'Failed to start call');
    }
  };
  
  // Handle ending a call
  const handleEndCall = async () => {
    if (!clientRef.current || !conversation) return;
    
    try {
      // Stop the call
      clientRef.current.stopCall();
      
      // End the conversation
      await clientRef.current.endConversation(conversation.callId);
      
      // Notify callback
      if (onConversationEnd) {
        onConversationEnd(conversation.callId);
      }
      
      setConversation(null);
    } catch (error) {
      if (debug) {
        console.error('Error ending call:', error);
      }
      
      setError(error instanceof Error ? error.message : 'Failed to end call');
    }
  };
  
  // Get status message
  const getStatusMessage = () => {
    if (error) return error;
    if (isLoading) return 'Starting call...';
    
    switch (audioStatus) {
      case 'idle':
        return conversation ? 'Ready to talk' : 'Start a call to begin';
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      case 'speaking':
        return 'Speaking...';
      case 'error':
        return 'An error occurred';
      default:
        return '';
    }
  };
  
  // Determine main button text
  const getMainButtonText = () => {
    if (conversation) {
      return 'End Call';
    }
    
    if (isLoading) {
      return 'Starting...';
    }
    
    return 'Start Call';
  };
  
  // Determine main button disabled state
  const isMainButtonDisabled = isLoading;
  
  // Determine main button click handler
  const handleMainButtonClick = conversation ? handleEndCall : handleStartCall;
  
  // Base styles
  const baseFloatingButtonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#0066CC',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    border: 'none',
    zIndex: 1000,
    ...floatingButtonStyle,
  };
  
  const baseModalStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '100px',
    right: '20px',
    width: '300px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1001,
    ...modalStyle,
  };
  
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f8f8f8',
  };
  
  const bodyStyle: React.CSSProperties = {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '200px',
  };
  
  const canvasStyle: React.CSSProperties = {
    width: '100%',
    height: '120px',
    marginBottom: '16px',
    borderRadius: '8px',
    backgroundColor: '#f8f8f8',
  };
  
  const statusStyle: React.CSSProperties = {
    marginBottom: '16px',
    textAlign: 'center',
    fontSize: '14px',
    color: error ? '#e53935' : '#666',
  };
  
  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: conversation ? '#e53935' : '#0066CC',
    color: 'white',
    fontSize: '14px',
    cursor: isMainButtonDisabled ? 'not-allowed' : 'pointer',
    opacity: isMainButtonDisabled ? 0.7 : 1,
    width: '100%',
    maxWidth: '200px',
  };
  
  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#666',
  };
  
  const phoneIconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
  };
  
  return (
    <>
      {/* Floating call button */}
      <button
        style={baseFloatingButtonStyle}
        onClick={handleOpen}
        aria-label="Open voice assistant"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          style={phoneIconStyle}
        >
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
        </svg>
      </button>
      
      {/* Call modal */}
      {isOpen && (
        <div style={baseModalStyle}>
          <div style={headerStyle}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Voice Assistant</h3>
            <button
              style={closeButtonStyle}
              onClick={handleClose}
              aria-label="Close voice assistant"
            >
              ✕
            </button>
          </div>
          
          <div style={bodyStyle}>
            <canvas
              ref={canvasRef}
              style={canvasStyle}
              width={300}
              height={120}
            />
            
            <div style={statusStyle}>
              {getStatusMessage()}
            </div>
            
            <button
              style={buttonStyle}
              onClick={handleMainButtonClick}
              disabled={isMainButtonDisabled}
            >
              {getMainButtonText()}
            </button>
          </div>
        </div>
      )}
    </>
  );
}; 