
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, BarChart3, Lightbulb, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EducatorLanding = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: BookOpen,
      title: "Course Creation Tools",
      description: "Build engaging courses with our intuitive drag-and-drop course builder and AI-powered content suggestions."
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Track student progress, manage enrollments, and provide personalized feedback at scale."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get deep insights into student performance, engagement metrics, and learning outcomes."
    },
    {
      icon: Lightbulb,
      title: "AI Teaching Assistant",
      description: "Leverage AI to create quizzes, generate content, and provide automated student support."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security ensures your content and student data are always protected."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Reach students worldwide with multi-language support and global payment processing."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative pt-14 sm:pt-16 lg:pt-18">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-gentle-bounce"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10 space-y-8">
            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="block text-foreground">Empower Your</span>
                <span className="block bg-gradient-to-r from-accent to-primary text-transparent bg-clip-text">Teaching Impact</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Create, deliver, and monetize your expertise with our comprehensive education platform. 
                Join educators who are transforming lives through innovative online learning.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <Link to="/auth">
                  <Button className="btn-primary text-lg px-8 py-4 h-auto rounded-xl group shadow-lg">
                    <span>Start Teaching</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/course-builder">
                  <Button variant="outline" className="text-lg px-8 py-4 h-auto rounded-xl border-border hover:bg-muted">
                    Explore Tools
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">2K+</div>
                <div className="text-muted-foreground">Active Educators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">$2M+</div>
                <div className="text-muted-foreground">Educator Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">4.8★</div>
                <div className="text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Professional Teaching Tools
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to create, manage, and grow your online education business.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Revenue Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-3xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Turn Your Knowledge Into Revenue
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Our educators earn an average of $5,000+ per month teaching what they love. 
                    With flexible pricing models and global reach, your earning potential is unlimited.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-foreground">Keep 85% of your revenue</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">Monthly payouts worldwide</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-foreground">No upfront costs</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-card rounded-xl p-6 text-center border border-border">
                    <div className="text-2xl font-bold text-accent mb-2">85%</div>
                    <div className="text-sm text-muted-foreground">Revenue Share</div>
                  </div>
                  <div className="bg-card rounded-xl p-6 text-center border border-border">
                    <div className="text-2xl font-bold text-primary mb-2">$5K+</div>
                    <div className="text-sm text-muted-foreground">Avg Monthly</div>
                  </div>
                  <div className="bg-card rounded-xl p-6 text-center border border-border">
                    <div className="text-2xl font-bold text-secondary mb-2">50M+</div>
                    <div className="text-sm text-muted-foreground">Global Reach</div>
                  </div>
                  <div className="bg-card rounded-xl p-6 text-center border border-border">
                    <div className="text-2xl font-bold text-accent mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-accent/5 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Ready to Share Your Expertise?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of educators who are making a difference while building their income.
              </p>
              <Link to="/auth">
                <Button className="btn-primary text-lg px-10 py-4 h-auto rounded-xl shadow-lg">
                  Become an Educator
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EducatorLanding;
