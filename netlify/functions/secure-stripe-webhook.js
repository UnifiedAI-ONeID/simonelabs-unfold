
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Enhanced security logging
const logSecurityEvent = async (event) => {
  try {
    await supabase.from('security_events').insert({
      event_type: event.type,
      details: event.details,
      ip_address: event.ip,
      user_agent: event.userAgent,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Request size validation
const validateRequestSize = (body, maxSize = 1024) => {
  const bodySize = Buffer.byteLength(body || '', 'utf8');
  if (bodySize > maxSize) {
    throw new Error(`Request too large: ${bodySize} bytes exceeds ${maxSize} bytes`);
  }
};

// Enhanced rate limiting with IP tracking
const rateLimitMap = new Map();
const checkRateLimit = (ip, maxRequests = 5, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  
  const requests = rateLimitMap.get(ip);
  // Clean old requests
  const recentRequests = requests.filter(time => time > windowStart);
  
  if (recentRequests.length >= maxRequests) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
};

exports.handler = async (event) => {
  const clientIP = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
  const userAgent = event.headers['user-agent'] || 'unknown';

  try {
    // Validate request method
    if (event.httpMethod !== 'POST') {
      await logSecurityEvent({
        type: 'INVALID_METHOD',
        details: `Invalid method: ${event.httpMethod}`,
        ip: clientIP,
        userAgent
      });
      return { statusCode: 405, body: 'Method not allowed' };
    }

    // Rate limiting
    if (!checkRateLimit(clientIP, 10, 60000)) {
      await logSecurityEvent({
        type: 'RATE_LIMIT_EXCEEDED',
        details: 'Webhook rate limit exceeded',
        ip: clientIP,
        userAgent
      });
      return { statusCode: 429, body: 'Rate limit exceeded' };
    }

    // Validate request size
    validateRequestSize(event.body, 2048); // 2KB max for webhooks

    // Validate Stripe signature
    const sig = event.headers['stripe-signature'];
    if (!sig) {
      await logSecurityEvent({
        type: 'MISSING_SIGNATURE',
        details: 'Missing Stripe signature',
        ip: clientIP,
        userAgent
      });
      return { statusCode: 400, body: 'Missing signature' };
    }

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      await logSecurityEvent({
        type: 'INVALID_SIGNATURE',
        details: `Invalid Stripe signature: ${err.message}`,
        ip: clientIP,
        userAgent
      });
      return { statusCode: 400, body: `Webhook signature verification failed: ${err.message}` };
    }

    // Log successful webhook processing start
    await logSecurityEvent({
      type: 'WEBHOOK_PROCESSING',
      details: `Processing webhook: ${stripeEvent.type}`,
      ip: clientIP,
      userAgent
    });

    // Process the webhook event
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(stripeEvent.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeletion(stripeEvent.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    // Log successful processing
    await logSecurityEvent({
      type: 'WEBHOOK_SUCCESS',
      details: `Successfully processed webhook: ${stripeEvent.type}`,
      ip: clientIP,
      userAgent
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      },
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    await logSecurityEvent({
      type: 'WEBHOOK_ERROR',
      details: `Webhook error: ${error.message}`,
      ip: clientIP,
      userAgent
    });

    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

async function handleSubscriptionChange(subscription) {
  const customerId = subscription.customer;
  const status = subscription.status;
  const priceId = subscription.items.data[0].price.id;

  try {
    // Find user by Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('users_profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (profileError) {
      throw new Error(`Error finding user: ${profileError.message}`);
    }

    // Update subscription
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: profile.id,
        stripe_subscription_id: subscription.id,
        stripe_price_id: priceId,
        status: status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      });

    if (error) {
      throw new Error(`Error updating subscription: ${error.message}`);
    }
  } catch (error) {
    console.error('Subscription change handling error:', error);
    throw error;
  }
}

async function handleSubscriptionDeletion(subscription) {
  const customerId = subscription.customer;

  try {
    // Find user by Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('users_profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (profileError) {
      throw new Error(`Error finding user: ${profileError.message}`);
    }

    // Update subscription status
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      throw new Error(`Error canceling subscription: ${error.message}`);
    }
  } catch (error) {
    console.error('Subscription deletion handling error:', error);
    throw error;
  }
}
