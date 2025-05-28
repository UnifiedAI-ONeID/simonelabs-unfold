
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard = ({ icon: Icon, title, description, gradient }: FeatureCardProps) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
      <CardContent className="p-8 text-center relative">
        <div className={`w-20 h-20 ${gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
