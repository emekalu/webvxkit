# Implementing the Phone UI in Your Application

This guide provides detailed instructions for implementing the IDPrivacy Phone UI in your application. The Phone UI offers a modern, intuitive interface for voice interactions with the IDPrivacy AI assistant.

## Table of Contents

- [Overview](#overview)
- [Quick Integration](#quick-integration)
- [Customization Options](#customization-options)
- [Advanced Integration](#advanced-integration)
- [Styling Best Practices](#styling-best-practices)
- [Mobile Considerations](#mobile-considerations)
- [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)

## Overview

The Phone UI consists of two main components:

1. **Floating Phone Button**: A fixed-position button that appears in the corner of your application, typically featuring a phone icon.
2. **Call Modal**: A dialog that opens when the button is clicked, presenting an interface for voice interactions.

These components work together to create a seamless voice experience for your users.

## Quick Integration

The fastest way to add the Phone UI to your application is by using the `IDPrivacyAssistant` React component:

```jsx
import React from 'react';
import { IDPrivacyAssistant } from 'idprivacy-react-sdk';

function App() {
  return (
    <div className="app">
      {/* Your application content */}
      
      <IDPrivacyAssistant
        apiKey="your-api-key"
        apiBaseUrl="https://your-api-url.com/api/external/v1"
        industry="automotive"
        userId="user-123"
      />
    </div>
  );
}
```

This will add the default Phone UI to your application with minimal configuration.

## Customization Options

### Floating Button Customization

You can customize the appearance and behavior of the floating button using the following props:

```jsx
<IDPrivacyAssistant
  // Position (defaults to bottom right)
  floatingButtonStyle={{
    bottom: '30px',
    right: '30px',
    // Change to left positioning if needed
    // left: '30px',
    // right: 'auto',
    
    // Colors
    backgroundColor: '#4CAF50',
    color: 'white',
    
    // Size and shape
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    
    // Shadows and effects
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    
    // Additional styles
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    zIndex: 9999,
  }}
  
  // Button text (defaults to a phone icon only)
  floatingButtonText="Talk to Expert"
/>
```

### Call Modal Customization

Similarly, you can customize the call modal:

```jsx
<IDPrivacyAssistant
  modalStyle={{
    // Size
    width: '400px',
    maxWidth: '90vw',
    height: 'auto',
    
    // Appearance
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    
    // Position (centered by default)
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    
    // Internal spacing
    padding: '24px',
    
    // Other
    zIndex: 10000,
    overflow: 'hidden',
  }}
/>
```

### Complete Example

Here's a complete customization example:

```jsx
<IDPrivacyAssistant
  apiKey="your-api-key"
  apiBaseUrl="https://your-api-url.com/api/external/v1"
  industry="automotive"
  userId="user-123"
  floatingButtonText="Voice Assistant"
  floatingButtonStyle={{
    backgroundColor: '#3f51b5',
    color: 'white',
    borderRadius: '50%',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  }}
  modalStyle={{
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    width: '400px',
    maxWidth: '90vw',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    padding: '24px',
  }}
  initialOpen={false}
  onClose={() => console.log('Assistant closed')}
  onConversationEnd={(callId) => console.log('Conversation ended:', callId)}
/>
```

## Advanced Integration

### Button Placement Strategies

The placement of the floating button can significantly impact user experience. Consider these strategies:

1. **Bottom Right (Default)**: This is the standard position for chat and help buttons.
2. **Bottom Left**: This can be useful if you have other UI elements in the bottom right.
3. **Fixed to Content**: Instead of being fixed to the viewport, the button can be positioned relative to specific content.

Here's how to implement a content-relative button:

```jsx
function ProductPage() {
  return (
    <div className="product-container">
      <h1>Product Name</h1>
      <p>Product description...</p>
      
      <div style={{ position: 'relative', padding: '20px 0' }}>
        <IDPrivacyAssistant
          apiKey="your-api-key"
          apiBaseUrl="https://your-api-url.com/api/external/v1"
          industry="automotive"
          userId="user-123"
          floatingButtonStyle={{
            position: 'relative', // Override fixed positioning
            bottom: 'auto',
            right: 'auto',
            display: 'inline-flex',
          }}
          floatingButtonText="Ask about this product"
        />
      </div>
    </div>
  );
}
```

### Programmatic Control

You can control the Phone UI programmatically using refs:

```jsx
import React, { useRef } from 'react';
import { IDPrivacyAssistant } from 'idprivacy-react-sdk';

function App() {
  const assistantRef = useRef(null);
  
  const handleOpenAssistant = () => {
    if (assistantRef.current) {
      assistantRef.current.open();
    }
  };
  
  const handleStartCall = () => {
    if (assistantRef.current) {
      assistantRef.current.startCall();
    }
  };
  
  return (
    <div className="app">
      <button onClick={handleOpenAssistant}>Open Assistant</button>
      <button onClick={handleStartCall}>Start Call</button>
      
      <IDPrivacyAssistant
        ref={assistantRef}
        apiKey="your-api-key"
        apiBaseUrl="https://your-api-url.com/api/external/v1"
        industry="automotive"
        userId="user-123"
      />
    </div>
  );
}
```

### Conditional Rendering

You might want to show the Phone UI only in certain situations:

```jsx
function App() {
  const [showAssistant, setShowAssistant] = useState(false);
  
  useEffect(() => {
    // Show assistant after user has been on the page for 30 seconds
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
          apiBaseUrl="https://your-api-url.com/api/external/v1"
          industry="automotive"
          userId="user-123"
        />
      )}
    </div>
  );
}
```

## Styling Best Practices

### Brand Consistency

Ensure the Phone UI matches your brand:

1. Use your brand colors for the button and modal
2. Consider using your brand's icon instead of the default phone icon
3. Use consistent typography and styling

### Dark Mode Support

Implement dark mode detection and adjust styling accordingly:

```jsx
function App() {
  const [darkMode, setDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return (
    <div className="app">
      <IDPrivacyAssistant
        apiKey="your-api-key"
        apiBaseUrl="https://your-api-url.com/api/external/v1"
        industry="automotive"
        userId="user-123"
        floatingButtonStyle={{
          backgroundColor: darkMode ? '#303030' : '#4CAF50',
          color: darkMode ? '#ffffff' : '#ffffff',
        }}
        modalStyle={{
          backgroundColor: darkMode ? '#121212' : '#ffffff',
          color: darkMode ? '#e0e0e0' : '#212121',
        }}
      />
    </div>
  );
}
```

### Animation and Transitions

Consider adding subtle animations to make the Phone UI more engaging:

```jsx
<IDPrivacyAssistant
  floatingButtonStyle={{
    // Other styles...
    transition: 'all 0.3s ease',
    transform: 'scale(1)',
    ':hover': {
      transform: 'scale(1.1)',
    },
  }}
/>
```

## Mobile Considerations

### Responsive Design

The Phone UI is designed to be mobile-friendly, but consider these additional adjustments:

```jsx
function App() {
  const isMobile = window.innerWidth < 768;
  
  return (
    <div className="app">
      <IDPrivacyAssistant
        apiKey="your-api-key"
        apiBaseUrl="https://your-api-url.com/api/external/v1"
        industry="automotive"
        userId="user-123"
        floatingButtonStyle={{
          // Mobile optimizations
          bottom: isMobile ? '20px' : '30px',
          right: isMobile ? '20px' : '30px',
          width: isMobile ? '50px' : '60px',
          height: isMobile ? '50px' : '60px',
        }}
        modalStyle={{
          // Mobile optimizations
          width: isMobile ? '100%' : '400px',
          height: isMobile ? '100%' : 'auto',
          borderRadius: isMobile ? '0' : '12px',
          padding: isMobile ? '16px' : '24px',
        }}
      />
    </div>
  );
}
```

### Touch Optimization

For touch devices, ensure the button is large enough for comfortable tapping:

```jsx
<IDPrivacyAssistant
  floatingButtonStyle={{
    // Other styles...
    width: '60px', // Minimum 44px for touch targets
    height: '60px',
  }}
/>
```

## Accessibility

### ARIA Attributes

The Phone UI includes necessary ARIA attributes, but you can add custom ones:

```jsx
<IDPrivacyAssistant
  buttonAriaLabel="Open voice assistant"
  closeButtonAriaLabel="Close voice assistant"
  startCallButtonAriaLabel="Start voice call"
  endCallButtonAriaLabel="End voice call"
/>
```

### Keyboard Navigation

The Phone UI supports keyboard navigation, but ensure your page layout doesn't create obstacles to accessing the button via tab navigation.

## Troubleshooting

### Button Not Visible

If the floating button isn't visible:

1. Check if the z-index is high enough (default is 9999)
2. Ensure there are no CSS conflicts from your application
3. Verify the button isn't positioned outside the viewport

```jsx
<IDPrivacyAssistant
  floatingButtonStyle={{
    // Ensure visibility
    zIndex: 10000,
    bottom: '30px',
    right: '30px',
  }}
/>
```

### Modal Display Issues

If the modal doesn't display correctly:

1. Check if your application has styles that might override modal positioning
2. Ensure the z-index is higher than other elements
3. Verify there's no CSS that might be clipping the modal

```jsx
<IDPrivacyAssistant
  modalStyle={{
    // Fix display issues
    zIndex: 10001,
    overflow: 'visible',
  }}
/>
```

### Audio Visualization Not Working

If the audio visualization isn't working:

1. Ensure the canvas context is properly initialized
2. Check if there are browser compatibility issues
3. Verify that the audio status is being correctly updated

For more technical details on the Phone UI implementation, refer to [phone-ui.md](./phone-ui.md). 