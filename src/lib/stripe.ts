import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
export const stripe = loadStripe('pk_test_51OqXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

export const createCheckoutSession = async (priceId: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    const session = await response.json();
    
    if (!response.ok) throw new Error(session.message);
    
    const result = await stripe?.redirectToCheckout({
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

export const createPortalSession = async () => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { url } = await response.json();
    window.location.href = url;
  } catch (error: any) {
    console.error('Error in createPortalSession:', error);
    throw new Error(error.message);
  }
};