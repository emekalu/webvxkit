"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { CustomButton } from '../ui/custom-button';
import VoiceAgent from '../voice-agent';

interface AIAgentProps {
  image: string;
  name: string;
  title: string;
  description: string;
  gender?: 'male' | 'female' | 'neutral';
  onTryIt: () => void;
}

const AIAgent = ({
  image,
  name,
  title,
  description,
  gender,
  onTryIt
}: AIAgentProps) => {
  return (
    <div className="flex flex-col items-start font-inter">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={image}
            alt={name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-lg font-inter">{name}</h3>
          <p className="text-gray-600 text-sm font-inter">{title}</p>
        </div>
      </div>
      <p className="mb-4 text-gray-700 text-sm font-inter">{description}</p>
      <CustomButton variant="outline" size="sm" onClick={onTryIt} className="font-inter">
        Try It
      </CustomButton>
    </div>
  );
};

interface TalkToAIProps {
  title?: string;
  description?: string;
  agents?: Array<{
    image: string;
    name: string;
    title: string;
    description: string;
    gender?: 'male' | 'female' | 'neutral';
  }>;
}

const TalkToAI = ({ 
  title = "Talk to our AI",
  description = "Experience our AI assistants in action",
  agents = []
}: TalkToAIProps) => {
  const [selectedAgent, setSelectedAgent] = useState<{
    name: string;
    title: string;
    description: string;
    gender?: 'male' | 'female' | 'neutral';
  } | null>(null);

  if (agents.length === 0) {
    return null;
  }

  return (
    <section id="demo" className="py-16 bg-white font-inter">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-4 font-inter">{title}</h2>
        <p className="text-center text-gray-600 mb-12 font-inter">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {agents.map((agent, index) => (
            <AIAgent
              key={index}
              image={agent.image}
              name={agent.name}
              title={agent.title}
              description={agent.description}
              gender={agent.gender}
              onTryIt={() => setSelectedAgent(agent)}
            />
          ))}
        </div>

        {selectedAgent && (
          <VoiceAgent
            isOpen={!!selectedAgent}
            onClose={() => setSelectedAgent(null)}
            agentName={selectedAgent.name}
            agentTitle={selectedAgent.title}
            description={selectedAgent.description}
            gender={selectedAgent.gender || 'neutral'}
          />
        )}
      </div>
    </section>
  );
};

export default TalkToAI;