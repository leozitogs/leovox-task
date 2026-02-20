"use client";

import React, { useEffect, useRef } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useRouter } from "next/navigation";
import gsap from "gsap";

export default function ChatPage() {
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }
      );
    }
  }, []);

  const handleTaskCreated = () => {
    router.refresh();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div ref={headerRef} className="p-6 lg:p-8 xl:p-10 pb-0 opacity-0">
        <h1 className="text-3xl lg:text-4xl font-bold font-heading tracking-tight">
          Chat <span className="text-primary text-glow">IA</span>
        </h1>
        <p className="text-text-secondary mt-2 text-sm lg:text-base">
          Descreva suas tarefas em linguagem natural e a IA organiza para você.
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden mx-6 lg:mx-8 xl:mx-10 my-5 glass-card rounded-2xl relative">
        <ChatInterface onTaskCreated={handleTaskCreated} />
      </div>
    </div>
  );
}
