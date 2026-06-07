"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChatMessageBubble } from "./chat-message-bubble";
import { Message, Reference } from "../_lib/ai/types";
import { ui, t } from "../_lib/locale";
import type { Locale } from "../_lib/locale";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export function ChatPanel({ isOpen, onClose, locale }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [references, setReferences] = useState<Record<number, Reference[]>>({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize session and welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedSessionKey = localStorage.getItem("portfolio_chat_session_key");
      if (savedSessionKey) {
        setSessionId(savedSessionKey);
      }
      setMessages([{ role: "system", content: t(ui.chat.welcome, locale) }]);
    }, 0);
    return () => clearTimeout(timer);
  }, [locale]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);



  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    setInput("");
    setErrorMsg(null);
    setIsLoading(true);

    const newMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(newMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId, locale }),
      });

      const body = await response.json();

      if (!response.ok || !body.success) {
        throw new Error(body?.error?.message || t(ui.chat.queryError, locale));
      }

      const { sessionId: returnedSessionId, answer, references: returnedRefs } = body.data;

      if (returnedSessionId) {
        localStorage.setItem("portfolio_chat_session_key", returnedSessionId);
        setSessionId(returnedSessionId);
      }

      const updatedMessages = [
        ...newMessages,
        { role: "assistant" as const, content: answer },
      ];
      setMessages(updatedMessages);

      if (returnedRefs && returnedRefs.length > 0) {
        setReferences((prev) => ({
          ...prev,
          [updatedMessages.length - 1]: returnedRefs,
        }));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t(ui.chat.fallbackError, locale);
      console.error(err);
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const prompts = ui.chat.suggestedPrompts[locale] ?? ui.chat.suggestedPrompts.en;

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-[color:var(--line)] bg-[color:var(--surface)]/95 backdrop-blur-md shadow-2xl transition-all md:max-w-md ${
        isOpen
          ? "translate-x-0 opacity-100 pointer-events-auto duration-[240ms] ease-[var(--ease-out)]"
          : "translate-x-full opacity-0 pointer-events-none duration-[180ms] ease-[var(--ease-in)]"
      } max-sm:${
        isOpen
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={t(ui.chat.panelTitle, locale)}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[color:var(--line)] px-4 py-3 bg-[color:var(--surface-muted)]">
        <div>
          <h2 className="font-semibold text-sm text-[color:var(--ink)]">
            {t(ui.chat.panelTitle, locale)}
          </h2>
          <span className="font-mono text-[9px] text-[color:var(--muted)]">
            {t(ui.chat.sourceLabel, locale)}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-[color:var(--muted)] hover:bg-[color:var(--line)] hover:text-[color:var(--ink)] transition-colors"
          aria-label={t(ui.chat.closeChat, locale)}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Message History */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessageBubble
            key={index}
            role={msg.role}
            content={msg.content}
            references={references[index]}
            locale={locale}
          />
        ))}

        {isLoading && (
          <div className="flex justify-start items-center space-x-2 text-[color:var(--muted)]">
            <div className="flex space-x-1 pl-4">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--accent)] [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--accent)] [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--accent)]" />
            </div>
            <span className="text-xs font-mono">{t(ui.chat.loading, locale)}</span>
          </div>
        )}

        {errorMsg && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-xs text-red-600">
            <p className="font-semibold mb-1">{t(ui.chat.errorTitle, locale)}</p>
            <p>{errorMsg}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-[color:var(--surface)]">
          <p className="font-mono text-[9px] uppercase tracking-wider text-[color:var(--muted)] mb-2">
            {t(ui.chat.suggestedLabel, locale)}
          </p>
          <div className="flex flex-col gap-1.5">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-left text-xs px-3 py-2 rounded border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--muted)] hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] hover:bg-[color:var(--surface-muted)] transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <footer className="border-t border-[color:var(--line)] bg-[color:var(--surface)] p-3">
        <div className="relative flex items-end rounded border border-[color:var(--line)] bg-[color:var(--surface)] focus-within:border-[color:var(--line-strong)] transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 1500))}
            onKeyDown={handleKeyDown}
            placeholder={t(ui.chat.placeholder, locale)}
            className="flex-1 resize-none bg-transparent px-3 py-2 text-xs text-[color:var(--ink)] focus:outline-none min-h-[44px] max-h-[120px]"
            rows={1}
            maxLength={1500}
            disabled={isLoading}
          />
          <div className="flex flex-col items-center justify-end pb-2 pr-2">
            <span className="font-mono text-[9px] text-[color:var(--muted)] mb-1">
              {input.length}/1500
            </span>
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="rounded bg-[color:var(--ink)] p-1.5 text-[color:var(--surface)] hover:bg-[color:var(--accent)] disabled:opacity-30 disabled:hover:bg-[color:var(--ink)] transition-colors"
              aria-label={locale === "th" ? "ส่งคำถาม" : "Send query"}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
