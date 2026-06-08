"use client";

import React, { useEffect, useState } from "react";
import { ChatPanel } from "./chat-panel";
import { useLocale } from "../_lib/locale-context";
import { ui, t } from "../_lib/locale";

const CHAT_POPOVER_STORAGE_KEY = "portfolio_chat_popover_seen";

export function ChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const { locale } = useLocale();

  const markPopoverSeen = () => {
    setShowPopover(false);
    try {
      localStorage.setItem(CHAT_POPOVER_STORAGE_KEY, "true");
    } catch {
      // Ignore storage failures so the chat button remains usable.
    }
  };

  const toggleChat = () => {
    markPopoverSeen();
    setIsOpen((open) => !open);
  };

  const openChat = () => {
    markPopoverSeen();
    setIsOpen(true);
  };

  // Listen to Escape key to close the chat dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      if (localStorage.getItem(CHAT_POPOVER_STORAGE_KEY) !== "true") {
        timer = setTimeout(() => {
          setShowPopover(true);
          localStorage.setItem(CHAT_POPOVER_STORAGE_KEY, "true");
        }, 900);
      }
    } catch {
      timer = setTimeout(() => setShowPopover(true), 900);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {showPopover && !isOpen && (
        <div
          className="chat-popover fixed bottom-[5.25rem] right-6 z-40 w-[min(18rem,calc(100vw-2rem))] border border-[color:var(--line)] bg-[color:var(--surface)] p-3 text-sm text-[color:var(--ink)] shadow-lg animate-fade-up animate-duration-200 animate-ease-out"
          role="status"
          aria-live="polite"
        >
          <button
            type="button"
            onClick={markPopoverSeen}
            className="absolute right-2 top-2 p-1 text-[color:var(--muted)] hover:text-[color:var(--ink)]"
            aria-label={t(ui.chat.popoverDismiss, locale)}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="pr-6 font-semibold">{t(ui.chat.popoverTitle, locale)}</p>
          <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
            {t(ui.chat.popoverDescription, locale)}
          </p>
          <button
            type="button"
            onClick={openChat}
            className="mt-3 inline-flex min-h-9 items-center justify-center border border-[color:var(--line-strong)] px-3 text-xs font-semibold text-[color:var(--ink)] transition-colors hover:bg-[color:var(--surface-muted)]"
          >
            {t(ui.chat.popoverAction, locale)}
          </button>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        id="chat-launcher-btn"
        onClick={toggleChat}
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
