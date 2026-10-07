ironmind-next/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   └── (dashboard)/
│       ├── layout.tsx
│       │
│       ├── dashboard/
│       │   └── page.tsx
│       │
│       ├── workouts/
│       │   ├── page.tsx
│       │   ├── create/
│       │   │   └── page.tsx
│       │   └── [id]/
│       │       └── page.tsx
│       │
│       ├── exercises/
│       │   └── page.tsx
│       │
│       ├── progress/
│       │   └── page.tsx
│       │
│       ├── ai/
│       │   └── page.tsx
│       │
│       └── profile/
│           └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileSidebar.tsx
│   │
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── RecentWorkouts.tsx
│   │   └── ProgressCard.tsx
│   │
│   ├── workouts/
│   │   ├── WorkoutCard.tsx
│   │   ├── WorkoutForm.tsx
│   │   └── ExerciseRow.tsx
│   │
│   ├── exercises/
│   │   └── ExerciseCard.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Loader.tsx
│
├── services/
│   ├── api.ts
│   ├── authApi.ts
│   ├── workoutApi.ts
│   ├── exerciseApi.ts
│   ├── progressApi.ts
│   └── aiApi.ts
│
├── store/
│   ├── store.ts
│   ├── Provider.tsx
│   │
│   └── slices/
│       ├── authSlice.ts
│       ├── workoutSlice.ts
│       └── exerciseSlice.ts
│
├── types/
│   ├── auth.ts
│   ├── workout.ts
│   ├── exercise.ts
│   └── progress.ts
│
├── lib/
│   ├── auth.ts
│   └── utils.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md