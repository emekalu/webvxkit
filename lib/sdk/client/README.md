# IDPrivacy Phone UI Component

A modern, intuitive phone button interface for voice conversations with the IDPrivacy AI assistant.

![Phone UI Preview](../images/phone-ui-preview.png)

## Overview

The Phone UI component provides a familiar phone-call interface for accessing the IDPrivacy voice assistant. It consists of:

1. **Floating Phone Button**: A fixed-position button that appears in the corner of your application
2. **Call Modal**: A clean, modern interface that appears when the button is clicked

## Key Features

- **One-Click Integration**: Add the phone interface to your app with a single component
- **Floating Button**: Prominent, accessible button that's always available to users
- **Visual Feedback**: Real-time audio visualization shows conversation status
- **Customizable**: Easily adjust colors, position, size, and text
- **Responsive**: Works on desktop and mobile devices

## Installation

```bash
# Using npm
npm install idprivacy-phone-ui

# Using yarn
yarn add idprivacy-phone-ui
```

## Quick Start

```jsx
import React from 'react';
import { IDPrivacyPhoneUI } from 'idprivacy-phone-ui';

function App() {
  return (
    <div className="App">
      <h1>My Application</h1>
      
      {/* Add the phone UI */}
      <IDPrivacyPhoneUI
        apiKey="your-api-key"
        apiBaseUrl="https://your-api-url.com/api/external/v1"
        industry="automotive"
        userId="user-123"
      />
    </div>
  );
}
```

## Configuration

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `apiKey` | string | Your IDPrivacy API key for authentication |
| `apiBaseUrl` | string | The base URL for the IDPrivacy API |
| `industry` | string | The industry vertical (e.g., "automotive", "healthcare") |
| `userId` | string | Unique identifier for the user |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `userName` | string | `""` | User's name for personalization |
| `userEmail` | string | `""` | User's email for identification |
| `initialOpen` | boolean | `false` | Whether to open the call modal on mount |
| `onClose` | function | `undefined` | Callback when modal is closed |
| `onConversationEnd` | function | `undefined` | Callback when conversation ends |
| `floatingButtonStyle` | object | `{}` | Custom styles for the phone button |
| `modalStyle` | object | `{}` | Custom styles for the call modal |
| `floatingButtonText` | string | `"Talk to Assistant"` | Text for the phone button |
| `debug` | boolean | `false` | Enable debug mode for logging |

## Customizing the Phone Button

```jsx
<IDPrivacyPhoneUI
  // ...other props
  floatingButtonStyle={{
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '50%',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
  }}
  floatingButtonText="Ask Expert"
/>
```

## Customizing the Call Modal

```jsx
<IDPrivacyPhoneUI
  // ...other props
  modalStyle={{
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    width: '400px', 
    maxWidth: '90vw',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  }}
/>
```

## Implementation Details

The phone UI is implemented in the following files:

- `IDPrivacyPhoneUI.tsx`: Main React component that renders the phone button and call modal
- `IDPrivacyClient.ts`: Client for communicating with the IDPrivacy API
- `AudioVisualizer.tsx`: Component that provides visual feedback for different audio states
- `styles.ts`: Styling for the phone UI components

### Audio States

The UI provides real-time visual feedback about the current audio state:

```typescript
export type AudioStatus = 'idle' | 'connecting' | 'connected' | 'listening' | 'processing' | 'speaking' | 'disconnected' | 'error';
```

Each state has a corresponding visual representation in the call modal:

- **Idle**: Default state before call starts
- **Connecting**: Connecting to the voice service
- **Connected**: Successfully connected, ready for conversation
- **Listening**: When the assistant is listening to the user
- **Processing**: When processing user input
- **Speaking**: When the assistant is speaking
- **Disconnected**: Call has ended
- **Error**: An error occurred during the call

## Programmatic Control

You can programmatically control the phone UI by using refs:

```jsx
import React, { useRef } from 'react';
import { IDPrivacyPhoneUI, IDPrivacyPhoneUIRef } from 'idprivacy-phone-ui';

function App() {
  const phoneUIRef = useRef<IDPrivacyPhoneUIRef>(null);

  const openCall = () => {
    phoneUIRef.current?.open();
  };

  const closeCall = () => {
    phoneUIRef.current?.close();
  };

  return (
    <div>
      <button onClick={openCall}>Open Call</button>
      <button onClick={closeCall}>Close Call</button>
      
      <IDPrivacyPhoneUI
        ref={phoneUIRef}
        apiKey="your-api-key"
        apiBaseUrl="https://your-api-url.com/api/external/v1"
        industry="automotive"
        userId="user-123"
      />
    </div>
  );
}
```

## Troubleshooting

### Phone Button Not Appearing

If the phone button doesn't appear:

1. Check that the component is being rendered in your application
2. Ensure there are no CSS conflicts hiding the button
3. Verify that the component is not hidden by other elements
4. Check for errors in your browser console

### Call Not Connecting

If the call doesn't connect:

1. Ensure your browser supports WebRTC
2. Check that microphone permissions are granted
3. Verify your API key and API base URL
4. Enable debug mode to see detailed logs:

```jsx
<IDPrivacyPhoneUI
  // ...other props
  debug={true}
/>
```

## Support

For additional support:

- Email: support@idprivacy.ai
- Documentation: https://docs.idprivacy.ai/phone-ui
- GitHub Issues: https://github.com/idprivacy/idprivacy-phone-ui/issues 