
import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key (safe to be public)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_publishable_key_here'; // Replace with your actual publishable key

// Initialize Stripe with the publishable key
export const stripe = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (priceId: string, userId: string) => {
  try {
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
