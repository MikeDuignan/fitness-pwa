'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateId } from '@/lib/utils';
import { useUserStore } from '@/lib/stores/user-store';
import { ArrowRight, ArrowLeft, Activity, Target, Calendar, User, CheckCircle2, Dumbbell, Clock, Sparkles, Zap } from 'lucide-react';

type Step = 'intro' | 'basic' | 'goals' | 'lifestyle' | 'equipment' | 'complete';

const steps: { id: Step; title: string; icon: any }[] = [
  { id: 'intro', title: 'Welcome', icon: Activity },
  { id: 'basic', title: 'About You', icon: User },
  { id: 'goals', title: 'Your Goals', icon: Target },
  { id: 'lifestyle', title: 'Lifestyle', icon: Calendar },
  { id: 'equipment', title: 'Equipment', icon: Dumbbell },
  { id: 'complete', title: 'Ready!', icon: CheckCircle2 },
];

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
    { id: 'weight-loss', label: 'Weight Loss', icon: '🎯', description: 'Burn calories' },
    { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪', description: 'Build strength' },
    { id: 'endurance', label: 'Endurance', icon: '🏃', description: 'Improve stamina' },
    { id: 'flexibility', label: 'Flexibility', icon: '🧘', description: 'Increase mobility' },
    { id: 'strength', label: 'Strength', icon: '🏋️', description: 'Power training' },
    { id: 'general-fitness', label: 'General Fitness', icon: '⭐', description: 'Overall health' },
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
    const stepOrder: Step[] = ['intro', 'basic', 'goals', 'lifestyle', 'equipment', 'complete'];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const stepOrder: Step[] = ['intro', 'basic', 'goals', 'lifestyle', 'equipment', 'complete'];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
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

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            AI Fitness Coach
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your personal AI-powered fitness journey
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {steps.map((s, index) => (
            <div
              key={s.id}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                index <= currentStepIndex
                  ? 'bg-green-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              {React.createElement(steps.find(s => s.id === step)!.icon, {
                className: 'w-10 h-10 text-white',
              })}
            </div>
            <div>
              <CardTitle className="text-center text-2xl">{steps.find(s => s.id === step)?.title}</CardTitle>
              <CardDescription className="text-center text-base">
                {step === 'intro' && 'Let us introduce ourselves'}
                {step === 'basic' && 'Tell us about yourself'}
                {step === 'goals' && 'What do you want to achieve?'}
                {step === 'lifestyle' && 'Help us understand your routine'}
                {step === 'equipment' && 'What resources do you have?'}
                {step === 'complete' && 'You are ready to begin!'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'intro' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl text-center space-y-2">
                    <Sparkles className="w-8 h-8 mx-auto text-green-600 dark:text-green-400" />
                    <p className="font-semibold text-sm">Smart AI Coach</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl text-center space-y-2">
                    <Target className="w-8 h-8 mx-auto text-blue-600 dark:text-blue-400" />
                    <p className="font-semibold text-sm">Personalized Plans</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl text-center space-y-2">
                    <Activity className="w-8 h-8 mx-auto text-purple-600 dark:text-purple-400" />
                    <p className="font-semibold text-sm">Progress Tracking</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl text-center space-y-2">
                    <Zap className="w-8 h-8 mx-auto text-orange-600 dark:text-orange-400" />
                    <p className="font-semibold text-sm">Instant Results</p>
                  </div>
                </div>
                <Button onClick={nextStep} className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {step === 'basic' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">Name</Label>
                  <Input
                    id="name"
                    value={basicInfo.name}
                    onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                    placeholder="Your name"
                    className="h-12"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-base">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={basicInfo.age}
                      onChange={(e) => setBasicInfo({ ...basicInfo, age: e.target.value })}
                      placeholder="25"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-base">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={basicInfo.weight}
                      onChange={(e) => setBasicInfo({ ...basicInfo, weight: e.target.value })}
                      placeholder="75"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-base">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={basicInfo.height}
                      onChange={(e) => setBasicInfo({ ...basicInfo, height: e.target.value })}
                      placeholder="180"
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex-1 h-12 font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 'goals' && (
              <div className="space-y-5">
                <div>
                  <Label className="text-base mb-3 block">Select Your Goals (multiple allowed)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map((goal) => (
                      <Button
                        key={goal.id}
                        variant={goals.goals.includes(goal.id) ? 'default' : 'outline'}
                        onClick={() => toggleGoal(goal.id)}
                        className={`h-24 flex-col gap-2 transition-all ${
                          goals.goals.includes(goal.id)
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                            : 'hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                      >
                        <span className="text-3xl">{goal.icon}</span>
                        <div className="text-center space-y-0.5">
                          <p className="font-semibold text-sm">{goal.label}</p>
                          <p className="text-xs opacity-75">{goal.description}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-base mb-3 block">Your Fitness Level</Label>
                  <div className="flex gap-3">
                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                      <Button
                        key={level}
                        variant={goals.fitnessLevel === level ? 'default' : 'outline'}
                        onClick={() => setGoals({ ...goals, fitnessLevel: level })}
                        className={`flex-1 h-14 font-semibold transition-all ${
                          goals.fitnessLevel === level
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                            : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        }`}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex-1 h-12 font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 'lifestyle' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="workSchedule" className="text-base">Work Schedule</Label>
                  <Input
                    id="workSchedule"
                    value={lifestyle.workSchedule}
                    onChange={(e) => setLifestyle({ ...lifestyle, workSchedule: e.target.value })}
                    placeholder="e.g., 9-5 weekdays, flexible weekends"
                    className="h-12"
                  />
                </div>

                <div>
                  <Label className="text-base mb-3 block">Available Workout Days</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day) => (
                      <Button
                        key={day}
                        variant={lifestyle.availableDays.includes(day) ? 'default' : 'outline'}
                        onClick={() => toggleDay(day)}
                        className={`h-12 text-xs font-medium transition-all ${
                          lifestyle.availableDays.includes(day)
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                            : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workoutDuration" className="text-base">Duration (min)</Label>
                    <Input
                      id="workoutDuration"
                      type="number"
                      value={lifestyle.workoutDuration}
                      onChange={(e) => setLifestyle({ ...lifestyle, workoutDuration: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sleepHours" className="text-base">Sleep (hours)</Label>
                    <Input
                      id="sleepHours"
                      type="number"
                      value={lifestyle.sleepHours}
                      onChange={(e) => setLifestyle({ ...lifestyle, sleepHours: e.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-base mb-3 block">Stress Level</Label>
                  <div className="flex gap-3">
                    {['low', 'moderate', 'high'].map((level) => (
                      <Button
                        key={level}
                        variant={lifestyle.stressLevel === level ? 'default' : 'outline'}
                        onClick={() => setLifestyle({ ...lifestyle, stressLevel: level })}
                        className={`flex-1 h-14 font-semibold capitalize transition-all ${
                          lifestyle.stressLevel === level
                            ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                            : 'hover:bg-amber-50 dark:hover:bg-amber-900/20'
                        }`}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="flex-1 h-12 font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 'equipment' && (
              <div className="space-y-5">
                <div>
                  <Label className="text-base mb-3 block">Where do you workout?</Label>
                  <div className="flex gap-3">
                    {['home', 'gym', 'outdoor'].map((location) => (
                      <Button
                        key={location}
                        variant={equipment.location === location ? 'default' : 'outline'}
                        onClick={() => setEquipment({ ...equipment, location })}
                        className={`flex-1 h-14 font-semibold capitalize transition-all ${
                          equipment.location === location
                            ? 'bg-gradient-to-br from-teal-500 to-green-600'
                            : 'hover:bg-teal-50 dark:hover:bg-teal-900/20'
                        }`}
                      >
                        {location}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base mb-3 block">Available Equipment</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {equipmentOptions.map((item) => (
                      <Button
                        key={item}
                        variant={equipment.equipment.includes(item) ? 'default' : 'outline'}
                        onClick={() => toggleEquipment(item)}
                        className={`h-10 text-xs font-medium transition-all ${
                          equipment.equipment.includes(item)
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                            : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                        }`}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="injuries" className="text-base">Injuries or Limitations (optional)</Label>
                  <Input
                    id="injuries"
                    value={equipment.injuries.join(', ')}
                    onChange={(e) => setEquipment({
                      ...equipment,
                      injuries: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                    })}
                    placeholder="e.g., knee injury, back pain"
                    className="h-12"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1 h-12"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="flex-1 h-12 font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Complete <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 'complete' && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-center text-2xl">You're All Set!</CardTitle>
                    <CardDescription className="text-center text-base">
                      Your AI coach is ready to help you reach your fitness goals
                    </CardDescription>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Goals</p>
                      <p className="font-semibold">{goals.goals.map(g => goalOptions.find(opt => opt.id === g)?.label).join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fitness Level</p>
                      <p className="font-semibold capitalize">{goals.fitnessLevel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Workout Days</p>
                      <p className="font-semibold">{lifestyle.availableDays.length} days/week</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Session Duration</p>
                      <p className="font-semibold">{lifestyle.workoutDuration} minutes</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleComplete}
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Start Your Fitness Journey <Zap className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
