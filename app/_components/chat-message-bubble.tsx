"use client";

import Link from "next/link";
import React from "react";
import { Reference } from "../_lib/ai/types";
import { ui, t } from "../_lib/locale";
import type { Locale } from "../_lib/locale";

interface ChatMessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  references?: Reference[];
  locale?: Locale;
}

export function ChatMessageBubble({ role, content, references, locale = "en" }: ChatMessageBubbleProps) {
  const isUser = role === "user";

  // Safe and simple markdown parser (zero dependencies)
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");

    return lines.map((line, lineIndex) => {
      let trimmed = line.trim();

      // Check if it's a list item
      const isListItem = trimmed.startsWith("- ") || trimmed.startsWith("* ");
      if (isListItem) {
        trimmed = trimmed.substring(2);
      }

      // Parse bold (**text**) and links ([text](href))
      const parts = trimmed.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
      const elements = parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index} className="font-semibold text-[color:var(--ink)]">{part.slice(2, -2)}</strong>;
        }

        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          const [, label, href] = linkMatch;
          const isExternal = href.startsWith("http");
          if (isExternal) {
            return (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--accent)] underline hover:text-[color:var(--ink)]"
              >
                {label}
              </a>
            );
          } else {
            return (
              <Link
                key={index}
                href={href}
                className="text-[color:var(--accent)] underline hover:text-[color:var(--ink)]"
              >
                {label}
              </Link>
            );
          }
        }

        return part;
      });

      if (isListItem) {
        return (
          <li key={lineIndex} className="ml-4 list-disc pl-1 text-sm leading-6">
            {elements}
          </li>
        );
      }

      if (trimmed === "") {
        return <div key={lineIndex} className="h-2" />;
      }

      return (
        <p key={lineIndex} className="text-sm leading-6">
          {elements}
        </p>
      );
    });
  };

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded px-4 py-3 shadow-sm ${
          isUser
            ? "bg-[color:var(--surface-muted)] text-[color:var(--ink)] border border-[color:var(--line)]"
            : "bg-[color:var(--surface)] text-[color:var(--ink)] border border-[color:var(--line-strong)]"
        }`}
      >
        <span
          className={`font-mono text-[10px] uppercase tracking-wider block mb-1.5 ${
            isUser ? "text-[color:var(--muted)]" : "text-[color:var(--accent)]"
          }`}
        >
          {isUser ? t(ui.chat.you, locale) : t(ui.chat.assistant, locale)}
        </span>

        <div className="space-y-1.5">{renderFormattedText(content)}</div>

        {references && references.length > 0 && (
          <div className="mt-3 pt-2 border-t border-[color:var(--line)]">
            <span className="font-mono text-[9px] uppercase text-[color:var(--muted)] block mb-1">
              {t(ui.chat.relatedLinks, locale)}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {references.map((ref, idx) => (
                <Link
                  key={idx}
                  href={ref.href}
                  className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded border border-[color:var(--line)] bg-[color:var(--background)] text-[color:var(--accent)] hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] transition-all"
                >
                  {ref.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
