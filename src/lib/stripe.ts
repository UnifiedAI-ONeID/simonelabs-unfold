
import { loadStripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment or use secure default
const getStripePublishableKey = () => {
  // In production, this should come from environment variables
  // For now, we'll use a placeholder that needs to be configured
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!key) {
    console.warn('Stripe publishable key not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY environment variable.');
    return null;
  }
  
  // Validate that it's a publishable key (starts with pk_)
  if (!key.startsWith('pk_')) {
    console.error('Invalid Stripe publishable key format. Must start with pk_');
    return null;
  }
  
  return key;
};

// Initialize Stripe with the publishable key
export const stripe = loadStripe(getStripePublishableKey() || '');

export const createCheckoutSession = async (priceId: string, userId: string) => {
  try {
    const publishableKey = getStripePublishableKey();
    if (!publishableKey) {
      throw new Error('Stripe is not properly configured. Please contact support.');
    }

    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, userId }),
    });

    const session = await response.json();
    
    if (!response.ok) throw new Error(session.error);
    
    const stripeInstance = await stripe;
    if (!stripeInstance) throw new Error('Stripe failed to initialize');
    
    const result = await stripeInstance.redirectToCheckout({
      sessionId: session.id,
    });

    if (result?.error) {
      throw new Error(result.error.message);
    }
  } catch (error: any) {
    console.error('Error in createCheckoutSession:', error);
    throw new Error(error.message);
  }
};

export const createPortalSession = async (token: string) => {
  try {
    const response = await fetch('/.netlify/functions/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const { url } = await response.json();
    window.location.href = url;
  } catch (error: any) {
    console.error('Error in createPortalSession:', error);
    throw new Error(error.message);
  }
};
