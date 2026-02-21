"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { tasksApi } from "@/lib/api";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestionChips } from "./SuggestionChips";
import { ChatInput } from "./ChatInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  onTaskCreated?: () => void;
}

export function ChatInterface({ onTaskCreated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await tasksApi.parseWithAI(messageText.trim());
      const data = response.data;

      let aiContent = "";
      if (data.task) {
        const task = data.task;
        aiContent = `Tarefa criada com sucesso!\n\n**Título:** ${task.title}`;
        if (task.description) aiContent += `\n**Descrição:** ${task.description}`;
        if (task.due_date)
          aiContent += `\n**Vencimento:** ${new Date(task.due_date).toLocaleString("pt-BR")}`;
        if (task.priority) aiContent += `\n**Prioridade:** ${task.priority}`;
        if (task.category) aiContent += `\n**Categoria:** ${task.category}`;
        if (task.tags && task.tags.length > 0)
          aiContent += `\n**Tags:** ${task.tags.join(", ")}`;
      } else if (data.parsed) {
        const parsed = data.parsed;
        aiContent = `Tarefa criada com sucesso!\n\n**Título:** ${data.task?.title || parsed.title || messageText}`;
        if (parsed.description) aiContent += `\n**Descrição:** ${parsed.description}`;
        if (parsed.due_date)
          aiContent += `\n**Vencimento:** ${new Date(parsed.due_date).toLocaleString("pt-BR")}`;
        if (parsed.priority) aiContent += `\n**Prioridade:** ${parsed.priority}`;
        if (parsed.category) aiContent += `\n**Categoria:** ${parsed.category}`;
        if (parsed.tags && parsed.tags.length > 0)
          aiContent += `\n**Tags:** ${parsed.tags.join(", ")}`;
      } else if (data.message) {
        aiContent = data.message;
      } else {
        aiContent = "Tarefa processada com sucesso! Verifique a lista de tarefas.";
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: aiContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      onTaskCreated?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content:
          err?.response?.data?.message ||
          "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = (text: string) => {
    sendMessage(text);
  };

  const handleNewConversation = () => {
    setMessages([]);
    setInput("");
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <SuggestionChips onSelect={handleSuggestionSelect} />
        ) : (
          <div className="px-4 sm:px-6 py-6 space-y-4 max-w-3xl mx-auto">
            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
            </AnimatePresence>

            {isLoading && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={() => sendMessage()}
        isLoading={isLoading}
      />
    </div>
  );
}
