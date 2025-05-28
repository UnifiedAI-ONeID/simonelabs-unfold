
import Navigation from "@/components/Navigation";
import AnalyticsDashboard from "@/components/Analytics/AnalyticsDashboard";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
