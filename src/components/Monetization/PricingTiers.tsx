
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, Zap, Crown, Users, BookOpen, Award, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PricingOption {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  badge?: string;
  icon: React.ElementType;
  gradient: string;
  category: 'course' | 'subscription' | 'certification' | 'mentoring' | 'enterprise';
}

const PricingTiers = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('subscription');
  const { toast } = useToast();

  const pricingOptions: PricingOption[] = [
    // Subscription Plans
    {
      id: 'basic-monthly',
      name: 'SimoneLabs Plus Monthly',
      price: 19,
      period: 'month',
      description: 'Unlimited access to most courses',
      category: 'subscription',
      icon: Star,
      gradient: 'from-blue-500 to-blue-600',
      features: [
        'Unlimited course access',
        'Self-paced learning',
        'Community support',
        'Mobile app access',
        'Basic certificates',
        'Progress tracking'
      ]
    },
    {
      id: 'premium-monthly',
      name: 'SimoneLabs Plus Premium',
      price: 29,
      period: 'month',
      description: 'Everything plus live sessions & mentoring',
      category: 'subscription',
      icon: Zap,
      gradient: 'from-purple-500 to-purple-600',
      popular: true,
      badge: 'Most Popular',
      features: [
        'Everything in Basic',
        'Live cohort courses',
        'Priority support',
        'Advanced certificates',
        'AI tutoring assistant',
        '1 mentoring session/month',
        'Exclusive content'
      ]
    },
    {
      id: 'yearly-discount',
      name: 'SimoneLabs Plus Yearly',
      price: 199,
      originalPrice: 348,
      period: 'year',
      description: 'Save 43% with annual billing',
      category: 'subscription',
      icon: Crown,
      gradient: 'from-green-500 to-green-600',
      badge: 'Best Value',
      features: [
        'Everything in Premium',
        '2 months free',
        'Annual exclusive workshops',
        'Industry certifications',
        'Career guidance sessions',
        'Network access'
      ]
    },
    // Pay-Per-Course
    {
      id: 'standard-course',
      name: 'Standard Course',
      price: 29,
      period: 'one-time',
      description: 'Individual course access',
      category: 'course',
      icon: BookOpen,
      gradient: 'from-indigo-500 to-indigo-600',
      features: [
        'Lifetime course access',
        'All course materials',
        'Community discussions',
        'Basic certificate',
        'Mobile access'
      ]
    },
    {
      id: 'premium-course',
      name: 'Premium Course',
      price: 99,
      period: 'one-time',
      description: 'In-depth course with certification',
      category: 'course',
      icon: Award,
      gradient: 'from-orange-500 to-orange-600',
      features: [
        'Everything in Standard',
        'Live Q&A sessions',
        'Project feedback',
        'Industry certification',
        'Career guidance',
        'Networking opportunities'
      ]
    },
    // Certifications
    {
      id: 'standard-cert',
      name: 'Standard Certificate',
      price: 35,
      period: 'one-time',
      description: 'Verified course completion',
      category: 'certification',
      icon: Award,
      gradient: 'from-teal-500 to-teal-600',
      features: [
        'Verified certificate',
        'LinkedIn integration',
        'Digital badge',
        'Transcript access'
      ]
    },
    {
      id: 'industry-cert',
      name: 'Industry Certification',
      price: 75,
      period: 'one-time',
      description: 'Professional stackable credential',
      category: 'certification',
      icon: Crown,
      gradient: 'from-rose-500 to-rose-600',
      features: [
        'Industry-recognized badge',
        'Proctored assessment',
        'Professional transcript',
        'Career services access',
        'Alumni network'
      ]
    },
    // Mentoring
    {
      id: 'mentor-session',
      name: '1:1 Mentoring Session',
      price: 60,
      period: 'hour',
      description: 'Personal guidance from experts',
      category: 'mentoring',
      icon: Users,
      gradient: 'from-violet-500 to-violet-600',
      features: [
        '60-minute session',
        'Personalized guidance',
        'Career advice',
        'Project feedback',
        'Follow-up notes'
      ]
    },
    {
      id: 'group-coaching',
      name: 'Small Group Coaching',
      price: 15,
      period: 'session',
      description: 'Learn with peers in small groups',
      category: 'mentoring',
      icon: Clock,
      gradient: 'from-cyan-500 to-cyan-600',
      features: [
        '90-minute sessions',
        'Max 8 participants',
        'Interactive workshops',
        'Peer networking',
        'Resource sharing'
      ]
    },
    // Enterprise
    {
      id: 'team-plan',
      name: 'Team Plan',
      price: 59,
      period: 'user/month',
      description: 'For teams and organizations',
      category: 'enterprise',
      icon: Users,
      gradient: 'from-slate-500 to-slate-600',
      features: [
        'Team management',
        'Advanced analytics',
        'Custom branding',
        'Bulk enrollment',
        'Progress reporting',
        'Admin controls',
        'Priority support'
      ]
    }
  ];

  const handlePurchase = async (optionId: string) => {
    setIsLoading(optionId);
    
    setTimeout(() => {
      toast({
        title: "Redirecting to payment",
        description: "Taking you to secure checkout...",
      });
      setIsLoading(null);
    }, 1500);
  };

  const filteredOptions = pricingOptions.filter(option => option.category === selectedTab);

  const getTabTitle = (category: string) => {
    switch (category) {
      case 'subscription': return 'Subscriptions';
      case 'course': return 'Pay-Per-Course';
      case 'certification': return 'Certifications';
      case 'mentoring': return 'Mentoring';
      case 'enterprise': return 'Enterprise';
      default: return category;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Learning Investment</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Flexible pricing options to fit your learning goals and budget
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
          <TabsTrigger value="course">Courses</TabsTrigger>
          <TabsTrigger value="certification">Certificates</TabsTrigger>
          <TabsTrigger value="mentoring">Mentoring</TabsTrigger>
          <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
        </TabsList>

        {['subscription', 'course', 'certification', 'mentoring', 'enterprise'].map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOptions.map((option) => (
                <Card 
                  key={option.id} 
                  className={`relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                    option.popular ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  {(option.popular || option.badge) && (
                    <div className={`absolute top-0 left-0 right-0 text-white text-center py-2 text-sm font-medium ${
                      option.popular ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                    }`}>
                      {option.badge || 'Most Popular'}
                    </div>
                  )}
                  
                  <CardHeader className={`text-center ${(option.popular || option.badge) ? 'pt-12' : 'pt-8'}`}>
                    <div className={`w-16 h-16 bg-gradient-to-r ${option.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{option.name}</CardTitle>
                    <CardDescription className="text-base">{option.description}</CardDescription>
                    <div className="pt-4">
                      <div className="flex items-center justify-center gap-2">
                        {option.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            ${option.originalPrice}
                          </span>
                        )}
                        <span className="text-3xl font-bold">${option.price}</span>
                      </div>
                      <span className="text-muted-foreground">/{option.period}</span>
                      {option.originalPrice && (
                        <Badge variant="secondary" className="ml-2">
                          Save {Math.round((1 - option.price / option.originalPrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <Button 
                      className={`w-full mb-6 bg-gradient-to-r ${option.gradient} hover:opacity-90 transition-opacity`}
                      onClick={() => handlePurchase(option.id)}
                      disabled={isLoading === option.id}
                    >
                      {isLoading === option.id ? 'Processing...' : 
                        option.category === 'subscription' ? 'Start Subscription' :
                        option.category === 'course' ? 'Buy Course' :
                        option.category === 'certification' ? 'Get Certified' :
                        option.category === 'mentoring' ? 'Book Session' :
                        'Contact Sales'
                      }
                    </Button>
                    
                    <ul className="space-y-3">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Additional Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">Money-Back Guarantee</h3>
          <p className="text-sm text-muted-foreground">30-day refund policy on all purchases</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold mb-2">Referral Program</h3>
          <p className="text-sm text-muted-foreground">Earn $10 credit for each friend you refer</p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold mb-2">Localized Pricing</h3>
          <p className="text-sm text-muted-foreground">Special pricing for emerging markets</p>
        </div>
      </div>
    </div>
  );
};

export default PricingTiers;
