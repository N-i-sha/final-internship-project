// App.jsx — Root component of the FAQ Chatbot.
// Owns all chat state (messages, loading, error) and makes
// Axios calls to the FastAPI /chat and /reset endpoints.

import React, { useState, useCallback } from "react";
import axios from "axios";
import ChatWindow from "./components/ChatWindow.jsx";
import InputBar from "./components/InputBar.jsx";

// ── Axios instance pre-configured to use the Vite proxy ──────────────────────
// All requests go to "/api/..." which Vite proxies to http://localhost:8000/...
const api = axios.create({
  baseURL: "/api",
  timeout: 30000, // 30 second timeout (LLM can be slow on first call)
});

// ── Initial welcome message from the bot ─────────────────────────────────────
const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content:
    "👋 Hello! I'm the GIT FAQ Assistant. I can answer questions about admissions, fees, hostel, exams, placements, and more. How can I help you today?",
  timestamp: new Date(),
  sources: [],
};

export default function App() {
  // Array of message objects: { id, role, content, timestamp, sources }
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);

  // True while waiting for the backend to respond
  const [isLoading, setIsLoading] = useState(false);

  // Non-null string when a network/server error occurs
  const [error, setError] = useState(null);

  // ── Send a message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // 1. Immediately add the user's message to the chat
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
      sources: [],
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // 2. POST to /api/chat → proxied to FastAPI /chat
      const { data } = await api.post("/chat", { message: trimmed });

      // 3. Add the bot's reply to the chat
      const botMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        sources: data.sources || [],
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      // Show a user-friendly error bubble
      const errText =
        err.response?.data?.detail ||
        "Sorry, I couldn't connect to the server. Please make sure the backend is running.";
      setError(errText);

      // Also add the error as a bot message so it appears inline
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: `⚠️ ${errText}`,
          timestamp: new Date(),
          sources: [],
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // ── Reset / clear the conversation ─────────────────────────────────────────
  const resetChat = useCallback(async () => {
    try {
      await api.post("/reset"); // Tell the backend to clear its history too
    } catch (_) {
      // Ignore reset errors — at minimum clear the frontend state
    }
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    // Full-screen blue gradient background
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">

      {/* ── Chatbot card ── */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
           style={{ height: "calc(100vh - 2rem)", maxHeight: "800px" }}>

        {/* ── Header ── */}
        <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Bot avatar */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-lg shadow">
              G
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">GIT FAQ Assistant</h1>
              <p className="text-blue-200 text-xs">Greenfield Institute of Technology</p>
            </div>
          </div>

          {/* Online indicator + reset button */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-blue-200">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
              Online
            </span>
            <button
              onClick={resetChat}
              className="text-xs text-blue-200 hover:text-white border border-blue-400 hover:border-white rounded-lg px-3 py-1.5 transition-colors"
              title="Clear conversation"
            >
              New Chat
            </button>
          </div>
        </header>

        {/* ── Chat messages area ── */}
        <ChatWindow messages={messages} isLoading={isLoading} />

        {/* ── Input bar ── */}
        <InputBar onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
