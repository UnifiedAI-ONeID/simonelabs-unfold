
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, DollarSign } from "lucide-react";

interface PricingRegion {
  region: string;
  currency: string;
  symbol: string;
  discount: number;
  basicPrice: number;
  premiumPrice: number;
}

const LocalizedPricing = () => {
  const [userRegion, setUserRegion] = useState<string>('US');
  
  const pricingRegions: PricingRegion[] = [
    {
      region: 'US/EU/UK',
      currency: 'USD',
      symbol: '$',
      discount: 0,
      basicPrice: 19,
      premiumPrice: 29
    },
    {
      region: 'India',
      currency: 'INR',
      symbol: '₹',
      discount: 60,
      basicPrice: 499,
      premiumPrice: 799
    },
    {
      region: 'Southeast Asia',
      currency: 'USD',
      symbol: '$',
      discount: 50,
      basicPrice: 9,
      premiumPrice: 14
    },
    {
      region: 'Africa',
      currency: 'USD',
      symbol: '$',
      discount: 55,
      basicPrice: 8,
      premiumPrice: 13
    },
    {
      region: 'Latin America',
      currency: 'USD',
      symbol: '$',
      discount: 45,
      basicPrice: 10,
      premiumPrice: 16
    }
  ];

  useEffect(() => {
    // Simulate geolocation detection
    const detectRegion = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        // Simplified region mapping
        if (['IN'].includes(data.country_code)) {
          setUserRegion('India');
        } else if (['SG', 'MY', 'TH', 'ID', 'PH', 'VN'].includes(data.country_code)) {
          setUserRegion('Southeast Asia');
        } else if (['NG', 'KE', 'ZA', 'GH', 'EG'].includes(data.country_code)) {
          setUserRegion('Africa');
        } else if (['BR', 'MX', 'AR', 'CO', 'CL'].includes(data.country_code)) {
          setUserRegion('Latin America');
        } else {
          setUserRegion('US/EU/UK');
        }
      } catch (error) {
        console.log('Could not detect region, using default');
        setUserRegion('US/EU/UK');
      }
    };

    detectRegion();
  }, []);

  const currentPricing = pricingRegions.find(p => p.region === userRegion) || pricingRegions[0];

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Your Regional Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Detected Region: {currentPricing.region}</p>
              {currentPricing.discount > 0 && (
                <Badge variant="secondary" className="text-green-600 bg-green-100">
                  {currentPricing.discount}% Regional Discount Applied
                </Badge>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-lg font-semibold">
                  {currentPricing.symbol}{currentPricing.basicPrice} - {currentPricing.symbol}{currentPricing.premiumPrice}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{currentPricing.currency}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pricingRegions.map((pricing) => (
          <Card 
            key={pricing.region} 
            className={`transition-all ${pricing.region === userRegion ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{pricing.region}</CardTitle>
              {pricing.discount > 0 && (
                <Badge variant="outline" className="w-fit">
                  {pricing.discount}% off
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Basic Plan:</span>
                  <span className="font-medium">{pricing.symbol}{pricing.basicPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Premium Plan:</span>
                  <span className="font-medium">{pricing.symbol}{pricing.premiumPrice}</span>
                </div>
                <div className="text-xs text-muted-foreground pt-2">
                  Currency: {pricing.currency}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Pricing automatically adjusted based on your location to make education more accessible worldwide.
          <br />
          All features and content remain the same regardless of pricing tier.
        </p>
      </div>
    </div>
  );
};

export default LocalizedPricing;
