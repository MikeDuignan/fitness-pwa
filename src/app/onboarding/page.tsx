'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateId } from '@/lib/utils';
import { useUserStore } from '@/lib/stores/user-store';
import { ArrowRight, Activity, Target, Calendar, User } from 'lucide-react';

type Step = 'intro' | 'basic' | 'goals' | 'lifestyle' | 'equipment' | 'complete';

export default function Onboarding() {
  const router = useRouter();
  const { setUser, setIsOnboarded } = useUserStore();
  const [step, setStep] = useState<Step>('intro');

  const [basicInfo, setBasicInfo] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
  });

  const [goals, setGoals] = useState({
    goals: [] as string[],
    fitnessLevel: 'beginner',
  });

  const [lifestyle, setLifestyle] = useState({
    workSchedule: '',
    availableDays: [] as string[],
    workoutDuration: '60',
    sleepHours: '8',
    stressLevel: 'moderate',
    dietaryPreferences: '',
  });

  const [equipment, setEquipment] = useState({
    location: 'home',
    equipment: [] as string[],
    injuries: [] as string[],
  });

  const goalOptions = [
    { id: 'weight-loss', label: 'Weight Loss', icon: '🎯' },
    { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
    { id: 'endurance', label: 'Endurance', icon: '🏃' },
    { id: 'flexibility', label: 'Flexibility', icon: '🧘' },
    { id: 'strength', label: 'Strength', icon: '🏋️' },
    { id: 'general-fitness', label: 'General Fitness', icon: '⭐' },
  ];

  const equipmentOptions = [
    'Barbell',
    'Dumbbells',
    'Kettlebell',
    'Resistance Bands',
    'Pull-up Bar',
    'Yoga Mat',
    'Bench',
    'Cable Machine',
    'Cardio Equipment',
    'Bodyweight Only',
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleGoal = (goalId: string) => {
    setGoals((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  const toggleDay = (day: string) => {
    setLifestyle((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const toggleEquipment = (item: string) => {
    setEquipment((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(item)
        ? prev.equipment.filter((e) => e !== item)
        : [...prev.equipment, item],
    }));
  };

  const handleComplete = () => {
    const userId = generateId();
    const user = {
      id: userId,
      name: basicInfo.name,
      age: parseInt(basicInfo.age),
      weight: parseFloat(basicInfo.weight),
      height: parseFloat(basicInfo.height),
      fitnessLevel: goals.fitnessLevel,
      goals: JSON.stringify(goals.goals),
      location: equipment.location,
      equipment: JSON.stringify(equipment.equipment),
      injuries: equipment.injuries.length > 0 ? JSON.stringify(equipment.injuries) : null,
      dietaryPreferences: lifestyle.dietaryPreferences || null,
      workSchedule: lifestyle.workSchedule || null,
      availableDays: JSON.stringify(lifestyle.availableDays),
      workoutDuration: parseInt(lifestyle.workoutDuration),
      sleepHours: parseInt(lifestyle.sleepHours),
      stressLevel: lifestyle.stressLevel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUser(user);
    setIsOnboarded(true);
    router.push('/');
  };

  const nextStep = () => {
    const steps: Step[] = ['intro', 'basic', 'goals', 'lifestyle', 'equipment', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['intro', 'basic', 'goals', 'lifestyle', 'equipment', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'intro':
        return true;
      case 'basic':
        return basicInfo.name && basicInfo.age && basicInfo.weight && basicInfo.height;
      case 'goals':
        return goals.goals.length > 0;
      case 'lifestyle':
        return lifestyle.availableDays.length > 0;
      case 'equipment':
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 'intro' && (
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-center">Welcome to AI Fitness Coach</CardTitle>
              <CardDescription className="text-center">
                Your personal AI-powered fitness companion. Let's get to know you better.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>✨ Personalized workout plans</p>
                <p>🤖 AI-powered coaching</p>
                <p>📊 Track your progress</p>
                <p>🎯 Achieve your goals</p>
              </div>
              <Button onClick={nextStep} className="w-full">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'basic' && (
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-center">Basic Information</CardTitle>
              <CardDescription className="text-center">
                Let's start with the basics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={basicInfo.age}
                  onChange={(e) => setBasicInfo({ ...basicInfo, age: e.target.value })}
                  placeholder="Your age"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={basicInfo.weight}
                  onChange={(e) => setBasicInfo({ ...basicInfo, weight: e.target.value })}
                  placeholder="Your weight in kg"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={basicInfo.height}
                  onChange={(e) => setBasicInfo({ ...basicInfo, height: e.target.value })}
                  placeholder="Your height in cm"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Back
                </Button>
                <Button onClick={nextStep} disabled={!canProceed()} className="flex-1">
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'goals' && (
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-center">Your Goals</CardTitle>
              <CardDescription className="text-center">
                Select your fitness goals (you can choose multiple)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {goalOptions.map((goal) => (
                  <Button
                    key={goal.id}
                    variant={goals.goals.includes(goal.id) ? 'default' : 'outline'}
                    onClick={() => toggleGoal(goal.id)}
                    className="flex-col h-20 gap-1"
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="text-xs">{goal.label}</span>
                  </Button>
                ))}
              </div>
              <div>
                <Label>Fitness Level</Label>
                <div className="flex gap-2 mt-2">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <Button
                      key={level}
                      variant={goals.fitnessLevel === level ? 'default' : 'outline'}
                      onClick={() => setGoals({ ...goals, fitnessLevel: level })}
                      className="flex-1 capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Back
                </Button>
                <Button onClick={nextStep} disabled={!canProceed()} className="flex-1">
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'lifestyle' && (
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-center">Lifestyle</CardTitle>
              <CardDescription className="text-center">
                Help us understand your routine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workSchedule">Work Schedule</Label>
                <Input
                  id="workSchedule"
                  value={lifestyle.workSchedule}
                  onChange={(e) => setLifestyle({ ...lifestyle, workSchedule: e.target.value })}
                  placeholder="e.g., 9-5 weekdays, flexible weekends"
                />
              </div>
              <div>
                <Label>Available Workout Days</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <Button
                      key={day}
                      variant={lifestyle.availableDays.includes(day) ? 'default' : 'outline'}
                      onClick={() => toggleDay(day)}
                      className="text-xs h-8"
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="workoutDuration">Preferred Workout Duration (minutes)</Label>
                <Input
                  id="workoutDuration"
                  type="number"
                  value={lifestyle.workoutDuration}
                  onChange={(e) => setLifestyle({ ...lifestyle, workoutDuration: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="sleepHours">Average Sleep (hours)</Label>
                <Input
                  id="sleepHours"
                  type="number"
                  value={lifestyle.sleepHours}
                  onChange={(e) => setLifestyle({ ...lifestyle, sleepHours: e.target.value })}
                />
              </div>
              <div>
                <Label>Stress Level</Label>
                <div className="flex gap-2 mt-2">
                  {['low', 'moderate', 'high'].map((level) => (
                    <Button
                      key={level}
                      variant={lifestyle.stressLevel === level ? 'default' : 'outline'}
                      onClick={() => setLifestyle({ ...lifestyle, stressLevel: level })}
                      className="flex-1 capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Back
                </Button>
                <Button onClick={nextStep} disabled={!canProceed()} className="flex-1">
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'equipment' && (
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-center">Equipment & Location</CardTitle>
              <CardDescription className="text-center">
                What equipment do you have access to?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Workout Location</Label>
                <div className="flex gap-2 mt-2">
                  {['home', 'gym', 'outdoor'].map((location) => (
                    <Button
                      key={location}
                      variant={equipment.location === location ? 'default' : 'outline'}
                      onClick={() => setEquipment({ ...equipment, location })}
                      className="flex-1 capitalize"
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Available Equipment</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {equipmentOptions.map((item) => (
                    <Button
                      key={item}
                      variant={equipment.equipment.includes(item) ? 'default' : 'outline'}
                      onClick={() => toggleEquipment(item)}
                      className="text-xs h-10"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="injuries">Any injuries or limitations? (optional)</Label>
                <Input
                  id="injuries"
                  value={equipment.injuries.join(', ')}
                  onChange={(e) => setEquipment({
                    ...equipment,
                    injuries: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                  })}
                  placeholder="e.g., knee injury, back pain"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  Back
                </Button>
                <Button onClick={nextStep} className="flex-1">
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'complete' && (
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-center">You're All Set!</CardTitle>
              <CardDescription className="text-center">
                Your AI coach is ready to help you reach your fitness goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p><strong>Goals:</strong> {goals.goals.map(g => goalOptions.find(opt => opt.id === g)?.label).join(', ')}</p>
                <p><strong>Fitness Level:</strong> {goals.fitnessLevel}</p>
                <p><strong>Workout Days:</strong> {lifestyle.availableDays.length} days/week</p>
                <p><strong>Duration:</strong> {lifestyle.workoutDuration} min/session</p>
              </div>
              <Button onClick={handleComplete} className="w-full">
                Start Your Journey
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
