import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  weight: real('weight').notNull(),
  height: real('height').notNull(),
  fitnessLevel: text('fitness_level').notNull(),
  goals: text('goals').notNull(),
  location: text('location').notNull(),
  equipment: text('equipment'),
  injuries: text('injuries'),
  dietaryPreferences: text('dietary_preferences'),
  workSchedule: text('work_schedule'),
  availableDays: text('available_days'),
  workoutDuration: integer('workout_duration'),
  sleepHours: integer('sleep_hours'),
  stressLevel: text('stress_level'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  muscleGroups: text('muscle_groups').notNull(),
  equipment: text('equipment').notNull(),
  difficulty: integer('difficulty').notNull(),
  instructions: text('instructions'),
  formTips: text('form_tips'),
  isAiGenerated: integer('is_ai_generated', { mode: 'boolean' }).default(true),
  imageUrl: text('image_url'),
  createdAt: text('created_at').notNull(),
});

export const workouts = sqliteTable('workouts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  date: text('date').notNull(),
  duration: integer('duration').notNull(),
  type: text('type').notNull(),
  aiGenerated: integer('ai_generated', { mode: 'boolean' }).default(false),
  aiPlanId: text('ai_plan_id'),
  notes: text('notes'),
  rating: integer('rating'),
  completedAt: text('completed_at'),
  createdAt: text('created_at').notNull(),
});

export const workoutExercises = sqliteTable('workout_exercises', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id),
  orderIndex: integer('order_index').notNull(),
  restTime: integer('rest_time'),
  notes: text('notes'),
});

export const sets = sqliteTable('sets', {
  id: text('id').primaryKey(),
  workoutExerciseId: text('workout_exercise_id').notNull().references(() => workoutExercises.id, { onDelete: 'cascade' }),
  setNumber: integer('set_number').notNull(),
  type: text('type').notNull(),
  values: text('values').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false),
});

export const personalRecords = sqliteTable('personal_records', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id),
  type: text('type').notNull(),
  value: real('value').notNull(),
  date: text('date').notNull(),
  workoutId: text('workout_id').references(() => workouts.id),
  createdAt: text('created_at').notNull(),
});

export const aiCoachSessions = sqliteTable('ai_coach_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  sessionType: text('session_type').notNull(),
  prompt: text('prompt').notNull(),
  response: text('response').notNull(),
  createdAt: text('created_at').notNull(),
});

export const aiFeedback = sqliteTable('ai_feedback', {
  id: text('id').primaryKey(),
  workoutId: text('workout_id').notNull().references(() => workouts.id),
  feedback: text('feedback').notNull(),
  rating: integer('rating').notNull(),
  createdAt: text('created_at').notNull(),
});

export type User = typeof users.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type Workout = typeof workouts.$inferSelect;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type Set = typeof sets.$inferSelect;
export type PersonalRecord = typeof personalRecords.$inferSelect;
export type AICoachSession = typeof aiCoachSessions.$inferSelect;
export type AIFeedback = typeof aiFeedback.$inferSelect;
