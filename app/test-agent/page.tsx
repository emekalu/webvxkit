"use client";

import React, { useState } from 'react';
import TestVoiceAgent from '@/components/test-voice-agent';

export default function TestAgentPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<{
    name: string;
    title: string;
    description: string;
    gender?: 'male' | 'female' | 'neutral';
  } | null>(null);

  const agents = [
    {
      name: "Lee",
      title: "Service Advisor AI",
      description: "I Specialise in service appointments and maintenance inquiries.",
      gender: "male" as const
    },
    {
      name: "Sarah",
      title: "Finance Specialist AI",
      description: "I help with financing options, loan applications, and payment plans.",
      gender: "female" as const
    }
  ];

  const openAgentDialog = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Voice Agent</h1>
      <p className="mb-6">This page uses a simplified voice agent implementation that calls the ElevenLabs API directly.</p>

      <h2 className="text-xl font-bold mb-4">Available Agents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent, index) => (
          <div key={index} className="border rounded-md p-4 shadow-sm">
            <h3 className="font-medium text-lg">{agent.name}</h3>
            <p className="text-gray-600 text-sm">{agent.title}</p>
            <p className="mt-2 mb-4 text-gray-700">{agent.description}</p>
            <button
              onClick={() => openAgentDialog(agent)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try It
            </button>
          </div>
        ))}
      </div>

      {selectedAgent && (
        <TestVoiceAgent
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          agentName={selectedAgent.name}
          agentTitle={selectedAgent.title}
          description={selectedAgent.description}
          gender={selectedAgent.gender}
        />
      )}
    </div>
  );
}