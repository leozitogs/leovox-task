"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  Bell,
  MessageSquare,
  Brain,
  CheckCircle,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/* ── Animation Variants ── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

/* ── CountUp Component ── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ── Section Wrapper with inView ── */
function AnimatedSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={controls}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) router.push("/dashboard");
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "IA Integrada",
      description:
        "Descreva tarefas em linguagem natural e a IA extrai título, data, prioridade e categoria automaticamente.",
    },
    {
      icon: LayoutDashboard,
      title: "Organização Inteligente",
      description:
        "Dashboard completo com métricas em tempo real, gráficos e visão geral de toda sua produtividade.",
    },
    {
      icon: Bell,
      title: "Lembretes Automáticos",
      description:
        "Receba notificações por e-mail antes do vencimento. Nunca mais perca um prazo importante.",
    },
    {
      icon: MessageSquare,
      title: "Chat Natural",
      description:
        "Converse com a IA como se fosse um assistente pessoal. Crie e organize tarefas em segundos.",
    },
  ];

  const steps = [
    {
      icon: MessageSquare,
      title: "Descreva",
      description: "Digite sua tarefa em linguagem natural no chat",
    },
    {
      icon: Brain,
      title: "IA Processa",
      description: "A IA extrai título, data, prioridade e categoria",
    },
    {
      icon: CheckCircle,
      title: "Organizado",
      description: "Sua tarefa aparece organizada no dashboard",
    },
  ];

  const metrics = [
    { value: 500, suffix: "+", label: "Tarefas organizadas" },
    { value: 99.9, suffix: "%", label: "Uptime garantido" },
    { value: 2, suffix: "s", label: "Tempo de resposta da IA" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none" />
      <div className="fixed inset-0 bg-radial-glow pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none animate-float" />
      <div
        className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none animate-float"
        style={{ animationDelay: "3s" }}
      />

      {/* ═══ NAVBAR ═══ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass border-b border-border"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/IsotipoLeovoxverde.svg"
              alt="Leovox"
              width={32}
              height={32}
              className="flex-shrink-0"
            />
            <Image
              src="/assets/TipografiaLeovoxverde.svg"
              alt="Leovox"
              width={90}
              height={20}
              className="flex-shrink-0"
            />
            <span className="text-sm font-medium text-text-secondary ml-0.5">Task</span>
          </div>

          {/* Center Links (desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#funcionalidades"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#como-funciona"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Como Funciona
            </a>
            <a
              href="#depoimentos"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Depoimentos
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="hidden sm:inline-flex">
                Começar Grátis
                <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative z-10 min-h-screen flex items-center justify-center px-6 lg:px-8 pt-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2.5rem,7vw,5rem)] font-black font-heading leading-[1.05] tracking-[-0.03em] mb-6"
          >
            Organize suas tarefas com{" "}
            <span className="text-primary text-glow-strong">linguagem natural</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-[1.125rem] text-text-secondary max-w-[560px] mx-auto mb-10 leading-[1.6] font-sans font-normal"
          >
            Diga o que precisa fazer e a IA da Leovox Task organiza tudo para você. Sem
            formulários. Sem cliques desnecessários. Apenas produtividade fluida.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/register">
              <Button size="lg" className="text-base px-8 h-[52px] glow-primary-sm">
                Começar Grátis
                <ArrowRight className="w-5 h-5 ml-2" strokeWidth={1.5} />
              </Button>
            </Link>
            <a href="#como-funciona">
              <Button variant="outline" size="lg" className="text-base px-8 h-[52px]">
                Ver demonstração
              </Button>
            </a>
          </motion.div>

          {/* Abstract visual element */}
          <motion.div
            variants={fadeIn}
            className="relative mx-auto max-w-3xl h-[200px] rounded-[16px] overflow-hidden glass-card"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
            <div className="absolute inset-0 bg-grid-pattern opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-[60px]" />
            <div className="absolute inset-0 flex items-center justify-center gap-4 text-text-tertiary">
              <div className="flex items-center gap-3 glass rounded-[12px] px-5 py-3">
                <MessageSquare className="w-5 h-5 text-primary" strokeWidth={1.5} />
                <span className="text-sm text-text-secondary font-medium">
                  &quot;Reunião amanhã às 14h, prioridade alta&quot;
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ FUNCIONALIDADES ═══ */}
      <AnimatedSection
        id="funcionalidades"
        className="relative z-10 py-24 px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="text-[2.5rem] font-extrabold font-heading tracking-[-0.02em] mb-4">
            Tudo que você precisa para{" "}
            <span className="text-primary text-glow">produtividade máxima</span>
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto text-base">
            Ferramentas poderosas para organizar seu dia com inteligência artificial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-[12px] p-6 gradient-border noise-overlay relative"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-[12px] bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[1.25rem] font-bold font-heading mb-3 text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-[0.9375rem] text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* ═══ COMO FUNCIONA ═══ */}
      <AnimatedSection
        id="como-funciona"
        className="relative z-10 py-24 px-6 lg:px-8 max-w-5xl mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="text-[2.5rem] font-extrabold font-heading tracking-[-0.02em] mb-4">
            Como <span className="text-primary text-glow">funciona</span>
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto text-base">
            Três passos simples para transformar sua produtividade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[60px] left-[16.67%] right-[16.67%] h-[2px]">
            <motion.div
              variants={{
                hidden: { scaleX: 0 },
                visible: {
                  scaleX: 1,
                  transition: { duration: 1, delay: 0.5, ease: "easeInOut" },
                },
              }}
              className="h-full bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 origin-left"
            />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                className="text-center relative"
              >
                <div className="relative inline-block mb-6">
                  <span className="absolute -top-3 -left-3 text-[4rem] font-black font-heading text-primary/[0.08] leading-none select-none">
                    {index + 1}
                  </span>
                  <div className="w-16 h-16 rounded-[16px] bg-primary/10 border border-primary/20 flex items-center justify-center relative z-10">
                    <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-xl font-bold font-heading mb-2 text-text-primary">
                  {step.title}
                </h3>
                <p className="text-[0.9375rem] text-text-secondary leading-relaxed max-w-[280px] mx-auto">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </AnimatedSection>

      {/* ═══ DEPOIMENTOS / MÉTRICAS ═══ */}
      <AnimatedSection
        id="depoimentos"
        className="relative z-10 py-24 px-6 lg:px-8 max-w-5xl mx-auto"
      >
        <motion.div variants={fadeUp} className="text-center mb-16">
          <h2 className="text-[2.5rem] font-extrabold font-heading tracking-[-0.02em] mb-4">
            Números que <span className="text-primary text-glow">impressionam</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="glass-card rounded-[12px] p-8 text-center gradient-border noise-overlay relative"
            >
              <div className="relative z-10">
                <p className="text-[3rem] font-black font-heading text-primary text-glow leading-none mb-3">
                  <CountUp target={metric.value} suffix={metric.suffix} />
                </p>
                <p className="text-text-secondary font-medium text-[0.9375rem]">
                  {metric.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ═══ CTA FINAL ═══ */}
      <AnimatedSection className="relative z-10 py-24 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-primary/[0.03] rounded-[24px] blur-[60px]" />
          <motion.div
            variants={fadeUp}
            className="glass-card rounded-[16px] p-12 relative noise-overlay"
          >
            <div className="relative z-10">
              <h2 className="text-[2rem] font-extrabold font-heading tracking-[-0.02em] mb-4">
                Pronto para transformar sua produtividade?
              </h2>
              <p className="text-text-secondary mb-8 text-base">
                Comece gratuitamente. Sem cartão de crédito.
              </p>
              <Link href="/register">
                <Button size="lg" className="text-base px-10 h-[52px] glow-primary-sm">
                  Começar Agora
                  <ArrowRight className="w-5 h-5 ml-2" strokeWidth={1.5} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative z-10 border-t border-border bg-background-secondary py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/assets/IsotipoLeovoxverde.svg"
                  alt="Leovox"
                  width={24}
                  height={24}
                />
                <span className="text-sm font-bold font-heading text-text-primary">
                  Leovox Task
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Orquestrador de tarefas com inteligência artificial para máxima produtividade.
              </p>
            </div>

            {/* Produto */}
            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-[0.1em] mb-4">
                Produto
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#funcionalidades" className="text-sm text-text-secondary hover:text-primary transition-colors">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="text-sm text-text-secondary hover:text-primary transition-colors">
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a href="#depoimentos" className="text-sm text-text-secondary hover:text-primary transition-colors">
                    Métricas
                  </a>
                </li>
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-[0.1em] mb-4">
                Recursos
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <span className="text-sm text-text-tertiary">Documentação</span>
                </li>
                <li>
                  <span className="text-sm text-text-tertiary">API Reference</span>
                </li>
                <li>
                  <span className="text-sm text-text-tertiary">Suporte</span>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-[0.1em] mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <span className="text-sm text-text-tertiary">Termos de Uso</span>
                </li>
                <li>
                  <span className="text-sm text-text-tertiary">Privacidade</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center">
            <p className="text-sm text-text-tertiary">
              &copy; 2026 Leovox Task — Desenvolvido por Leonardo Gonçalves Sobral
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
