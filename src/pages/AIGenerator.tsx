
import Navigation from "@/components/Navigation";
import CourseOutlineGenerator from "@/components/AIGenerator/CourseOutlineGenerator";

const AIGenerator = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Course Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let AI help you create comprehensive course outlines in minutes
            </p>
          </div>
          <CourseOutlineGenerator />
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;
