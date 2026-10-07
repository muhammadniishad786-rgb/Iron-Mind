import { Plus } from "lucide-react";
import Link from "next/link";

export default function WorkoutsPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            My <span className="text-red-500">Workouts</span>
          </h1>

          <p className="mt-2 text-zinc-400">
            Create, manage, and track your workouts.
          </p>
        </div>

       <Link href="/workouts/create">
        <button className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-500">
          <Plus size={18} />
          Create Workout
        </button>
        </Link>

      </div>
      
      {/* Workout List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">
          Your Workouts
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {/* Workout Card */}
          <div className="rounded-xl border border-red-800 bg-zinc-950 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-red-500">
                  Push Day
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Chest & Shoulders
                </h3>
              </div>

              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-500">
                Completed
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-zinc-900 p-3">
                <p className="text-lg font-semibold">6</p>
                <p className="text-xs text-zinc-500">Exercises</p>
              </div>

              <div className="rounded-lg bg-zinc-900 p-3">
                <p className="text-lg font-semibold">45</p>
                <p className="text-xs text-zinc-500">Minutes</p>
              </div>

              <div className="rounded-lg bg-zinc-900 p-3">
                <p className="text-lg font-semibold">1.5K</p>
                <p className="text-xs text-zinc-500">Volume</p>
              </div>
            </div>

            <button className="mt-5 w-full rounded-lg border border-zinc-700 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white">
              View Workout
            </button>
          </div>

          {/* Workout Card */}
          <div className="rounded-xl border border-red-800 bg-zinc-950 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-red-500">
                  Pull Day
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  Back & Biceps
                </h3>
              </div>

              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                Planned
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-zinc-900 p-3">
                <p className="text-lg font-semibold">5</p>
                <p className="text-xs text-zinc-500">Exercises</p>
              </div>

              <div className="rounded-lg bg-zinc-900 p-3">
                <p className="text-lg font-semibold">50</p>
                <p className="text-xs text-zinc-500">Minutes</p>
              </div>

              <div className="rounded-lg bg-zinc-900 p-3">
                <p className="text-lg font-semibold">1.8K</p>
                <p className="text-xs text-zinc-500">Volume</p>
              </div>
            </div>

            <button className="mt-5 w-full rounded-lg border border-zinc-700 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white">
              View Workout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}