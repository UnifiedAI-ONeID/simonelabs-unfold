
import { Star } from "lucide-react";

const MissionSection = () => {
  return (
    <section className="section-padding bg-card/50">
      <div className="container mx-auto container-padding">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
              <Star className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Our Mission
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            We believe that everyone deserves access to quality education. Through innovative technology 
            and adaptive learning systems, we're breaking down barriers and creating opportunities for 
            learners worldwide to reach their full potential.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">100+ Courses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-sm text-muted-foreground">50,000+ Learners</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-muted rounded-full"></div>
              <span className="text-sm text-muted-foreground">Global Community</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
