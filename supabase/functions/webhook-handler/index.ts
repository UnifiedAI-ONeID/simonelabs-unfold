
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

// Enhanced security utilities
const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';"
});

const createSecureErrorResponse = (message: string, status: number = 400) => {
  return new Response(
    JSON.stringify({ 
      error: message,
      timestamp: new Date().toISOString()
    }),
    { 
      status, 
      headers: { 
        ...getSecurityHeaders(), 
        'Content-Type': 'application/json' 
      }
    }
  );
};

const validateRequest = (req: Request): { isValid: boolean; reason?: string } => {
  // Check request size (stricter limit)
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 512 * 1024) { // 512KB limit
    return { isValid: false, reason: 'Request too large' };
  }

  // Check required headers
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return { isValid: false, reason: 'Missing signature' };
  }

  // Validate content type
  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return { isValid: false, reason: 'Invalid content type' };
  }

  return { isValid: true };
};

const validateTimestamp = (timestamp: number): boolean => {
  const now = Math.floor(Date.now() / 1000);
  const tolerance = 300; // 5 minutes
  return Math.abs(now - timestamp) <= tolerance;
};

serve(async (req) => {
  const headers = getSecurityHeaders();

  if (req.method !== 'POST') {
    return createSecureErrorResponse('Method not allowed', 405);
  }

  // Enhanced request validation
  const validation = validateRequest(req);
  if (!validation.isValid) {
    console.error('Request validation failed:', validation.reason);
    return createSecureErrorResponse('Invalid request format', 400);
  }

  const signature = req.headers.get('stripe-signature')!;
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return createSecureErrorResponse('Service configuration error', 500);
  }

  try {
    const body = await req.text();
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured');
      return createSecureErrorResponse('Service configuration error', 500);
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Verify webhook signature with enhanced validation
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return createSecureErrorResponse('Invalid signature', 400);
    }

    // Enhanced timestamp validation
    if (!validateTimestamp(event.created)) {
      console.error('Event timestamp outside tolerance window');
      return createSecureErrorResponse('Event too old or too new', 400);
    }

    // Log event for monitoring (without sensitive data)
    console.log('Processing webhook event:', {
      type: event.type,
      id: event.id,
      created: event.created,
      livemode: event.livemode
    });

    // Enhanced event handling with additional security checks
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        if (session.mode === 'payment' && session.payment_status === 'paid') {
          console.log('Valid checkout session completed:', session.id);
          // Handle successful payment with additional validation
        }
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        // Validate subscription data before processing
        if (subscription.id && subscription.status) {
          console.log('Valid subscription event:', {
            type: event.type,
            subscription_id: subscription.id,
            status: subscription.status
          });
          // Handle subscription changes with validation
        }
        break;
      
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
        const invoice = event.data.object;
        // Validate invoice data
        if (invoice.id && typeof invoice.amount_paid === 'number') {
          console.log('Valid invoice event:', {
            type: event.type,
            invoice_id: invoice.id,
            amount: invoice.amount_paid
          });
          // Handle invoice events with validation
        }
        break;
      
      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(
      JSON.stringify({ 
        received: true,
        event_id: event.id,
        timestamp: new Date().toISOString(),
        processed: true
      }),
      { 
        headers: { 
          ...headers, 
          'Content-Type': 'application/json' 
        }
      }
    );

  } catch (error) {
    console.error('Webhook handler error:', error);
    
    // Log security event for suspicious activity
    if (error instanceof Error && error.message.includes('signature')) {
      console.warn('Potential security threat - invalid signature attempt');
    }
    
    return createSecureErrorResponse('Webhook processing failed', 500);
  }
});
