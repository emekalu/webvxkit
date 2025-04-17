"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AnimatedAvatarProps = {
  audioStatus: "idle" | "connecting" | "speaking" | "listening";
  industry?: string;
  size?: "sm" | "md" | "lg";
};

export function AnimatedAvatar({
  audioStatus,
  industry = "automotive",
  size = "md",
}: AnimatedAvatarProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (audioStatus === "speaking" || audioStatus === "listening") {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [audioStatus]);

  // Size mapping
  const sizeMap = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  // Status-specific styling
  const statusStyles = {
    idle: "border-slate-300",
    connecting: "border-teal-300",
    speaking: "border-teal-500 border-[3px]",
    listening: "border-teal-700 border-[3px]",
  };

  return (
    <div className="relative flex items-center justify-center font-sans">
      <div
        className={cn(
          "rounded-full overflow-hidden border-2 relative transition-colors duration-300",
          sizeMap[size],
          statusStyles[audioStatus],
          // Only apply pulse animation to connecting state to avoid flickering
          audioStatus === "connecting" ? "animate-pulse" : ""
        )}
      >
        <Image
          src={`/avatars/ai-assistant-2.avif`}
          alt="AI Assistant"
          width={size === "lg" ? 96 : size === "md" ? 64 : 40}
          height={size === "lg" ? 96 : size === "md" ? 64 : 40}
          className="object-cover"
          priority
        />
        
        {/* Audio wave visualization when speaking - smoother transitions */}
        {audioStatus === "speaking" && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 h-2 bg-black/50">
            <div className="w-0.5 bg-teal-500 animate-sound-wave-1"></div>
            <div className="w-0.5 bg-teal-500 animate-sound-wave-2"></div>
            <div className="w-0.5 bg-teal-500 animate-sound-wave-3"></div>
            <div className="w-0.5 bg-teal-500 animate-sound-wave-2"></div>
            <div className="w-0.5 bg-teal-500 animate-sound-wave-1"></div>
          </div>
        )}
        
        {/* Audio wave visualization when listening - smoother transitions */}
        {audioStatus === "listening" && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 h-2 bg-black/50">
            <div className="w-0.5 bg-teal-700 animate-sound-wave-1"></div>
            <div className="w-0.5 bg-teal-700 animate-sound-wave-2"></div>
            <div className="w-0.5 bg-teal-700 animate-sound-wave-3"></div>
            <div className="w-0.5 bg-teal-700 animate-sound-wave-2"></div>
            <div className="w-0.5 bg-teal-700 animate-sound-wave-1"></div>
          </div>
        )}
      </div>
      
      {/* Status indicator dot with smoother transitions */}
      <div className={cn(
        "absolute bottom-0 right-0 w-3 h-3 rounded-full transition-colors duration-300",
        {
          "bg-slate-400": audioStatus === "idle",
          "bg-teal-300 animate-pulse": audioStatus === "connecting",
          "bg-teal-500": audioStatus === "speaking",
          "bg-teal-700": audioStatus === "listening",
        }
      )}></div>

      {/* Status text below avatar for better accessibility */}
      <div className={cn(
        "absolute -bottom-6 text-xs font-medium text-center w-full transition-colors duration-300 font-inter",
        {
          "text-slate-500": audioStatus === "idle",
          "text-teal-400": audioStatus === "connecting",
          "text-teal-500": audioStatus === "speaking",
          "text-teal-700": audioStatus === "listening",
        }
      )}>
        {audioStatus === "speaking" ? "Speaking" : 
         audioStatus === "listening" ? "Listening" :
         audioStatus === "connecting" ? "Connecting..." : ""}
      </div>
    </div>
  );
} 