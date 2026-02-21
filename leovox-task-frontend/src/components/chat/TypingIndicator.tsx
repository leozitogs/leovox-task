"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 max-w-[80%]">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10 border border-primary/20">
        <Image
          src="/assets/IsotipoLeovoxverde.svg"
          alt="Leovox IA"
          width={20}
          height={20}
        />
      </div>

      {/* Dots */}
      <div className="glass rounded-[16px] rounded-bl-[4px] px-5 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
