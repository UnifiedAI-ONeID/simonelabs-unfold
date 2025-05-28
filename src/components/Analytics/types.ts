
export interface LearningData {
  studyTime: { date: string; minutes: number }[];
  quizScores: { quiz: string; score: number; date: string }[];
  courseProgress: { course: string; progress: number; timeSpent: number }[];
  achievements: { name: string; date: string; type: string }[];
  weeklyGoals: { target: number; achieved: number };
  learningStreak: number;
}

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtitle?: string;
}
