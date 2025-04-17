# Implementing the Phone UI in Your Application

This guide provides step-by-step instructions for adding the IDPrivacy Voice Assistant with the Phone UI to your application. The Phone UI creates an intuitive, phone-like interface for users to interact with your voice assistant.

## Overview

The Phone UI consists of two main components:
1. **Floating Phone Button** - A phone icon button that appears in the corner of your application
2. **Call Modal** - A dialog that opens when the button is clicked, containing the call interface

## Quick Start

### Step 1: Install the SDK

```bash
npm install idprivacy-react-sdk
# or
yarn add idprivacy-react-sdk
```

### Step 2: Import and Add the Component

```jsx
import { IDPrivacyAssistant } from 'idprivacy-react-sdk';

function MyApp() {
  return (
    <div className="app">
      {/* Your application content */}
      
      <IDPrivacyAssistant
        apiKey="your-api-key"
        industry="automotive"
        userId="user123"
      />
    </div>
  );
}
```

That's it! With just these few lines of code, you've added the IDPrivacy Voice Assistant with the Phone UI to your application.

## Component Placement

The Phone UI's floating button is positioned in the bottom-right corner of the screen by default. You can customize its position using the `floatingButtonStyle` prop:

```jsx
<IDPrivacyAssistant
  apiKey="your-api-key"
  industry="automotive"
  userId="user123"
  floatingButtonStyle={{
    bottom: '20px',
    right: '20px',
    // Other CSS properties
  }}
/>
```

## Customizing the Phone UI

### Floating Button Customization

You can customize the appearance of the floating button:

```jsx
<IDPrivacyAssistant
  // Required props
  apiKey="your-api-key"
  industry="automotive"
  userId="user123"
  
  // Customization props
  floatingButtonStyle={{
    backgroundColor: '#4285F4',  // Change button color
    width: '70px',               // Adjust size
    height: '70px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',  // Customize shadow
    borderRadius: '50%',         // Keep it circular
  }}
  floatingButtonText="Call Assistant"  // Change the button text (appears on hover)
/>
```

### Call Modal Customization

You can also customize the call modal dialog:

```jsx
<IDPrivacyAssistant
  // Required props
  apiKey="your-api-key"
  industry="automotive"
  userId="user123"
  
  // Modal customization
  modalStyle={{
    backgroundColor: '#ffffff',        // Background color
    borderRadius: '12px',              // Rounded corners
    width: '350px',                    // Width
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',  // Shadow
    fontFamily: 'Arial, sans-serif',   // Font
  }}
/>
```

## Advanced Implementation

### Conditional Rendering

You may want to show the Phone UI only in certain situations:

```jsx
function MyApp() {
  const [showAssistant, setShowAssistant] = useState(false);
  
  // Show the assistant after user has been active for 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAssistant(true);
    }, 30000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="app">
      {/* Your application content */}
      
      {showAssistant && (
        <IDPrivacyAssistant
          apiKey="your-api-key"
          industry="automotive"
          userId="user123"
        />
      )}
    </div>
  );
}
```

### Programmatic Control

You can use refs to programmatically control the Phone UI:

```jsx
function MyApp() {
  const assistantRef = useRef();
  
  const handleHelpButtonClick = () => {
    // Programmatically open the assistant
    assistantRef.current.open();
  };
  
  return (
    <div className="app">
      <button onClick={handleHelpButtonClick}>
        Get Help
      </button>
      
      <IDPrivacyAssistant
        ref={assistantRef}
        apiKey="your-api-key"
        industry="automotive"
        userId="user123"
      />
    </div>
  );
}
```

This approach is useful when you want to open the assistant from different parts of your application.

### Event Handling

You can respond to various events from the Phone UI:

```jsx
function MyApp() {
  const handleAssistantClose = () => {
    console.log('Assistant closed');
    // Track analytics, update UI, etc.
  };
  
  const handleConversationEnd = (callId) => {
    console.log(`Conversation ${callId} ended`);
    // Save conversation data, show feedback form, etc.
  };
  
  return (
    <div className="app">
      <IDPrivacyAssistant
        apiKey="your-api-key"
        industry="automotive"
        userId="user123"
        onClose={handleAssistantClose}
        onConversationEnd={handleConversationEnd}
      />
    </div>
  );
}
```

## Best Practices

### Consistent Button Placement

We recommend placing the floating button in a location that:
- Is easily accessible (typically bottom-right or bottom-left)
- Doesn't obstruct important content
- Remains consistent across your application

### Mobile-Friendly Considerations

For mobile devices:
- Consider making the button slightly larger (`width: '70px', height: '70px'`)
- Ensure it doesn't block important mobile UI elements
- Test thoroughly on various mobile devices

Example mobile-optimized configuration:

```jsx
<IDPrivacyAssistant
  apiKey="your-api-key"
  industry="automotive"
  userId="user123"
  floatingButtonStyle={{
    bottom: '25px',
    right: '25px',
    width: '70px',
    height: '70px',
    zIndex: 999999, // Ensure it appears above all content
  }}
/>
```

### Accessibility Considerations

The Phone UI is designed with accessibility in mind, but you can enhance it:

```jsx
<IDPrivacyAssistant
  apiKey="your-api-key"
  industry="automotive"
  userId="user123"
  floatingButtonText="Voice Assistant" // Clear, descriptive text for screen readers
  // Additional ARIA attributes are automatically applied
/>
```

## Integration Examples

### Basic Website Integration

