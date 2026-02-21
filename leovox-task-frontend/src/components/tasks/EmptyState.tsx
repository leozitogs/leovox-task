"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckSquare, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateTask: () => void;
}

export function EmptyState({ onCreateTask }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-[16px] bg-surface border border-border flex items-center justify-center mb-6">
        <CheckSquare className="w-9 h-9 text-text-tertiary opacity-50" strokeWidth={1.5} />
      </div>
      <h3 className="text-[1.5rem] font-bold text-text-primary mb-2 font-heading">
        Nenhuma tarefa por aqui
      </h3>
      <p className="text-sm text-text-secondary max-w-sm leading-relaxed mb-6">
        Crie sua primeira tarefa ou use o Chat IA para organizar seu dia.
      </p>
      <div className="flex items-center gap-3">
        <Button onClick={onCreateTask}>
          <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
          Criar Tarefa
        </Button>
        <Link href="/chat">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Ir para Chat IA
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
