"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || "Credenciais inválidas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "flex h-12 w-full rounded-[10px] bg-surface border border-border pl-11 pr-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-300 font-sans focus:outline-none focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(0,255,65,0.08),0_0_20px_rgba(0,255,65,0.05)] hover:border-border-hover";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[60%] relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-[150px]" />

        {/* Animated organic shapes */}
        <div className="absolute top-[20%] left-[15%] w-64 h-64 bg-primary/[0.03] rounded-full blur-[80px] animate-float" />
        <div
          className="absolute bottom-[25%] right-[20%] w-48 h-48 bg-primary/[0.04] rounded-full blur-[60px] animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 text-center px-12 max-w-lg">
          <Image
            src="/assets/LogoLeovoxverde.svg"
            alt="Leovox Logo"
            width={280}
            height={200}
            className="mx-auto mb-8 drop-shadow-[0_0_30px_rgba(0,255,65,0.15)]"
          />
          <p className="text-xl text-text-secondary font-heading font-bold leading-relaxed">
            Organize suas tarefas com{" "}
            <span className="text-primary text-glow">linguagem natural</span>
          </p>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 bg-background-secondary lg:bg-transparent" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Mobile logo */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-10 lg:hidden">
            <Image src="/assets/IsotipoLeovoxverde.svg" alt="Leovox" width={40} height={40} />
            <span className="text-xl font-bold font-heading text-primary text-glow">Leovox Task</span>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h1 className="text-[2rem] font-extrabold font-heading mb-2 text-text-primary">
              Bem-vindo de volta
            </h1>
            <p className="text-text-secondary mb-8">Entre na sua conta para continuar</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 rounded-[10px] bg-danger/10 border border-danger/20 text-danger text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <motion.div variants={fadeUp} className="space-y-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.05em]">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" strokeWidth={1.5} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  className={inputClasses}
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp} className="space-y-2">
              <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.05em]">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" strokeWidth={1.5} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  autoComplete="current-password"
                  className={`${inputClasses} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Button type="submit" className="w-full h-12 text-sm" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" strokeWidth={1.5} />
                    Entrar
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.p variants={fadeUp} className="text-center text-sm text-text-secondary mt-8">
            Não tem conta?{" "}
            <Link href="/register" className="text-primary hover:text-primary-hover transition-colors font-medium">
              Criar conta
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
