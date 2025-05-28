
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ElementType;
  gradient: string;
}

const PaymentPlans = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9,
      period: 'month',
      description: 'Perfect for individual learners',
      icon: Star,
      gradient: 'from-blue-500 to-blue-600',
      features: [
        'Access to 10 courses',
        'Basic video quality',
        'Community support',
        'Mobile app access',
        'Course certificates'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      period: 'month',
      description: 'Best for serious learners',
      icon: Zap,
      gradient: 'from-purple-500 to-purple-600',
      popular: true,
      features: [
        'Unlimited course access',
        'HD video quality',
        'Priority support',
        'Offline downloads',
        'Advanced analytics',
        'AI tutoring assistant',
        'Custom learning paths'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      period: 'month',
      description: 'For teams and organizations',
      icon: Crown,
      gradient: 'from-yellow-500 to-yellow-600',
      features: [
        'Everything in Pro',
        'Team management',
        'Custom branding',
        'Advanced reporting',
        'API access',
        'Dedicated support',
        'Custom integrations',
        'Bulk user management'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setIsLoading(planId);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Processing",
        description: "Redirecting to secure payment gateway...",
      });
      setIsLoading(null);
      
      // In a real implementation, this would redirect to Stripe
      console.log(`Processing payment for plan: ${planId}`);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Learning Plan</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Unlock your potential with our flexible pricing options
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden ${
              plan.popular ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-2 text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-8'}`}>
              <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <plan.icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-base">{plan.description}</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <Button 
                className={`w-full mb-6 bg-gradient-to-r ${plan.gradient} hover:opacity-90 transition-opacity`}
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading === plan.id}
              >
                {isLoading === plan.id ? 'Processing...' : `Get ${plan.name}`}
              </Button>
              
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-8">
        <p className="text-gray-600 mb-4">
          All plans include a 14-day free trial. Cancel anytime.
        </p>
        <div className="flex justify-center space-x-8 text-sm text-gray-500">
          <span>✓ Secure payments</span>
          <span>✓ Money-back guarantee</span>
          <span>✓ No hidden fees</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentPlans;
