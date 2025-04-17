import React, { useEffect, useState, useCallback, useRef } from 'react';
import { VXClient, AudioStatus, ConversationResponse } from './vx-client';

export interface VXAssistantProps {
  // Required props
  apiKey: string;
  industry: string;
  userId: string;
  
  // Optional props
  apiBaseUrl?: string;
  userName?: string;
  userEmail?: string;
  clientOptions?: {
    debug?: boolean;
  };
  initialOpen?: boolean;
  onClose?: () => void;
  onConversationEnd?: (callId: string) => void;
  floatingButtonStyle?: React.CSSProperties;
  modalStyle?: React.CSSProperties;
  floatingButtonText?: string;
  debug?: boolean;
}

/**
 * VX Voice Assistant React Component
 * 
 * A React component that provides a complete voice assistant interface
 * using the VX Voice Assistant API.
 */
export const VXAssistant: React.FC<VXAssistantProps> = ({
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
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [conversationData, setConversationData] = useState<ConversationResponse | null>(null);
  const clientRef = useRef<VXClient | null>(null);
  
  // Initialize the client
  useEffect(() => {
    if (!apiKey) {
      setError('API key is required');
      return;
    }
    
    clientRef.current = new VXClient({
      apiKey,
      apiBaseUrl,
      debug: clientOptions?.debug || debug,
    });
    
    // Set up audio status listener
    const removeListener = clientRef.current.onAudioStatusChange((status, error) => {
      setAudioStatus(status);
      if (error) setError(error.message);
    });
    
    // Clean up on unmount
    return () => {
      removeListener();
      if (clientRef.current) {
        clientRef.current.cleanup();
        clientRef.current = null;
      }
    };
  }, [apiKey, apiBaseUrl, clientOptions?.debug, debug]);
  
  // Handle opening the assistant
  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  // Handle closing the assistant
  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (onClose) onClose();
    
    // End any active conversation
    if (conversationData && clientRef.current) {
      clientRef.current.stopCall();
      clientRef.current.endConversation(conversationData.callId)
        .then(() => {
          if (onConversationEnd) onConversationEnd(conversationData.callId);
          setConversationData(null);
        })
        .catch(err => {
          if (debug) console.error('Error ending conversation:', err);
        });
    }
  }, [conversationData, onClose, onConversationEnd, debug]);
  
  // Handle starting a call
  const handleStartCall = useCallback(async () => {
    if (!clientRef.current) {
      setError('Client not initialized');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Start the conversation
      const data = await clientRef.current.startConversation({
        industry,
        userId,
        userName,
        userEmail,
      });
      
      setConversationData(data);
      
      // Connect to the conversation
      await clientRef.current.connectToConversation(data.callId, data.accessToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
      if (debug) console.error('Error starting call:', err);
    } finally {
      setIsLoading(false);
    }
  }, [industry, userId, userName, userEmail, debug]);
  
  // Handle ending a call
  const handleEndCall = useCallback(async () => {
    if (!clientRef.current || !conversationData) {
      return;
    }
    
    clientRef.current.stopCall();
    
    try {
      await clientRef.current.endConversation(conversationData.callId);
      if (onConversationEnd) onConversationEnd(conversationData.callId);
      setConversationData(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end conversation');
      if (debug) console.error('Error ending call:', err);
    }
  }, [conversationData, onConversationEnd, debug]);
  
  // Get status message based on audio status
  const getStatusMessage = useCallback(() => {
    if (error) return error;
    
    switch (audioStatus) {
      case 'idle':
        return 'Ready to start';
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error connecting';
      default:
        return '';
    }
  }, [audioStatus, error]);
  
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
    border: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    ...floatingButtonStyle,
  };
  
  const baseModalStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '100px',
    right: '20px',
    width: '300px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    overflow: 'hidden',
    ...modalStyle,
  };
  
  // Render
  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          style={baseFloatingButtonStyle}
          onClick={handleOpen}
          title={floatingButtonText}
        >
          <PhoneIcon />
        </button>
      )}
      
      {/* Call modal */}
      {isOpen && (
        <div style={baseModalStyle}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontWeight: 'bold' }}>VX Assistant</div>
            <button
              onClick={handleClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <CloseIcon />
            </button>
          </div>
          
          {/* Status message */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '16px',
            color: error ? '#e53935' : '#666666',
            fontSize: '14px',
          }}>
            {getStatusMessage()}
          </div>
          
          {/* Canvas for visualization */}
          <canvas
            ref={canvasRef}
            width={260}
            height={100}
            style={{
              display: 'block',
              margin: '0 auto 16px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
            }}
          />
          
          {/* Call controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            {!conversationData && (
              <button
                onClick={handleStartCall}
                disabled={isLoading}
                style={{
                  backgroundColor: '#0066CC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: isLoading ? 'default' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? 'Starting...' : 'Start Call'}
              </button>
            )}
            
            {conversationData && (
              <button
                onClick={handleEndCall}
                style={{
                  backgroundColor: '#e53935',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                }}
              >
                End Call
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Helper components for icons
const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 15.5C18.75 15.5 17.55 15.3 16.43 14.93C16.08 14.82 15.69 14.9 15.41 15.17L13.21 17.37C10.38 15.93 8.06 13.62 6.62 10.78L8.82 8.57C9.1 8.31 9.18 7.92 9.07 7.57C8.7 6.45 8.5 5.25 8.5 4C8.5 3.45 8.05 3 7.5 3H4C3.45 3 3 3.45 3 4C3 13.39 10.61 21 20 21C20.55 21 21 20.55 21 20V16.5C21 15.95 20.55 15.5 20 15.5ZM19 12H21C21 7.03 16.97 3 12 3V5C15.87 5 19 8.13 19 12ZM15 12H17C17 9.24 14.76 7 12 7V9C13.66 9 15 10.34 15 12Z" fill="currentColor" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.25 4.8075L13.1925 3.75L9 7.9425L4.8075 3.75L3.75 4.8075L7.9425 9L3.75 13.1925L4.8075 14.25L9 10.0575L13.1925 14.25L14.25 13.1925L10.0575 9L14.25 4.8075Z" fill="#666666" />
  </svg>
);

// Helper for canvas ref
const canvasRef = React.createRef<HTMLCanvasElement>();

export default VXAssistant; 