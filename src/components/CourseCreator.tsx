
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Wand2, 
  Upload, 
  Video, 
  Image, 
  FileText,
  Mic,
  Code,
  Plus,
  Settings
} from "lucide-react";

const CourseCreator = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);

  const contentTypes = [
    { icon: Video, label: "Video Lessons", description: "Upload or record video content", color: "bg-red-100 text-red-600" },
    { icon: Image, label: "Images & Slides", description: "Add visual content and presentations", color: "bg-blue-100 text-blue-600" },
    { icon: FileText, label: "Documents", description: "PDFs, articles, and reading materials", color: "bg-green-100 text-green-600" },
    { icon: Mic, label: "Audio Content", description: "Podcasts and audio lessons", color: "bg-purple-100 text-purple-600" },
    { icon: Code, label: "Interactive Code", description: "Coding exercises and labs", color: "bg-yellow-100 text-yellow-600" },
    { icon: Star, label: "Quizzes & Tests", description: "AI-generated assessments", color: "bg-pink-100 text-pink-600" }
  ];

  const aiFeatures = [
    "Auto-generate course outline",
    "Create quiz questions from content",
    "Suggest learning objectives",
    "Generate video transcripts",
    "Personalized learning paths",
    "Content recommendations"
  ];

  const handleGenerateOutline = () => {
    setIsGeneratingOutline(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGeneratingOutline(false);
    }, 3000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Create Your Course with
            <span className="gradient-text block">AI Assistance</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build engaging, interactive courses with powerful AI tools and rich media support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Creation Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="w-5 h-5 mr-2 text-purple-600" />
                  Course Details
                </CardTitle>
                <CardDescription>
                  Let AI help you create a comprehensive course structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Course Title</label>
                  <Input 
                    placeholder="e.g., Complete Web Development Bootcamp"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Course Description</label>
                  <Textarea 
                    placeholder="Describe what students will learn and achieve..."
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleGenerateOutline}
                  disabled={isGeneratingOutline || !courseTitle}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGeneratingOutline ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating AI Outline...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Course Outline with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Content Types */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-blue-600" />
                  Add Course Content
                </CardTitle>
                <CardDescription>
                  Support for all media types and interactive elements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentTypes.map((type, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <type.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {type.label}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        </div>
                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Features Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-600" />
                  AI-Powered Features
                </CardTitle>
                <CardDescription>
                  Let AI enhance your course creation process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {aiFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-gray-600" />
                  Course Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Course Type</span>
                  <Badge>Self-Paced</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Difficulty</span>
                  <Badge variant="secondary">Beginner</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Estimated Duration</span>
                  <Badge variant="outline">8 weeks</Badge>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Advanced Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg glass-card">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">AI Course Assistant</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get personalized suggestions and optimization tips
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Ask AI Assistant
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseCreator;
