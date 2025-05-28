
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Book, 
  Clock, 
  Users, 
  Award,
  Medal,
  Crown,
  Flame
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  category: string;
}

interface UserStats {
  level: number;
  totalPoints: number;
  streak: number;
  coursesCompleted: number;
  studyTime: number;
}

const AchievementSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const userStats: UserStats = {
    level: 12,
    totalPoints: 2450,
    streak: 7,
    coursesCompleted: 8,
    studyTime: 142
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first course',
      icon: Star,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rarity: 'common',
      points: 100,
      category: 'learning'
    },
    {
      id: '2',
      title: 'Speed Learner',
      description: 'Complete a course in under 24 hours',
      icon: Zap,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rarity: 'rare',
      points: 250,
      category: 'speed'
    },
    {
      id: '3',
      title: 'Knowledge Seeker',
      description: 'Complete 10 courses',
      icon: Book,
      progress: 8,
      maxProgress: 10,
      unlocked: false,
      rarity: 'epic',
      points: 500,
      category: 'learning'
    },
    {
      id: '4',
      title: 'Dedication Master',
      description: 'Maintain a 30-day learning streak',
      icon: Flame,
      progress: 7,
      maxProgress: 30,
      unlocked: false,
      rarity: 'legendary',
      points: 1000,
      category: 'streak'
    },
    {
      id: '5',
      title: 'Night Owl',
      description: 'Study for 100 hours total',
      icon: Clock,
      progress: 142,
      maxProgress: 100,
      unlocked: true,
      rarity: 'rare',
      points: 300,
      category: 'time'
    },
    {
      id: '6',
      title: 'Community Helper',
      description: 'Help 5 other students',
      icon: Users,
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      rarity: 'epic',
      points: 400,
      category: 'social'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Achievements' },
    { id: 'learning', name: 'Learning' },
    { id: 'speed', name: 'Speed' },
    { id: 'streak', name: 'Streaks' },
    { id: 'time', name: 'Time' },
    { id: 'social', name: 'Social' }
  ];

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-yellow-600'
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const nextLevelPoints = (userStats.level + 1) * 250;
  const currentLevelProgress = (userStats.totalPoints % 250) / 250 * 100;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Your Achievements</h2>
        <p className="text-xl text-gray-600">Track your learning progress and unlock rewards</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Level {userStats.level}</h3>
            <p className="text-gray-600">Current Level</p>
            <div className="mt-2">
              <Progress value={currentLevelProgress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {userStats.totalPoints % 250}/{nextLevelPoints % 250} XP to next level
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</h3>
            <p className="text-gray-600">Total Points</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold">{userStats.streak}</h3>
            <p className="text-gray-600">Day Streak</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold">{userStats.coursesCompleted}</h3>
            <p className="text-gray-600">Courses Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="text-sm"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
              achievement.unlocked ? 'shadow-lg' : 'opacity-75'
            }`}
          >
            <CardHeader className="text-center">
              <div className={`w-20 h-20 bg-gradient-to-r ${
                achievement.unlocked 
                  ? rarityColors[achievement.rarity]
                  : 'from-gray-300 to-gray-400'
              } rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                achievement.unlocked ? 'animate-pulse' : ''
              }`}>
                <achievement.icon className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-lg">{achievement.title}</CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
              <Badge 
                variant="outline" 
                className={`mx-auto capitalize ${achievement.unlocked ? 'border-green-500 text-green-700' : ''}`}
              >
                {achievement.rarity}
              </Badge>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>Progress</span>
                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.maxProgress) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reward:</span>
                  <Badge variant="secondary">{achievement.points} XP</Badge>
                </div>
              </div>
              
              {achievement.unlocked && (
                <div className="absolute top-4 right-4">
                  <Medal className="w-6 h-6 text-yellow-500" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Milestone */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Next Milestone</CardTitle>
          <CardDescription>Keep learning to unlock your next achievement!</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <div className="text-lg font-semibold">Complete 2 more courses to unlock "Knowledge Seeker"</div>
            <Progress value={80} className="h-3" />
            <Badge className="bg-purple-600">{500} XP Reward</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementSystem;
