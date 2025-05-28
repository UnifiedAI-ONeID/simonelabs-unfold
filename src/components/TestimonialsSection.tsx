
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Users } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      company: "TechCorp",
      content: "SimoneLabs has completely revolutionized my learning journey. The AI-powered course recommendations are incredibly accurate and have helped me advance my career faster than I ever imagined possible.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b593?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      company: "DataFlow Inc",
      content: "The interactive learning experience and personalized feedback made complex machine learning topics easy to understand. I've completed 12 courses in just 6 months!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "DesignStudio",
      content: "Best investment I've made in my professional development. The courses are practical, immediately applicable, and the community support is phenomenal. Highly recommended!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "David Park",
      role: "Product Manager",
      company: "InnovateLab",
      content: "The AI tutor feature is like having a personal mentor available 24/7. It adapts to my learning style and provides insights that traditional courses simply can't match.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Lisa Wang",
      role: "Marketing Director",
      company: "BrandCo",
      content: "I love how the platform tracks my progress and suggests relevant courses. It's helped me stay motivated and achieve my learning goals consistently over the past year.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "James Miller",
      role: "DevOps Engineer",
      company: "CloudTech",
      content: "The hands-on projects and real-world examples make learning engaging and practical. I've been able to implement what I've learned immediately in my work environment.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face"
    }
  ];

  return (
    <section className="section-padding bg-muted/20">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-16 lg:mb-20 space-y-6 fade-in-up">
          <div className="inline-flex items-center gap-2 simonelabs-glass-card rounded-full px-4 py-2 text-sm font-medium">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Student Success Stories</span>
          </div>
          
          <h2 className="responsive-heading text-foreground max-w-4xl mx-auto">
            What Our
            <span className="simonelabs-gradient-text"> Students Say</span>
          </h2>
          
          <p className="responsive-body text-muted-foreground max-w-2xl mx-auto">
            Real stories from learners who achieved their goals and transformed 
            their careers with our AI-powered learning platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="simonelabs-glass-card gentle-hover border-border/40 rounded-2xl group overflow-hidden"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <CardContent className="p-6 lg:p-8 space-y-6">
                {/* Quote icon and rating */}
                <div className="flex items-start justify-between">
                  <Quote className="w-8 h-8 text-primary/40 group-hover:text-primary/60 transition-colors" />
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-current" />
                    ))}
                  </div>
                </div>
                
                {/* Testimonial content */}
                <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">
                  "{testimonial.content}"
                </p>
                
                {/* User info */}
                <div className="flex items-center gap-4 pt-4 border-t border-border/40">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-border/40 group-hover:ring-primary/40 transition-colors"
                  />
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground heading text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-primary font-medium">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced CTA section */}
        <div className="mt-20 text-center">
          <div className="simonelabs-glass-card p-8 lg:p-12 rounded-3xl max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="grid grid-cols-5 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-primary fill-current" />
                ))}
              </div>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 heading">
              Join 15,000+ Happy Students
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Start your learning journey today and see why students love our platform.
            </p>
            <button className="simonelabs-primary-button px-8 py-4 rounded-xl text-base font-semibold">
              Start Learning for Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
