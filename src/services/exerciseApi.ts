import api from "./api";

export interface Exercise {
  _id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  image?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get all exercises
export const getExercises = async () => {
  const response = await api.get("/exercises");

  return response.data;
};

// Get single exercise
export const getExerciseById = async (id: string) => {
  const response = await api.get(`/exercises/${id}`);

  return response.data;
};

// Create exercise
export const createExercise = async (
  exerciseData: Omit<Exercise, "_id" | "createdAt" | "updatedAt">
) => {
  const response = await api.post(
    "/exercises",
    exerciseData
  );

  return response.data;
};

// Update exercise
export const updateExercise = async (
  id: string,
  exerciseData: Partial<Exercise>
) => {
  const response = await api.put(
    `/exercises/${id}`,
    exerciseData
  );

  return response.data;
};

// Delete exercise
export const deleteExercise = async (id: string) => {
  const response = await api.delete(
    `/exercises/${id}`
  );

  return response.data;
};
