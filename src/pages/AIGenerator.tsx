import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseGenerator from "@/components/AI/CourseGenerator";
import ContentEditor from "@/components/AI/ContentEditor";
import CodeLab from "@/components/AI/CodeLab";
import AITutor from "@/components/AI/AITutor";
import AdaptiveLearning from "@/components/AI/AdaptiveLearning";
import AssessmentEngine from "@/components/AI/AssessmentEngine";
import ProgressTracker from "@/components/AI/ProgressTracker";

const AIGenerator = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Tools</h1>
            <p className="text-muted-foreground">
              Powerful AI-powered tools to enhance your learning experience
            </p>
          </div>

          <Tabs defaultValue="tutor" className="space-y-6">
            <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
              <TabsTrigger value="tutor">AI Tutor</TabsTrigger>
              <TabsTrigger value="generator">Course Generator</TabsTrigger>
              <TabsTrigger value="editor">Content Editor</TabsTrigger>
              <TabsTrigger value="codelab">Code Lab</TabsTrigger>
              <TabsTrigger value="adaptive">Adaptive Learning</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="tutor">
              <AITutor />
            </TabsContent>

            <TabsContent value="generator">
              <CourseGenerator />
            </TabsContent>

            <TabsContent value="editor">
              <ContentEditor />
            </TabsContent>

            <TabsContent value="codelab">
              <CodeLab />
            </TabsContent>

            <TabsContent value="adaptive">
              <AdaptiveLearning />
            </TabsContent>

            <TabsContent value="assessment">
              <AssessmentEngine />
            </TabsContent>

            <TabsContent value="progress">
              <ProgressTracker />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;