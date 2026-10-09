
import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getProgressDashboard,
  getWorkoutProgress,
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

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  const err = error as {
    response?: {
      data?: {
        message?: string;
      };
    };
    message?: string;
  };

  return (
    err.response?.data?.message ||
    err.message ||
    fallback
  );
}

// =========================
// RESPONSE HELPER
// =========================

// Supports common Axios/API response wrappers.
function unwrapResponse(response: any): any {
  let result = response;

  for (let i = 0; i < 2; i++) {
    if (
      result?.data &&
      typeof result.data === "object" &&
      !Array.isArray(result.data)
    ) {
      result = result.data;
    } else {
      break;
    }
  }

  return result;
}

// =========================
// FETCH DASHBOARD
// =========================

export const fetchProgressDashboard =
  createAsyncThunk<
    ProgressDashboard,
    void,
    { rejectValue: string }
  >(
    "progress/fetchDashboard",

    async (_, { rejectWithValue }) => {
      try {
        // Fetch dashboard and detailed statistics together.
        const [
          dashboardResponse,
          progressResponse,
        ] = await Promise.all([
          getProgressDashboard(),
          getWorkoutProgress(),
        ]);

        const dashboardResult =
          unwrapResponse(dashboardResponse);

        const progressResult =
          unwrapResponse(progressResponse);

        // Dashboard endpoint response.
        const dashboard =
          dashboardResult?.dashboard ??
          dashboardResult;

        // Detailed progress endpoint response.
        const progress =
          progressResult?.progress ??
          progressResult?.stats ??
          progressResult;

        // Preserve dashboard-specific information while
        // filling missing all-time statistics from progress.
        const result: ProgressDashboard = {
          ...progress,
          ...dashboard,

          totalWorkouts:
            progress?.totalWorkouts ??
            dashboard?.totalWorkouts ??
            0,

          totalDuration:
            progress?.totalDuration ??
            dashboard?.totalDuration ??
            0,

          totalVolume:
            progress?.totalVolume ??
            dashboard?.totalVolume ??
            0,

          totalSets:
            progress?.totalSets ??
            dashboard?.totalSets ??
            0,

          totalReps:
            progress?.totalReps ??
            dashboard?.totalReps ??
            0,

          thisWeek:
            dashboard?.thisWeek ??
            progress?.thisWeek ?? {
              workouts: 0,
              duration: 0,
              volume: 0,
            },

          lastWeek:
            dashboard?.lastWeek ??
            progress?.lastWeek ?? {
              workouts: 0,
              duration: 0,
              volume: 0,
            },

          muscleGroups:
            dashboard?.muscleGroups ??
            progress?.muscleGroups ??
            {},

          topExercises:
            dashboard?.topExercises ??
            progress?.topExercises ??
            [],

          recentWorkouts:
            dashboard?.recentWorkouts ??
            progress?.recentWorkouts ??
            [],
        };

        return result;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to load progress dashboard"
          )
        );
      }
    }
  );

// =========================
// FETCH PERSONAL RECORDS
// =========================

export const fetchProgressPersonalRecords =
  createAsyncThunk<
    PersonalRecord[],
    void,
    { rejectValue: string }
  >(
    "progress/fetchPersonalRecords",

    async (_, { rejectWithValue }) => {
      try {
        const response =
          await getPersonalRecords();

        const data = unwrapResponse(response);

        if (Array.isArray(data)) {
          return data;
        }

        if (
          Array.isArray(data?.personalRecords)
        ) {
          return data.personalRecords;
        }

        if (Array.isArray(data?.records)) {
          return data.records;
        }

        if (Array.isArray(data?.pr)) {
          return data.pr;
        }

        return [];
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to load personal records"
          )
        );
      }
    }
  );

// =========================
// FETCH WEEKLY PROGRESS
// =========================

export const fetchProgressWeekly =
  createAsyncThunk<
    ProgressState["weeklyProgress"],
    void,
    { rejectValue: string }
  >(
    "progress/fetchWeekly",

    async (_, { rejectWithValue }) => {
      try {
        const response =
          await getWeeklyProgress();

        const result = unwrapResponse(response);

        const data =
          result?.weeklyProgress ??
          result;

        return {
          thisWeek: data?.thisWeek,
          lastWeek: data?.lastWeek,

          dailyWorkouts:
            Array.isArray(data?.dailyWorkouts)
              ? data.dailyWorkouts
              : [],
        };
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to load weekly progress"
          )
        );
      }
    }
  );

// =========================
// FETCH EXERCISE PROGRESSION
// =========================

export const fetchExerciseProgression =
  createAsyncThunk<
    ExerciseProgression,
    string,
    { rejectValue: string }
  >(
    "progress/fetchExerciseProgression",

    async (exerciseId, { rejectWithValue }) => {
      try {
        const response =
          await getExerciseProgression(exerciseId);

        const result = unwrapResponse(response);

        return (
          result?.progression ??
          result
        ) as ExerciseProgression;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Failed to load exercise progression"
          )
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
    // =========================
    // DASHBOARD
    // =========================

    builder
      .addCase(
        fetchProgressDashboard.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchProgressDashboard.fulfilled,
        (state, action) => {
          state.loading = false;
          state.dashboard = action.payload;
        }
      )

      .addCase(
        fetchProgressDashboard.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ??
            "Failed to load progress";
        }
      );

    // =========================
    // PERSONAL RECORDS
    // =========================

    builder
      .addCase(
        fetchProgressPersonalRecords.fulfilled,
        (state, action) => {
          state.personalRecords = action.payload;
        }
      )

      .addCase(
        fetchProgressPersonalRecords.rejected,
        (state, action) => {
          state.error =
            action.payload ??
            "Failed to load personal records";
        }
      );

    // =========================
    // WEEKLY PROGRESS
    // =========================

    builder
      .addCase(
        fetchProgressWeekly.fulfilled,
        (state, action) => {
          state.weeklyProgress = action.payload;
        }
      )

      .addCase(
        fetchProgressWeekly.rejected,
        (state, action) => {
          state.error =
            action.payload ??
            "Failed to load weekly progress";
        }
      );

    // =========================
    // EXERCISE PROGRESSION
    // =========================

    builder
      .addCase(
        fetchExerciseProgression.pending,
        (state) => {
          state.progressionLoading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchExerciseProgression.fulfilled,
        (state, action) => {
          state.progressionLoading = false;
          state.exerciseProgression =
            action.payload;
        }
      )

      .addCase(
        fetchExerciseProgression.rejected,
        (state, action) => {
          state.progressionLoading = false;

          state.error =
            action.payload ??
            "Failed to load exercise progression";
        }
      );
  },
});

export const {
  clearProgressError,
  clearExerciseProgression,
} = progressSlice.actions;

export default progressSlice.reducer;