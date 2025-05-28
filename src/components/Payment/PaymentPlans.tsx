
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingTiers from '@/components/Monetization/PricingTiers';
import BundleOffers from '@/components/Monetization/BundleOffers';

const PaymentPlans = () => {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="pricing" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="pricing">All Pricing Options</TabsTrigger>
          <TabsTrigger value="bundles">Course Bundles</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing">
          <PricingTiers />
        </TabsContent>

        <TabsContent value="bundles">
          <BundleOffers />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentPlans;
