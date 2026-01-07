'use client';
// Force Vercel redeploy - UI redesign complete

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore, useWorkoutStore } from '@/lib/stores/user-store';
import { useWorkoutStore as useWorkoutState } from '@/lib/stores/workout-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  Dumbbell,
  TrendingUp,
  Target,
  MessageCircle,
  Plus,
  Calendar,
  Flame,
  Trophy,
  BarChart3,
  Home,
  List,
  User,
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isOnboarded, user } = useUserStore();
  const { workouts } = useWorkoutState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isOnboarded) {
      router.push('/onboarding');
    }
  }, [isOnboarded, router]);

  const quickStats = {
    workoutsThisWeek: workouts.filter(w => {
      const workoutDate = new Date(w.date);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return workoutDate >= weekAgo;
    }).length,
    totalMinutes: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
    personalRecords: 0,
    streak: 0,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (!mounted || !isOnboarded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent animate-spin rounded-full" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-24 pt-6 max-w-7xl">
        {/* Hero Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                {getGreeting()}{user?.name ? `, ${user.name}` : ''}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {}}
              className="rounded-full border-2 hover:scale-110 transition-transform shadow-lg"
            >
              <MessageCircle className="w-5 h-5 text-violet-600" />
            </Button>
          </div>

          {/* Quick Action Card */}
          <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 transform hover:scale-[1.02] transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">Ready to workout?</h3>
                  </div>
                  <p className="text-white/90 mb-4">Start your session now and track your progress</p>
                  <Button
                    onClick={() => {}}
                    size="lg"
                    className="bg-white text-violet-600 hover:bg-white/90 font-semibold shadow-lg h-12"
                  >
                    <Dumbbell className="mr-2 h-5 w-5" />
                    Start Workout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="hidden sm:flex items-center justify-center">
                  <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Flame className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-violet-600" />
            Your Progress
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-500 to-cyan-500">
              <CardContent className="p-6">
                <Activity className="w-8 h-8 text-white mb-3" />
                <p className="text-4xl font-bold text-white mb-1">{quickStats.workoutsThisWeek}</p>
                <p className="text-white/90 text-sm font-medium">Workouts this week</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-emerald-500 to-teal-500">
              <CardContent className="p-6">
                <Target className="w-8 h-8 text-white mb-3" />
                <p className="text-4xl font-bold text-white mb-1">{Math.round(quickStats.totalMinutes)}</p>
                <p className="text-white/90 text-sm font-medium">Total minutes</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-amber-500 to-orange-500">
              <CardContent className="p-6">
                <Trophy className="w-8 h-8 text-white mb-3" />
                <p className="text-4xl font-bold text-white mb-1">{quickStats.personalRecords}</p>
                <p className="text-white/90 text-sm font-medium">Personal records</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-pink-500 to-rose-500">
              <CardContent className="p-6">
                <Flame className="w-8 h-8 text-white mb-3" />
                <p className="text-4xl font-bold text-white mb-1">{quickStats.streak}</p>
                <p className="text-white/90 text-sm font-medium">Day streak</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Coach Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-600" />
            AI Coach
          </h2>
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircle className="w-8 h-8 text-white" />
                    <h3 className="text-2xl font-bold text-white">Your Personal AI Coach</h3>
                  </div>
                  <p className="text-white/90 text-lg mb-6">
                    Get personalized workout plans, form tips, and progress insights powered by advanced AI
                  </p>
                  <Button
                    onClick={() => {}}
                    size="lg"
                    className="bg-white text-violet-600 hover:bg-white/90 font-semibold shadow-lg h-12"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat Now
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl">
                  <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center mb-3">
                    <Target className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Personalized Plans</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Workouts tailored to your goals and equipment</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Progress Analysis</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Track improvements and identify areas to focus</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Smart Guidance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Form tips and technique corrections in real-time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-violet-600" />
            Recent Activity
          </h2>
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">No workouts yet</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start your first workout to begin tracking your fitness journey
                  </p>
                </div>
                <Button
                  onClick={() => {}}
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
              <Home className="w-6 h-6" />
              <span className="text-xs font-semibold">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
              <List className="w-6 h-6" />
              <span className="text-xs font-medium">Workouts</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs font-medium">Progress</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors">
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
