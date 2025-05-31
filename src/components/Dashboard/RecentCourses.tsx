
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
  progress: number;
  course_id: string;
}

interface RecentCoursesProps {
  inProgressCourses: number;
  userProgress: any[] | undefined;
}

const RecentCourses = ({ inProgressCourses, userProgress }: RecentCoursesProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          {t('continueLearning.title')}
        </h2>
        <Link to="/courses">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('continueLearning.browseButton')}
          </Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        {inProgressCourses > 0 ? (
          userProgress?.filter(p => !p.completed && p.progress > 0).slice(0, 3).map((progress) => (
            <div key={progress.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium mb-1">{progress.courses?.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {progress.courses?.description}
                  </p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {progress.courses?.difficulty_level}
                </span>
              </div>
              <Progress value={(progress.progress || 0) * 100} className="mb-3" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {Math.round((progress.progress || 0) * 100)}% {t('continueLearning.complete')}
                </span>
                <Link to={`/learn/${progress.course_id}`}>
                  <Button size="sm" className="rounded-xl">{t('continueLearning.continueButton')}</Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t('continueLearning.noCourses.title')}</p>
            <Link to="/courses">
              <Button className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                {t('continueLearning.noCourses.button')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentCourses;
