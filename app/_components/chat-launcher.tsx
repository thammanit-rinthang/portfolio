"use client";

import React, { useEffect, useState } from "react";
import { ChatPanel } from "./chat-panel";
import { useLocale } from "../_lib/locale-context";
import { ui, t } from "../_lib/locale";

export function ChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale } = useLocale();

  // Listen to Escape key to close the chat dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating trigger button */}
      <button
        id="chat-launcher-btn"
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--ink)] text-[color:var(--surface)] shadow-lg hover:animate-jump hover:bg-[color:var(--accent)] active:scale-[0.97] transition-all duration-150"
        aria-label={isOpen ? t(ui.chat.closeChat, locale) : t(ui.chat.openChat, locale)}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Slide-out Chat Panel */}
      <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} locale={locale} />
    </>
  );
}

export default ChatLauncher;
