import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workout, WorkoutExercise } from '@/db';

interface WorkoutState {
  workouts: Workout[];
  activeWorkout: Workout | null;
  workoutExercises: WorkoutExercise[];
  addWorkout: (workout: Workout) => void;
  setActiveWorkout: (workout: Workout | null) => void;
  completeWorkout: () => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  addExerciseToWorkout: (exercise: WorkoutExercise) => void;
  clearActiveWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      workouts: [],
      activeWorkout: null,
      workoutExercises: [],
      
      addWorkout: (workout) => set((state) => ({
        workouts: [...state.workouts, workout],
      })),
      
      setActiveWorkout: (workout) => set({ activeWorkout: workout }),
      
      completeWorkout: () => set((state) => {
        if (!state.activeWorkout) return state;
        return {
          workouts: [...state.workouts, { ...state.activeWorkout, completedAt: new Date().toISOString() }],
          activeWorkout: null,
        };
      }),
      
      updateWorkout: (id, updates) => set((state) => ({
        workouts: state.workouts.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        activeWorkout: state.activeWorkout?.id === id ? { ...state.activeWorkout, ...updates } : state.activeWorkout,
      })),
      
      deleteWorkout: (id) => set((state) => ({
        workouts: state.workouts.filter((w) => w.id !== id),
      })),
      
      addExerciseToWorkout: (exercise) => set((state) => ({
        workoutExercises: [...state.workoutExercises, exercise],
      })),
      
      clearActiveWorkout: () => set({ activeWorkout: null, workoutExercises: [] }),
    }),
    {
      name: 'fitness-workout-storage',
    }
  )
);
