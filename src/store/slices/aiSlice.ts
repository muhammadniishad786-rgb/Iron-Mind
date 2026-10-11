
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import {
  generateAIWorkout,
  askAI,
  saveAIWorkout,
  getAIProgression,
  type GenerateAIWorkoutPayload,
  type GeneratedAIWorkout,
  type SaveAIWorkoutPayload,
  type AIProgressionResponse,
} from "@/services/aiApi";

// ========================================
// TYPES
// ========================================

interface SavedAIWorkout {
  _id?: string;
  name?: string;
  workoutName?: string;
  description?: string;
  exercises?: unknown[];
  [key: string]: unknown;
}

interface AIProgressionHistory {
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
}

interface AIProgressionResult {
  message: string;
  progression: AIProgressionResponse;
  history: AIProgressionHistory[];
}

interface AIState {
  workout: GeneratedAIWorkout | null;
  savedWorkout: SavedAIWorkout | null;
  response: string;
  progression: AIProgressionResult | null;

  loading: boolean;
  chatLoading: boolean;
  saving: boolean;
  progressionLoading: boolean;

  error: string | null;
  chatError: string | null;
  saveError: string | null;
  progressionError: string | null;

  saveSuccess: boolean;
}

// ========================================
// ERROR HANDLER
// ========================================

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

// ========================================
// GENERATE AI WORKOUT
// POST /api/ai/generate-workout
// ========================================

export const generateWorkout = createAsyncThunk<
  GeneratedAIWorkout,
  GenerateAIWorkoutPayload,
  { rejectValue: string }
>("ai/generateWorkout", async (payload, { rejectWithValue }) => {
  try {
    const data = await generateAIWorkout(payload);
    return data.workout;
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to generate workout")
    );
  }
});

// ========================================
// SAVE AI WORKOUT
// POST /api/ai/save-workout
// ========================================

export const saveWorkout = createAsyncThunk<
  SavedAIWorkout,
  SaveAIWorkoutPayload,
  { rejectValue: string }
>("ai/saveWorkout", async (payload, { rejectWithValue }) => {
  try {
    const data = await saveAIWorkout(payload);
    return data.workout as SavedAIWorkout;
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to save workout")
    );
  }
});

// ========================================
// AI CHAT
// POST /api/ai/chat
// ========================================

export const sendAIMessage = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("ai/sendAIMessage", async (message, { rejectWithValue }) => {
  try {
    const data = await askAI(message);
    return data.message;
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to get AI response")
    );
  }
});

// ========================================
// AI PROGRESSION
// POST /api/ai/progression
// ========================================

export const getProgression = createAsyncThunk<
  AIProgressionResult,
  string,
  { rejectValue: string }
>("ai/getProgression", async (exerciseId, { rejectWithValue }) => {
  try {
    return await getAIProgression(exerciseId);
  } catch (error: unknown) {
    return rejectWithValue(
      getErrorMessage(error, "Failed to generate AI progression")
    );
  }
});

// ========================================
// INITIAL STATE
// ========================================

const initialState: AIState = {
  workout: null,
  savedWorkout: null,
  response: "",
  progression: null,

  loading: false,
  chatLoading: false,
  saving: false,
  progressionLoading: false,

  error: null,
  chatError: null,
  saveError: null,
  progressionError: null,

  saveSuccess: false,
};

// ========================================
// SLICE
// ========================================

const aiSlice = createSlice({
  name: "ai",
  initialState,

  reducers: {
    clearWorkout: (state) => {
      state.workout = null;
      state.error = null;
    },

    clearAIResponse: (state) => {
      state.response = "";
      state.chatError = null;
    },

    clearSaveStatus: (state) => {
      state.saveSuccess = false;
      state.saveError = null;
      state.savedWorkout = null;
    },

    clearProgression: (state) => {
      state.progression = null;
      state.progressionError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // --------------------
      // GENERATE WORKOUT
      // --------------------
      .addCase(generateWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.workout = null;
      })
      .addCase(generateWorkout.fulfilled, (state, action) => {
        state.loading = false;
        state.workout = action.payload;
      })
      .addCase(generateWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to generate workout";
      })

      // --------------------
      // SAVE WORKOUT
      // --------------------
      .addCase(saveWorkout.pending, (state) => {
        state.saving = true;
        state.saveError = null;
        state.saveSuccess = false;
      })
      .addCase(saveWorkout.fulfilled, (state, action) => {
        state.saving = false;
        state.savedWorkout = action.payload;
        state.saveSuccess = true;
      })
      .addCase(saveWorkout.rejected, (state, action) => {
        state.saving = false;
        state.saveError =
          action.payload ?? action.error.message ?? "Failed to save workout";
        state.saveSuccess = false;
      })

      // --------------------
      // AI CHAT
      // --------------------
      .addCase(sendAIMessage.pending, (state) => {
        state.chatLoading = true;
        state.chatError = null;
      })
      .addCase(sendAIMessage.fulfilled, (state, action) => {
        state.chatLoading = false;
        state.response = action.payload;
      })
      .addCase(sendAIMessage.rejected, (state, action) => {
        state.chatLoading = false;
        state.chatError =
          action.payload ?? action.error.message ?? "Failed to get AI response";
      })

      // --------------------
      // AI PROGRESSION
      // --------------------
      .addCase(getProgression.pending, (state) => {
        state.progressionLoading = true;
        state.progressionError = null;
        state.progression = null;
      })
      .addCase(getProgression.fulfilled, (state, action) => {
        state.progressionLoading = false;
        state.progression = action.payload;
      })
      .addCase(getProgression.rejected, (state, action) => {
        state.progressionLoading = false;
        state.progressionError =
          action.payload ??
          action.error.message ??
          "Failed to generate AI progression";
      });
  },
});

export const {
  clearWorkout,
  clearAIResponse,
  clearSaveStatus,
  clearProgression,
} = aiSlice.actions;

export default aiSlice.reducer;
