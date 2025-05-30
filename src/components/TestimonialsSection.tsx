
import { Star, Quote, ArrowLeft, ArrowRight, Play, CheckCircle } from "lucide-react";
import { useState } from "react";

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Data Scientist",
      company: "Google",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face",
      content: "SimoneLabs transformed my learning experience completely. The AI-powered recommendations helped me master machine learning concepts faster than I ever thought possible. The personalized learning paths kept me engaged and motivated throughout my journey.",
      rating: 5,
      achievement: "Completed 12 courses in 6 months",
      course: "Advanced Machine Learning"
    },
    {
      name: "Marcus Chen",
      role: "Software Engineer",
      company: "Microsoft",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "The interactive learning approach and real-world projects made complex programming concepts incredibly clear. I went from beginner to advanced in just a few months. The community support was exceptional.",
      rating: 5,
      achievement: "Built 5 full-stack applications",
      course: "Full Stack Development"
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      company: "Tesla",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "As someone transitioning into tech, SimoneLabs provided the perfect bridge. The courses are well-structured, the AI tutor is incredibly helpful, and the progress tracking kept me motivated. I landed my dream job thanks to the skills I gained here.",
      rating: 5,
      achievement: "Career transition in 8 months",
      course: "Digital Marketing & Analytics"
    },
    {
      name: "David Kim",
      role: "UX Designer",
      company: "Apple",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "The design thinking courses and portfolio guidance were game-changers. The feedback from instructors and peers helped me refine my skills and build a portfolio that stood out. The platform's user experience itself is a masterclass in design.",
      rating: 5,
      achievement: "Portfolio views increased 300%",
      course: "UX/UI Design Mastery"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const features = [
    "AI-Powered Learning Paths",
    "Real-World Projects", 
    "Expert Instructors",
    "Community Support",
    "Career Guidance",
    "Progress Tracking"
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-card/30 via-background to-card/20 relative overflow-hidden">
      {/* Background decoration using exact colors */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-br from-primary/40 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl animate-gentle-bounce"></div>
      </div>

      <div className="container mx-auto container-padding relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-3 simonelabs-glass-card rounded-full px-6 py-3 text-sm font-medium border border-primary/20">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground font-semibold">Success Stories</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            What Our Learners 
            <span className="block simonelabs-gradient-text mt-2">Are Saying</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover how thousands of learners have transformed their careers 
            and achieved their goals with our AI-powered learning platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Features list */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 heading">
                Why Learners Choose Us
              </h3>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 simonelabs-glass-card p-4 rounded-xl gentle-hover"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="simonelabs-glass-card p-6 rounded-2xl border border-primary/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>
                <span className="text-2xl font-bold text-foreground">4.9/5</span>
              </div>
              <p className="text-muted-foreground">
                Average rating from <span className="font-semibold text-foreground">10,000+</span> learners worldwide
              </p>
            </div>
          </div>

          {/* Main testimonial */}
          <div className="lg:col-span-2">
            <div className="simonelabs-glass-card p-8 lg:p-12 rounded-3xl border border-primary/20 relative overflow-hidden">
              {/* Quote decoration */}
              <div className="absolute top-6 left-6 opacity-20">
                <Quote className="w-16 h-16 text-primary" />
              </div>
              
              <div className="relative z-10">
                {/* Navigation */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={prevTestimonial}
                      className="w-10 h-10 rounded-full bg-card hover:bg-primary/10 flex items-center justify-center transition-colors gentle-hover"
                    >
                      <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <button 
                      onClick={nextTestimonial}
                      className="w-10 h-10 rounded-full bg-card hover:bg-primary/10 flex items-center justify-center transition-colors gentle-hover"
                    >
                      <ArrowRight className="w-5 h-5 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Testimonial content */}
                <div className="space-y-6">
                  <blockquote className="text-xl lg:text-2xl text-foreground leading-relaxed font-medium">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  
                  <div className="flex items-center gap-6 pt-6 border-t border-border/40">
                    <img 
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20"
                    />
                    
                    <div className="flex-1">
                      <div className="font-bold text-foreground text-lg heading">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-muted-foreground">
                        {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                      </div>
                      <div className="text-sm text-primary font-medium mt-1">
                        {testimonials[currentTestimonial].achievement}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Course Completed</div>
                      <div className="font-semibold text-foreground">
                        {testimonials[currentTestimonial].course}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial 
                          ? 'bg-primary' 
                          : 'bg-card hover:bg-primary/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Video testimonial CTA */}
            <div className="mt-8 simonelabs-glass-card p-6 rounded-2xl border border-accent/20 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-foreground mb-1 heading">Watch Video Testimonials</h4>
                <p className="text-sm text-muted-foreground">See real success stories from our community</p>
              </div>
              <button className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center gentle-hover group">
                <Play className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
