
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CourseSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
        <CardDescription>
          Manage your course settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Course settings will be available soon.</p>
      </CardContent>
    </Card>
  );
};

export default CourseSettings;
