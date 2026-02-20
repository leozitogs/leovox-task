"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import gsap from "gsap";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "expo.out" }
      );
    }
  }, []);

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.05] rounded-full blur-[150px] pointer-events-none" />

      <div ref={formRef} className="w-full max-w-md relative z-10 opacity-0">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
          Voltar ao início
        </Link>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <Image
            src="/assets/IsotipoLeovoxverde.svg"
            alt="Leovox"
            width={44}
            height={44}
            className="rounded-xl"
          />
          <span className="text-2xl font-bold font-heading text-primary text-glow">
            Leovox Task
          </span>
        </div>

        {/* Glass Panel */}
        <div className="glass-panel rounded-2xl p-8 noise-overlay relative">
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold font-heading mb-2">Bem-vindo de volta</h1>
              <p className="text-sm text-text-secondary">Entre na sua conta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm backdrop-blur-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  className="flex h-12 w-full rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] px-4 py-3 text-sm text-text placeholder:text-text-muted/50 transition-all duration-300 focus:outline-none focus:bg-white/[0.06] focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(0,255,65,0.08),0_0_20px_rgba(0,255,65,0.05)] hover:border-white/[0.15]"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    required
                    autoComplete="current-password"
                    className="flex h-12 w-full rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] px-4 pr-12 py-3 text-sm text-text placeholder:text-text-muted/50 transition-all duration-300 focus:outline-none focus:bg-white/[0.06] focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(0,255,65,0.08),0_0_20px_rgba(0,255,65,0.05)] hover:border-white/[0.15]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-sm" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" strokeWidth={1.5} />
                    Entrar
                  </span>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-8">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:text-primary-hover transition-colors font-medium">
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-8">
          &copy; 2026 Leovox Task — Leonardo Gonçalves Sobral
        </p>
      </div>
    </div>
  );
}
