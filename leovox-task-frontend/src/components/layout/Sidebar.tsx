"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ListTodo,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tarefas", icon: ListTodo },
  { href: "/chat", label: "Chat IA", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: collapsed ? 80 : 272 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-40 h-screen flex flex-col"
      style={{ width: collapsed ? 80 : 272 }}
    >
      {/* Floating glass sidebar with margin */}
      <div className="m-3 flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden noise-overlay relative">
        <div className="relative z-10 flex flex-col flex-1">
          {/* Logo */}
          <div className={cn(
            "flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]",
            collapsed && "justify-center px-3"
          )}>
            <Image
              src="/assets/IsotipoLeovoxverde.svg"
              alt="Leovox"
              width={36}
              height={36}
              className="rounded-xl flex-shrink-0"
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-base font-bold font-heading text-primary text-glow whitespace-nowrap">
                    Leovox Task
                  </h1>
                  <p className="text-[10px] text-text-muted whitespace-nowrap tracking-wider uppercase">
                    Orquestrador de Tarefas
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-5 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: collapsed ? 0 : 3 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                      collapsed ? "justify-center px-3 py-3" : "px-4 py-3",
                      isActive
                        ? "text-primary"
                        : "text-text-secondary hover:text-text"
                    )}
                  >
                    {/* Active background pill */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-primary/[0.08] border border-primary/20 rounded-xl"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Hover background */}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-xl bg-white/[0.03] opacity-0 hover:opacity-100 transition-opacity duration-200" />
                    )}

                    <Icon
                      className={cn(
                        "w-5 h-5 relative z-10 flex-shrink-0",
                        isActive ? "text-primary" : "text-text-secondary"
                      )}
                      strokeWidth={1.5}
                    />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="relative z-10 whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Active dot */}
                    {isActive && !collapsed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,65,0.5)] relative z-10 flex-shrink-0"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Collapse toggle */}
          <div className="px-3 pb-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-text-muted hover:text-text-secondary hover:bg-white/[0.03] transition-all duration-200"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-xs">Recolher</span>
                </>
              )}
            </button>
          </div>

          {/* User section */}
          <div className="border-t border-white/[0.06] p-4">
            <div className={cn(
              "flex items-center gap-3 mb-3",
              collapsed && "justify-center"
            )}>
              <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-w-0 overflow-hidden"
                  >
                    <p className="text-sm font-medium text-text truncate">{user?.name}</p>
                    <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              whileHover={{ x: collapsed ? 0 : 2 }}
              whileTap={{ scale: 0.97 }}
              onClick={logout}
              className={cn(
                "flex items-center gap-2 w-full rounded-xl text-sm text-text-secondary hover:bg-danger/10 hover:text-danger transition-all duration-200",
                collapsed ? "justify-center px-3 py-2.5" : "px-4 py-2.5"
              )}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    Sair
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
