
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  onCreateCourse: () => void;
}

const DashboardHeader = ({ userName, onCreateCourse }: DashboardHeaderProps) => {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground heading">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Here's what's happening with your courses today.
          </p>
        </div>
        <Button 
          className="simonelabs-primary-button w-full sm:w-auto"
          onClick={onCreateCourse}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Course
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
