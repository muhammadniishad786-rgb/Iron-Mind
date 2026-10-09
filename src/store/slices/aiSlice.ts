
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {
  generateAIWorkout as generateAIWorkoutApi,
  saveAIWorkout as saveAIWorkoutApi,
  askAI as askAIApi,
  getAIProgression as getAIProgressionApi,
  type GenerateAIWorkoutPayload,
  type GeneratedAIWorkout,
  type SaveAIWorkoutPayload,
  type AIProgressionResponse,
} from "@/services/aiApi";

// =========================
// TYPES
// =========================

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIState {
  generatedWorkout: GeneratedAIWorkout | null;
  savedWorkoutId: string | null;
  progression: AIProgressionResponse | null;
  progressionHistory: {
    date: string;
    workoutName: string;
    maxWeight: number;
    totalReps: number;
    totalVolume: number;
  }[];
  messages: ChatMessage[];
  generating: boolean;
  saving: boolean;
  chatting: boolean;
  progressionLoading: boolean;
  error: string | null;
}

const initialState: AIState = {
  generatedWorkout: null,
  savedWorkoutId: null,
  progression: null,
  progressionHistory: [],
  messages: [],
  generating: false,
  saving: false,
  chatting: false,
  progressionLoading: false,
  error: null,
};

// =========================
// ERROR HELPER
// =========================

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  const err = error as {
    response?: {
      data?: {
        message?: string;
        error?: string;
      };
    };
    message?: string;
  };

  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    fallback
  );
}

// =========================
// GENERATE WORKOUT
// =========================

export const generateAIWorkout = createAsyncThunk<
  GeneratedAIWorkout,
  GenerateAIWorkoutPayload,
  { rejectValue: string }
>(
  "ai/generateWorkout",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await generateAIWorkoutApi(payload);

      return response.workout;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to generate workout"
        )
      );
    }
  }
);

// =========================
// SAVE WORKOUT
// =========================

export const saveAIWorkout = createAsyncThunk<
  { workoutId: string },
  SaveAIWorkoutPayload,
  { rejectValue: string }
>(
  "ai/saveWorkout",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await saveAIWorkoutApi(payload);

      const workout =
        response.workout ??
        response.data?.workout;

      if (!workout?._id) {
        throw new Error(
          "Workout was saved, but no workout ID was returned"
        );
      }

      return { workoutId: workout._id };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to save AI workout"
        )
      );
    }
  }
);

// =========================
// CHAT
// =========================

export const sendAIMessage = createAsyncThunk<
  ChatMessage,
  string,
  { rejectValue: string }
>(
  "ai/sendMessage",
  async (message, { rejectWithValue }) => {
    try {
      const response = await askAIApi(message);

      return {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: response.message,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Failed to get AI response"
        )
      );
    }
  }
);

// =========================
// PROGRESSION
// =========================

export const fetchAIProgression =
  createAsyncThunk<
    {
      progression: AIProgressionResponse;
      history: AIState["progressionHistory"];
    },
    string,
    { rejectValue: string }
  >(
    "ai/fetchProgression",
    async (exerciseId, { rejectWithValue }) => {
      try {
        const response =
          await getAIProgressionApi(exerciseId);

        return {
          progression: response.progression,
          history: response.history.map(
            (item) => ({
              date: item.date,
              workoutName: item.workoutName,
              maxWeight: item.maxWeight,
              totalReps: item.totalReps,
              totalVolume: item.totalVolume,
            })
          ),
        };
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to analyze progression"
          )
        );
      }
    }
  );

// =========================
// SLICE
// =========================

const aiSlice = createSlice({
  name: "ai",
  initialState,

  reducers: {
    clearAIError(state) {
      state.error = null;
    },

    clearGeneratedWorkout(state) {
      state.generatedWorkout = null;
      state.savedWorkoutId = null;
    },

    clearAIProgression(state) {
      state.progression = null;
      state.progressionHistory = [];
    },

    addUserMessage(
      state,
      action: PayloadAction<string>
    ) {
      state.messages.push({
        id: `${Date.now()}-user`,
        role: "user",
        content: action.payload,
      });
    },

    clearAIChat(state) {
      state.messages = [];
    },
  },

  extraReducers: (builder) => {
    // Generate workout
    builder
      .addCase(
        generateAIWorkout.pending,
        (state) => {
          state.generating = true;
          state.error = null;
          state.savedWorkoutId = null;
        }
      )
      .addCase(
        generateAIWorkout.fulfilled,
        (state, action) => {
          state.generating = false;
          state.generatedWorkout = action.payload;
        }
      )
      .addCase(
        generateAIWorkout.rejected,
        (state, action) => {
          state.generating = false;
          state.error =
            action.payload ??
            "Failed to generate workout";
        }
      );

    // Save workout
    builder
      .addCase(
        saveAIWorkout.pending,
        (state) => {
          state.saving = true;
          state.error = null;
        }
      )
      .addCase(
        saveAIWorkout.fulfilled,
        (state, action) => {
          state.saving = false;
          state.savedWorkoutId =
            action.payload.workoutId;
        }
      )
      .addCase(
        saveAIWorkout.rejected,
        (state, action) => {
          state.saving = false;
          state.error =
            action.payload ??
            "Failed to save workout";
        }
      );

    // Chat
    builder
      .addCase(
        sendAIMessage.pending,
        (state) => {
          state.chatting = true;
          state.error = null;
        }
      )
      .addCase(
        sendAIMessage.fulfilled,
        (state, action) => {
          state.chatting = false;
          state.messages.push(action.payload);
        }
      )
      .addCase(
        sendAIMessage.rejected,
        (state, action) => {
          state.chatting = false;
          state.error =
            action.payload ??
            "Failed to get AI response";
        }
      );

    // Progression
    builder
      .addCase(
        fetchAIProgression.pending,
        (state) => {
          state.progressionLoading = true;
          state.error = null;
          state.progression = null;
        }
      )
      .addCase(
        fetchAIProgression.fulfilled,
        (state, action) => {
          state.progressionLoading = false;
          state.progression =
            action.payload.progression;
          state.progressionHistory =
            action.payload.history;
        }
      )
      .addCase(
        fetchAIProgression.rejected,
        (state, action) => {
          state.progressionLoading = false;
          state.error =
            action.payload ??
            "Failed to analyze progression";
        }
      );
  },
});

export const {
  clearAIError,
  clearGeneratedWorkout,
  clearAIProgression,
  addUserMessage,
  clearAIChat,
} = aiSlice.actions;

export default aiSlice.reducer;