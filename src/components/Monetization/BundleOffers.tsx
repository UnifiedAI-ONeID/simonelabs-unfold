
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CourseBundle {
  id: string;
  name: string;
  courses: string[];
  originalPrice: number;
  bundlePrice: number;
  discount: number;
  duration: string;
  students: number;
  rating: number;
  category: string;
}

const BundleOffers = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const bundles: CourseBundle[] = [
    {
      id: 'web-dev-bundle',
      name: 'Full-Stack Web Development',
      courses: ['HTML & CSS Mastery', 'JavaScript Advanced', 'React Development', 'Node.js Backend'],
      originalPrice: 196,
      bundlePrice: 139,
      discount: 29,
      duration: '40 hours',
      students: 2547,
      rating: 4.8,
      category: 'Web Development'
    },
    {
      id: 'data-science-bundle',
      name: 'Data Science Complete',
      courses: ['Python for Data Science', 'Machine Learning', 'Data Visualization', 'SQL for Analytics'],
      originalPrice: 176,
      bundlePrice: 123,
      discount: 30,
      duration: '35 hours',
      students: 1893,
      rating: 4.9,
      category: 'Data Science'
    },
    {
      id: 'design-bundle',
      name: 'Digital Design Mastery',
      courses: ['UI/UX Design', 'Adobe Creative Suite', 'Design Systems', 'Portfolio Building'],
      originalPrice: 156,
      bundlePrice: 109,
      discount: 30,
      duration: '28 hours',
      students: 1634,
      rating: 4.7,
      category: 'Design'
    },
    {
      id: 'business-bundle',
      name: 'Entrepreneurship & Business',
      courses: ['Business Strategy', 'Digital Marketing', 'Financial Planning', 'Leadership Skills'],
      originalPrice: 166,
      bundlePrice: 116,
      discount: 30,
      duration: '32 hours',
      students: 987,
      rating: 4.6,
      category: 'Business'
    }
  ];

  const handlePurchaseBundle = async (bundleId: string) => {
    setIsLoading(bundleId);
    
    setTimeout(() => {
      toast({
        title: "Bundle Purchase",
        description: "Redirecting to secure checkout for your bundle...",
      });
      setIsLoading(null);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Course Bundles</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Save up to 30% when you buy multiple courses together
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {bundles.map((bundle) => (
          <Card key={bundle.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="secondary" className="mb-2">{bundle.category}</Badge>
                  <CardTitle className="text-xl">{bundle.name}</CardTitle>
                </div>
                <Badge variant="destructive" className="text-white">
                  {bundle.discount}% OFF
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{bundle.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{bundle.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{bundle.rating}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Included Courses
                  </h4>
                  <ul className="space-y-2">
                    {bundle.courses.map((course, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {course}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-muted-foreground line-through">
                          ${bundle.originalPrice}
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          ${bundle.bundlePrice}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Save ${bundle.originalPrice - bundle.bundlePrice}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
                    onClick={() => handlePurchaseBundle(bundle.id)}
                    disabled={isLoading === bundle.id}
                  >
                    {isLoading === bundle.id ? 'Processing...' : 'Buy Bundle'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Custom Bundle Builder</h3>
        <p className="text-muted-foreground mb-4">
          Want to create your own bundle? Select any 3+ courses and get automatic discounts
        </p>
        <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
          Build Custom Bundle
        </Button>
      </div>
    </div>
  );
};

export default BundleOffers;
