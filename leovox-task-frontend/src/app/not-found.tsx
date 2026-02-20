"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center relative z-10"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8"
        >
          <span className="text-[120px] sm:text-[160px] font-bold font-heading text-primary/20 leading-none block text-glow-strong">
            404
          </span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-4 tracking-tight">
          Página não encontrada
        </h1>
        <p className="text-text-secondary text-base max-w-md mx-auto mb-10 leading-relaxed">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button size="lg">
              <Home className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Ir para o início
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
              Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
