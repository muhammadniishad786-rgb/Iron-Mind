import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  completeWorkout,
  Workout,
  WorkoutExercise,
} from "@/services/workoutApi";

// =========================
// STATE
// =========================

interface WorkoutState {
  workouts: Workout[];
  currentWorkout: Workout | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkoutState = {
  workouts: [],
  currentWorkout: null,
  loading: false,
  error: null,
};

// =========================
// GET ALL WORKOUTS
// =========================

export const fetchWorkouts = createAsyncThunk(
  "workouts/fetchWorkouts",

  async (_, { rejectWithValue }) => {
    try {
      const data = await getWorkouts();

      return data.workouts;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch workouts"
      );
    }
  }
);

// =========================
// GET SINGLE WORKOUT
// =========================

export const fetchWorkoutById = createAsyncThunk(
  "workouts/fetchWorkoutById",

  async (
    id: string,
    { rejectWithValue }
  ) => {
    try {
      const data = await getWorkoutById(id);

      return data.workout;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch workout"
      );
    }
  }
);

// =========================
// CREATE WORKOUT
// =========================

export const addWorkout = createAsyncThunk(
  "workouts/addWorkout",

  async (
    workoutData: {
      name: string;
      description?: string;
      exercises: WorkoutExercise[];
      duration?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await createWorkout(
        workoutData
      );

      return data.workout;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create workout"
      );
    }
  }
);

// =========================
// UPDATE WORKOUT
// =========================

export const editWorkout = createAsyncThunk(
  "workouts/editWorkout",

  async (
    {
      id,
      workoutData,
    }: {
      id: string;
      workoutData: Partial<Workout>;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateWorkout(
        id,
        workoutData
      );

      return data.workout;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update workout"
      );
    }
  }
);

// =========================
// DELETE WORKOUT
// =========================

export const removeWorkout = createAsyncThunk(
  "workouts/removeWorkout",

  async (
    id: string,
    { rejectWithValue }
  ) => {
    try {
      await deleteWorkout(id);

      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete workout"
      );
    }
  }
);

// =========================
// COMPLETE WORKOUT
// =========================

export const finishWorkout = createAsyncThunk(
  "workouts/finishWorkout",

  async (
    {
      id,
      data,
    }: {
      id: string;
      data: {
        duration?: number;
        exercises?: WorkoutExercise[];
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await completeWorkout(
        id,
        data
      );

      return response.workout;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to complete workout"
      );
    }
  }
);

// =========================
// SLICE
// =========================

const workoutSlice = createSlice({
  name: "workouts",

  initialState,

  reducers: {
    clearWorkoutError: (state) => {
      state.error = null;
    },

    clearCurrentWorkout: (state) => {
      state.currentWorkout = null;
    },
  },

  extraReducers: (builder) => {
    // =========================
    // FETCH WORKOUTS
    // =========================

    builder
      .addCase(
        fetchWorkouts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchWorkouts.fulfilled,
        (state, action) => {
          state.loading = false;
          state.workouts = action.payload;
        }
      )

      .addCase(
        fetchWorkouts.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      );

    // =========================
    // FETCH SINGLE WORKOUT
    // =========================

    builder
      .addCase(
        fetchWorkoutById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchWorkoutById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.currentWorkout =
            action.payload;
        }
      )

      .addCase(
        fetchWorkoutById.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      );

    // =========================
    // CREATE WORKOUT
    // =========================

    builder
      .addCase(
        addWorkout.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        addWorkout.fulfilled,
        (state, action) => {
          state.loading = false;

          state.workouts.unshift(
            action.payload
          );

          state.currentWorkout =
            action.payload;
        }
      )

      .addCase(
        addWorkout.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      );

    // =========================
    // UPDATE WORKOUT
    // =========================

    builder
      .addCase(
        editWorkout.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        editWorkout.fulfilled,
        (state, action) => {
          state.loading = false;

          const updatedWorkout =
            action.payload;

          const index =
            state.workouts.findIndex(
              (workout) =>
                workout._id ===
                updatedWorkout._id
            );

          if (index !== -1) {
            state.workouts[index] =
              updatedWorkout;
          }

          state.currentWorkout =
            updatedWorkout;
        }
      )

      .addCase(
        editWorkout.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      );

    // =========================
    // DELETE WORKOUT
    // =========================

    builder
      .addCase(
        removeWorkout.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        removeWorkout.fulfilled,
        (state, action) => {
          state.loading = false;

          state.workouts =
            state.workouts.filter(
              (workout) =>
                workout._id !==
                action.payload
            );

          if (
            state.currentWorkout?._id ===
            action.payload
          ) {
            state.currentWorkout = null;
          }
        }
      )

      .addCase(
        removeWorkout.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      );

    // =========================
    // COMPLETE WORKOUT
    // =========================

    builder
      .addCase(
        finishWorkout.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        finishWorkout.fulfilled,
        (state, action) => {
          state.loading = false;

          const completedWorkout =
            action.payload;

          const index =
            state.workouts.findIndex(
              (workout) =>
                workout._id ===
                completedWorkout._id
            );

          if (index !== -1) {
            state.workouts[index] =
              completedWorkout;
          }

          state.currentWorkout =
            completedWorkout;
        }
      )

      .addCase(
        finishWorkout.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      );
  },
});

export const {
  clearWorkoutError,
  clearCurrentWorkout,
} = workoutSlice.actions;

export default workoutSlice.reducer;