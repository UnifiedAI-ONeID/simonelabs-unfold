
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingFallbackProps {
  type?: 'page' | 'component' | 'form';
  className?: string;
}

export const LoadingFallback = ({ type = 'page', className = '' }: LoadingFallbackProps) => {
  if (type === 'page') {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 ${className}`}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
};
