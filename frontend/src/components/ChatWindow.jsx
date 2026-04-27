// ChatWindow.jsx — Renders all chat messages in a scrollable container.
// Auto-scrolls to the latest message whenever messages change.

import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";

// ── Typing indicator (three bouncing dots shown while bot is thinking) ────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4 message-appear">
      {/* Bot avatar */}
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        G
      </div>

      {/* Dots bubble */}
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5 h-5">
          <span className="w-2 h-2 rounded-full bg-blue-400 dot-1" />
          <span className="w-2 h-2 rounded-full bg-blue-400 dot-2" />
          <span className="w-2 h-2 rounded-full bg-blue-400 dot-3" />
        </div>
      </div>
    </div>
  );
}

// ── Main ChatWindow component ─────────────────────────────────────────────────
export default function ChatWindow({ messages, isLoading }) {
  // Ref to the invisible div at the bottom of the list — we scroll to it
  const bottomRef = useRef(null);

  // Scroll to bottom every time messages array changes or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    // flex-1 makes this div take all available vertical space between header and input
    <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4 bg-slate-50">

      {/* Render each message */}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {/* Show typing indicator while waiting for bot response */}
      {isLoading && <TypingIndicator />}

      {/* Invisible scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
