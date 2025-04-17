# Voice Experience (VX) Package

This package contains all the components, services, and assets needed to integrate the "Talk to VX" voice assistant functionality into your Next.js project.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [Basic Usage](#basic-usage)
- [Component Reference](#component-reference)
- [Customization](#customization)
- [API Integration](#api-integration)
- [Troubleshooting](#troubleshooting)

## Overview

The Voice Experience (VX) package provides a complete solution for adding AI voice assistant capabilities to your application. The main features include:

- Interactive "Talk to VX" button with animations
- Voice assistant dialog with real-time voice interactions
- Text-to-speech and speech-to-text capabilities
- Animated avatar with visual feedback during conversations
- Industry-specific voice agent configurations
- API integration with Retell for voice processing

## Getting Started

### 1. Installation

Copy the entire `vx` directory into your Next.js project.

### 2. Install Dependencies

Add the following dependencies to your project:

```bash
npm install framer-motion @heroicons/react tsparticles @tsparticles/react @tsparticles/engine retell-client-js-sdk
```

### 3. Environment Variables

Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
NEXT_PUBLIC_RETELL_API_KEY=your_retell_api_key
RETELL_API_KEY=your_retell_api_key  # Server-side key
```

## Dependencies

- Next.js 13+ with App Router
- React 18+
- TypeScript 5+
- ElevenLabs API for text-to-speech
- Retell API for voice conversations
- Tailwind CSS (for styling)

## Basic Usage

### Adding the Talk to VX Button

```tsx
import React, { useState } from 'react';
import AIButton from 'path-to-vx/components/ui/ai-button';
import { VoiceAssistant } from 'path-to-vx/components/ui/voice-assistant';

export default function YourComponent() {
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  const handleOpenVoiceAssistant = () => {
    setShowVoiceAssistant(true);
  };

  const handleCloseVoiceAssistant = () => {
    setShowVoiceAssistant(false);
  };

  return (
    <div>
      <h1>Your Page Title</h1>
      
      <AIButton 
        onClick={handleOpenVoiceAssistant}
        className="min-w-[150px]"
      >
        Talk to VX
      </AIButton>
      
      {/* Voice assistant */}
      <VoiceAssistant
        initialOpen={showVoiceAssistant}
        onClose={handleCloseVoiceAssistant}
        userInfo={{
          userId: `user-${Date.now()}`,
        }}
      />
    </div>
  );
}
```

### Using the Hero Section with the Button

If you want to use the complete hero section with the Talk to VX button:

```tsx
import Hero from 'path-to-vx/components/sections/hero';

export default function HomePage() {
  return (
    <main>
      <Hero 
        title="Revolutionize Your Industry with AI Voice Assistants" 
        description="Intelligent voice assistants that understand your needs and deliver personalized service."
        image="/your-hero-image.png"
      />
      
      {/* Other content */}
    </main>
  );
}
```

## Component Reference

### Main Components

1. **VoiceAssistant**: The core component that provides the voice assistant functionality.
   ```tsx
   <VoiceAssistant
     initialOpen={boolean}
     onClose={() => void}
     userInfo={{
       userId: string,
       userName?: string,
       userEmail?: string,
     }}
   />
   ```

2. **AIButton**: A button with AI-themed animations.
   ```tsx
   <AIButton
     onClick={() => void}
     className?: string
     href?: string
   >
     Button Text
   </AIButton>
   ```

3. **AnimatedAvatar**: Visual representation of the voice assistant with animation states.
   ```tsx
   <AnimatedAvatar
     audioStatus="idle" | "connecting" | "speaking" | "listening"
     industry?: string
     size?: "sm" | "md" | "lg"
   />
   ```

4. **Talk to AI Section**: A complete section displaying AI agents.
   ```tsx
   <TalkToAI
     title?: string
     description?: string
     agents?: Array<{
       image: string
       name: string
       title: string
       description: string
       gender?: 'male' | 'female' | 'neutral'
     }>
   />
   ```

### Service Utilities

1. **Voice Service**: Provides text-to-speech and speech-to-text functionality.
   ```tsx
   import { textToSpeech, speechToText } from 'path-to-vx/lib/voice-service';
   
   // Convert text to speech
   const audioUrl = await textToSpeech("Hello, how can I help you?", "alloy");
   
   // Convert speech to text
   const transcript = await speechToText(audioBlob);
   ```

## Customization

### Styling

The components use Tailwind CSS for styling. You can customize the appearance by:

1. Adding custom classes to the components
2. Modifying the theme colors in your `tailwind.config.js` file

### Industry-Specific Configuration

Edit the `industry-content.ts` file to customize the content for different industries:

```ts
// Example of adding a new industry
export const industryContent: Record<string, IndustryContent> = {
  // Existing industries...
  
  // Add a new industry
  newindustry: {
    title: "AI Voice Assistants for New Industry",
    description: "Transforming New Industry with intelligent voice AI",
    features: [
      // Features specific to this industry
    ],
    // ...other configurations
  }
};
```

## API Integration

### Setting up Retell API

1. Create a Retell account at [https://retellai.com](https://retellai.com)
2. Get your API key from the dashboard
3. Add the API key to your environment variables

### Setting up ElevenLabs API

1. Create an ElevenLabs account at [https://elevenlabs.io](https://elevenlabs.io)
2. Get your API key from the dashboard
3. Add the API key to your environment variables

## Troubleshooting

### Common Issues

1. **Voice assistant not connecting**
   - Check that your Retell API key is valid
   - Ensure your browser supports Web Audio API
   - Check network connectivity

2. **No audio playback**
   - Ensure user has interacted with the page (browser policy)
   - Check that microphone permissions are granted
   - Verify ElevenLabs API key is valid

3. **Button animations not working**
   - Ensure tsparticles dependencies are installed
   - Check for console errors related to animation

### Browser Support

The voice experience requires modern browser features:
- Web Audio API
- MediaRecorder API
- WebSockets

Support is best in recent versions of Chrome, Firefox, Edge, and Safari.

## License

This package is provided for your exclusive use. All rights reserved.

---

For additional support or questions, please contact the development team. 