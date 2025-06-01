
import { useEffect } from 'react';

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Handle different types of performance entries
        if (entry.entryType === 'navigation') {
          const navigationEntry = entry as PerformanceNavigationTiming;
          console.log(`Navigation: ${navigationEntry.name} - ${navigationEntry.duration}ms`);
        } else if (entry.entryType === 'paint') {
          const paintEntry = entry as PerformancePaintTiming;
          console.log(`Paint: ${paintEntry.name} - ${paintEntry.startTime}ms`);
        } else if (entry.entryType === 'largest-contentful-paint') {
          const lcpEntry = entry as any; // LCP entries have renderTime or loadTime
          const time = lcpEntry.renderTime || lcpEntry.loadTime;
          console.log(`LCP: ${entry.name} - ${time}ms`);
        } else {
          console.log(`${entry.name}: ${entry.startTime}ms`);
        }
      });
    });

    // Observe different performance metrics
    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    } catch (error) {
      console.warn('Performance observer not supported');
    }

    // Memory usage monitoring (if available)
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn('High memory usage detected');
        }
      };

      const memoryInterval = setInterval(checkMemory, 30000); // Check every 30 seconds

      return () => {
        clearInterval(memoryInterval);
        observer.disconnect();
      };
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
};
