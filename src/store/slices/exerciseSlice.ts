import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  getExercises,
  Exercise,
} from "@/services/exerciseApi";

interface ExerciseState {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
}

const initialState: ExerciseState = {
  exercises: [],
  loading: false,
  error: null,
};

// Get all exercises
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

const exerciseSlice = createSlice({
  name: "exercises",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH EXERCISES
      .addCase(fetchExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload;
      })

      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default exerciseSlice.reducer;
