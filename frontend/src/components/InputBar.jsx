// InputBar.jsx — The message input area at the bottom of the chat.
// Handles: typing, Enter to send, button click to send, disabled while loading.

import React, { useState, useRef, useEffect } from "react";

// ── Send icon SVG ─────────────────────────────────────────────────────────────
function SendIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export default function InputBar({ onSend, isLoading }) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef(null);

  // Focus the input when the component mounts (page loads)
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Re-focus input after loading finishes (so user can type the next message)
  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  // Auto-resize the textarea as the user types (max 5 lines)
  const handleChange = (e) => {
    setInputValue(e.target.value);
    // Reset height then set to scrollHeight so it grows naturally
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSend(inputValue);
    setInputValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Send on Enter (but allow Shift+Enter for newlines)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default newline insertion
      handleSend();
    }
  };

  const canSend = inputValue.trim().length > 0 && !isLoading;

  return (
    <div className="flex-shrink-0 border-t border-slate-200 bg-white px-4 py-3">

      {/* Suggestion chips (quick questions) */}
      <div className="flex gap-2 mb-2 overflow-x-auto pb-1 scrollbar-hide">
        {[
          "What is the fee structure?",
          "Hostel facilities?",
          "Placement records?",
          "Admission eligibility?",
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => !isLoading && onSend(suggestion)}
            disabled={isLoading}
            className="flex-shrink-0 text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex items-end gap-2">

        {/* Textarea grows with content */}
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={isLoading ? "Thinking…" : "Ask about admissions, fees, hostel, exams…"}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-60 disabled:cursor-not-allowed leading-relaxed"
          style={{ minHeight: "44px", maxHeight: "120px", overflowY: "auto" }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`
            send-btn flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
            transition-all duration-150
            ${canSend
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }
          `}
          title="Send message (Enter)"
        >
          {isLoading ? (
            // Spinner while loading
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
              <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            <SendIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Hint text */}
      <p className="text-xs text-slate-400 mt-1.5 text-center">
        Press <kbd className="bg-slate-100 border border-slate-300 rounded px-1 text-slate-500">Enter</kbd> to send &nbsp;·&nbsp; <kbd className="bg-slate-100 border border-slate-300 rounded px-1 text-slate-500">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
