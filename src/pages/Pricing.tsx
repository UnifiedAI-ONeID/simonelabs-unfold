
import Navigation from "@/components/Navigation";
import PaymentPlans from "@/components/Payment/PaymentPlans";
import LocalizedPricing from "@/components/Monetization/LocalizedPricing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Flexible Learning Investment Options</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from subscriptions, individual courses, certifications, mentoring, and enterprise solutions. 
              All designed to fit your learning journey and budget.
            </p>
          </div>

          <Tabs defaultValue="plans" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto">
              <TabsTrigger value="plans">Pricing Plans</TabsTrigger>
              <TabsTrigger value="regional">Regional Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <PaymentPlans />
            </TabsContent>

            <TabsContent value="regional">
              <LocalizedPricing />
            </TabsContent>
          </Tabs>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center text-sm text-muted-foreground">
              <div>✓ 30-day money-back guarantee</div>
              <div>✓ Secure payment processing</div>
              <div>✓ Cancel anytime</div>
              <div>✓ 24/7 customer support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
