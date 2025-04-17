import { NextRequest, NextResponse } from 'next/server';

// PRODUCTION CONFIG: Hard-coded critical values - update these for your specific environment
// ========================================================================================
// Get API key from environment variables - REQUIRED for production
const RETELL_API_KEY = process.env.RETELL_API_KEY || "";

// For production, verify API key is set
if (!RETELL_API_KEY) {
  console.error('⚠️ PRODUCTION ERROR: RETELL_API_KEY environment variable is not set!');
  // We don't throw here to allow build to complete, but API calls will fail
}

// Map of industry-specific agent IDs - REQUIRED for production
const INDUSTRY_AGENT_IDS: Record<string, string> = {
  automotive: process.env.RETELL_AUTOMOTIVE_AGENT_ID || "",
  beauty: process.env.RETELL_BEAUTY_AGENT_ID || "",
  health: process.env.RETELL_HEALTH_AGENT_ID || "",
  dental: process.env.RETELL_DENTAL_AGENT_ID || "",
  restaurant: process.env.RETELL_RESTAURANT_AGENT_ID || "",
  fitness: process.env.RETELL_FITNESS_AGENT_ID || "",
  realestate: process.env.RETELL_REALESTATE_AGENT_ID || "",
  education: process.env.RETELL_EDUCATION_AGENT_ID || "",
  // PRODUCTION: For reliability, include a fallback default agent ID
  default: process.env.RETELL_DEFAULT_AGENT_ID || ""
};

// For production, verify at least default agent ID is set
if (!INDUSTRY_AGENT_IDS.default) {
  console.error('⚠️ PRODUCTION ERROR: RETELL_DEFAULT_AGENT_ID environment variable is not set!');
  // We don't throw here to allow build to complete, but API calls will fail
}

// ========================================================================================

export async function POST(request: NextRequest) {
  try {
    console.log('Retell API route called');
    
    // Log env variables (safely)
    console.log('API key configured:', !!RETELL_API_KEY);
    console.log('Default Agent ID configured:', !!INDUSTRY_AGENT_IDS.default);
    
    // If API key is not set, return error
    if (!RETELL_API_KEY) {
      console.error('Retell API key not configured');
      return NextResponse.json(
        { error: 'Retell API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('Request body:', JSON.stringify({
      action: body.action,
      industry: body.industry,
      userId: body.userId,
      // Don't log personal info
    }));
    
    const { action, industry, userId, userName, userEmail } = body;

    // Get the appropriate agent ID based on industry
    // First try to get the industry-specific agent ID
    let agentId = INDUSTRY_AGENT_IDS[industry] || "";
    
    // Check if the industry agent ID is a placeholder value or empty
    if (!agentId || agentId.startsWith('your_') || agentId === 'your_default_agent_id') {
      console.log(`No valid agent ID for industry: ${industry}, falling back to default agent`);
      agentId = INDUSTRY_AGENT_IDS.default;
    }
    
    console.log('Using agent ID:', agentId, 'for industry:', industry);
    
    if (!agentId) {
      console.error('No agent ID configured for any industry');
      return NextResponse.json(
        { error: 'No agent ID configured for this industry' },
        { status: 400 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'start-conversation': {
        console.log('Starting Web Call with Retell API');
        
        // Make request to Retell Web Call API with agent speaking first config
        const requestBody = {
          agent_id: agentId,
          // Hard-coded production-ready configuration
          agent_config: {
            begin_message_delay_ms: 1000,  // 1 second delay before agent starts speaking
            // Additional hard-coded settings for production reliability
            end_call_after_silence_ms: 600000, // 10 minutes of silence before ending call
            max_call_duration_ms: 3600000, // 1 hour maximum call duration
            interruption_sensitivity: 0.5, // Medium interruption sensitivity
          }
        };
        
        // Log for debugging but mask sensitive data
        console.log('Sending request to Retell API with agent_id:', agentId.substring(0, 8) + '...');
        
        console.log('Request to Retell Web Call API:', JSON.stringify(requestBody));
        
        // Make request to Retell Web Call API
        const response = await fetch('https://api.retellai.com/v2/create-web-call', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RETELL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('Retell API response status:', response.status);
        
        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
          console.log('Retell API response data:', JSON.stringify(data));
        } else {
          const text = await response.text();
          console.error('Received non-JSON response:', text.substring(0, 100) + '...');
          data = { error: `Server returned non-JSON response (${response.status})` };
        }
        
        if (!response.ok) {
          console.error('Error from Retell API:', data);
          return NextResponse.json(
            { error: data.error || 'Failed to start web call' },
            { status: response.status }
          );
        }

        console.log('Web call created successfully with ID:', data.call_id);
        
        // Return the data needed by the client to connect to the call
        return NextResponse.json({ 
          callId: data.call_id,
          accessToken: data.access_token,
          agentId: data.agent_id
        });
      }

      case 'end-conversation': {
        const { conversationId } = body;
        
        if (!conversationId) {
          return NextResponse.json(
            { error: 'Conversation ID is required' },
            { status: 400 }
          );
        }

        // Make request to Retell API to end a conversation
        const response = await fetch(`https://api.retellai.com/v1/conversations/${conversationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${RETELL_API_KEY}`,
          },
        });

        // Handle non-JSON responses
        let data;
        try {
          data = await response.json();
        } catch (error) {
          console.log('No JSON in response for end-conversation, likely empty response which is fine');
          data = {};
        }

        if (!response.ok) {
          console.error('Error ending conversation:', data);
          return NextResponse.json(
            { error: data.error || 'Failed to end conversation' },
            { status: response.status }
          );
        }

        return NextResponse.json({ success: true });
      }

      default:
        console.error('Invalid action:', action);
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in Retell API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 