/**
 * IDPrivacy Voice Assistant SDK
 * 
 * This SDK provides a complete solution for integrating IDPrivacy's AI voice assistant
 * with a phone-like UI into your web applications.
 */

// Export the React component
export { default as IDPrivacyAssistant } from './IDPrivacyAssistant';
export type { IDPrivacyAssistantProps } from './IDPrivacyAssistant';

// Export the client
export { IDPrivacyClient } from './idprivacy-client';
export type { 
  IDPrivacyClientConfig,
  ConversationOptions,
  ConversationResponse,
  AudioStatus
} from './idprivacy-client';

// Export example for reference
export { default as ExampleUsage } from './example-usage';

// Version number
export const VERSION = '1.0.0'; 