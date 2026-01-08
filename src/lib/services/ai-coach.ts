import { z } from 'zod';

const exerciseSchema = z.object({
  name: z.string(),
  sets: z.number().min(1).max(5),
  reps: z.number().min(1).max(20),
  weight: z.number().optional(),
  duration: z.number().optional(),
  restTime: z.number().min(30).max(300),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  equipment: z.string(),
  instructions: z.string(),
  muscleGroups: z.array(z.string()),
});

const workoutPlanSchema = z.object({
  name: z.string(),
  focus: z.string(),
  exercises: z.array(exerciseSchema).min(3).max(8),
  totalDuration: z.number().min(20).max(90),
  estimatedCalories: z.number(),
  notes: z.string(),
  warmup: z.array(z.object({
    name: z.string(),
    duration: z.number(),
  })),
  cooldown: z.array(z.object({
    name: z.string(),
    duration: z.number(),
  })),
});

const analysisSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  plateaus: z.array(z.string()),
  recommendations: z.array(z.string()),
  nextWeekAdjustments: z.string(),
  motivationalMessage: z.string(),
});

export class AICoach {
  private apiKey: string;
  private baseUrl: string = 'https://open.bigmodel.cn/api/paas/v4';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ZHIPU_API_KEY || '';
  }

  private validateApiKey(): void {
    if (!this.apiKey) {
      throw new Error('ZHIPU_API_KEY is not configured. Please add it to your environment variables.');
    }
  }

  async generateWorkoutPlan(userProfile: any, week: number = 1, previousFeedback: any[] = []): Promise<any> {
    this.validateApiKey();
    const prompt = this.buildWorkoutPrompt(userProfile, week, previousFeedback);

    const response = await this.callGLM(prompt, true);
    
    try {
      const parsed = workoutPlanSchema.parse(JSON.parse(response));
      return parsed;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Failed to generate valid workout plan');
    }
  }

  async analyzeProgress(userProfile: any, workoutHistory: any[], personalRecords: any[]): Promise<any> {
    const prompt = this.buildAnalysisPrompt(userProfile, workoutHistory, personalRecords);
    
    const response = await this.callGLM(prompt, true);
    
    try {
      const parsed = analysisSchema.parse(JSON.parse(response));
      return parsed;
    } catch (error) {
      console.error('Failed to parse analysis response:', error);
      throw new Error('Failed to analyze progress');
    }
  }

  async chat(message: string, context: any): Promise<string> {
    this.validateApiKey();
    const systemPrompt = this.getSystemPrompt(context);

    return await this.callGLMChat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ]);
  }

  async suggestExercises(muscleGroup: string, equipment: string[], difficulty: string): Promise<any[]> {
    const prompt = `Suggest 5 exercises for ${muscleGroup} muscle group.

Equipment available: ${equipment.join(', ') || 'bodyweight'}
Difficulty level: ${difficulty}

For each exercise, provide:
- Name
- Sets and reps
- Rest time
- Equipment needed
- Brief instructions
- Muscle groups targeted

Respond as a JSON array with this structure:
[
  {
    "name": "Exercise Name",
    "sets": 3,
    "reps": 12,
    "restTime": 90,
    "equipment": "Barbell",
    "instructions": "Brief instructions",
    "muscleGroups": ["Chest", "Triceps"]
  }
]`;

    const response = await this.callGLM(prompt, true);
    
    try {
      const parsed = z.array(exerciseSchema).parse(JSON.parse(response));
      return parsed;
    } catch (error) {
      console.error('Failed to parse exercises response:', error);
      throw new Error('Failed to suggest exercises');
    }
  }

  async provideFormTips(exerciseName: string): Promise<string> {
    const prompt = `Provide detailed form tips for ${exerciseName}.

Include:
1. Starting position
2. Movement pattern
3. Common mistakes to avoid
4. Breathing technique
5. Safety considerations

Keep it concise and actionable. Format as plain text.`;

    return await this.callGLM(prompt, false);
  }

  private async callGLM(prompt: string, jsonResponse: boolean = false): Promise<string> {
    const model = process.env.ZHIPU_MODEL || 'glm-3-turbo';  // glm-3-turbo is the most compatible

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('GLM API Error:', response.status, error);
      throw new Error(`GLM API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callGLMChat(messages: any[]): Promise<string> {
    const model = process.env.ZHIPU_MODEL || 'glm-3-turbo';  // glm-3-turbo is the most compatible

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('GLM API Error:', response.status, error);
      throw new Error(`GLM API error (${response.status}): ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private buildWorkoutPrompt(userProfile: any, week: number, previousFeedback: any[]): string {
    return `You are an expert fitness coach creating a personalized workout plan for Week ${week}.

USER PROFILE:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Weight: ${userProfile.weight} kg
- Height: ${userProfile.height} cm
- Fitness Level: ${userProfile.fitnessLevel}
- Goals: ${userProfile.goals.join(', ')}
- Location: ${userProfile.location}
- Available Equipment: ${userProfile.equipment ? userProfile.equipment.join(', ') : 'bodyweight'}
- Injuries: ${userProfile.injuries ? userProfile.injuries.join(', ') : 'none'}
- Available Days: ${userProfile.availableDays ? userProfile.availableDays.join(', ') : 'all days'}
- Workout Duration: ${userProfile.workoutDuration} minutes per session
- Work Schedule: ${userProfile.workSchedule || 'not specified'}
- Sleep Hours: ${userProfile.sleepHours || 'not specified'} per night
- Stress Level: ${userProfile.stressLevel || 'not specified'}

PREVIOUS FEEDBACK:
${previousFeedback.length > 0 ? previousFeedback.map((f, i) => `- Week ${week - i}: ${f.feedback} (Rating: ${f.rating}/5)`).join('\n') : 'No previous feedback'}

INSTRUCTIONS:
1. Create a workout focused on: ${userProfile.goals[0] || 'general fitness'}
2. Consider fitness level: ${userProfile.fitnessLevel}
3. Account for lifestyle: ${userProfile.workSchedule || 'flexible schedule'}
4. Total duration under ${userProfile.workoutDuration || 60} minutes
5. Include 5-7 main exercises
6. Add warm-up (5-10 minutes) and cool-down (5-10 minutes)
7. Provide clear instructions for each exercise
8. Consider injuries: ${userProfile.injuries ? userProfile.injuries.join(', ') : 'none'}
9. Progress from previous weeks: ${week > 1 ? 'increase intensity by 5-10% or vary exercises' : 'start at appropriate level'}
10. Address feedback: ${previousFeedback.map(f => f.feedback).join(', ') || 'none'}

IMPORTANT SAFETY RULES:
- Always include disclaimers for users with injuries
- Suggest consulting healthcare professionals for pain or discomfort
- Provide alternatives for high-impact exercises if needed
- Ensure exercises match the available equipment
- Consider fatigue levels based on sleep and stress

RESPONSE AS JSON ONLY with this exact structure:
{
  "name": "Week X - Focus Area",
  "focus": "primary goal of this workout",
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": 3,
      "reps": 12,
      "weight": 60,
      "duration": null,
      "restTime": 90,
      "difficulty": "intermediate",
      "equipment": "Dumbbells",
      "instructions": "Brief instructions",
      "muscleGroups": ["Chest", "Triceps"]
    }
  ],
  "totalDuration": 45,
  "estimatedCalories": 300,
  "notes": "any special considerations",
  "warmup": [
    {"name": "Jumping Jacks", "duration": 60},
    {"name": "Arm Circles", "duration": 30}
  ],
  "cooldown": [
    {"name": "Stretching", "duration": 60}
  ]
}`;
  }

  private buildAnalysisPrompt(userProfile: any, workoutHistory: any[], personalRecords: any[]): string {
    return `You are analyzing a user's fitness progress to provide insights and recommendations.

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

RECENT WORKOUT HISTORY (${workoutHistory.length} workouts):
${JSON.stringify(workoutHistory.slice(-5), null, 2)}

PERSONAL RECORDS:
${JSON.stringify(personalRecords.slice(-10), null, 2)}

ANALYSIS TASKS:
1. Identify strengths (consistent performance, progress in key areas)
2. Identify weaknesses (plateaus, missing exercises, low performance areas)
3. Detect plateaus (stagnant PRs, lack of progress)
4. Provide specific recommendations for improvement
5. Suggest adjustments for next week
6. Include a motivational message

RESPONSE AS JSON ONLY with this exact structure:
{
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "plateaus": ["plateau 1", "plateau 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "nextWeekAdjustments": "specific suggestions for week plan",
  "motivationalMessage": "encouraging message"
}`;
  }

  private getSystemPrompt(context: any): string {
    return `You are an expert fitness coach and personal trainer. Your role is to:

EXPERTISE AREAS:
- Exercise programming and progression
- Nutrition planning and macro calculation
- Recovery and injury prevention
- Motivation and accountability
- Lifestyle and habit coaching

CURRENT USER CONTEXT:
${context ? JSON.stringify(context, null, 2) : 'No context yet. Ask about their goals, fitness level, and preferences.'}

GUIDELINES:
1. Always consider user's fitness level (beginner/intermediate/advanced)
2. Adapt workouts to available equipment and location
3. Account for medical conditions and physical limitations
4. Provide clear, actionable advice
5. Be encouraging and supportive
6. Ask clarifying questions if information is missing
7. Consider lifestyle factors (work, sleep, stress)
8. Provide realistic expectations
9. Suggest progression strategies
10. Include safety disclaimers when appropriate

SAFETY FIRST:
- Always recommend consulting healthcare professionals for pain or injuries
- Never prescribe specific calorie amounts without complete health data
- Flag any advice requiring medical supervision
- Provide low-intensity alternatives when needed

COMMUNICATION STYLE:
- Friendly and approachable
- Professional but casual
- Evidence-based but accessible
- Positive and motivating
- Clear and concise

Respond helpfully and ask follow-up questions to provide better advice.`;
  }
}
