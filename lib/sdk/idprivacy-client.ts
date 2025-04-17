import { RetellWebClient } from 'retell-client-js-sdk';

/**
 * Configuration options for the IDPrivacy client
 */
export interface IDPrivacyClientConfig {
  /** Your API key */
  apiKey: string;
  
  /** Base URL for the API */
  apiBaseUrl?: string;
  
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Options for starting a conversation
 */
export interface ConversationOptions {
  /** Industry vertical for the voice assistant */
  industry: string;
  
  /** Unique identifier for the user */
  userId: string;
  
  /** User's name for personalized interactions */
  userName?: string;
  
  /** User's email for identification */
  userEmail?: string;
  
  /** Additional client options */
  clientOptions?: Record<string, any>;
}

/**
 * Response from starting a conversation
 */
export interface ConversationResponse {
  /** ID of the call */
  callId: string;
  
  /** Access token for the call */
  accessToken: string;
  
  /** ID of the agent */
  agentId: string;
}

/**
 * Audio status types
 */
export type AudioStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

/**
 * Audio status listener function
 */
export type AudioStatusListener = (status: AudioStatus, error?: Error) => void;

/**
 * IDPrivacy Voice Assistant Client
 * 
 * Provides methods for interacting with the Voice Assistant API
 * and managing voice conversations.
 */
export class IDPrivacyClient {
  private apiKey: string;
  private apiBaseUrl: string;
  private debug: boolean;
  private retellClient: RetellWebClient | null = null;
  private audioStatusListeners: AudioStatusListener[] = [];
  private currentStatus: AudioStatus = 'idle';
  private animationFrame: number | null = null;
  private canvas: HTMLCanvasElement | null = null;

  /**
   * Create a new IDPrivacy client
   */
  constructor(config: IDPrivacyClientConfig) {
    this.apiKey = config.apiKey;
    this.apiBaseUrl = config.apiBaseUrl || 'https://your-domain.com/api/external/v1';
    this.debug = config.debug || false;
    
    if (this.debug) {
      console.log('IDPrivacy client initialized with API base URL:', this.apiBaseUrl);
    }
  }

