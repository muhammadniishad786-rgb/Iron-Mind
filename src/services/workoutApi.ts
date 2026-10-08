import api from "./api";

export interface WorkoutExercise {
  exercise: string | {
    _id: string;
    name: string;
    muscleGroup: string;
    equipment: string;
    difficulty: string;
  };

  sets: number;
  reps: number;
  weight: number;
  restTime?: number;

  performedSets?: {
    reps: number;
    weight: number;
    completed: boolean;
  }[];

  completed?: boolean;
}

export interface Workout {
  _id: string;
  user: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  duration?: number;
  completed: boolean;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// =========================
// GET ALL WORKOUTS
// =========================

export const getWorkouts = async () => {
  const response = await api.get("/api/workouts");

  return response.data;
};

// =========================
// GET SINGLE WORKOUT
// =========================

export const getWorkoutById = async (id: string) => {
  const response = await api.get(`/api/workouts/${id}`);

  return response.data;
};

// =========================
// CREATE WORKOUT
// =========================

export const createWorkout = async (workoutData: {
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  duration?: number;
}) => {
  const response = await api.post(
    "/api/workouts",
    workoutData
  );

  return response.data;
};

// =========================
// UPDATE WORKOUT
// =========================

export const updateWorkout = async (
  id: string,
  workoutData: Partial<Workout>
) => {
  const response = await api.put(
    `/api/workouts/${id}`,
    workoutData
  );

  return response.data;
};

// =========================
// DELETE WORKOUT
// =========================

export const deleteWorkout = async (id: string) => {
  const response = await api.delete(
    `/api/workouts/${id}`
  );

  return response.data;
};

// =========================
// COMPLETE WORKOUT
// =========================

export const completeWorkout = async (
  id: string,
  data: {
    duration?: number;
    exercises?: WorkoutExercise[];
  }
) => {
  const response = await api.patch(
    `/api/workouts/${id}/complete`,
    data
  );

  return response.data;
};

// =========================
// WORKOUT HISTORY
// =========================

export const getWorkoutHistory = async () => {
  const response = await api.get(
    "/api/workouts/history"
  );

  return response.data;
};

// =========================
// WORKOUT PROGRESS
// =========================

export const getWorkoutProgress = async () => {
  const response = await api.get(
    "/api/workouts/progress"
  );

  return response.data;
};

// =========================
// PROGRESS DASHBOARD
// =========================

export const getProgressDashboard = async () => {
  const response = await api.get(
    "/api/workouts/progress/dashboard"
  );

  return response.data;
};

// =========================
// PERSONAL RECORDS
// =========================

export const getPersonalRecords = async () => {
  const response = await api.get(
    "/api/workouts/progress/pr"
  );

  return response.data;
};

// =========================
// WEEKLY PROGRESS
// =========================

export const getWeeklyProgress = async () => {
  const response = await api.get(
    "/api/workouts/progress/weekly"
  );

  return response.data;
};

// =========================
// EXERCISE PROGRESSION
// =========================

export const getExerciseProgression = async (
  exerciseId: string
) => {
  const response = await api.get(
    `/api/workouts/progress/exercise/${exerciseId}`
  );

  return response.data;
};

// =========================
// COMPLETE INDIVIDUAL EXERCISE
// =========================

export const completeWorkoutExercise = async (
  workoutId: string,
  exerciseId: string
) => {
  const response = await api.patch(
    `/api/workouts/${workoutId}/exercises/${exerciseId}/complete`
  );

  return response.data;
};

// =========================
// REMOVE EXERCISE
// =========================

export const removeWorkoutExercise = async (
  workoutId: string,
  exerciseId: string
) => {
  const response = await api.delete(
    `/api/workouts/${workoutId}/exercises/${exerciseId}`
  );

  return response.data;
};