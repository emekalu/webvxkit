# Voice Experience (VX) Component Map

This document provides a visual map of how the components in the VX package are related and interact with each other.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                    │
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │ Hero Section  │  │   Talk to AI  │  │ Test Pages    │   │
│  │ (hero.tsx)    │  │ (talk-to-ai.tsx)│ (test-*.tsx)   │   │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘   │
│          │                  │                  │           │
│          └──────────────────┼──────────────────┘           │
│                            │                              │
│                    ┌───────▼────────┐                     │
│                    │   AI Button    │                     │
│                    │ (ai-button.tsx)│                     │
│                    └───────┬────────┘                     │
│                            │                              │
│                    ┌───────▼────────┐                     │
│                    │Voice Assistant │                     │
│                    │(voice-assistant.tsx)                 │
│                    └───────┬────────┘                     │
└────────────────────────────┼──────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────┐
│                     Component Layer                        │
│                                                            │
│  ┌──────────────────┐    ┌──────────────────┐             │
│  │  Voice Agent     │    │  Animated Avatar │             │
│  │ (voice-agent.tsx)│    │(animated-avatar.tsx)           │
│  └────────┬─────────┘    └──────────┬───────┘             │
│           │                         │                      │
└───────────┼─────────────────────────┼──────────────────────┘
            │                         │
┌───────────▼─────────────────────────▼──────────────────────┐
│                     Services Layer                          │
│                                                             │
│  ┌──────────────────┐    ┌─────────────────┐               │
│  │  Voice Service   │    │ Industry Content│               │
│  │(voice-service.ts)│    │(industry-content.ts)            │
│  └────────┬─────────┘    └─────────────────┘               │
│           │                                                 │
└───────────┼─────────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────────┐
│                     API Layer                                │
│                                                              │
│  ┌──────────────────┐    ┌─────────────────────┐            │
│  │ Retell API Route │    │Text-to-Speech Route │            │
│  │  (api/retell)    │    │(api/text-to-speech) │            │
│  └──────────────────┘    └─────────────────────┘            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Component Relationships

### Entry Points

1. **Hero Section** (`hero.tsx`)
   - Contains the "Talk to VX" button
   - Displays brand messaging and hero image
   - Integrates the VoiceAssistant component

2. **Talk to AI Section** (`talk-to-ai.tsx`)
   - Displays multiple AI agents with their information
   - Each agent can be clicked to start a conversation
   - Uses the VoiceAgent component

3. **Test Pages** (`test-voice/page.tsx`, `test-agent/page.tsx`)
   - Demo pages for testing voice functionality
   - Provides simple interfaces for voice interactions

### Core Components

1. **AI Button** (`ai-button.tsx`)
   - Animated button with particle effects
   - Used to trigger voice assistant interactions
   - Can be placed anywhere in the application

2. **Voice Assistant** (`voice-assistant.tsx`)
   - Main component for voice interactions
   - Handles the dialog UI, animation states
   - Connects to Retell for real-time voice conversation
   - Uses the AnimatedAvatar component

3. **Voice Agent** (`voice-agent.tsx`)
   - Handles voice interaction logic
   - Manages speech-to-text and text-to-speech
   - Tracks conversation state

4. **Animated Avatar** (`animated-avatar.tsx`)
   - Visual representation of the AI assistant
   - Shows different states (idle, connecting, speaking, listening)
   - Provides visual feedback during conversations

### Service Utilities

1. **Voice Service** (`voice-service.ts`)
   - Provides text-to-speech functionality
   - Provides speech-to-text functionality
   - Handles browser compatibility and error handling

2. **Industry Content** (`industry-content.ts`)
   - Contains industry-specific text and configuration
   - Defines the content for different industry verticals
   - Used to personalize voice interactions

### API Integration

1. **Retell API Route** (`api/retell/route.ts`)
   - Handles server-side communication with Retell
   - Creates and manages voice conversations
   - Provides authentication for client-side

2. **Text-to-Speech Route** (`api/text-to-speech/route.ts`)
   - Handles text-to-speech requests
   - Communicates with ElevenLabs API
   - Returns audio data for voice playback

## Data Flow

1. User clicks the "Talk to VX" button in the UI
2. The VoiceAssistant component is opened
3. VoiceAssistant connects to the Retell API through the API route
4. Audio streaming begins via the Retell Web Client
5. AnimatedAvatar shows the appropriate state based on conversation
6. User speaks, and Retell processes the audio
7. AI responds, and the response is played through the browser
8. Conversation continues until the user closes the assistant

## Asset Dependencies

- Agent images in `/public/images/agents/`
- Avatar images in `/public/avatars/`
- Sound effects in `/public/sounds/` 