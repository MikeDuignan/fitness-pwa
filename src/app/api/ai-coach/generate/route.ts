import { NextRequest, NextResponse } from 'next/server';
import { AICoach } from '@/lib/services/ai-coach';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, week, previousFeedback } = body;

    if (!userProfile) {
      return NextResponse.json(
        { error: 'Missing userProfile' },
        { status: 400 }
      );
    }

    const coach = new AICoach();
    const workoutPlan = await coach.generateWorkoutPlan(userProfile, week, previousFeedback);

    return NextResponse.json(workoutPlan);
  } catch (error: any) {
    console.error('Error generating workout:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate workout' },
      { status: 500 }
    );
  }
}
