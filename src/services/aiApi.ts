
import api from "@/services/api";

// =========================
// TYPES
// =========================

export interface GenerateAIWorkoutPayload {
  muscleGroup: string;
  difficulty: string;
  goal: string;
  equipment: string[];
}

export interface AIWorkoutExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  restTime: number;
  instructions?: string;
}

export interface GeneratedAIWorkout {
  workoutName: string;
  description: string;
  muscleGroup: string;
  difficulty: string;
  equipment: string[];
  exercises: AIWorkoutExercise[];
}

export interface SaveAIWorkoutPayload {
  workoutName: string;
  description?: string;
  exercises: AIWorkoutExercise[];
}

export interface AIProgressionResponse {
  exerciseName: string;
  muscleGroup: string;
  status: "progressing" | "maintaining" | "regressing";
  recommendation: {
    action:
      | "increase_weight"
      | "maintain_weight"
      | "increase_reps"
      | "reduce_weight"
      | "maintain";
    weight: number;
    targetReps: number;
    sets: number;
  };
  reason: string;
  nextGoal: string;
}

export interface AIChatResponse {
  message: string;
}

// =========================
// GENERATE WORKOUT
// POST /api/ai/generate-workout
// =========================

export const generateAIWorkout = async (
  payload: GenerateAIWorkoutPayload
) => {
  const response = await api.post(
    "/ai/generate-workout",
    payload
  );

  return response.data as {
    message: string;
    workout: GeneratedAIWorkout;
  };
};

// =========================
// SAVE WORKOUT
// POST /api/ai/save-workout
// =========================

export const saveAIWorkout = async (
  payload: SaveAIWorkoutPayload
) => {
  const response = await api.post(
    "/ai/save-workout",
    payload
  );

  return response.data;
};

// =========================
// AI CHAT
// POST /api/ai/chat
// =========================

export const askAI = async (message: string) => {
  const response = await api.post(
    "/ai/chat",
    { message }
  );

  return response.data as AIChatResponse;
};

// =========================
// AI PROGRESSION
// POST /api/ai/progression
// =========================

export const getAIProgression = async (
  exerciseId: string
) => {
  const response = await api.post(
    "/ai/progression",
    { exerciseId }
  );

  return response.data as {
    message: string;
    progression: AIProgressionResponse;
    history: {
      date: string;
      workoutName: string;
      maxWeight: number;
      totalReps: number;
      totalVolume: number;
      sets: {
        setNumber: number;
        weight: number;
        reps: number;
      }[];
    }[];
  };
};