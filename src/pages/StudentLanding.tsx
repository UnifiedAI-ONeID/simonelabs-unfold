
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Users, Trophy, Brain, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const StudentLanding = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Get personalized study recommendations and adaptive content that adjusts to your learning pace."
    },
    {
      icon: BookOpen,
      title: "Interactive Courses",
      description: "Access hundreds of courses with video lessons, quizzes, and hands-on projects."
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Join collaborative study sessions and learn together with peers worldwide."
    },
    {
      icon: Trophy,
      title: "Achievements & Badges",
      description: "Track your progress and earn badges as you complete courses and master new skills."
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Learn at your own pace with 24/7 access to all course materials and resources."
    },
    {
      icon: Star,
      title: "Expert Support",
      description: "Get help from qualified instructors and AI tutors whenever you need assistance."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative pt-14 sm:pt-16 lg:pt-18">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-gentle-bounce"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10 space-y-8">
            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="block text-foreground">Unlock Your</span>
                <span className="block bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">Learning Potential</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Join thousands of students who are mastering new skills with our AI-powered learning platform. 
                Personalized courses, interactive content, and a supportive community await you.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <Link to="/auth">
                  <Button className="btn-primary text-lg px-8 py-4 h-auto rounded-xl group shadow-lg">
                    <span>Start Learning Free</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" className="text-lg px-8 py-4 h-auto rounded-xl border-border hover:bg-muted">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-muted-foreground">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">500+</div>
                <div className="text-muted-foreground">Courses Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">95%</div>
                <div className="text-muted-foreground">Completion Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive learning platform provides all the tools and support you need to achieve your educational goals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Ready to Transform Your Learning Journey?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join our community of learners and start building the skills that will shape your future.
              </p>
              <Link to="/auth">
                <Button className="btn-primary text-lg px-10 py-4 h-auto rounded-xl shadow-lg">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentLanding;
