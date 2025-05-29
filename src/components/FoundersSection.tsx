
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const FoundersSection = () => {
  const founders = [
    {
      name: "Fiona Wong",
      role: "Co-Founder & CEO",
      bio: "Former EdTech executive with 15 years of experience in educational innovation. Fiona's vision for accessible education drives SimoneLabs' mission to democratize learning globally.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      fallback: "FW"
    },
    {
      name: "Simon Luke",
      role: "Co-Founder & CTO",
      bio: "AI and machine learning expert with a PhD in Educational Technology. Simon's innovative approach to adaptive learning systems forms the technological foundation of SimoneLabs.",
      image: "/lovable-uploads/3e498a20-6de2-4231-8d3f-bf16f1738c22.png",
      fallback: "SL"
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meet Our Founders
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {founders.map((founder, index) => (
            <div key={index} className="text-center space-y-6">
              {/* Founder image */}
              <div className="flex justify-center">
                <Avatar className="w-32 h-32">
                  <AvatarImage 
                    src={founder.image} 
                    alt={founder.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {founder.fallback}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Founder details */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">{founder.name}</h3>
                <p className="text-lg font-medium text-primary">{founder.role}</p>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {founder.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
