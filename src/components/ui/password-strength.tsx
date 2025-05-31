
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { calculatePasswordStrength } from '@/lib/security';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export const PasswordStrength = ({ password, className }: PasswordStrengthProps) => {
  const strength = calculatePasswordStrength(password);
  
  const getStrengthLabel = (strength: number): string => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };
  
  const getStrengthColor = (strength: number): string => {
    if (strength < 30) return 'text-red-500';
    if (strength < 60) return 'text-orange-500';
    if (strength < 80) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  if (!password) return null;
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground">Password strength</span>
        <span className={`text-xs font-medium ${getStrengthColor(strength)}`}>
          {getStrengthLabel(strength)}
        </span>
      </div>
      <Progress value={strength} className="h-2" />
    </div>
  );
};