  /**
   * Start a conversation with the voice assistant
   */
  public async startConversation(options: ConversationOptions): Promise<ConversationResponse> {
    if (this.debug) {
      console.log('Starting conversation with options:', options);
    }
    
    try {
      const response = await fetch(`${this.apiBaseUrl}/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          action: 'start',
          industry: options.industry,
          userId: options.userId,
          userName: options.userName,
          userEmail: options.userEmail,
          clientOptions: options.clientOptions
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to start conversation: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (this.debug) {
        console.log('Conversation started successfully:', data);
      }
      
      return data;
    } catch (error) {
      if (this.debug) {
        console.error('Error starting conversation:', error);
      }
      throw error;
    }
  }

  /**
   * End a conversation with the voice assistant
   */
  public async endConversation(callId: string): Promise<void> {
    if (this.debug) {
      console.log('Ending conversation with callId:', callId);
    }
    
    try {
      const response = await fetch(`${this.apiBaseUrl}/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          action: 'end',
          callId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to end conversation: ${response.status} ${response.statusText}`);
      }
      
      if (this.debug) {
        console.log('Conversation ended successfully');
      }
    } catch (error) {
      if (this.debug) {
        console.error('Error ending conversation:', error);
      }
      throw error;
    }
  }

  /**
   * Connect to a conversation using the Retell Web Client
   */
  public async connectToConversation(
    callId: string, 
    accessToken: string,
    canvas: HTMLCanvasElement | null = null
  ): Promise<void> {
    if (this.debug) {
      console.log('Connecting to conversation:', { callId, accessToken });
    }
    
    // Check if the browser supports the required APIs
    if (!this.checkBrowserSupport()) {
      this.updateAudioStatus('error', new Error('Your browser does not support the required audio APIs'));
      throw new Error('Your browser does not support the required audio APIs');
    }
    
    try {
      // Save canvas for visualization
      this.canvas = canvas;
      
      // Request microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream after permission check
      
      // Initialize the Retell client
      this.retellClient = new RetellWebClient({
        callId,
        accessToken
      });
      
      // Set up event listeners
      this.setupEventListeners();
      
      if (this.debug) {
        console.log('Connected to conversation successfully');
      }
      
      this.updateAudioStatus('idle');
    } catch (error) {
      if (this.debug) {
        console.error('Error connecting to conversation:', error);
      }
      this.updateAudioStatus('error', error instanceof Error ? error : new Error('Failed to connect'));
      throw error;
    }
  }

  /**
   * Stop the active call
   */
  public stopCall(): void {
    if (this.retellClient) {
      if (this.debug) {
        console.log('Stopping call');
      }
      
      this.retellClient.destroy();
      this.retellClient = null;
      this.updateAudioStatus('idle');
      
      // Cancel any animation frames
      if (this.animationFrame !== null) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    }
  }

  /**
   * Register a callback for audio status changes
   */
  public onAudioStatusChange(callback: AudioStatusListener): () => void {
    this.audioStatusListeners.push(callback);
    
    // Return a function to remove the listener
    return () => {
      this.audioStatusListeners = this.audioStatusListeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Clean up resources used by the client
   */
  public cleanup(): void {
    if (this.debug) {
      console.log('Cleaning up IDPrivacy client');
    }
    
    if (this.retellClient) {
      this.retellClient.destroy();
      this.retellClient = null;
    }
    
    this.audioStatusListeners = [];
    
    // Cancel any animation frames
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Check if the browser supports the required APIs
   */
  private checkBrowserSupport(): boolean {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.AudioContext
    );
  }

  /**
   * Set up event listeners for the Retell client
   */
  private setupEventListeners(): void {
    if (!this.retellClient) return;
    
    this.retellClient.on('userSpeakingStarted', () => {
      if (this.debug) console.log('User started speaking');
      this.updateAudioStatus('listening');
    });
    
    this.retellClient.on('userSpeakingEnded', () => {
      if (this.debug) console.log('User stopped speaking');
      this.updateAudioStatus('processing');
    });
    
    this.retellClient.on('agentSpeakingStarted', () => {
      if (this.debug) console.log('Agent started speaking');
      this.updateAudioStatus('speaking');
    });
    
    this.retellClient.on('agentSpeakingEnded', () => {
      if (this.debug) console.log('Agent stopped speaking');
      this.updateAudioStatus('idle');
    });
    
    this.retellClient.on('error', (error) => {
      if (this.debug) console.error('Retell client error:', error);
      this.updateAudioStatus('error', error instanceof Error ? error : new Error('Retell client error'));
    });
  }

  /**
   * Update the audio status and notify listeners
   */
  private updateAudioStatus(status: AudioStatus, error?: Error): void {
    if (this.currentStatus === status) return;
    
    this.currentStatus = status;
    
    // Update visualization
    this.updateVisualization(status);
    
    // Notify listeners
    for (const listener of this.audioStatusListeners) {
      listener(status, error);
    }
  }

  /**
   * Update the audio visualization based on the status
   */
  private updateVisualization(status: AudioStatus): void {
    if (!this.canvas) return;
    
    // Cancel any existing animation
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    switch (status) {
      case 'idle':
        this.drawIdleState(ctx);
        break;
      case 'listening':
        this.drawListeningState(ctx);
        break;
      case 'processing':
        this.drawProcessingState(ctx);
        break;
      case 'speaking':
        this.drawSpeakingState(ctx);
        break;
      case 'error':
        this.drawErrorState(ctx);
        break;
    }
  }
  
  // Visualization methods
  
  private drawIdleState(ctx: CanvasRenderingContext2D): void {
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.2;
    
    // Draw a pulsing circle
    let scale = 1;
    let increasing = true;
    
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Update scale
      if (increasing) {
        scale += 0.01;
        if (scale >= 1.1) increasing = false;
      } else {
        scale -= 0.01;
        if (scale <= 0.9) increasing = true;
      }
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#e0e0e0';
      ctx.fill();
      
      // Draw inner circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * scale * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = '#0066CC';
      ctx.fill();
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  private drawListeningState(ctx: CanvasRenderingContext2D): void {
    const { width, height } = ctx.canvas;
    const centerY = height / 2;
    const barWidth = 4;
    const barGap = 3;
    const barCount = 16;
    const totalWidth = barCount * (barWidth + barGap) - barGap;
    let startX = (width - totalWidth) / 2;
    
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw bars
      for (let i = 0; i < barCount; i++) {
        const barHeight = Math.random() * height * 0.6 + height * 0.2;
        const barX = startX + i * (barWidth + barGap);
        const barY = centerY - barHeight / 2;
        
        ctx.fillStyle = '#0066CC';
        ctx.fillRect(barX, barY, barWidth, barHeight);
      }
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  private drawProcessingState(ctx: CanvasRenderingContext2D): void {
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.2;
    let angle = 0;
    
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Update angle
      angle += 0.1;
      
      // Draw spinning arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, angle, angle + Math.PI * 1.5);
      ctx.strokeStyle = '#0066CC';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  private drawSpeakingState(ctx: CanvasRenderingContext2D): void {
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.3;
    const circleCount = 3;
    let time = 0;
    
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Update time
      time += 0.05;
      
      // Draw concentric circles
      for (let i = 0; i < circleCount; i++) {
        const phase = (i / circleCount) * Math.PI * 2;
        const scale = 0.5 + 0.5 * Math.sin(time + phase);
        const radius = maxRadius * (0.4 + 0.6 * scale);
        const alpha = 0.2 + 0.8 * scale;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 102, 204, ${alpha})`;
        ctx.fill();
      }
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  private drawErrorState(ctx: CanvasRenderingContext2D): void {
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const size = Math.min(width, height) * 0.3;
    
    // Draw error X
    ctx.beginPath();
    ctx.moveTo(centerX - size / 2, centerY - size / 2);
    ctx.lineTo(centerX + size / 2, centerY + size / 2);
    ctx.moveTo(centerX + size / 2, centerY - size / 2);
    ctx.lineTo(centerX - size / 2, centerY + size / 2);
    ctx.strokeStyle = '#e53935';
    ctx.lineWidth = 4;
    ctx.stroke();
  }
} 