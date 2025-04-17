import React, { useState } from 'react';
import { IDPrivacyAssistant } from './IDPrivacyAssistant';

/**
 * Example usage component for the IDPrivacy Voice Assistant
 */
const ExampleUsage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastCallId, setLastCallId] = useState<string | null>(null);
  
  const handleOpen = () => {
    setIsOpen(true);
  };
  
  const handleConversationEnd = (callId: string) => {
    console.log('Conversation ended with ID:', callId);
    setLastCallId(callId);
  };
  
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1>IDPrivacy Voice Assistant Example</h1>
      
      {/* Description of the phone UI experience */}
      <div style={{ marginBottom: '40px' }}>
        <h2>Phone-like UI Experience</h2>
        <p>
          The IDPrivacy Voice Assistant provides a phone-like interface for interacting with voice AI:
        </p>
        <ul>
          <li><strong>Floating Call Button:</strong> A circular button appears in the bottom right of your screen</li>
          <li><strong>Call Modal:</strong> When clicked, a phone-like interface appears with controls</li>
          <li><strong>Audio Visualizer:</strong> Visual feedback for the audio conversation</li>
          <li><strong>Call Controls:</strong> Buttons to start and end the voice conversation</li>
        </ul>
        
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleOpen}
            style={{
              backgroundColor: '#0066CC',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Open Voice Assistant
          </button>
        </div>
        
        {lastCallId && (
          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <strong>Last conversation ID:</strong> {lastCallId}
          </div>
        )}
      </div>
      
      {/* Integration Guide */}
      <div>
        <h2>Integration Guide</h2>
        
        <h3>Installation</h3>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '8px', 
          overflow: 'auto' 
        }}>
          npm install idprivacy-react-sdk
        </pre>
        
        <h3>Basic Usage</h3>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '8px', 
          overflow: 'auto' 
        }}>
{`import React from 'react';
import { IDPrivacyAssistant } from 'idprivacy-react-sdk';

const App = () => {
  return (
    <div>
      <h1>My Application</h1>
      <IDPrivacyAssistant
        apiKey="your-api-key"
        industry="automotive"
        userId="user-123"
      />
    </div>
  );
};`}
        </pre>
        
        <h3>Required Props</h3>
        <ul>
          <li><strong>apiKey:</strong> Your IDPrivacy API key</li>
          <li><strong>industry:</strong> The industry vertical for the voice assistant</li>
          <li><strong>userId:</strong> Unique identifier for the current user</li>
        </ul>
        
        <h3>Optional Props</h3>
        <ul>
          <li><strong>apiBaseUrl:</strong> Custom API base URL</li>
          <li><strong>userName:</strong> User's name for personalized interactions</li>
          <li><strong>userEmail:</strong> User's email for identification</li>
          <li><strong>initialOpen:</strong> Whether the assistant should be initially open</li>
          <li><strong>onClose:</strong> Callback when the assistant is closed</li>
          <li><strong>onConversationEnd:</strong> Callback when a conversation ends</li>
          <li><strong>floatingButtonStyle:</strong> Custom styles for the floating button</li>
          <li><strong>modalStyle:</strong> Custom styles for the modal</li>
          <li><strong>floatingButtonText:</strong> Custom text for the floating button</li>
          <li><strong>debug:</strong> Enable debug logging</li>
        </ul>
      </div>
      
      {/* The actual IDPrivacyAssistant component */}
      <IDPrivacyAssistant
        apiKey="your-api-key"
        apiBaseUrl="https://api.example.com"
        industry="automotive"
        userId="user-123"
        initialOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConversationEnd={handleConversationEnd}
        floatingButtonStyle={{
          backgroundColor: '#0066CC',
        }}
        modalStyle={{
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        }}
        floatingButtonText="Talk to Assistant"
        debug={true}
      />
    </div>
  );
};

export default ExampleUsage; 