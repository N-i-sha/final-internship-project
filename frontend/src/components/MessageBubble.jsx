// MessageBubble.jsx — Renders a single chat message.
// User messages appear on the RIGHT in blue.
// Bot messages appear on the LEFT in white with an avatar.

import React from "react";

// ── Format a Date object as "hh:mm AM/PM" ────────────────────────────────────
function formatTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    // Outer row: user messages pushed to the right, bot messages to the left
    <div
      className={`flex items-end gap-2 mb-4 message-appear ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* ── Avatar (only shown for bot messages) ── */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mb-0.5">
          G
        </div>
      )}

      {/* ── Bubble content ── */}
      <div className={`max-w-[75%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>

        {/* Main text bubble */}
        <div
          className={`
            px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap
            ${isUser
              ? "bg-blue-600 text-white rounded-br-sm"           // User: blue bubble, sharp bottom-right
              : message.isError
                ? "bg-red-50 border border-red-200 text-red-700 rounded-bl-sm"  // Error: red tint
                : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm" // Bot: white card
            }
          `}
        >
          {message.content}
        </div>

        {/* ── Sources badge (show which FAQ files were used) ── */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            <span className="text-xs text-slate-400">Source:</span>
            {message.sources.map((src) => (
              <span
                key={src}
                className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full"
              >
                📄 {src}
              </span>
            ))}
          </div>
        )}

        {/* ── Timestamp ── */}
        <span className="text-xs text-slate-400 mt-1 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
