
"use client";

import {
  Bot,
  Send,
  Sparkles,
  User,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { sendAIMessage } from "@/store/slices/aiSlice";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIPage() {
  const dispatch = useDispatch<AppDispatch>();

  const chatLoading = useSelector(
    (state: RootState) => state.ai.chatLoading
  );

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey Nishad! 👋 I'm your IronMind AI Coach. I can help you create workouts, improve your exercises, and understand your training progress. What would you like help with today?",
    },
  ]);

  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Create a workout for me",
    "How can I improve my bench press?",
    "Give me a chest workout",
    "How should I increase my weight?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, chatLoading, error]);

  const sendMessage = async (
    text: string,
    addUserMessage = true
  ) => {
    const trimmedMessage = text.trim();

    if (!trimmedMessage || chatLoading) return;

    setError("");
    setMessage("");

    if (addUserMessage) {
      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-user`,
          role: "user",
          content: trimmedMessage,
        },
      ]);
    }

    try {
      const response = await dispatch(
        sendAIMessage(trimmedMessage)
      ).unwrap();

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: response,
        },
      ]);
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : "Unable to get a response. Please try again."
      );
    }
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    void sendMessage(message);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col bg-white p-4 text-zinc-900 transition-colors duration-200 dark:bg-black dark:text-white sm:p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10">
            <Bot className="text-red-600 dark:text-red-500" size={22} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              AI <span className="text-red-600 dark:text-red-500">Coach</span>
            </h1>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Your personal AI fitness assistant.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="mt-8 flex min-h-[480px] flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-950">
        {/* Messages */}
        <div
          className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6"
          aria-live="polite"
          aria-label="AI Coach conversation"
        >
          {messages.map((chatMessage) => {
            const isAssistant = chatMessage.role === "assistant";

            return (
              <div
                key={chatMessage.id}
                className={`flex gap-3 ${
                  isAssistant ? "justify-start" : "justify-end"
                }`}
              >
                {isAssistant && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-2xl ${
                    isAssistant ? "" : "order-first"
                  }`}
                >
                  <div
                    className={`rounded-xl px-4 py-3 ${
                      isAssistant
                        ? "rounded-tl-none bg-white text-zinc-700 shadow-sm dark:bg-zinc-900 dark:text-zinc-300"
                        : "rounded-tr-none bg-red-600 text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                      {chatMessage.content}
                    </p>
                  </div>

                  <p
                    className={`mt-1 text-[10px] text-zinc-500 dark:text-zinc-600 ${
                      isAssistant ? "text-left" : "text-right"
                    }`}
                  >
                    {isAssistant ? "IRONMIND AI" : "YOU"}
                  </p>
                </div>

                {!isAssistant && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {chatLoading && (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                <Bot size={18} />
              </div>

              <div className="rounded-xl rounded-tl-none bg-white px-4 py-3 shadow-sm dark:bg-zinc-900">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <LoaderCircle
                    size={16}
                    className="animate-spin text-red-600 dark:text-red-500"
                  />
                  Your AI Coach is thinking...
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="ml-12 max-w-2xl rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const lastUserMessage = [...messages]
                    .reverse()
                    .find((item) => item.role === "user");

                  if (lastUserMessage) {
                    void sendMessage(lastUserMessage.content, false);
                  }
                }}
                disabled={chatLoading}
                className="mt-3 flex items-center gap-2 text-xs font-medium text-red-600 transition hover:text-red-500 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
              >
                <RefreshCw size={14} />
                Try again
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions and Input */}
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setMessage(suggestion)}
                disabled={chatLoading}
                className="whitespace-nowrap rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-600 transition hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 transition focus-within:border-red-500 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <Sparkles
              size={20}
              className="ml-2 shrink-0 text-red-600 dark:text-red-500"
            />

            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask your AI Coach..."
              disabled={chatLoading}
              aria-label="Message your AI Coach"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 disabled:opacity-60 dark:text-white dark:placeholder:text-zinc-600"
            />

            <button
              type="submit"
              disabled={!message.trim() || chatLoading}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {chatLoading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>

          <p className="mt-3 text-center text-[11px] text-zinc-500 dark:text-zinc-600">
            AI-generated fitness guidance. Listen to your body and train safely.
          </p>
        </div>
      </div>
    </div>
  );
}
