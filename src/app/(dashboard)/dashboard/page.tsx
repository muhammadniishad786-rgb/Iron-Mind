"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  LoaderCircle,
  Medal,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Weight,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";

import {
  fetchProgressDashboard,
  fetchProgressPersonalRecords,
  fetchProgressWeekly,
} from "@/store/slices/progressSlice";

import { fetchWorkouts } from "@/store/slices/workoutSlice";
import type { Workout, WorkoutExercise } from "@/services/workoutApi";

const WEEKLY_GOAL = 5;

function formatNumber(value = 0) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
}

function formatDuration(minutes = 0) {
  const value = Number(minutes) || 0;
  const hours = Math.floor(value / 60);
  const mins = Math.round(value % 60);

  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;

  return `${hours} hr ${mins} min`;
}

function formatDate(date?: string) {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getWorkoutVolume(workout: Workout) {
  return (workout.exercises ?? []).reduce(
    (total: number, exercise: WorkoutExercise) => {
      const completedSets = (exercise.performedSets ?? []).filter(
        (set) => set.completed
      );

      const exerciseVolume = completedSets.reduce(
        (sum, set) => sum + (Number(set.weight) || 0) * (Number(set.reps) || 0),
        0
      );

      return total + exerciseVolume;
    },
    0
  );
}

function getExerciseCount(workout: Workout) {
  return workout.exercises?.length ?? 0;
}

function getCompletedSetCount(workout: Workout) {
  return (workout.exercises ?? []).reduce(
    (total, exercise) =>
      total +
      (exercise.performedSets ?? []).filter((set) => set.completed).length,
    0
  );
}

function getExerciseNames(workout: Workout) {
  const names = (workout.exercises ?? [])
    .map((item) =>
      typeof item.exercise === "string"
        ? ""
        : item.exercise?.name ?? ""
    )
    .filter(Boolean);

  return names.length > 0 ? names.slice(0, 3).join(", ") : "Training session";
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/40">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">{title}</p>

        <div className="rounded-xl bg-red-500/10 p-2.5 text-red-400 transition group-hover:bg-red-500/15">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-2 text-xs text-zinc-500">{description}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-800 px-5 py-9 text-center">
      <Dumbbell className="mx-auto mb-3 text-zinc-600" size={25} />
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { dashboard, personalRecords, loading, error } = useSelector(
    (state: RootState) => state.progress
  );

  const { workouts, loading: workoutsLoading } = useSelector(
    (state: RootState) => state.workout
  );

  useEffect(() => {
    dispatch(fetchProgressDashboard());
    dispatch(fetchProgressPersonalRecords());
    dispatch(fetchProgressWeekly());
    dispatch(fetchWorkouts());
  }, [dispatch]);

  const recentWorkouts = dashboard?.recentWorkouts ?? [];

  // Select the next unfinished workout. The backend does not currently
  // expose a dedicated workout schedule.
  const nextWorkout = useMemo(
    () => workouts.find((workout) => !workout.completed),
    [workouts]
  );

  const thisWeek = dashboard?.thisWeek;

  const goalProgress = Math.min(
    100,
    Math.round(((thisWeek?.workouts ?? 0) / WEEKLY_GOAL) * 100)
  );

  const isInitialLoading =
    (loading || workoutsLoading) && !dashboard && workouts.length === 0;

  const refreshDashboard = () => {
    dispatch(fetchProgressDashboard());
    dispatch(fetchProgressPersonalRecords());
    dispatch(fetchProgressWeekly());
    dispatch(fetchWorkouts());
  };

  if (isInitialLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#090909] text-white">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin text-red-500" size={34} />
          <p className="text-sm text-zinc-400">
            Loading your IronMind dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
              Your fitness command center
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, <span className="text-red-500">Nishad</span>
              <span className="text-red-500">.</span>
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Here's your fitness overview. Keep showing up and keep getting
              stronger.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshDashboard}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:border-red-500/50 hover:text-white sm:self-auto"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {/* ERROR */}
        {error && (
          <div className="flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-300 sm:flex-row sm:items-center sm:justify-between">
            <p>{error}</p>

            <button
              type="button"
              onClick={refreshDashboard}
              className="self-start font-semibold hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* STATS */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Activity className="text-red-400" size={19} />
            <h2 className="font-semibold text-white">Your statistics</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Workouts"
              value={formatNumber(dashboard?.totalWorkouts)}
              description="Completed training sessions"
              icon={Dumbbell}
            />

            <StatCard
              title="This Week"
              value={formatNumber(thisWeek?.workouts)}
              description={`${WEEKLY_GOAL} sessions is your weekly goal`}
              icon={CalendarDays}
            />

            <StatCard
              title="Total Volume"
              value={`${formatNumber(dashboard?.totalVolume)} kg`}
              description="Total weight × reps"
              icon={Weight}
            />

            <StatCard
              title="Personal Records"
              value={formatNumber(personalRecords.length)}
              description="Recorded exercise PRs"
              icon={Medal}
            />
          </div>
        </section>

        {/* TODAY'S / NEXT WORKOUT */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Your Next Workout</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Pick up where you left off.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-red-900/40 bg-zinc-950 p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-red-400">
                  <Flame size={17} />
                  Ready when you are
                </div>

                {nextWorkout ? (
                  <>
                    <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                      {nextWorkout.name}
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                      {nextWorkout.description ||
                        "Your next training session is waiting. Stay focused and track every set."}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-400">
                      <span className="flex items-center gap-2">
                        <Dumbbell size={16} className="text-red-400" />
                        {getExerciseCount(nextWorkout)} exercises
                      </span>

                      <span className="flex items-center gap-2">
                        <Target size={16} className="text-red-400" />
                        {getCompletedSetCount(nextWorkout)} completed sets
                      </span>

                      {nextWorkout.duration ? (
                        <span className="flex items-center gap-2">
                          <Clock3 size={16} className="text-red-400" />
                          {formatDuration(nextWorkout.duration)}
                        </span>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                      Ready for a fresh start?
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                      You have no unfinished workouts. Create a new workout
                      and make your next session count.
                    </p>
                  </>
                )}
              </div>

              <Link
                href={nextWorkout ? "/workouts" : "/workouts"}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                {nextWorkout ? "Start Workout" : "Create Workout"}
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* RECENT WORKOUTS */}
        <section>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-semibold">Recent Workouts</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Your latest completed training sessions.
              </p>
            </div>

            <Link
              href="/workouts"
              className="inline-flex items-center gap-2 self-start text-sm font-medium text-red-400 transition hover:text-red-300"
            >
              View all workouts
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            {recentWorkouts.length === 0 ? (
              <div className="p-5">
                <EmptyState message="No completed workouts yet. Finish your first workout to see your training history here." />
              </div>
            ) : (
              recentWorkouts.slice(0, 4).map((workout, index) => (
                <div
                  key={workout._id || index}
                  className={`flex flex-col gap-4 p-5 transition hover:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between ${
                    index !== Math.min(recentWorkouts.length, 4) - 1
                      ? "border-b border-zinc-800"
                      : ""
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                      <Dumbbell size={20} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">
                        {workout.name}
                      </h3>

                      <p className="mt-1 max-w-md truncate text-sm text-zinc-500">
                        {workout.exercises?.length
                          ? `${workout.exercises.length} exercises`
                          : "Completed workout"}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        {formatDate(workout.completedAt || workout.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 pl-1 sm:pl-0">
                    <div>
                      <p className="text-xs text-zinc-500">Duration</p>
                      <p className="mt-1 text-sm font-medium">
                        {formatDuration(workout.duration)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500">Volume</p>
                      <p className="mt-1 text-sm font-medium">
                        {formatNumber(
                          getWorkoutVolume(
                            workout as unknown as Workout
                          )
                        )}{" "}
                        kg
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                      <CheckCircle2 size={13} />
                      Completed
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* BOTTOM SECTION */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* WEEKLY PROGRESS */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Weekly Progress</h2>
                <p className="mt-2 text-sm text-zinc-500">
                  Build consistency one session at a time.
                </p>
              </div>

              <div className="rounded-xl bg-red-500/10 p-2.5 text-red-400">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-sm text-zinc-500">Workouts</p>

                <p className="mt-2 text-2xl font-bold">
                  {formatNumber(thisWeek?.workouts)}
                  <span className="text-base font-medium text-zinc-500">
                    {" "}
                    / {WEEKLY_GOAL}
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-sm text-zinc-500">Weekly Volume</p>

                <p className="mt-2 text-2xl font-bold">
                  {formatNumber(thisWeek?.volume)}
                  <span className="ml-1 text-sm font-medium text-zinc-500">
                    kg
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-zinc-400">Weekly goal</span>
                <span className="font-semibold text-red-400">
                  {goalProgress}%
                </span>
              </div>

              <div
                className="h-2.5 overflow-hidden rounded-full bg-zinc-800"
                role="progressbar"
                aria-valuenow={goalProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Weekly workout goal"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-400 transition-all duration-500"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-zinc-500">
                {Math.max(
                  0,
                  WEEKLY_GOAL - (thisWeek?.workouts ?? 0)
                )}{" "}
                more workouts to reach your weekly goal.
              </p>
            </div>

            <Link
              href="/progress"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-red-400 transition hover:text-red-300"
            >
              View full analytics
              <ArrowRight size={16} />
            </Link>
          </section>

          {/* AI COACH */}
          <section className="relative overflow-hidden rounded-2xl border border-red-900/40 bg-zinc-950 p-6 sm:p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-600/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-red-600/5 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-red-400">
                <Sparkles size={17} />
                IRONMIND AI
              </div>

              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                Train smarter with AI.
              </h2>

              <p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">
                Get workout suggestions, training guidance and personalized
                fitness insights with your IronMind AI Coach.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Personalized workout suggestions",
                  "Exercise and training guidance",
                  "Smarter training decisions",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <CheckCircle2 size={16} className="shrink-0 text-red-400" />
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/ai-workout"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Ask AI Coach
                <ArrowRight size={17} />
              </Link>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="pb-3 pt-1 text-center text-xs text-zinc-600">
          Built for consistency. Powered by IronMind.
        </footer>
      </div>
    </main>
  );
}
