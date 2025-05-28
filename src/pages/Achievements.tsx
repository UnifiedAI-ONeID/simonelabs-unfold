
import Navigation from "@/components/Navigation";
import AchievementSystem from "@/components/Gamification/AchievementSystem";

const Achievements = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <AchievementSystem />
        </div>
      </div>
    </div>
  );
};

export default Achievements;
