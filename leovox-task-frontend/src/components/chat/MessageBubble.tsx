"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

function formatTime(ts?: string): string {
  if (!ts) {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  }
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

// Simple markdown-like rendering: bold, italic, code, lists
function renderContent(content: string) {
  // Split by code blocks first
  const parts = content.split(/```([\s\S]*?)```/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      // Code block
      return (
        <pre
          key={i}
          className="bg-background/50 border border-border rounded-[8px] p-3 my-2 text-xs font-mono overflow-x-auto"
        >
          <code>{part.trim()}</code>
        </pre>
      );
    }
    // Regular text with inline formatting
    return (
      <span key={i}>
        {part.split("\n").map((line, j) => (
          <React.Fragment key={j}>
            {j > 0 && <br />}
            {renderInline(line)}
          </React.Fragment>
        ))}
      </span>
    );
  });
}

function renderInline(text: string) {
  // Bold
  let result = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic
  result = result.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Inline code
  result = result.replace(/`(.*?)`/g, '<code class="bg-background/50 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20">
          <Image
            src="/assets/IsotipoLeovoxverde.svg"
            alt="Leovox IA"
            width={20}
            height={20}
          />
        </div>
      )}

      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Bubble */}
        <div
          className={`px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-primary/[0.15] border border-primary/20 rounded-[16px] rounded-br-[4px] text-text-primary"
              : "glass rounded-[16px] rounded-bl-[4px] text-text-primary"
          }`}
        >
          {renderContent(content)}
        </div>

        {/* Timestamp */}
        <p
          className={`text-[0.6875rem] text-text-tertiary mt-1 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {formatTime(timestamp)}
        </p>
      </div>
    </motion.div>
  );
}
