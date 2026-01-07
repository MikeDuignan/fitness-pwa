'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore, useWorkoutStore } from '@/lib/stores/user-store';
import { useWorkoutStore as useWorkoutState } from '@/lib/stores/workout-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Dumbbell, TrendingUp, Target, MessageCircle, Plus, Calendar, Flame, Trophy, BarChart3 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isOnboarded } = useUserStore();
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
  };

  if (!mounted || !isOnboarded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent animate-spin rounded-full" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-4 pb-20">
        <header className="mb-8 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Fitness Coach
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your personal fitness journey
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/onboarding')}
              className="rounded-full"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-white/90" />
                    <CardTitle className="text-white text-lg">Today's Workout</CardTitle>
                  </div>
                  <p className="text-white/80 text-sm">
                    Ready to crush it?
                  </p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
              <Button
                onClick={() => {}}
                className="w-full h-12 font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="mr-2 h-5 w-5" />
                Start Workout
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-2 bg-gradient-to-br from-blue-600 to-cyan-600 p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-white/90" />
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">This Week</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-white">
                    {quickStats.workoutsThisWeek}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">workouts</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Time</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-900 dark:text-white">
                    {Math.round(quickStats.totalMinutes)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">minutes</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">PRs</p>
                  </div>
                  <p className="text-2xl font-bold text-amber-900 dark:text-white">
                    {quickStats.personalRecords}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">records</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Streak</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-white">
                    0
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-white/90" />
                  <CardTitle className="text-white">AI Coach</CardTitle>
                </div>
                <p className="text-white/80 text-sm">
                  Get personalized advice and workout recommendations
                </p>
              </div>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Personalized Workouts</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">AI generates plans based on your goals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💪</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Progress Analysis</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Track your improvement over time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📊</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">Smart Tips</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Get form corrections and advice</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {}}
                className="w-full h-12 font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat with Coach
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-0 shadow-xl">
          <CardHeader className="space-y-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              <CardTitle className="text-gray-900 dark:text-white">Upcoming Workouts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-600" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-gray-900 dark:text-white">No upcoming workouts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start a workout to track your progress
                </p>
              </div>
              <Button
                onClick={() => {}}
                variant="outline"
                className="border-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Schedule Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
