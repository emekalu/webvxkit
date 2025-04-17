# IDPrivacy Voice Assistant SDK

A sophisticated SDK for integrating voice assistants into your web applications. This SDK provides both a React component for easy integration and a JavaScript client for more customized implementations.

## Table of Contents
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Phone UI Features](#phone-ui-features)
- [React Component](#react-component)
- [JavaScript/TypeScript Client](#javascripttypescript-client)
- [Direct API Access](#direct-api-access)
- [Configuration](#configuration)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Support](#support)

## Installation

Install the package using npm:

```bash
npm install idprivacy-react-sdk
```

Or using yarn:

```bash
yarn add idprivacy-react-sdk
```

## Quick Start

### React Integration

```jsx
import { IDPrivacyAssistant } from 'idprivacy-react-sdk';

function App() {
  return (
    <div className="app">
      <h1>My Application</h1>
      <IDPrivacyAssistant 
        apiKey="your-api-key" 
        industry="automotive" 
        userId="user123" 
      />
    </div>
  );
}
```

### JavaScript/TypeScript Integration

```typescript
import { IDPrivacyClient } from 'idprivacy-react-sdk';

// Initialize the client
const client = new IDPrivacyClient({
  apiKey: 'your-api-key',
  apiBaseUrl: 'https://your-api-base-url.com/api'
});

// Start a conversation
async function startConversation() {
  try {
    const { callId, accessToken } = await client.startConversation({
      industry: 'automotive',
      userId: 'user123'
    });
    
    // Connect to the conversation
    await client.connectToConversation(callId, accessToken);
  } catch (error) {
    console.error('Error starting conversation:', error);
  }
}
```

## Phone UI Features

The IDPrivacy Voice Assistant SDK provides a complete phone-like user interface for voice interactions:

### Floating Call Button
- A professional-looking phone button that floats at the bottom-right corner of your application
- Customizable color, position, and text
- Hoverable tooltip with call-to-action message

### Call Modal Interface
- A clean, modern modal that looks like a phone call interface
- Caller information with avatar and connection status
- Audio visualization during the call to provide visual feedback
- Call controls (start call and end call buttons)
- Status indicators that show the current state of the conversation

### Audio Status Visualization
- Visual feedback for different states:
  - Idle: Ready to start the call
  - Listening: When the assistant is listening to the user
  - Processing: When the assistant is processing the user's request
  - Speaking: When the assistant is speaking
  - Error: When an error occurs

Here's a breakdown of the key files that implement these features:

1. `IDPrivacyAssistant.tsx` - The main React component that implements the phone UI
2. `idprivacy-client.ts` - The client that handles the connection and audio status
3. `example-usage.tsx` - Shows how to integrate and customize the phone UI

## React Component

The `IDPrivacyAssistant` component provides a complete voice assistant interface with a phone-like UI.

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `apiKey` | string | Your API key |
| `industry` | string | Industry vertical for the voice assistant |
| `userId` | string | Unique identifier for the user |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiBaseUrl` | string | `"https://your-domain.com/api/external/v1"` | Base URL for the API |
| `userName` | string | | User's name for personalized interactions |
| `userEmail` | string | | User's email for identification |
| `clientOptions` | object | | Additional client options |
| `initialOpen` | boolean | `false` | Whether the assistant should be initially open |
| `onClose` | function | | Callback when the assistant is closed |
| `onConversationEnd` | function | | Callback when a conversation ends with the conversation ID |
| `floatingButtonStyle` | object | | Custom styles for the floating call button |
| `modalStyle` | object | | Custom styles for the call modal |
| `floatingButtonText` | string | `"Call Assistant"` | Custom text for the floating button tooltip |
| `debug` | boolean | `false` | Enable debug logging |

## JavaScript/TypeScript Client

The `IDPrivacyClient` class provides methods for interacting with the Voice Assistant API.

### Constructor

```typescript
const client = new IDPrivacyClient({
  apiKey: 'your-api-key',
  apiBaseUrl: 'https://your-api-base-url.com/api',
  debug: false
});
```

### Methods

#### startConversation

Starts a conversation with the voice assistant.

```typescript
const { callId, accessToken } = await client.startConversation({
  industry: 'automotive',
  userId: 'user123',
  userName: 'John Doe',
  userEmail: 'john@example.com'
});
```

#### endConversation

Ends an active conversation.

```typescript
await client.endConversation(callId);
```

#### connectToConversation

Connects to a conversation using the Retell Web Client.

```typescript
await client.connectToConversation(callId, accessToken, canvasElement);
```

#### stopCall

Stops the active call.

```typescript
client.stopCall();
```

#### onAudioStatusChange

Subscribes to audio status changes.

```typescript
const removeListener = client.onAudioStatusChange((status) => {
  console.log('Audio status:', status);
});

// Later, remove the listener
removeListener();
```

## Direct API Access

### Starting a Conversation

```javascript
// Using fetch
const response = await fetch('https://your-domain.com/api/external/v1/assistant', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    action: 'start',
    industry: 'automotive',
    userId: 'user123',
    userName: 'John Doe',
    userEmail: 'john@example.com'
  })
});

const data = await response.json();
// data contains callId and accessToken
```

### Ending a Conversation

```javascript
// Using fetch
await fetch('https://your-domain.com/api/external/v1/assistant', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    action: 'end',
    callId: 'existing-call-id'
  })
});
```

## Configuration

### Environment Variables

If you're deploying the API on your server, make sure to set the following environment variables:

```
RETELL_API_KEY=your-retell-api-key
API_SECRET_KEY=your-secret-api-key
```

## Customization

### Styling the React Component

You can customize the appearance of the component using the `floatingButtonStyle` and `modalStyle` props:

```jsx
<IDPrivacyAssistant
  apiKey="your-api-key"
  industry="automotive"
  userId="user123"
  floatingButtonStyle={{
    backgroundColor: '#4CAF50',
    bottom: '40px',
    right: '40px'
  }}
  modalStyle={{
    borderRadius: '16px',
    maxWidth: '400px'
  }}
/>
```

### Adjusting Agent Behavior

You can configure agent behavior using the `clientOptions` prop:

```jsx
<IDPrivacyAssistant
  apiKey="your-api-key"
  industry="automotive"
  userId="user123"
  clientOptions={{
    initialContext: "Customer is interested in electric vehicles.",
    agentSettings: {
      interruptionsEnabled: true,
      silenceTimeout: 3000
    }
  }}
/>
```

## Troubleshooting

### CORS Errors

If you encounter CORS errors, make sure your server is configured to allow requests from your domain.

### Authentication Errors

If you see authentication errors, check that you're using the correct API key and that it's properly configured on your server.

### Connection Issues

If the voice assistant fails to connect, ensure that:
1. Your browser supports the Web Audio API
2. The user has granted microphone permissions
3. Your internet connection is stable

### Debug Mode

Enable debug mode to see detailed logs:

```jsx
<IDPrivacyAssistant
  apiKey="your-api-key"
  industry="automotive"
  userId="user123"
  debug={true}
/>
```

## Support

For support and documentation, contact us at support@webvx.io or visit our [documentation](https://docs.webvx.io) 