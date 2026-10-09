import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getProgressDashboard,
  getPersonalRecords,
  getWeeklyProgress,
  getExerciseProgression,
} from "@/services/workoutApi";

// =========================
// TYPES
// =========================

export interface ProgressDashboard {
  totalWorkouts: number;
  totalDuration: number;
  totalVolume: number;
  totalSets: number;
  totalReps: number;

  thisWeek: {
    workouts: number;
    duration: number;
    volume: number;
  };

  lastWeek: {
    workouts: number;
    duration: number;
    volume: number;
  };

  // The backend groups these values by muscle group.
  muscleGroups: Record<string, number>;

  topExercises: {
    exerciseId: string;
    exerciseName: string;
    muscleGroup?: string;
    totalVolume?: number;
    maxWeight?: number;
  }[];

  recentWorkouts: {
    _id: string;
    name: string;
    duration?: number;
    completedAt?: string;
    createdAt?: string;
    exercises?: unknown[];
  }[];
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  muscleGroup?: string;
  maxWeight: number;
  maxWeightReps: number;
  totalVolume: number;
  achievedAt?: string;
}

export interface DailyProgress {
  date: string;
  workouts: number;
  duration: number;
  volume: number;
}

export interface ExerciseProgression {
  exercise: {
    exerciseId: string;
    name: string;
    muscleGroup?: string;
  };
  progress: {
    workoutId: string;
    workoutName: string;
    date: string;
    maxWeight: number;
    totalReps: number;
    totalVolume: number;
  }[];
}

interface ProgressState {
  dashboard: ProgressDashboard | null;
  personalRecords: PersonalRecord[];
  weeklyProgress: {
    thisWeek?: unknown;
    lastWeek?: unknown;
    dailyWorkouts: DailyProgress[];
  } | null;
  exerciseProgression: ExerciseProgression | null;

  loading: boolean;
  progressionLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  dashboard: null,
  personalRecords: [],
  weeklyProgress: null,
  exerciseProgression: null,

  loading: false,
  progressionLoading: false,
  error: null,
};

// =========================
// ERROR HELPER
// =========================

function getErrorMessage(error: unknown, fallback: string) {
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return err.response?.data?.message || err.message || fallback;
}

// =========================
// FETCH DASHBOARD
// =========================

export const fetchProgressDashboard = createAsyncThunk<
  ProgressDashboard,
  void,
  { rejectValue: string }
>(
  "progress/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProgressDashboard();
      return response.dashboard ?? response;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load progress dashboard")
      );
    }
  }
);

// =========================
// FETCH PERSONAL RECORDS
// =========================

export const fetchProgressPersonalRecords = createAsyncThunk<
  PersonalRecord[],
  void,
  { rejectValue: string }
>(
  "progress/fetchPersonalRecords",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPersonalRecords();

      if (Array.isArray(response)) return response;

      return (
        response.personalRecords ??
        response.records ??
        response.pr ??
        []
      );
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load personal records")
      );
    }
  }
);

// =========================
// FETCH WEEKLY PROGRESS
// =========================

export const fetchProgressWeekly = createAsyncThunk<
  ProgressState["weeklyProgress"],
  void,
  { rejectValue: string }
>(
  "progress/fetchWeekly",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWeeklyProgress();
      const data = response.weeklyProgress ?? response;

      return {
        thisWeek: data.thisWeek,
        lastWeek: data.lastWeek,
        dailyWorkouts: data.dailyWorkouts ?? [],
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load weekly progress")
      );
    }
  }
);

// =========================
// FETCH EXERCISE PROGRESSION
// =========================

export const fetchExerciseProgression = createAsyncThunk<
  ExerciseProgression,
  string,
  { rejectValue: string }
>(
  "progress/fetchExerciseProgression",
  async (exerciseId, { rejectWithValue }) => {
    try {
      const response = await getExerciseProgression(exerciseId);
      return response.progression ?? response;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Failed to load exercise progression")
      );
    }
  }
);

// =========================
// SLICE
// =========================

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    clearProgressError(state) {
      state.error = null;
    },
    clearExerciseProgression(state) {
      state.exerciseProgression = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgressDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgressDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchProgressDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load progress";
      })

      .addCase(fetchProgressPersonalRecords.fulfilled, (state, action) => {
        state.personalRecords = action.payload;
      })
      .addCase(fetchProgressPersonalRecords.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to load personal records";
      })

      .addCase(fetchProgressWeekly.fulfilled, (state, action) => {
        state.weeklyProgress = action.payload;
      })
      .addCase(fetchProgressWeekly.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to load weekly progress";
      })

      .addCase(fetchExerciseProgression.pending, (state) => {
        state.progressionLoading = true;
        state.error = null;
      })
      .addCase(fetchExerciseProgression.fulfilled, (state, action) => {
        state.progressionLoading = false;
        state.exerciseProgression = action.payload;
      })
      .addCase(fetchExerciseProgression.rejected, (state, action) => {
        state.progressionLoading = false;
        state.error = action.payload ?? "Failed to load exercise progression";
      });
  },
});

export const {
  clearProgressError,
  clearExerciseProgression,
} = progressSlice.actions;

export default progressSlice.reducer;
