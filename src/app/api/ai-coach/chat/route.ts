import { NextRequest, NextResponse } from 'next/server';
import { AICoach } from '@/lib/services/ai-coach';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Missing message' },
        { status: 400 }
      );
    }

    const coach = new AICoach();
    const response = await coach.chat(message, context);

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat' },
      { status: 500 }
    );
  }
}
