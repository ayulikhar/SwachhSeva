import { useUser } from "@/hooks/use-user";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Loader2, User, Award, TrendingUp, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Profile() {
  const { data: user, isLoading } = useUser();

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  // Mock data for impact chart
  const data = [
    { name: 'Mon', reports: 2 },
    { name: 'Tue', reports: 5 },
    { name: 'Wed', reports: 3 },
    { name: 'Thu', reports: 7 },
    { name: 'Fri', reports: 4 },
    { name: 'Sat', reports: 8 },
    { name: 'Sun', reports: 6 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      <main className="max-w-md mx-auto p-6 space-y-8">
        {!user ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Welcome to SwachhSeva</h2>
              <p className="text-muted-foreground max-w-xs mx-auto">
                Join our community of eco-warriors and help keep our city clean.
              </p>
            </div>
            <Button onClick={handleLogin} className="w-full max-w-xs shadow-lg shadow-primary/20">
              Login with Replit
            </Button>
          </div>
        ) : (
          <>
            {/* User Profile Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-xl shadow-emerald-900/5 border border-emerald-100 flex items-center gap-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/30">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold truncate">{user.displayName || user.username}</h2>
                <p className="text-sm text-muted-foreground truncate">{user.email || 'Eco Warrior'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                    <Award className="w-3 h-3 mr-1" />
                    Level 5
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Stats Dashboard */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Impact Dashboard
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-3xl border border-border shadow-sm">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Reports</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">24</p>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-border shadow-sm">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Verified</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">18</p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-5 rounded-3xl border border-border shadow-sm h-64">
                <h4 className="text-sm font-medium mb-4 text-muted-foreground">Weekly Activity</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={data}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="reports" radius={[4, 4, 4, 4]}>
                      {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 5 ? '#059669' : '#e2e8f0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Logout Button */}
            <div className="pt-4">
              <Button variant="outline" className="w-full border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
