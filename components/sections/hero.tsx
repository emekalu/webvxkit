"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CustomButton } from '../ui/custom-button';
import AIButton from '../ui/ai-button';
import { headerConfig } from '@/lib/industry-content';
import { AnimatedBeam } from '../ui/background/animated-beam';
import { AnimatedHoverText } from '../ui/animated-hover-text';
import { VoiceAssistant } from '../ui/voice-assistant';

interface HeroProps {
  title: string;
  description: string;
  image: string;
  fontFamily?: string;
  gradients?: {
    background?: string[];
    primaryBeam?: string;
    secondaryBeam?: string;
    accentBeam?: string;
  };
}

// Industry name patterns to look for in the title
const industryTerms: Record<string, string> = {
  automotive: 'Automotive',
  beauty: 'Beauty',
  health: 'Healthcare',
  dental: 'Dental',
  restaurant: 'Restaurant',
  fitness: 'Fitness',
  realestate: 'Real Estate',
  education: 'Education'
};

// Function to highlight industry name in title
const formatTitleWithHighlight = (title: string, industry: string) => {
  // Map of industries to their highlight colors - we're now using the same teal color for all industries
  const highlightColor = 'text-vx-teal';
  
  // Get the term to find
  const termToFind = industryTerms[industry] || industry;

  // Use the new AnimatedHoverText component for enhanced hover effects
  return (
    <AnimatedHoverText 
      text={title}
      highlightWords={[termToFind]}
      industry={industry}
      highlightClass={highlightColor}
    />
  );
};

const Hero = ({ title, description, image, gradients }: HeroProps) => {
  const params = useParams();
  const industry = params.industry as string;
  const [tiltStyle, setTiltStyle] = React.useState({});
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({});
  };

  // External VoiceAssistant control
  const handleOpenVoiceAssistant = () => {
    setShowVoiceAssistant(true);
  };

  const handleCloseVoiceAssistant = () => {
    setShowVoiceAssistant(false);
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated background */}
      <AnimatedBeam 
        className="absolute inset-0" 
        backgroundColors={gradients?.background}
        primaryBeamColor={gradients?.primaryBeam}
        secondaryBeamColor={gradients?.secondaryBeam}
        accentBeamColor={gradients?.accentBeam}
      />
      
      {/* Content */}
      <div className="container relative mx-auto px-4 z-10">
        <div className="text-center mb-12">
          <h1 className="font-inter font-inter-bold text-4xl md:text-5xl lg:text-6xl mb-10 max-w-4xl mx-auto text-gray-900 pt-4">
            {formatTitleWithHighlight(title, industry)}
          </h1>
          <div className="font-inter text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-12 leading-relaxed pt-4">
            <AnimatedHoverText 
              text={description}
              highlightWords={['AI', 'assistant', 'automation', 'virtual', 'digital', 'transform', 'intelligent', 'smart', industryTerms[industry] || industry]}
              industry={industry}
              highlightClass="text-vx-teal font-inter-medium"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <AIButton 
              onClick={handleOpenVoiceAssistant}
              className="min-w-[150px]"
            >
              {headerConfig.hero.primaryCta.text}
            </AIButton>
            <Link href={headerConfig.hero.secondaryCta.url}>
              <CustomButton
                variant="outline"
                size="lg"
                className="font-inter min-w-[150px] relative z-20 bg-white/80 backdrop-blur-sm"
                icon={
                  headerConfig.hero.secondaryCta.icon ? (
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : undefined
                }
              >
                {headerConfig.hero.secondaryCta.text}
              </CustomButton>
            </Link>
          </div>
        </div>

        <div 
          className="relative mx-auto max-w-6xl overflow-hidden rounded-lg bg-white/90 backdrop-blur-sm shadow-lg transition-transform duration-300 ease-out aspect-[8/5]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={tiltStyle}
        >
          <Image
            src={image}
            alt="VX Preview"
            fill
            className="object-contain relative z-10"
            priority
          />
        </div>
      </div>

      {/* Voice assistant */}
      <VoiceAssistant
        initialOpen={showVoiceAssistant}
        onClose={handleCloseVoiceAssistant}
        userInfo={{
          userId: `user-${Date.now()}`,
        }}
      />
    </section>
  );
};

export default Hero;
