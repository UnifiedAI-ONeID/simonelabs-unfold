
import Navigation from "@/components/Navigation";
import PaymentPlans from "@/components/Payment/PaymentPlans";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <PaymentPlans />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
