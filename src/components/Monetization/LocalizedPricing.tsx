import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, DollarSign } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface PricingRegion {
  region: string;
  currency: string;
  symbol: string;
  discount: number;
  basicPrice: number;
  premiumPrice: number;
}

const LocalizedPricing = () => {
  const [userRegion, setUserRegion] = useState<string>('US/EU/UK');
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation('payment');
  
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
    const detectRegion = async () => {
      try {
        setIsLoading(true);
        // Use a more secure geolocation service with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }

        const data = await response.json();
        
        // Validate response data
        if (!data.country_code || typeof data.country_code !== 'string') {
          throw new Error('Invalid location data');
        }

        const countryCode = data.country_code.toUpperCase();
        
        // Improved region mapping with more countries
        if (['IN'].includes(countryCode)) {
          setUserRegion('India');
        } else if (['SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'MM', 'KH', 'LA', 'BN'].includes(countryCode)) {
          setUserRegion('Southeast Asia');
        } else if (['NG', 'KE', 'ZA', 'GH', 'EG', 'MA', 'ET', 'TZ', 'UG', 'DZ', 'SD', 'MZ', 'MG', 'CM', 'CI', 'NE', 'BF', 'ML', 'MW', 'ZM', 'SN', 'SO', 'TD', 'GN', 'RW', 'BJ', 'TN', 'BI', 'GW', 'LR', 'SL', 'TG', 'CF', 'MR', 'ER', 'GM', 'BW', 'GA', 'LS', 'GQ', 'MU', 'SZ', 'DJ', 'CV', 'KM', 'SC', 'ST'].includes(countryCode)) {
          setUserRegion('Africa');
        } else if (['BR', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'NI', 'CR', 'PA', 'UY', 'JM', 'TT', 'GY', 'SR', 'BZ', 'BB', 'BS', 'AG', 'DM', 'GD', 'KN', 'LC', 'VC'].includes(countryCode)) {
          setUserRegion('Latin America');
        } else {
          setUserRegion('US/EU/UK');
        }
      } catch (error) {
        console.log('Could not detect region:', error);
        setUserRegion('US/EU/UK');
      } finally {
        setIsLoading(false);
      }
    };

    detectRegion();
  }, []);

  const currentPricing = pricingRegions.find(p => p.region === userRegion) || pricingRegions[0];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t('regional.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {t('regional.detectedRegion', { region: currentPricing.region })}
              </p>
              {currentPricing.discount > 0 && (
                <Badge variant="secondary" className="text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900">
                  {t('regional.discount', { discount: currentPricing.discount })}
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
              <p className="text-sm text-muted-foreground">
                {t('regional.currency', { currency: currentPricing.currency })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pricingRegions.map((pricing) => (
          <Card 
            key={pricing.region} 
            className={`transition-all hover:shadow-md ${pricing.region === userRegion ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''}`}
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
                  {t('regional.currency', { currency: pricing.currency })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          {t('regional.description')}
        </p>
      </div>
    </div>
  );
};

export default LocalizedPricing;