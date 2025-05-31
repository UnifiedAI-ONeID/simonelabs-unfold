
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Enhanced security and rate limiting
const rateLimitMap = new Map();
const checkRateLimit = (ip, maxRequests = 3, windowMs = 300000) => { // 3 requests per 5 minutes
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  
  const requests = rateLimitMap.get(ip);
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
};

const validateRequestSize = (body, maxSize = 512) => {
  const bodySize = Buffer.byteLength(body || '', 'utf8');
  if (bodySize > maxSize) {
    throw new Error(`Request too large: ${bodySize} bytes`);
  }
};

exports.handler = async (event) => {
  const clientIP = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
  
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.URL || '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      },
    };
  }

  try {
    // Validate HTTP method
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'Allow': 'POST, OPTIONS' },
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    // Rate limiting
    if (!checkRateLimit(clientIP)) {
      return {
        statusCode: 429,
        headers: {
          'Retry-After': '300',
          'X-Content-Type-Options': 'nosniff'
        },
        body: JSON.stringify({ error: 'Rate limit exceeded' }),
      };
    }

    // Validate request size
    validateRequestSize(event.body);

    // Validate authorization header
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid authorization header' }),
      };
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Validate token format
    if (!token || token.length < 32) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid token format' }),
      };
    }

    // Get user from Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid or expired token' }),
      };
    }

    // Get customer ID with additional validation
    const { data: profile, error: profileError } = await supabase
      .from('users_profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Customer not found or not configured for billing' }),
      };
    }

    // Validate customer exists in Stripe
    let customer;
    try {
      customer = await stripe.customers.retrieve(profile.stripe_customer_id);
      if (customer.deleted) {
        throw new Error('Customer has been deleted');
      }
    } catch (stripeError) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Customer not found in billing system' }),
      };
    }

    // Create portal session with security settings
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.URL}/account`,
      configuration: {
        business_profile: {
          privacy_policy_url: `${process.env.URL}/privacy`,
          terms_of_service_url: `${process.env.URL}/terms`,
        },
        features: {
          payment_method_update: { enabled: true },
          subscription_cancel: { enabled: true },
          subscription_pause: { enabled: false }, // Disable pausing for security
          subscription_update: {
            enabled: true,
            default_allowed_updates: ['price'],
            proration_behavior: 'create_prorations'
          },
          invoice_history: { enabled: true }
        }
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.URL || '*',
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({ 
        url: session.url,
        expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiry
      }),
    };
  } catch (error) {
    console.error('Error creating portal session:', error);
    
    // Don't expose internal error details
    const statusCode = error.code === 'resource_missing' ? 404 : 500;
    const message = statusCode === 404 ? 'Resource not found' : 'Internal server error';
    
    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': process.env.URL || '*',
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      },
      body: JSON.stringify({ error: message }),
    };
  }
};
