import Navigation from "@/components/Navigation";
import VirtualLab from "@/components/VirtualLabs/VirtualLab";

const VirtualLabs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Virtual Labs</h1>
            <p className="text-muted-foreground">
              Interactive simulations and hands-on learning environments
            </p>
          </div>
          <VirtualLab />
        </div>
      </div>
    </div>
  );
};

export default VirtualLabs;