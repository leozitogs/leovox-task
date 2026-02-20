"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Brain, ListChecks, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import gsap from "gsap";

export default function HomePage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Logo float in
      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: 60, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }
      );

      // Heading words stagger
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll(".word");
        tl.fromTo(
          words,
          { opacity: 0, y: 40, rotateX: -15 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.08 },
          "-=0.6"
        );
      }

      // Subtext
      tl.fromTo(
        subtextRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      );

      // CTA
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );

      // Feature cards stagger
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".feature-card");
        tl.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12 },
          "-=0.3"
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Brain,
      title: "IA Integrada",
      description:
        "Descreva tarefas em linguagem natural e a IA extrai título, data, prioridade e categoria automaticamente.",
    },
    {
      icon: ListChecks,
      title: "Organização Inteligente",
      description:
        "Categorize, priorize e filtre suas tarefas com facilidade. Dashboard completo com visão geral.",
    },
    {
      icon: Clock,
      title: "Lembretes Automáticos",
      description:
        "Receba notificações por e-mail antes do vencimento das tarefas. Nunca mais esqueça um prazo.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none" />
      <div className="fixed inset-0 bg-radial-glow pointer-events-none" />

      {/* Floating orbs */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: "3s" }} />

      {/* Header */}
      <header className="relative z-10 glass border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/IsotipoLeovoxverde.svg"
              alt="Leovox"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-lg font-bold font-heading text-primary text-glow">
              Leovox Task
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Começar Grátis
                <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main ref={heroRef} className="relative z-10 flex-1 flex items-center justify-center px-6 lg:px-8 pt-16 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo */}
          <div ref={logoRef} className="flex justify-center mb-10 opacity-0">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full" />
              <Image
                src="/assets/LogoLeovoxverde.svg"
                alt="Leovox Logo"
                width={240}
                height={180}
                priority
                className="relative z-10 drop-shadow-[0_0_30px_rgba(0,255,65,0.2)]"
              />
            </div>
          </div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading mb-6 leading-tight"
          >
            <span className="word inline-block">Organize&nbsp;</span>
            <span className="word inline-block">suas&nbsp;</span>
            <span className="word inline-block">tarefas&nbsp;</span>
            <span className="word inline-block">com&nbsp;</span>
            <br className="hidden sm:block" />
            <span className="word inline-block text-primary text-glow-strong">linguagem&nbsp;</span>
            <span className="word inline-block text-primary text-glow-strong">natural</span>
          </h1>

          {/* Subtext */}
          <p
            ref={subtextRef}
            className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed opacity-0"
          >
            Diga o que precisa fazer e a IA da Leovox Task organiza tudo para você.
            Sem formulários complicados, sem cliques desnecessários.
            Apenas produtividade fluida.
          </p>

          {/* CTA */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 opacity-0">
            <Link href="/register">
              <Button size="lg" className="text-base px-10 h-13">
                <Sparkles className="w-5 h-5 mr-2" strokeWidth={1.5} />
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" strokeWidth={1.5} />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-base px-8 h-13">
                Já tenho conta
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="feature-card glass-card rounded-2xl p-6 text-center gradient-border noise-overlay relative"
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 mx-auto">
                      <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold font-heading mb-3 text-text">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-sm text-text-muted">
          <p>&copy; 2026 Leovox Task — Desenvolvido por Leonardo Gonçalves Sobral</p>
        </div>
      </footer>
    </div>
  );
}
