import React from 'react';
import {
  Award,
  Star,
  Gift,
  Trophy,
  Target,
  TrendingUp
} from 'lucide-react';

interface RewardsScreenProps {
  userStats: {
    totalPoints: number;
    currentLevel: string;
    nextLevelPoints: number;
    badges: Array<{
      id: string;
      name: string;
      description: string;
      earned: boolean;
      icon: string;
    }>;
  };
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({ userStats }) => {
  const progressPercentage = Math.min(
    (userStats.totalPoints / userStats.nextLevelPoints) * 100,
    100
  );

  const rewards = [
    {
      id: 'first-report',
      name: 'First Responder',
      description: 'Submitted your first waste report',
      points: 50,
      icon: '🎯',
      earned: true
    },
    {
      id: 'week-streak',
      name: 'Weekly Warrior',
      description: 'Reported waste 7 days in a row',
      points: 200,
      icon: '🔥',
      earned: true
    },
    {
      id: 'community-hero',
      name: 'Community Hero',
      description: 'Submitted 100 verified reports',
      points: 1000,
      icon: '🏆',
      earned: false
    },
    {
      id: 'severity-master',
      name: 'Severity Master',
      description: 'Identified 50 high-priority issues',
      points: 750,
      icon: '⚠️',
      earned: false
    }
  ];

  return (
    <div className="min-h-screen bg-bg pb-24">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-accent px-6 py-10">
        <div className="container-centered text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-large">
            <Award className="w-10 h-10 text-accent" />
          </div>

          <h1 className="text-3xl font-display font-bold text-white">
            {userStats.totalPoints.toLocaleString()} Points
          </h1>
          <p className="text-white/90">
            Civic Level: {userStats.currentLevel}
          </p>
        </div>

        {/* Progress */}
        <div className="mt-6 container-centered">
          <div className="flex justify-between text-sm text-white/90 mb-2">
            <span>Progress to next level</span>
            <span>
              {userStats.totalPoints}/{userStats.nextLevelPoints}
            </span>
          </div>

          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-3 rounded-full transition-all duration-700"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= BADGES ================= */}
      <div className="container-centered py-10">
        <h2 className="text-xl font-semibold text-text mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          Achievement Badges
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={`card text-center transition-all
                ${reward.earned
                  ? 'border-accent/20 bg-accent/5'
                  : 'border-border opacity-60'
                }`}
            >
              <div className={`text-3xl mb-3 ${reward.earned ? '' : 'grayscale'}`}>
                {reward.icon}
              </div>

              <h3 className="font-semibold text-text mb-1">
                {reward.name}
              </h3>

              <p className="text-muted text-sm mb-3">
                {reward.description}
              </p>

              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-accent font-semibold">
                  {reward.points}
                </span>
              </div>

              {reward.earned && (
                <div className="mt-3 px-3 py-1 bg-accent/10 rounded-full inline-block">
                  <span className="text-accent text-xs font-semibold">
                    Earned ✓
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= UPCOMING ================= */}
      <div className="container-centered pb-10">
        <h2 className="text-xl font-semibold text-text mb-6 flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Upcoming Rewards
        </h2>

        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-text">
                  City Champion Badge
                </h3>
                <p className="text-muted text-sm">
                  Earn 500 points this month
                </p>

                <div className="mt-2 bg-border rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full w-3/4" />
                </div>

                <p className="text-primary text-sm font-medium mt-1">
                  375 / 500 points
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-text">
                  Monthly Leaderboard
                </h3>
                <p className="text-muted text-sm">
                  Top contributors this month
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-accent font-semibold">
                    You’re #7
                  </span>
                  <span className="text-muted text-sm">
                    Keep reporting to climb higher
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
