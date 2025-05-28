
import { Brain, Video, Users, Trophy, Zap, Shield } from "lucide-react";
import FeatureCard from "./FeatureCard";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized course recommendations and adaptive learning paths powered by advanced AI algorithms.",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      icon: Video,
      title: "Interactive Content",
      description: "Engage with high-quality videos, interactive exercises, and hands-on projects for better learning outcomes.",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from industry professionals and thought leaders who bring real-world experience to every lesson.",
      gradient: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      icon: Trophy,
      title: "Skill Certification",
      description: "Earn recognized certificates upon course completion to showcase your new skills to employers.",
      gradient: "bg-gradient-to-br from-yellow-500 to-orange-500"
    },
    {
      icon: Zap,
      title: "Fast-Track Learning",
      description: "Accelerated learning paths designed to help you master new skills in weeks, not months.",
      gradient: "bg-gradient-to-br from-pink-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Lifetime Access",
      description: "Once enrolled, access your courses forever with free updates and new content additions.",
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="gradient-text">SimoneLabs</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of online learning with cutting-edge technology, 
            expert instruction, and personalized learning paths designed for your success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
