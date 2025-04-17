import { RetellWebClient } from 'retell-client-js-sdk';

/**
 * Configuration options for the VX client
 */
export interface VXClientConfig {
  /** Your API key */
  apiKey: string;
  
  /** Base URL for the API */
  apiBaseUrl?: string;
  
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Conversation response from the voice API
 */
export interface ConversationResponse {
  /** ID of the call */
  callId: string;
  
  /** Access token for the call */
  accessToken: string;
  // Add other properties as needed
}

/**
 * Start conversation request parameters
 */
export interface StartConversationParams {
  /** Industry vertical for the voice assistant */
  industry: string;
  
  /** Unique identifier for the user */
  userId: string;
  
  /** User's name for personalized interactions */
  userName?: string;
  
  /** User's email for identification */
  userEmail?: string;
  
  /** Additional metadata for the conversation */
  metadata?: Record<string, any>;
}

/**
 * Audio status types for tracking connection status
 */
export type AudioStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * Audio status change listener type
 */
export type AudioStatusListener = (status: AudioStatus, error?: Error) => void;

/**
 * Type for the Retell Web Client constructor
 */
interface RetellWebClientConstructor {
  new (options: { callId: string; accessToken: string }): any;
}

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Global reference to the Retell client
 */
let RetellWebClient: RetellWebClientConstructor | null = null;

// Load the Retell client if we're in a browser
if (isBrowser) {
  try {
    // Try to get the client from the window object
    if ((window as any).RetellWebClient) {
      RetellWebClient = (window as any).RetellWebClient;
    } else {
      // We'll need to dynamically import it
      console.log('RetellWebClient not available on window, consider adding the script to your HTML');
    }
  } catch (e) {
    console.error('Error loading RetellWebClient', e);
  }
}

/**
 * VX Voice Assistant Client
 * 
 * Provides methods to interact with the voice assistant API
 */
export class VXClient {
  private apiKey: string;
  private apiBaseUrl: string;
  private debug: boolean;
  private statusListeners: AudioStatusListener[] = [];
  private retellClient: any = null;
  private canvas: HTMLCanvasElement | null = null;

  /**
   * Create a new VX client
   */
  constructor(config: VXClientConfig) {
    this.apiKey = config.apiKey;
    this.apiBaseUrl = config.apiBaseUrl || 'https://api.example.com/api';
    this.debug = config.debug || false;
    
    if (this.debug) {
      console.log('VX client initialized with API base URL:', this.apiBaseUrl);
    }
  }

  /**
   * Add a status change listener
   * @returns A function to remove the listener
   */
  public onAudioStatusChange(listener: AudioStatusListener): () => void {
    this.statusListeners.push(listener);
    
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }
  
  /**
   * Update audio status and notify listeners
   */
  private updateAudioStatus(status: AudioStatus, error?: Error): void {
    if (this.debug) {
      console.log('Audio status changed:', status, error);
    }
    
    for (const listener of this.statusListeners) {
      listener(status, error);
    }
  }
  
  /**
   * Start a conversation
   * @returns The call ID and access token
   */
  public async startConversation(params: StartConversationParams): Promise<ConversationResponse> {
    if (this.debug) {
      console.log('Starting conversation with params:', params);
    }
    
    try {
      const response = await fetch(`${this.apiBaseUrl}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start conversation: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      
      if (this.debug) {
        console.log('Conversation started:', data);
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
   * End a conversation
   */
  public async endConversation(callId: string): Promise<void> {
    if (this.debug) {
      console.log('Ending conversation:', callId);
    }
    
    try {
      const response = await fetch(`${this.apiBaseUrl}/conversations/${callId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to end conversation: ${response.status} ${errorText}`);
      }
      
      if (this.debug) {
        console.log('Conversation ended:', callId);
      }
    } catch (error) {
      if (this.debug) {
        console.error('Error ending conversation:', error);
      }
      throw error;
    }
  }
  
  /**
   * Check if the browser supports required audio APIs
   */
  private checkBrowserSupport(): boolean {
    if (!isBrowser) return false;
    
    const hasAudioContext = !!(window.AudioContext || (window as any).webkitAudioContext);
    const hasUserMedia = !!navigator.mediaDevices?.getUserMedia;
    
    return hasAudioContext && hasUserMedia;
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
   * Set up event listeners for the Retell client
   */
  private setupEventListeners(): void {
    if (!this.retellClient) return;
    
    this.retellClient.on('stateChange', (state: string) => {
      if (this.debug) {
        console.log('Retell state changed:', state);
      }
      
      switch (state) {
        case 'connecting':
          this.updateAudioStatus('connecting');
          break;
        case 'connected':
          this.updateAudioStatus('connected');
          break;
        case 'disconnected':
          this.updateAudioStatus('disconnected');
          break;
        case 'error':
          this.updateAudioStatus('error', new Error('Connection error'));
          break;
      }
    });
    
    this.retellClient.on('error', (error: any) => {
      if (this.debug) {
        console.error('Retell error:', error);
      }
      
      this.updateAudioStatus('error', new Error(error.message || 'Unknown error'));
    });
  }
  
  /**
   * Stop the call
   */
  public stopCall(): void {
    if (this.retellClient) {
      try {
        this.retellClient.stop();
        this.updateAudioStatus('idle');
      } catch (error) {
        if (this.debug) {
          console.error('Error stopping call:', error);
        }
      }
    }
  }
  
  /**
   * Clean up resources
   */
  public cleanup(): void {
    if (this.debug) {
      console.log('Cleaning up VX client');
    }
    
    this.stopCall();
    this.statusListeners = [];
    this.retellClient = null;
    this.canvas = null;
  }
} 