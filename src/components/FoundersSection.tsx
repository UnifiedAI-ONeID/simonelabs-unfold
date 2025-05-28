import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Twitter } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const FoundersSection = () => {
  const founders = [
    {
      name: "Fiona Wong",
      role: "Founder & CEO",
      bio: "Visionary leader with 15+ years in educational technology. Former VP of Product at leading EdTech companies, passionate about democratizing access to quality education through AI.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      fallback: "FW",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Simon Luke",
      role: "Co-Founder & CTO",
      bio: "Ex Microsoft engineer and AI researcher with expertise in machine learning and educational systems. PhD in Computer Science from Stanford, passionate about leveraging AI to revolutionize learning.",
      image: "/lovable-uploads/3e498a20-6de2-4231-8d3f-bf16f1738c22.png",
      fallback: "SL",
      linkedin: "#",
      twitter: "#"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Our Founders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The visionaries behind SimoneLabs, dedicated to transforming education through innovation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {founders.map((founder, index) => (
            <Card key={index} className="border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square w-full overflow-hidden flex items-center justify-center bg-muted">
                  <Avatar className="w-48 h-48">
                    <AvatarImage 
                      src={founder.image} 
                      alt={founder.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                      {founder.fallback}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{founder.name}</h3>
                  <p className="text-lg font-semibold text-primary mb-4">{founder.role}</p>
                  <p className="text-muted-foreground leading-relaxed mb-6">{founder.bio}</p>
                  <div className="flex space-x-4">
                    <a 
                      href={founder.linkedin}
                      className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                      aria-label={`${founder.name}'s LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </a>
                    <a 
                      href={founder.twitter}
                      className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label={`${founder.name}'s Twitter`}
                    >
                      <Twitter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </a>
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

export default FoundersSection;
