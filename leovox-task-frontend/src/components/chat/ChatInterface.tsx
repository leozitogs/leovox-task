"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { tasksApi } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  taskCreated?: boolean;
}

export function ChatInterface({ onTaskCreated }: { onTaskCreated?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        'Olá! Sou o assistente da Leovox Task. Descreva uma tarefa em linguagem natural e eu vou organizá-la para você. Por exemplo: "Reunião com o time de design amanhã às 14h, prioridade alta"',
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await tasksApi.parseWithAI(userMessage.content);
      const { task, parsed } = response.data;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Tarefa criada com sucesso!\n\n**${task.title}**${parsed.description ? `\n${parsed.description}` : ""}${parsed.due_date ? `\nVencimento: ${new Date(parsed.due_date).toLocaleString("pt-BR")}` : ""}${parsed.priority ? `\nPrioridade: ${parsed.priority}` : ""}${parsed.category ? `\nCategoria: ${parsed.category}` : ""}${parsed.tags?.length ? `\nTags: ${parsed.tags.join(", ")}` : ""}`,
        taskCreated: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      onTaskCreated?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Desculpe, não consegui processar sua solicitação. ${err?.response?.data?.message || "Tente novamente com mais detalhes."}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 pb-28">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex gap-3 max-w-4xl",
                message.role === "user" ? "justify-end ml-auto" : "justify-start"
              )}
            >
              {/* AI Avatar */}
              {message.role === "assistant" && (
                <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" strokeWidth={1.5} />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={cn(
                  "max-w-[75%] px-5 py-3.5 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-primary/[0.08] text-text border border-primary/15 rounded-2xl rounded-tr-md"
                    : "glass-elevated rounded-2xl rounded-tl-md text-gray-300",
                  message.taskCreated && "border-success/20"
                )}
              >
                {message.taskCreated && (
                  <div className="flex items-center gap-1.5 text-success text-xs mb-2.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Tarefa criada com sucesso</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>

              {/* User Avatar */}
              {message.role === "user" && (
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" strokeWidth={1.5} />
            </div>
            <div className="glass-elevated rounded-2xl rounded-tl-md px-5 py-3.5">
              <div className="flex items-center gap-2.5 text-text-secondary text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-primary" strokeWidth={1.5} />
                <span>Processando...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="glass-panel rounded-2xl p-3 max-w-4xl mx-auto noise-overlay relative">
          <form onSubmit={handleSubmit} className="flex gap-3 relative z-10">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Descreva sua tarefa em linguagem natural..."
              disabled={isLoading}
              className="flex-1 h-11 bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-xl px-4 text-sm text-text placeholder:text-text-muted/50 transition-all duration-300 focus:outline-none focus:bg-white/[0.06] focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(0,255,65,0.08)] disabled:opacity-40"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cn(
                "h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0",
                input.trim() && !isLoading
                  ? "bg-gradient-to-r from-primary to-primary-deep text-background shadow-[0_0_15px_rgba(0,255,65,0.2)]"
                  : "bg-white/[0.05] text-text-muted border border-white/[0.08]"
              )}
            >
              <Send className="w-4 h-4" strokeWidth={1.5} />
            </motion.button>
          </form>
          <p className="text-[11px] text-text-muted mt-2.5 text-center relative z-10">
            Powered by Groq AI — Descreva tarefas naturalmente e a IA organiza para você.
          </p>
        </div>
      </div>
    </div>
  );
}
