"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ChatPage() {
  const [key, setKey] = React.useState(0);

  const handleNewConversation = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-[1400px] mx-auto -mt-2">
      {/* ── Chat Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass border-b border-border px-6 py-3.5 flex items-center justify-between rounded-t-[12px]"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20">
            <Image
              src="/assets/IsotipoLeovoxverde.svg"
              alt="Leovox IA"
              width={22}
              height={22}
            />
          </div>
          <div>
            <h2 className="text-[1.1rem] font-bold font-heading text-text-primary leading-tight">
              Leovox IA
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-text-secondary">Online</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleNewConversation}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5 rounded-[8px] hover:bg-surface-hover"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Nova conversa</span>
        </button>
      </motion.div>

      {/* ── Chat Interface ── */}
      <div className="flex-1 glass-card rounded-b-[12px] overflow-hidden border-t-0">
        <ChatInterface key={key} />
      </div>
    </div>
  );
}
