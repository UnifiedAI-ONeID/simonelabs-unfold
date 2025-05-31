const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async ({ body, headers }) => {
  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = stripeEvent.data.object;
        await handleSubscriptionChange(subscription);
        break;
      
      case 'customer.subscription.deleted':
        const deletedSubscription = stripeEvent.data.object;
        await handleSubscriptionDeletion(deletedSubscription);
        break;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

async function handleSubscriptionChange(subscription) {
  const customerId = subscription.customer;
  const status = subscription.status;
  const priceId = subscription.items.data[0].price.id;

  // Update user's subscription status in the database
  const { data: profile, error: profileError } = await supabase
    .from('users_profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (profileError) {
    console.error('Error finding user:', profileError);
    return;
  }

  await supabase
    .from('subscriptions')
    .upsert({
      user_id: profile.id,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      status: status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    });
}

async function handleSubscriptionDeletion(subscription) {
  const customerId = subscription.customer;

  const { data: profile, error: profileError } = await supabase
    .from('users_profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (profileError) {
    console.error('Error finding user:', profileError);
    return;
  }

  await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id);
}