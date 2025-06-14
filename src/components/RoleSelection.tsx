
import { Button } from "@/components/ui/button";
import { GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";

const RoleSelection = () => {
  const { isAuthenticated } = useEnhancedAuth();

  const roles = [
    {
      icon: GraduationCap,
      title: "Student",
      description: "Learn new skills with AI-powered courses and interactive content",
      features: ["Personalized learning paths", "Interactive courses", "Study groups", "Progress tracking"],
      link: isAuthenticated ? "/dashboard" : "/student",
      color: "from-primary/10 to-primary/5",
      iconColor: "text-primary"
    },
    {
      icon: Users,
      title: "Educator",
      description: "Create and monetize your expertise with powerful teaching tools",
      features: ["Course creation tools", "Student analytics", "Revenue sharing", "AI assistance"],
      link: isAuthenticated ? "/dashboard" : "/educator",
      color: "from-accent/10 to-accent/5",
      iconColor: "text-accent"
    }
  ];

  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Learning Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're here to learn or teach, we have the perfect solution for your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {roles.map((role, index) => (
            <div key={index} className={`bg-gradient-to-br ${role.color} rounded-2xl p-8 border border-border hover:shadow-lg transition-all duration-300 group`}>
              <div className={`w-16 h-16 bg-card rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <role.icon className={`h-8 w-8 ${role.iconColor}`} />
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-3">{role.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{role.description}</p>
                
                <div className="space-y-2 mb-6">
                  {role.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 ${role.iconColor.replace('text-', 'bg-')} rounded-full`}></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Link to={role.link} className="block">
                <Button className="w-full btn-primary rounded-xl group-hover:shadow-lg transition-all duration-300">
                  {isAuthenticated ? `Go to ${role.title} Dashboard` : `Get Started as ${role.title}`}
                </Button>
              </Link>
            </div>
          ))}
        </div>
        
        {isAuthenticated && (
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Need administrative access? Contact your system administrator.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoleSelection;
