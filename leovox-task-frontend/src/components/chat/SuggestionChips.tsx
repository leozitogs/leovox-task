"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarPlus,
  Target,
  BarChart3,
  Clock,
  Tags,
  Lightbulb,
} from "lucide-react";

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
}

const suggestions = [
  {
    icon: CalendarPlus,
    text: "Criar tarefa para amanhã às 14h",
  },
  {
    icon: Target,
    text: "Priorizar minhas tarefas da semana",
  },
  {
    icon: BarChart3,
    text: "Resumo das minhas tarefas pendentes",
  },
  {
    icon: Clock,
    text: "O que vence hoje?",
  },
  {
    icon: Tags,
    text: "Organizar tarefas por categoria",
  },
  {
    icon: Lightbulb,
    text: "Sugerir como organizar meu dia",
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      {/* Logo with glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 relative"
      >
        <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full animate-pulse-glow" />
        <div className="relative w-16 h-16 flex items-center justify-center">
          <Image
            src="/assets/IsotipoLeovoxverde.svg"
            alt="Leovox IA"
            width={64}
            height={64}
            className="relative z-10"
          />
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-[2rem] font-extrabold font-heading text-text-primary mb-2 text-center"
      >
        Como posso ajudar?
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-base text-text-secondary mb-10 text-center max-w-md"
      >
        Descreva suas tarefas naturalmente e eu organizo tudo para você.
      </motion.p>

      {/* Chips Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl"
      >
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <motion.button
              key={index}
              variants={fadeUp}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(suggestion.text)}
              className="glass-card rounded-[12px] p-4 flex items-center gap-3 text-left transition-all duration-200 cursor-pointer"
            >
              <Icon className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.5} />
              <span className="text-sm text-text-secondary font-medium">
                {suggestion.text}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
