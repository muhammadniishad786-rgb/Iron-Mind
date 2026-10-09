import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import exerciseReducer from "./slices/exerciseSlice"
import workoutReducer from "./slices/workoutSlice"
import progressReducer from "./slices/progressSlice"
import aiReducer from "./slices/aiSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercise: exerciseReducer,
    workout: workoutReducer,
    progress: progressReducer,
    ai: aiReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;