"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Dumbbell,
  Flame,
  LoaderCircle,
  Medal,
  RefreshCw,
  Target,
  TrendingUp,
  Trophy,
  Weight,
} from "lucide-react";

import {
  fetchProgressDashboard,
  fetchProgressPersonalRecords,
  fetchProgressWeekly,
  fetchExerciseProgression,
} from "@/store/slices/progressSlice";

function formatNumber(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
}

function formatDuration(minutes = 0) {
  const value = Number(minutes) || 0;
  const hours = Math.floor(value / 60);
  const remainingMinutes = Math.round(value % 60);

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} hr`;
  return `${hours} hr ${remainingMinutes} min`;
}

function formatDate(date?: string) {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Date unavailable";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="rounded-xl bg-red-500/10 p-2.5 text-red-400">
        <Icon size={19} />
      </div>
      <div>
        <h2 className="font-semibold text-white">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  suffix,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  suffix?: string;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:border-zinc-700">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">{title}</p>
        <div className="rounded-xl bg-red-500/10 p-2.5 text-red-400">
          <Icon size={19} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-2">
        <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {value}
        </p>
        {suffix && <span className="text-sm text-zinc-500">{suffix}</span>}
      </div>

      <p className="mt-2 text-xs text-zinc-500">{description}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-800 px-4 py-10 text-center text-sm text-zinc-500">
      {message}
    </div>
  );
}

export default function ProgressPage() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    dashboard,
    personalRecords,
    weeklyProgress,
    exerciseProgression,
    loading,
    progressionLoading,
    error,
  } = useSelector((state: RootState) => state.progress);

  const [selectedExercise, setSelectedExercise] = useState("");

  useEffect(() => {
    dispatch(fetchProgressDashboard());
    dispatch(fetchProgressPersonalRecords());
    dispatch(fetchProgressWeekly());
  }, [dispatch]);

  const exercises = dashboard?.topExercises ?? [];

  useEffect(() => {
    if (!selectedExercise && exercises.length > 0) {
      const firstExercise = exercises[0].exerciseId;
      if (firstExercise) setSelectedExercise(firstExercise);
    }
  }, [exercises, selectedExercise]);

  useEffect(() => {
    if (selectedExercise) {
      dispatch(fetchExerciseProgression(selectedExercise));
    }
  }, [dispatch, selectedExercise]);

  const muscleGroups = useMemo(() => {
    return Object.entries(dashboard?.muscleGroups ?? {}).sort(
      (a, b) => Number(b[1]) - Number(a[1])
    );
  }, [dashboard?.muscleGroups]);

  const maxMuscleVolume = Math.max(
    1,
    ...muscleGroups.map(([, volume]) => Number(volume) || 0)
  );

  const dailyWorkouts = weeklyProgress?.dailyWorkouts ?? [];
  const maxDailyWorkouts = Math.max(
    1,
    ...dailyWorkouts.map((day) => Number(day.workouts) || 0)
  );

  const thisWeek = dashboard?.thisWeek;
  const lastWeek = dashboard?.lastWeek;

  const workoutDifference =
    (thisWeek?.workouts ?? 0) - (lastWeek?.workouts ?? 0);

  const volumeDifference =
    (thisWeek?.volume ?? 0) - (lastWeek?.volume ?? 0);

  const recentWorkouts = dashboard?.recentWorkouts ?? [];
  const topExercises = dashboard?.topExercises ?? [];

  if (loading && !dashboard) {
    return (
      <main className="min-h-screen bg-[#090909] p-5 text-white sm:p-8">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center gap-4">
          <LoaderCircle className="animate-spin text-red-400" size={34} />
          <p className="text-sm text-zinc-400">
            Loading your training progress...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
              Performance center
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your Progress<span className="text-red-500">.</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
              Track your consistency, training volume, and strength over time.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              dispatch(fetchProgressDashboard());
              dispatch(fetchProgressPersonalRecords());
              dispatch(fetchProgressWeekly());
              if (selectedExercise) {
                dispatch(fetchExerciseProgression(selectedExercise));
              }
            }}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-red-500/60 hover:bg-red-500/5 sm:self-auto"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-300 sm:flex-row sm:items-center sm:justify-between">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                dispatch(fetchProgressDashboard());
                dispatch(fetchProgressPersonalRecords());
                dispatch(fetchProgressWeekly());
              }}
              className="self-start font-semibold hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Completed workouts"
            value={formatNumber(dashboard?.totalWorkouts)}
            icon={Dumbbell}
            description="All-time completed sessions"
          />
          <StatCard
            title="Training time"
            value={formatDuration(dashboard?.totalDuration)}
            icon={Clock3}
            description="Total recorded duration"
          />
          <StatCard
            title="Training volume"
            value={formatNumber(dashboard?.totalVolume)}
            suffix="kg"
            icon={Weight}
            description="Weight × reps across completed sets"
          />
          <StatCard
            title="Total sets"
            value={formatNumber(dashboard?.totalSets)}
            icon={Target}
            description="Completed training sets"
          />
          <StatCard
            title="Total reps"
            value={formatNumber(dashboard?.totalReps)}
            icon={Activity}
            description="Completed repetitions"
          />
        </div>

        {/* WEEKLY OVERVIEW + DAILY CHART */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Panel>
            <SectionHeading
              title="This week"
              subtitle="Compared with last week"
              icon={CalendarDays}
            />

            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Workouts</p>
                  <p className="mt-1 text-2xl font-bold">
                    {formatNumber(thisWeek?.workouts)}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    workoutDifference >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {workoutDifference >= 0 ? (
                    <ArrowUpRight size={17} />
                  ) : (
                    <ArrowDownRight size={17} />
                  )}
                  {Math.abs(workoutDifference)} sessions
                </div>
              </div>

              <div className="h-px bg-zinc-800" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Duration</p>
                  <p className="mt-1 text-xl font-bold">
                    {formatDuration(thisWeek?.duration)}
                  </p>
                </div>
                <p className="text-xs text-zinc-500">
                  Last week: {formatDuration(lastWeek?.duration)}
                </p>
              </div>

              <div className="h-px bg-zinc-800" />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-400">Volume</p>
                  <p className="mt-1 text-xl font-bold">
                    {formatNumber(thisWeek?.volume)} kg
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    volumeDifference >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {volumeDifference >= 0 ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  {formatNumber(Math.abs(volumeDifference))} kg
                </div>
              </div>
            </div>
          </Panel>

          <Panel className="xl:col-span-2">
            <SectionHeading
              title="Weekly activity"
              subtitle="Completed workouts by day"
              icon={TrendingUp}
            />

            {dailyWorkouts.length === 0 ? (
              <EmptyState message="No weekly activity data yet. Complete a workout to start tracking." />
            ) : (
              <div className="flex h-52 items-end justify-around gap-2 pt-3">
                {dailyWorkouts.map((day, index) => {
                  const height = Math.max(
                    6,
                    (Number(day.workouts) / maxDailyWorkouts) * 100
                  );

                  return (
                    <div
                      key={`${day.date}-${index}`}
                      className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-xs text-zinc-400">
                        {day.workouts}
                      </span>
                      <div className="flex h-[72%] w-full items-end justify-center">
                        <div
                          title={`${day.workouts} workouts`}
                          className="w-full max-w-10 rounded-t-md bg-red-500 transition-all hover:bg-red-400"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="max-w-full truncate text-[10px] text-zinc-500 sm:text-xs">
                        {formatDate(day.date).split(" ")[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>

        {/* MUSCLE GROUP VOLUME + TOP EXERCISES */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Panel>
            <SectionHeading
              title="Muscle group breakdown"
              subtitle="Training volume by muscle group"
              icon={Flame}
            />

            {muscleGroups.length === 0 ? (
              <EmptyState message="Muscle-group statistics will appear after completed workouts." />
            ) : (
              <div className="space-y-5">
                {muscleGroups.map(([muscle, volume]) => {
                  const numericVolume = Number(volume) || 0;
                  const percentage = (numericVolume / maxMuscleVolume) * 100;

                  return (
                    <div key={muscle}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span className="capitalize text-zinc-300">
                          {muscle}
                        </span>
                        <span className="text-zinc-400">
                          {formatNumber(numericVolume)} kg
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel>
            <SectionHeading
              title="Top exercises"
              subtitle="Exercises ranked by recorded training volume"
              icon={Trophy}
            />

            {topExercises.length === 0 ? (
              <EmptyState message="Your top exercises will appear here after you complete workouts." />
            ) : (
              <div className="space-y-3">
                {topExercises.map((exercise, index) => (
                  <div
                    key={exercise.exerciseId || `${exercise.exerciseName}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-red-400">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {exercise.exerciseName}
                      </p>
                      <p className="mt-1 text-xs capitalize text-zinc-500">
                        {exercise.muscleGroup || "Exercise"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-zinc-200">
                        {formatNumber(exercise.totalVolume)} kg
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">Volume</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* PERSONAL RECORDS */}
        <Panel>
          <SectionHeading
            title="Personal records"
            subtitle="Your strongest recorded lifts"
            icon={Medal}
          />

          {personalRecords.length === 0 ? (
            <EmptyState message="No personal records yet. Complete exercises with recorded weights to build your record list." />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {personalRecords.map((record, index) => (
                <div
                  key={`${record.exerciseId}-${index}`}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {record.exerciseName}
                      </p>
                      <p className="mt-1 text-xs capitalize text-zinc-500">
                        {record.muscleGroup || "Personal record"}
                      </p>
                    </div>
                    <Trophy className="shrink-0 text-amber-400" size={19} />
                  </div>

                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-red-400">
                      {formatNumber(record.maxWeight)}
                    </span>
                    <span className="text-sm text-zinc-400">kg</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 text-xs text-zinc-500">
                    <span>{record.maxWeightReps} reps</span>
                    <span>{formatDate(record.achievedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* EXERCISE PROGRESSION */}
        <Panel>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <SectionHeading
              title="Exercise progression"
              subtitle="Review your recorded performance across workouts"
              icon={TrendingUp}
            />

            <select
              value={selectedExercise}
              onChange={(event) => setSelectedExercise(event.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500 sm:max-w-xs"
            >
              {topExercises.map((exercise) => (
                <option
                  key={exercise.exerciseId}
                  value={exercise.exerciseId}
                >
                  {exercise.exerciseName}
                </option>
              ))}
            </select>
          </div>

          {!selectedExercise ? (
            <EmptyState message="Complete a workout to select an exercise and view its progression." />
          ) : progressionLoading ? (
            <div className="flex items-center justify-center gap-3 py-12 text-sm text-zinc-400">
              <LoaderCircle size={20} className="animate-spin text-red-400" />
              Loading exercise progression...
            </div>
          ) : !exerciseProgression?.progress?.length ? (
            <EmptyState message="No progression history is available for this exercise yet." />
          ) : (
            <>
              <div className="mb-5 rounded-xl bg-zinc-950/70 p-4">
                <p className="text-sm text-zinc-400">
                  Selected exercise
                </p>
                <h3 className="mt-1 text-lg font-semibold">
                  {exerciseProgression.exercise?.name || "Exercise progression"}
                </h3>
                {exerciseProgression.exercise?.muscleGroup && (
                  <p className="mt-1 text-xs capitalize text-zinc-500">
                    {exerciseProgression.exercise.muscleGroup}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {exerciseProgression.progress.map((entry, index) => (
                  <div
                    key={`${entry.workoutId}-${entry.date}-${index}`}
                    className="grid grid-cols-1 gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {entry.workoutName}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {formatDate(entry.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Max weight</p>
                      <p className="mt-1 font-semibold text-red-400">
                        {formatNumber(entry.maxWeight)} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Total reps</p>
                      <p className="mt-1 font-semibold text-zinc-200">
                        {formatNumber(entry.totalReps)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Volume</p>
                      <p className="mt-1 font-semibold text-zinc-200">
                        {formatNumber(entry.totalVolume)} kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Panel>

        {/* RECENT COMPLETED WORKOUTS */}
        <Panel>
          <SectionHeading
            title="Recent workouts"
            subtitle="Your latest completed training sessions"
            icon={CalendarDays}
          />

          {recentWorkouts.length === 0 ? (
            <EmptyState message="Your completed workout history will appear here." />
          ) : (
            <div className="space-y-3">
              {recentWorkouts.map((workout, index) => (
                <div
                  key={workout._id || index}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                      <Dumbbell size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {workout.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {formatDate(workout.completedAt || workout.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-1 sm:pl-0">
                    <span className="text-sm text-zinc-400">
                      {formatDuration(workout.duration)}
                    </span>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <p className="pb-3 text-center text-xs text-zinc-600">
          Keep showing up. Your progress is built one session at a time.
        </p>
      </div>
    </main>
  );
}
