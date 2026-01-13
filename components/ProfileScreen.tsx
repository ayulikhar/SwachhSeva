import React from 'react';
import {
  User,
  Award,
  MapPin,
  Calendar,
  LogOut,
  Settings,
  HelpCircle,
  Shield
} from 'lucide-react';

interface ProfileScreenProps {
  userProfile: {
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    avatar?: string;
    stats: {
      totalReports: number;
      totalPoints: number;
      currentStreak: number;
      areasCovered: number;
    };
  };
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  onLogout
}) => {
  const menuItems = [
    { icon: Settings, label: 'Settings', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
    { icon: Shield, label: 'Privacy Policy', action: () => {} }
  ];

  return (
    <div className="min-h-screen bg-bg pb-24">

      {/* ================= PROFILE HEADER ================= */}
      <div className="bg-gradient-primary px-6 py-10">
        <div className="container-centered text-center">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-large">
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt="User avatar"
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-primary" />
            )}
          </div>

          <h1 className="text-2xl font-display font-bold text-white">
            {userProfile.name}
          </h1>
          <p className="text-white/80 text-sm">
            Member since {userProfile.joinDate}
          </p>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="container-centered -mt-6 mb-10 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-display font-bold text-text">
              {userProfile.stats.totalPoints}
            </p>
            <p className="text-muted text-sm">Points Earned</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-accent" />
            </div>
            <p className="text-2xl font-display font-bold text-text">
              {userProfile.stats.totalReports}
            </p>
            <p className="text-muted text-sm">Reports Submitted</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card text-center">
            <p className="text-lg font-display font-bold text-text">
              {userProfile.stats.currentStreak}
            </p>
            <p className="text-muted text-xs">Day Reporting Streak</p>
          </div>

          <div className="card text-center">
            <p className="text-lg font-display font-bold text-text">
              {userProfile.stats.areasCovered}
            </p>
            <p className="text-muted text-xs">Areas Covered</p>
          </div>
        </div>
      </div>

      {/* ================= CONTACT INFO ================= */}
      <div className="container-centered mb-10">
        <h2 className="text-lg font-semibold text-text mb-4">
          Contact Information
        </h2>

        <div className="card space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-muted text-sm">Email</p>
              <p className="text-text font-medium">{userProfile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-muted text-sm">Phone</p>
              <p className="text-text font-medium">{userProfile.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-muted text-sm">Member Since</p>
              <p className="text-text font-medium">{userProfile.joinDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="container-centered mb-8">
        <div className="card divide-y divide-border">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-4 hover:bg-bg transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-text font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= LOGOUT ================= */}
      <div className="container-centered">
        <button
          onClick={onLogout}
          className="w-full bg-danger/10 border border-danger/20 text-danger rounded-2xl py-4 font-semibold hover:bg-danger/20 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};
