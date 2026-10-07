export default function DashboardPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="text-red-500">Nishad</span>
        </h1>

        <p className="mt-2 text-zinc-400">
          Here's your fitness overview for today.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-red-500 bg-zinc-950 p-5">
          <p className="text-sm text-zinc-400">Total Workouts</p>
          <h2 className="mt-2 text-3xl font-bold">24</h2>
        </div>

        <div className="rounded-xl border border-red-500 bg-zinc-950 p-5">
          <p className="text-sm text-zinc-400">This Week</p>
          <h2 className="mt-2 text-3xl font-bold">4</h2>
        </div>

        <div className="rounded-xl border border-red-500 bg-zinc-950 p-5">
          <p className="text-sm text-zinc-400">Total Volume</p>
          <h2 className="mt-2 text-3xl font-bold">12.4K</h2>
        </div>

        <div className="rounded-xl border border-red-500 bg-zinc-950 p-5">
          <p className="text-sm text-zinc-400">Personal Records</p>
          <h2 className="mt-2 text-3xl font-bold">8</h2>
        </div>
      </div>

      {/* Today's Workout */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Today's Workout</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Your scheduled workout for today.
          </p>
        </div>

        <div className="rounded-xl border border-red-500 bg-zinc-950 p-6">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            {/* Workout Info */}
            <div>
              <p className="text-sm font-medium text-red-500">PUSH DAY</p>

              <h3 className="mt-2 text-2xl font-bold">Chest & Shoulders</h3>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-400">
                <span>6 Exercises</span>
                <span>45 min</span>
                <span>8 Sets</span>
              </div>
            </div>

            {/* Button */}
            <button className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500">
              Start Workout
            </button>
          </div>
        </div>
      </section>

      {/* Recent Workouts */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Recent Workouts</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Your latest completed workouts.
            </p>
          </div>

          <button className="text-sm font-medium text-red-500 transition hover:text-red-400">
            View All
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          {/* Workout 1 */}
          <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">Push Day</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Chest, Shoulders & Triceps
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <p className="text-zinc-500">Duration</p>
                <p className="mt-1 font-medium">45 min</p>
              </div>

              <div>
                <p className="text-zinc-500">Volume</p>
                <p className="mt-1 font-medium">1,540 kg</p>
              </div>

              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                Completed
              </span>
            </div>
          </div>

          {/* Workout 2 */}
          <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">Pull Day</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Back, Biceps & Rear Delts
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <p className="text-zinc-500">Duration</p>
                <p className="mt-1 font-medium">52 min</p>
              </div>

              <div>
                <p className="text-zinc-500">Volume</p>
                <p className="mt-1 font-medium">1,820 kg</p>
              </div>

              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                Completed
              </span>
            </div>
          </div>

          {/* Workout 3 */}
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">Leg Day</h3>

              <p className="mt-1 text-sm text-zinc-500">
                Quads, Hamstrings & Calves
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <p className="text-zinc-500">Duration</p>
                <p className="mt-1 font-medium">58 min</p>
              </div>

              <div>
                <p className="text-zinc-500">Volume</p>
                <p className="mt-1 font-medium">2,140 kg</p>
              </div>

              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                Completed
              </span>
            </div>
          </div>
        </div>
      </section>

            {/* Bottom Section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* Progress */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Weekly Progress</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Your workout activity this week.
            </p>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-zinc-900 p-4">
              <p className="text-sm text-zinc-500">
                Workouts
              </p>

              <p className="mt-2 text-2xl font-bold">
                4 / 5
              </p>
            </div>

            <div className="rounded-lg bg-zinc-900 p-4">
              <p className="text-sm text-zinc-500">
                Volume
              </p>

              <p className="mt-2 text-2xl font-bold">
                8.6K kg
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-zinc-400">
                Weekly Goal
              </span>

              <span className="text-red-500">
                80%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full w-[80%] rounded-full bg-red-600" />
            </div>
          </div>
        </section>

        {/* AI Coach */}
        <section className="relative overflow-hidden rounded-xl border border-red-900/40 bg-zinc-950 p-6">

          {/* Red Glow */}
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-medium text-red-500">
              IRONMIND AI
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Your AI Coach
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
              Get personalized workout suggestions, training guidance,
              and fitness insights powered by AI.
            </p>

            <button className="mt-6 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500">
              Ask AI Coach
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
