import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  Exercise,
} from "@/services/exerciseApi";

interface ExerciseState {
  exercises: Exercise[];
  currentExercise: Exercise | null;
  loading: boolean;
  error: string | null;
}

const initialState: ExerciseState = {
  exercises: [],
  currentExercise: null,
  loading: false,
  error: null,
};

/*
 * GET ALL EXERCISES
 */
export const fetchExercises = createAsyncThunk(
  "exercises/fetchExercises",

  async (_, { rejectWithValue }) => {
    try {
      const data = await getExercises();

      return data.exercises;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch exercises"
      );
    }
  }
);

/*
 * GET SINGLE EXERCISE
 */
export const fetchExerciseById = createAsyncThunk(
  "exercises/fetchExerciseById",

  async (
    id: string,
    { rejectWithValue }
  ) => {
    try {
      const data = await getExerciseById(id);

      return data.exercise;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch exercise"
      );
    }
  }
);

/*
 * CREATE EXERCISE
 */
export const addExercise = createAsyncThunk(
  "exercises/addExercise",

  async (
    exerciseData: Omit<
      Exercise,
      "_id" | "createdAt" | "updatedAt"
    >,
    { rejectWithValue }
  ) => {
    try {
      const data = await createExercise(
        exerciseData
      );

      return data.exercise;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create exercise"
      );
    }
  }
);

/*
 * UPDATE EXERCISE
 */
export const editExercise = createAsyncThunk(
  "exercises/editExercise",

  async (
    {
      id,
      exerciseData,
    }: {
      id: string;
      exerciseData: Partial<Exercise>;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateExercise(
        id,
        exerciseData
      );

      return data.exercise;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update exercise"
      );
    }
  }
);

/*
 * DELETE EXERCISE
 */
export const removeExercise = createAsyncThunk(
  "exercises/removeExercise",

  async (
    id: string,
    { rejectWithValue }
  ) => {
    try {
      await deleteExercise(id);

      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete exercise"
      );
    }
  }
);

const exerciseSlice = createSlice({
  name: "exercises",

  initialState,

  reducers: {
    clearCurrentExercise: (state) => {
      state.currentExercise = null;
    },

    clearExerciseError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /*
       * =========================
       * FETCH ALL EXERCISES
       * =========================
       */

      .addCase(
        fetchExercises.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchExercises.fulfilled,
        (state, action) => {
          state.loading = false;
          state.exercises = action.payload;
        }
      )

      .addCase(
        fetchExercises.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      )

      /*
       * =========================
       * FETCH SINGLE EXERCISE
       * =========================
       */

      .addCase(
        fetchExerciseById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.currentExercise = null;
        }
      )

      .addCase(
        fetchExerciseById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.currentExercise =
            action.payload;
        }
      )

      .addCase(
        fetchExerciseById.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      )

      /*
       * =========================
       * CREATE EXERCISE
       * =========================
       */

      .addCase(
        addExercise.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        addExercise.fulfilled,
        (state, action) => {
          state.loading = false;

          state.exercises.unshift(
            action.payload
          );

          state.currentExercise =
            action.payload;
        }
      )

      .addCase(
        addExercise.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      )

      /*
       * =========================
       * UPDATE EXERCISE
       * =========================
       */

      .addCase(
        editExercise.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        editExercise.fulfilled,
        (state, action) => {
          state.loading = false;

          state.currentExercise =
            action.payload;

          const index =
            state.exercises.findIndex(
              (exercise) =>
                exercise._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.exercises[index] =
              action.payload;
          }
        }
      )

      .addCase(
        editExercise.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      )

      /*
       * =========================
       * DELETE EXERCISE
       * =========================
       */

      .addCase(
        removeExercise.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        removeExercise.fulfilled,
        (state, action) => {
          state.loading = false;

          state.exercises =
            state.exercises.filter(
              (exercise) =>
                exercise._id !== action.payload
            );

          if (
            state.currentExercise?._id ===
            action.payload
          ) {
            state.currentExercise = null;
          }
        }
      )

      .addCase(
        removeExercise.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload as string;
        }
      );
  },
});

export const {
  clearCurrentExercise,
  clearExerciseError,
} = exerciseSlice.actions;

export default exerciseSlice.reducer;