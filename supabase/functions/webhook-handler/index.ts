
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

// Security utilities
const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
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

const validateRequest = (req: Request): boolean => {
  // Check request size
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB limit
    return false;
  }

  // Check required headers
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return false;
  }

  return true;
};

serve(async (req) => {
  const headers = getSecurityHeaders();

  if (req.method !== 'POST') {
    return createSecureErrorResponse('Method not allowed', 405);
  }

  // Validate request
  if (!validateRequest(req)) {
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

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return createSecureErrorResponse('Invalid signature', 400);
    }

    // Log event for monitoring (without sensitive data)
    console.log('Processing webhook event:', {
      type: event.type,
      id: event.id,
      created: event.created
    });

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        // Handle successful payment
        break;
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        console.log('Subscription event:', {
          type: event.type,
          subscription_id: subscription.id,
          status: subscription.status
        });
        // Handle subscription changes
        break;
      
      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed':
        const invoice = event.data.object;
        console.log('Invoice event:', {
          type: event.type,
          invoice_id: invoice.id,
          amount: invoice.amount_paid
        });
        // Handle invoice events
        break;
      
      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(
      JSON.stringify({ 
        received: true,
        event_id: event.id,
        timestamp: new Date().toISOString()
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
    return createSecureErrorResponse('Webhook processing failed', 500);
  }
});
