import React, { useState } from "react";
import { Severity, WasteReport } from "./types";

import { SplashScreen } from "./components/SplashScreen";
import { AuthScreen } from "./components/AuthScreen";
import { HomeScreen } from "./components/HomeScreen";
import { RewardsScreen } from "./components/RewardsScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { WasteAnalyzer } from "./components/WasteAnalyzer";
import { MapView } from "./components/MapView";
import { BottomNavigation } from "./components/BottomNavigation";

type AppState = "splash" | "auth" | "home";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("splash");
  const [activeTab, setActiveTab] = useState("home");

  const [reports, setReports] = useState<WasteReport[]>([
    {
      id: "1",
      timestamp: Date.now() - 86400000,
      image: "data:image/jpeg;base64,placeholder",
      result: {
        severity: Severity.HIGH,
        confidence: 0.85,
        waste_type: ["mixed"],
        reason: "Large accumulation of mixed waste near residential area"
      },
      location: { lat: 28.6139, lng: 77.209 }
    },
    {
      id: "2",
      timestamp: Date.now() - 43200000,
      image: "data:image/jpeg;base64,placeholder",
      result: {
        severity: Severity.MEDIUM,
        confidence: 0.72,
        waste_type: ["plastic"],
        reason: "Plastic waste scattered in public park"
      },
      location: { lat: 28.7041, lng: 77.1025 }
    }
  ]);

  /* ---------------- USER DATA ---------------- */

  const userStats = {
    totalReports: reports.length,
    totalPoints: 1250,
    reportsThisWeek: 5
  };

  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    joinDate: "January 2024",
    stats: {
      totalReports: reports.length,
      totalPoints: 1250,
      currentStreak: 7,
      areasCovered: 12
    }
  };

  const rewardsData = {
    totalPoints: 1250,
    currentLevel: "Community Champion",
    nextLevelPoints: 2000,
    badges: []
  };

  /* ---------------- HANDLERS ---------------- */

  const handleSplashComplete = () => {
    setAppState("auth");
  };

  const handleLogin = () => {
    setAppState("home");
  };

  const handleReportGarbage = () => {
    setActiveTab("report");
  };

  const handleNewReport = (report: WasteReport) => {
    setReports(prev => [report, ...prev]);
    setActiveTab("home");
  };

  const handleViewMap = () => {
    setActiveTab("map");
  };

  const handleViewReport = (report: WasteReport) => {
    console.log("View report:", report);
  };

  const handleLogout = () => {
    setAppState("auth");
    setActiveTab("home");
  };

  /* ---------------- SCREEN RENDER ---------------- */

  const renderScreen = () => {
    if (appState === "splash") {
      return <SplashScreen onComplete={handleSplashComplete} />;
    }

    if (appState === "auth") {
      return <AuthScreen onLogin={handleLogin} />;
    }

    // HOME STATE
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            reports={reports}
            userStats={userStats}
            onReportGarbage={handleReportGarbage}
            onViewReport={handleViewReport}
            onViewMap={handleViewMap}
          />
        );

      case "report":
        return <WasteAnalyzer onNewReport={handleNewReport} />;

      case "map":
        return <MapView reports={reports} />;

      case "rewards":
        return <RewardsScreen userStats={rewardsData} />;

      case "profile":
        return (
          <ProfileScreen
            userProfile={userProfile}
            onLogout={handleLogout}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      {renderScreen()}

      {appState === "home" && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
};

export default App;
