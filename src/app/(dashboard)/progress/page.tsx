"use client";

import {
  Activity,
  Dumbbell,
  Trophy,
  TrendingUp,
} from "lucide-react";

const weeklyProgress = [
  { day: "Mon", workouts: 1 },
  { day: "Tue", workouts: 0 },
  { day: "Wed", workouts: 1 },
  { day: "Thu", workouts: 0 },
  { day: "Fri", workouts: 1 },
  { day: "Sat", workouts: 1 },
  { day: "Sun", workouts: 0 },
];

const personalRecords = [
  {
    exercise: "Bench Press",
    weight: "80 kg",
    reps: "5 reps",
  },
  {
    exercise: "Squat",
    weight: "100 kg",
    reps: "5 reps",
  },
  {
    exercise: "Deadlift",
    weight: "120 kg",
    reps: "3 reps",
  },
];

export default function ProgressPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Your <span className="text-red-500">Progress</span>
        </h1>

        <p className="mt-2 text-zinc-400">
          Track your performance and see how your training is improving.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 hover:border-red-500">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">Total Workouts</p>

            <Dumbbell size={20} className="text-red-500" />
          </div>

          <h2 className="mt-3 text-3xl font-bold">24</h2>

          <p className="mt-1 text-sm text-green-500">
            +4 this week
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 hover:border-red-500">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">Total Volume</p>

            <Activity size={20} className="text-red-500" />
          </div>

          <h2 className="mt-3 text-3xl font-bold">12.4K</h2>

          <p className="mt-1 text-sm text-zinc-500">
            kg lifted
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">Personal Records</p>

            <Trophy size={20} className="text-red-500" />
          </div>

          <h2 className="mt-3 text-3xl font-bold">8</h2>

          <p className="mt-1 text-sm text-green-500">
            +2 this month
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">Progress</p>

            <TrendingUp size={20} className="text-red-500" />
          </div>

          <h2 className="mt-3 text-3xl font-bold">80%</h2>

          <p className="mt-1 text-sm text-zinc-500">
            weekly goal
          </p>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6 hover:border-red-500">
        <div>
          <h2 className="text-lg font-semibold">
            Weekly Activity
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Your workouts this week.
          </p>
        </div>

        <div className="mt-8 flex items-end justify-between gap-3">
          {weeklyProgress.map((day) => (
            <div
              key={day.day}
              className="flex flex-1 flex-col items-center gap-3"
            >
              <div className="flex h-40 w-full items-end justify-center rounded-lg bg-zinc-900">
                <div
                  className={`w-8 rounded-t-md transition ${
                    day.workouts > 0
                      ? "h-28 bg-red-600"
                      : "h-3 bg-zinc-700"
                  }`}
                />
              </div>

              <span className="text-xs text-zinc-500">
                {day.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Personal Records */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Personal Records
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Your strongest performances.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {personalRecords.map((record) => (
              <div
                key={record.exercise}
                className="flex items-center justify-between rounded-lg bg-zinc-900 p-4"
              >
                <div>
                  <p className="font-medium">
                    {record.exercise}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    {record.reps}
                  </p>
                </div>

                <p className="font-semibold text-red-500">
                  {record.weight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Exercise Progress */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div>
            <h2 className="text-lg font-semibold">
              Exercise Progress
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Recent improvements in your exercises.
            </p>
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <div className="flex justify-between text-sm">
                <span>Bench Press</span>
                <span className="text-green-500">
                  +10 kg
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-zinc-800">
                <div className="h-2 w-[80%] rounded-full bg-red-600" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>Squat</span>
                <span className="text-green-500">
                  +15 kg
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-zinc-800">
                <div className="h-2 w-[90%] rounded-full bg-red-600" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>Deadlift</span>
                <span className="text-green-500">
                  +20 kg
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-zinc-800">
                <div className="h-2 w-[95%] rounded-full bg-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}