'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/stores/user-store';
import { useWorkoutStore } from '@/lib/stores/workout-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ArrowLeft,
  Sparkles,
  Dumbbell,
  Clock,
  Flame,
  CheckCircle,
  Loader2,
  Play,
  Target
} from 'lucide-react';
import { generateId } from '@/lib/utils';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
  difficulty: string;
  equipment: string;
  instructions: string;
  muscleGroups: string[];
}

interface WarmupCooldown {
  name: string;
  duration: number;
}

interface WorkoutPlan {
  name: string;
  focus: string;
  exercises: Exercise[];
  warmup: WarmupCooldown[];
  cooldown: WarmupCooldown[];
  totalDuration: number;
  estimatedCalories: number;
  notes: string;
}

export default function WorkoutPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { addWorkout, setActiveWorkout } = useWorkoutStore();
  const [loading, setLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateWorkout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-coach/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            name: user?.name,
            age: user?.age,
            weight: user?.weight,
            height: user?.height,
            fitnessLevel: user?.fitnessLevel,
            goals: JSON.parse(user?.goals || '[]'),
            equipment: JSON.parse(user?.equipment || '[]'),
            injuries: user?.injuries ? JSON.parse(user.injuries) : [],
            workSchedule: user?.workSchedule,
            availableDays: JSON.parse(user?.availableDays || '[]'),
            workoutDuration: user?.workoutDuration,
          },
          week: 1,
          previousFeedback: [],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate workout');
      }

      const data = await response.json();
      setWorkoutPlan(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate workout. Please try again.';
      setError(errorMessage);
      console.error('Error generating workout:', err);

      // Show more details if it's an API key error
      if (errorMessage.includes('ZHIPU_API_KEY')) {
        setError('⚠️ API Key Missing: Please add your ZHIPU_API_KEY to Vercel environment variables and redeploy.');
      }
    } finally {
      setLoading(false);
    }
  };

  const startWorkout = () => {
    if (!workoutPlan) return;

    const workout = {
      id: generateId(),
      userId: user?.id || '',
      name: workoutPlan.name,
      date: new Date().toISOString(),
      duration: workoutPlan.totalDuration,
      type: 'weights',
      aiGenerated: true,
      aiPlanId: null,
      rating: null,
      completedAt: null,
      notes: workoutPlan.notes,
      createdAt: new Date().toISOString(),
    };

    addWorkout(workout);
    setActiveWorkout(workout);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 max-w-4xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Generate Workout</h1>
              <p className="text-sm text-white/50">AI-powered personalized plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
        {!workoutPlan && !loading && (
          <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">AI Workout Generator</CardTitle>
                  <CardDescription className="text-white/60">
                    Get a personalized workout plan based on your goals
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <Target className="w-6 h-6 text-purple-400 mb-3" />
                  <h5 className="font-semibold mb-1">Your Goals</h5>
                  <p className="text-sm text-white/50">
                    {user?.goals ? JSON.parse(user.goals).join(', ') : 'Not set'}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <Dumbbell className="w-6 h-6 text-purple-400 mb-3" />
                  <h5 className="font-semibold mb-1">Equipment</h5>
                  <p className="text-sm text-white/50">
                    {user?.equipment ? JSON.parse(user.equipment).length + ' items' : 'None'}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <Clock className="w-6 h-6 text-purple-400 mb-3" />
                  <h5 className="font-semibold mb-1">Duration</h5>
                  <p className="text-sm text-white/50">{user?.workoutDuration || 60} minutes</p>
                </div>
              </div>

              <Button
                onClick={generateWorkout}
                size="lg"
                disabled={loading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold h-14 rounded-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Perfect Workout...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate AI Workout Plan
                  </>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="border-0 bg-white/5 backdrop-blur-xl border border-white/10">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent animate-spin rounded-full" />
                  <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500/20 rounded-full" />
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">Creating Your Workout</p>
                  <p className="text-white/50">AI is analyzing your profile and goals...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {workoutPlan && !loading && (
          <>
            {/* Workout Header */}
            <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-500/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{workoutPlan.name}</h2>
                      <p className="text-white/60">{workoutPlan.focus}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/20 rounded-2xl">
                      <Dumbbell className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-white/50">Duration</span>
                      </div>
                      <p className="text-xl font-bold">{workoutPlan.totalDuration} min</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-white/50">Calories</span>
                      </div>
                      <p className="text-xl font-bold">{workoutPlan.estimatedCalories}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warm-up */}
            <Card className="border-0 bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Warm-up</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {workoutPlan.warmup.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70">{item.name}</span>
                      <span className="text-white/50 text-sm">{item.duration}s</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exercises */}
            <Card className="border-0 bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Exercises</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workoutPlan.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                          <span className="text-emerald-400 font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{exercise.name}</h3>
                          <p className="text-xs text-white/40">{exercise.equipment}</p>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-white/20" />
                    </div>
                    <p className="text-sm text-white/60 mb-3 ml-13">{exercise.instructions}</p>
                    <div className="grid grid-cols-3 gap-3 ml-13">
                      <div>
                        <p className="text-xs text-white/50 mb-1">Sets</p>
                        <p className="font-semibold">{exercise.sets}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 mb-1">Reps</p>
                        <p className="font-semibold">{exercise.reps}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50 mb-1">Rest</p>
                        <p className="font-semibold">{exercise.restTime}s</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cool-down */}
            <Card className="border-0 bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">Cool-down</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {workoutPlan.cooldown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70">{item.name}</span>
                      <span className="text-white/50 text-sm">{item.duration}s</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {workoutPlan.notes && (
              <Card className="border-0 bg-amber-500/10 backdrop-blur-xl border border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">Coach's Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">{workoutPlan.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => setWorkoutPlan(null)}
                variant="outline"
                size="lg"
                className="flex-1 h-14 rounded-full border-white/10 hover:bg-white/5"
              >
                Generate New Plan
              </Button>
              <Button
                onClick={startWorkout}
                size="lg"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-14 rounded-full"
              >
                <Play className="mr-2 h-5 w-5" />
                Start This Workout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
