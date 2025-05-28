
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      content: "SimoneLabs transformed my career. The AI-powered course recommendations helped me learn exactly what I needed.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b593?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      content: "The interactive learning experience and personalized feedback made complex topics easy to understand.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      content: "Best investment I've made in my professional development. The courses are practical and immediately applicable.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground heading">
            What Our Students Say
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Real stories from learners who achieved their goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="simonelabs-glass-card hover:shadow-lg transition-all duration-200">
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-simonelabs-warning fill-current" />
                  ))}
                </div>
                
                <p className="text-sm sm:text-base text-muted-foreground italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3 sm:gap-4 pt-2">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  <div className="space-y-1">
                    <div className="font-semibold text-sm sm:text-base text-foreground heading">
                      {testimonial.name}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
