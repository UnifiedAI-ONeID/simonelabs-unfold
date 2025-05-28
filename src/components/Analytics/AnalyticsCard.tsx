
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AnalyticsCardProps } from './types';

const AnalyticsCard = ({ title, value, icon: Icon, color, subtitle }: AnalyticsCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
