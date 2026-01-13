import React, { useEffect } from 'react';
import { Logo } from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 2400);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-primary overflow-hidden">

      {/* Ambient background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-12 w-20 h-20 bg-white/10 rounded-full animate-pulse-slow" />
        <div
          className="absolute top-40 right-20 w-14 h-14 bg-white/10 rounded-full animate-pulse-slow"
          style={{ animationDelay: '0.4s' }}
        />
        <div
          className="absolute bottom-36 left-24 w-16 h-16 bg-white/10 rounded-full animate-pulse-slow"
          style={{ animationDelay: '0.8s' }}
        />
        <div
          className="absolute bottom-24 right-14 w-10 h-10 bg-white/10 rounded-full animate-pulse-slow"
          style={{ animationDelay: '1.2s' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 animate-fade-in">
        <div className="animate-bounce-subtle">
          <Logo size="lg" />
        </div>

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            SwachhSeva
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium mt-1">
            Report. Track. Transform.
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex space-x-2 mt-6">
          <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
          <span
            className="w-3 h-3 bg-white rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          />
          <span
            className="w-3 h-3 bg-white rounded-full animate-pulse"
            style={{ animationDelay: '0.4s' }}
          />
        </div>
      </div>

      {/* Tagline */}
      <div className="absolute bottom-8 text-center">
        <p className="text-white/70 text-sm font-medium">
          Making cities cleaner, one report at a time
        </p>
      </div>
    </div>
  );
};
