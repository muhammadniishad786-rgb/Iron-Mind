"use client";

import { Bot, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";

export default function AIPage() {
  const [message, setMessage] = useState("");

  const suggestions = [
    "Create a workout for me",
    "How can I improve my bench press?",
    "Give me a chest workout",
    "How should I increase my weight?",
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10">
            <Bot className="text-red-500" size={22} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              AI <span className="text-red-500">Coach</span>
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Your personal AI fitness assistant.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="mt-8 flex flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
        
        {/* Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          
          {/* AI Message */}
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600">
              <Bot size={18} />
            </div>

            <div className="max-w-2xl">
              <div className="rounded-xl rounded-tl-none bg-zinc-900 px-4 py-3">
                <p className="text-sm leading-6 text-zinc-300">
                  Hey Nishad! 👋 I'm your IronMind AI Coach.
                  I can help you create workouts, improve your
                  exercises, and understand your training progress.
                </p>
              </div>
            </div>
          </div>

          {/* Example User Message */}
          <div className="flex justify-end gap-3">
            <div className="max-w-xl">
              <div className="rounded-xl rounded-tr-none bg-red-600 px-4 py-3">
                <p className="text-sm leading-6">
                  Give me a good chest workout.
                </p>
              </div>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800">
              <User size={18} />
            </div>
          </div>

          {/* Example AI Response */}
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600">
              <Bot size={18} />
            </div>

            <div className="max-w-2xl">
              <div className="rounded-xl rounded-tl-none bg-zinc-900 px-4 py-3">
                <p className="text-sm leading-6 text-zinc-300">
                  Here's a simple chest workout:
                </p>

                <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                  <li>1. Bench Press — 4 × 8</li>
                  <li>2. Incline Dumbbell Press — 3 × 10</li>
                  <li>3. Cable Fly — 3 × 12</li>
                  <li>4. Push Ups — 3 × 15</li>
                </ul>

                <p className="mt-3 text-sm text-zinc-400">
                  Rest around 60–90 seconds between sets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="border-t border-zinc-800 p-4">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setMessage(suggestion)}
                className="whitespace-nowrap rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-zinc-400 transition hover:border-red-500 hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-2">
            <Sparkles
              size={20}
              className="ml-2 shrink-0 text-red-500"
            />

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask your AI Coach..."
              className="flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-zinc-600"
            />

            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600 transition hover:bg-red-500"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}