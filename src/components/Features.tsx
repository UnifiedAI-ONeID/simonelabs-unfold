
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Star, 
  Users, 
  Video, 
  Book, 
  Settings, 
  Calendar,
  Image,
  Monitor,
  Headphones
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Star,
      title: "AI Course Creation",
      description: "Generate structured course outlines, quizzes, and content with advanced AI assistance",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Users,
      title: "Interactive AI Tutoring",
      description: "24/7 AI chatbot that answers questions contextually and provides personalized study tips",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Video,
      title: "Rich Media Support",
      description: "Upload videos, audio, PDFs, presentations, and integrate external content seamlessly",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Monitor,
      title: "XR & Immersive Learning",
      description: "Support for VR, AR, and MR content for truly immersive educational experiences",
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      icon: Book,
      title: "Flexible Course Delivery",
      description: "On-demand, live, and cohort-based courses with automated scheduling and management",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Settings,
      title: "Advanced Analytics",
      description: "Comprehensive dashboards with predictive learning analytics and performance insights",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: Calendar,
      title: "Gamification System",
      description: "Badges, leaderboards, challenges, and motivation tools to boost engagement",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: Headphones,
      title: "Mobile-First Design",
      description: "Full-featured mobile apps with offline support and data-saver modes",
      color: "bg-teal-100 text-teal-600"
    },
    {
      icon: Image,
      title: "Community Learning",
      description: "Built-in forums, peer reviews, study groups, and mentoring tools",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for
            <span className="gradient-text block">Modern Learning</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create, deliver, and scale world-class educational experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
