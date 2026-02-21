"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export function ChatInput({ value, onChange, onSend, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const maxHeight = 5 * 24; // 5 lines * ~24px
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSend();
      }
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <div className="glass border-t border-border px-4 sm:px-6 py-4">
      <div className="relative max-w-3xl mx-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Descreva sua tarefa em linguagem natural..."
          disabled={isLoading}
          rows={1}
          className="w-full resize-none rounded-[12px] bg-surface border border-border py-3.5 pl-4 pr-12 text-base text-text-primary placeholder:text-text-tertiary font-sans focus:outline-none focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(0,255,65,0.08),0_0_20px_rgba(0,255,65,0.05)] hover:border-border-hover transition-all duration-300 disabled:opacity-50"
          style={{ maxHeight: "120px" }}
        />

        {/* Send button */}
        <motion.button
          whileHover={hasText ? { scale: 1.05 } : {}}
          whileTap={hasText ? { scale: 0.95 } : {}}
          onClick={() => {
            if (hasText && !isLoading) onSend();
          }}
          disabled={!hasText || isLoading}
          className={cn(
            "absolute right-3 bottom-3 w-9 h-9 rounded-[8px] flex items-center justify-center transition-all duration-200",
            hasText
              ? "bg-primary text-black hover:bg-primary-hover cursor-pointer"
              : "text-text-tertiary cursor-default"
          )}
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" strokeWidth={1.5} />
          )}
        </motion.button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[0.6875rem] text-text-tertiary mt-2.5">
        A IA pode cometer erros. Verifique informações importantes.
      </p>
    </div>
  );
}