```jsx
import React from 'react';
import { IDPrivacyAssistant } from 'idprivacy-react-sdk';

function Website() {
  return (
    <div>
      <header>
        <h1>My Automotive Website</h1>
        <nav>{/* Navigation items */}</nav>
      </header>
      
      <main>
        {/* Website content */}
      </main>
      
      <footer>
        {/* Footer content */}
      </footer>
      
      <IDPrivacyAssistant
        apiKey="your-api-key"
        industry="automotive"
        userId="user123"
      />
    </div>
  );
}
```

### E-commerce Integration

```jsx
import React, { useEffect, useState } from 'react';
import { IDPrivacyAssistant } from 'idprivacy-react-sdk';

function EcommerceStore() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  // Load user data from your auth system
  useEffect(() => {
    // Example of loading user data
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserId(parsedUser.id);
      setUserName(parsedUser.name);
      setUserEmail(parsedUser.email);
    }
  }, []);
  
  return (
    <div className="store">
      {/* E-commerce store content */}
      
      {userId && (
        <IDPrivacyAssistant
          apiKey="your-api-key"
          industry="automotive"
          userId={userId}
          userName={userName}
          userEmail={userEmail}
          floatingButtonText="Shopping Assistant"
        />
      )}
    </div>
  );
}
```

### Single-Page Application (SPA) Integration

```jsx
import React, { useContext } from 'react';
import { IDPrivacyAssistant } from 'idprivacy-react-sdk';
import { UserContext } from './UserContext';
import { ThemeContext } from './ThemeContext';

function SPA() {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  
  // Only show the assistant if the user is logged in
  if (!user) {
    return <div className="app">{/* App content for logged-out users */}</div>;
  }
  
  // Customize assistant based on app theme
  const buttonColor = theme === 'dark' ? '#8ab4f8' : '#4285F4';
  const buttonTextColor = theme === 'dark' ? '#ffffff' : '#ffffff';
  
  return (
    <div className="app">
      {/* App content for logged-in users */}
      
      <IDPrivacyAssistant
        apiKey="your-api-key"
        apiBaseUrl="https://your-api.example.com/api/external/v1"
        industry="automotive"
        userId={user.id}
        userName={user.name}
        userEmail={user.email}
        floatingButtonStyle={{
          backgroundColor: buttonColor,
          color: buttonTextColor,
          // Positioned in the bottom-right corner
          bottom: '30px',
          right: '30px',
        }}
      />
    </div>
  );
}
```

## Troubleshooting

### Button Not Visible

If the floating button isn't visible:

1. Check z-index - The button might be behind other elements
   ```jsx
   floatingButtonStyle={{
     zIndex: 9999, // Increase this value
   }}
   ```

2. Check positioning - The button might be positioned outside the viewport
   ```jsx
   floatingButtonStyle={{
     bottom: '30px', // Adjust these values
     right: '30px',
   }}
   ```

3. Check if it's being conditionally rendered
   ```jsx
   // Make sure the condition for rendering is true
   {showAssistant && <IDPrivacyAssistant ... />}
   ```

### Modal Display Issues

If the call modal doesn't display correctly:

1. Add a width constraint
   ```jsx
   modalStyle={{
     width: '350px',
     maxWidth: '90vw', // Prevents overflow on mobile
   }}
   ```

2. Check browser compatibility
   - The modal uses modern CSS features
   - Ensure your application supports the same browsers as the SDK

### Audio Connection Problems

If there are issues with the audio connection:

1. Make sure the user has granted microphone permissions
2. Check browser compatibility (WebRTC is required)
3. Enable debug mode to see detailed logs:
   ```jsx
   <IDPrivacyAssistant
     debug={true}
     // Other props
   />
   ```

## Complete Example

Here's a complete example demonstrating various customization options:

```jsx
import React, { useState, useRef } from 'react';
import { IDPrivacyAssistant } from 'idprivacy-react-sdk';

function App() {
  const [lastCallId, setLastCallId] = useState(null);
  const assistantRef = useRef();
  
  const handleOpenClick = () => {
    assistantRef.current.open();
  };
  
  const handleConversationEnd = (callId) => {
    setLastCallId(callId);
    // You could store conversation data, show a feedback form, etc.
  };
  
  return (
    <div className="app">
      <header>
        <h1>My Automotive Application</h1>
      </header>
      
      <main>
        <button onClick={handleOpenClick}>
          Get Voice Assistance
        </button>
        
        {lastCallId && (
          <div className="previous-conversation">
            <p>Your last conversation ID: {lastCallId}</p>
            <button onClick={() => window.alert('Feature not implemented')}>
              View Transcript
            </button>
          </div>
        )}
      </main>
      
      <IDPrivacyAssistant
        ref={assistantRef}
        apiKey="your-api-key"
        apiBaseUrl="https://your-api.example.com/api/external/v1"
        industry="automotive"
        userId="user123"
        userName="John Doe"
        userEmail="john@example.com"
        
        // Initial state - whether the assistant is open when first loaded
        initialOpen={false}
        
        // Event handlers
        onClose={() => console.log('Assistant closed')}
        onConversationEnd={handleConversationEnd}
        
        // Styling
        floatingButtonStyle={{
          backgroundColor: '#4285F4',
          color: 'white',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          zIndex: 9999,
        }}
        modalStyle={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          width: '350px',
          maxWidth: '90vw',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          fontFamily: 'Arial, sans-serif',
        }}
        
        // Button text - visible on hover and for screen readers
        floatingButtonText="Talk to Assistant"
        
        // Enable debug logging
        debug={false}
      />
    </div>
  );
}

export default App;
```

## Next Steps

- Check out the [SDK README](../README.md) for more configuration options
- Explore the [Technical Implementation Guide](./phone-ui.md) for developer details
- See the [SDK Example](./example-usage.tsx) for more usage patterns 