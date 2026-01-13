import { Link, useLocation } from "wouter";
import { Camera, History, Map as MapIcon, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Camera, label: "Analyze" },
    { href: "/history", icon: History, label: "History" },
    { href: "/map", icon: MapIcon, label: "Map" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-transparent pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="flex items-center justify-around px-2 py-3 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-emerald-900/10 rounded-3xl">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
              )}>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn("w-6 h-6 z-10", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] font-medium mt-1 z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
