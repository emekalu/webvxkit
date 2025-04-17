# Voice Experience (VX) Quick Start Guide

This guide will help you quickly integrate the voice assistant functionality into your Next.js project.

## 1. Project Setup

First, make sure your project meets these requirements:
- Next.js 13+ with App Router
- React 18+
- TypeScript 5+
- Tailwind CSS

## 2. Installation

### Copy Files

Copy the entire `vx` directory into your project structure.

### Install Dependencies

```bash
npm install framer-motion @heroicons/react tsparticles @tsparticles/react @tsparticles/engine retell-client-js-sdk
```

### Environment Setup

Add to your `.env.local`:
```
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
NEXT_PUBLIC_RETELL_API_KEY=your_retell_api_key
RETELL_API_KEY=your_retell_api_key  # Server-side key
```

## 3. Basic Integration

### Step 1: Create a Simple Example

Create a new page in your project (e.g., `app/voice-demo/page.tsx`):

```tsx
"use client";

import React, { useState } from 'react';
import AIButton from '../../vx/components/ui/ai-button';
import { VoiceAssistant } from '../../vx/components/ui/voice-assistant';

export default function VoiceDemoPage() {
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Voice Assistant Demo</h1>
      
      <div className="mb-8">
        <p className="mb-4">Click the button below to talk to our AI assistant:</p>
        
        <AIButton 
          onClick={() => setShowVoiceAssistant(true)}
          className="min-w-[200px]"
        >
          Talk to VX
        </AIButton>
      </div>
      
      {/* Voice assistant component */}
      <VoiceAssistant
        initialOpen={showVoiceAssistant}
        onClose={() => setShowVoiceAssistant(false)}
        userInfo={{
          userId: `user-${Date.now()}`,
        }}
      />
    </div>
  );
}
```

### Step 2: Add API Routes

Ensure your Next.js project includes the API routes:

1. Create `app/api/retell/route.ts` (copy from `vx/app/api/retell/route.ts`)
2. Create `app/api/text-to-speech/route.ts` (copy from `vx/app/api/text-to-speech/route.ts`)

### Step 3: Verify Assets

Ensure the asset directories are properly copied to your public folder:
- `/public/sounds/connecting.mp3`
- `/public/avatars/ai-assistant-2.avif`
- `/public/images/agents/*` (all agent images)

## 4. Advanced Implementation

### Using the Hero Section

To use the complete hero section with the Talk to VX button:

```tsx
"use client";

import Hero from '../../vx/components/sections/hero';

export default function HomePage() {
  return (
    <main>
      <Hero 
        title="Revolutionize Your Business with AI Voice Assistants" 
        description="Intelligent voice assistants that understand your needs and deliver personalized service."
        image="/your-hero-image.png"
        gradients={{
          background: ['#f8f9fa', '#e9ecef'],
          primaryBeam: '#6ee7b7',
          secondaryBeam: '#3b82f6',
          accentBeam: '#a78bfa'
        }}
      />
    </main>
  );
}
```

### Using the Talk to AI Section

To create a section with multiple AI agents to talk to:

```tsx
"use client";

import TalkToAI from '../../vx/components/sections/talk-to-ai';

export default function AgentsPage() {
  const agents = [
    {
      image: "/images/agents/Lee.webp",
      name: "Lee",
      title: "Automotive Specialist",
      description: "I can help with vehicle maintenance, repair information, and scheduling service.",
      gender: "male"
    },
    {
      image: "/images/agents/Sarah.webp",
      name: "Sarah",
      title: "Customer Support",
      description: "I'll assist you with any account questions or concerns you may have.",
      gender: "female"
    }
  ];

  return (
    <div>
      <TalkToAI
        title="Talk to Our AI Experts"
        description="Choose an assistant to help with your specific needs"
        agents={agents}
      />
    </div>
  );
}
```

## 5. Testing

1. Start your development server:
```bash
npm run dev
```

2. Navigate to your demo page (e.g., http://localhost:3000/voice-demo)
3. Click the "Talk to VX" button
4. Grant microphone permissions when prompted
5. Interact with the voice assistant

## 6. Customization

- Modify button text and styling in your implementation
- Update agent images and information in the TalkToAI component
- Customize industry-specific content in `vx/lib/industry-content.ts`

## Next Steps

Refer to the full README.md for more detailed information on:
- Component API references
- Customization options
- Troubleshooting common issues
- API integration details 