'use client';
// Professional UI v2.1 - Fixed naming conflict - Fresh deploy

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/stores/user-store';
import { useWorkoutStore } from '@/lib/stores/workout-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  House,
  Library,
  User,
  Sparkles,
  ArrowRight,
  Zap,
  Clock,
  Award,
  Heart
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { isOnboarded, user } = useUserStore();
  const { workouts } = useWorkoutStore();
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
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (!mounted || !isOnboarded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent animate-spin rounded-full" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-500/20 rounded-full" />
          </div>
          <p className="text-lg font-semibold text-white/90 animate-pulse">Loading your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {getGreeting()}{user?.name ? `, ${user.name}` : ''}
              </h1>
              <p className="text-sm text-white/50 mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {}}
              className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
        {/* Hero CTA */}
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-2xl shadow-emerald-500/20">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Ready to Train</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Start Your Workout</h2>
                  <p className="text-white/90 text-lg">Let's crush today's session and hit your goals</p>
                </div>
                <Button
                  onClick={() => router.push('/workout')}
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-white/90 font-semibold h-14 px-8 rounded-full shadow-xl"
                >
                  <Dumbbell className="mr-2 h-5 w-5" />
                  Begin Workout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
                  <div className="relative w-40 h-40 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <Flame className="w-20 h-20" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Your Progress</h3>
            <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/5">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/20 hover:border-blue-500/40 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6 text-blue-400" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold tracking-tight">{quickStats.workoutsThisWeek}</p>
                  <p className="text-sm text-white/50">Workouts this week</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-emerald-400" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold tracking-tight">{Math.round(quickStats.totalMinutes)}</p>
                  <p className="text-sm text-white/50">Total minutes</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/20 hover:border-amber-500/40 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-amber-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6 text-amber-400" />
                  </div>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold tracking-tight">{quickStats.personalRecords}</p>
                  <p className="text-sm text-white/50">Personal records</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 backdrop-blur-xl border border-rose-500/20 hover:border-rose-500/40 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-rose-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                    <Flame className="w-6 h-6 text-rose-400" />
                  </div>
                  <Heart className="w-4 h-4 text-rose-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold tracking-tight">{quickStats.streak}</p>
                  <p className="text-sm text-white/50">Day streak</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Coach */}
        <div>
          <h3 className="text-xl font-bold mb-4">AI Coach</h3>
          <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 backdrop-blur-xl border border-purple-500/20 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="hidden sm:flex p-4 bg-purple-500/20 rounded-3xl">
                  <Sparkles className="w-12 h-12 text-purple-400" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-2xl font-bold mb-2">Your Personal AI Coach</h4>
                    <p className="text-white/60 text-lg">Get personalized workout plans, expert form guidance, and real-time progress insights powered by advanced AI</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <Target className="w-6 h-6 text-purple-400 mb-3" />
                      <h5 className="font-semibold mb-1">Smart Plans</h5>
                      <p className="text-sm text-white/50">Tailored to your goals</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <TrendingUp className="w-6 h-6 text-purple-400 mb-3" />
                      <h5 className="font-semibold mb-1">Track Progress</h5>
                      <p className="text-sm text-white/50">See your improvements</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <MessageCircle className="w-6 h-6 text-purple-400 mb-3" />
                      <h5 className="font-semibold mb-1">Expert Tips</h5>
                      <p className="text-sm text-white/50">Form corrections</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push('/chat')}
                    size="lg"
                    className="bg-purple-500 hover:bg-purple-600 text-white font-semibold h-12 px-6 rounded-full"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat with Coach
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <Card className="border-0 bg-white/5 backdrop-blur-xl border border-white/10">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                  <div className="relative w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <Calendar className="w-12 h-12 text-white/40" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">No workouts yet</p>
                  <p className="text-white/50 max-w-md">Start your first workout to begin tracking your fitness journey and unlock insights</p>
                </div>
                <Button
                  onClick={() => router.push('/workout')}
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-12 px-8 rounded-full"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Workout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-around h-20">
            <button className="flex flex-col items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/20 text-emerald-400 transition-all">
              <House className="w-6 h-6" />
              <span className="text-xs font-semibold">Home</span>
            </button>
            <button className="flex flex-col items-center gap-2 px-6 py-3 rounded-2xl hover:bg-white/5 text-white/50 hover:text-white transition-all">
              <Library className="w-6 h-6" />
              <span className="text-xs font-medium">Workouts</span>
            </button>
            <button className="flex flex-col items-center gap-2 px-6 py-3 rounded-2xl hover:bg-white/5 text-white/50 hover:text-white transition-all">
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs font-medium">Progress</span>
            </button>
            <button className="flex flex-col items-center gap-2 px-6 py-3 rounded-2xl hover:bg-white/5 text-white/50 hover:text-white transition-all">
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
