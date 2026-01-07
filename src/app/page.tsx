'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/stores/user-store';

export default function Home() {
  const router = useRouter();
  const { isOnboarded } = useUserStore();

  useEffect(() => {
    if (!isOnboarded) {
      router.push('/onboarding');
    }
  }, [isOnboarded, router]);

  if (!isOnboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Today's Workout</h2>
            <p className="text-muted-foreground">No workout scheduled</p>
            <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Start Workout
            </button>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
            <div className="space-y-2 text-sm">
              <p>Workouts this week: 0</p>
              <p>Total minutes: 0</p>
              <p>Personal records: 0</p>
            </div>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">AI Coach</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Get personalized advice and workout recommendations
            </p>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Chat with Coach
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
