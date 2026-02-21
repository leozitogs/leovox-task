"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tarefas", icon: CheckSquare },
  { href: "/chat", label: "Chat IA", icon: MessageSquare, badge: "IA" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const userInitials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <Tooltip.Provider delayDuration={200}>
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: collapsed ? 72 : 280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 z-40 h-screen flex flex-col"
        style={{ width: collapsed ? 72 : 280 }}
      >
        <div className="m-3 flex-1 flex flex-col glass-panel rounded-[16px] overflow-hidden noise-overlay relative">
          <div className="relative z-10 flex flex-col flex-1">
            {/* ── Logo ── */}
            <div
              className={cn(
                "flex items-center gap-3 px-5 py-5 border-b border-border",
                collapsed && "justify-center px-3"
              )}
            >
              {collapsed ? (
                <Image
                  src="/assets/TipografiaLVXLeovoxverde.svg"
                  alt="LVX"
                  width={32}
                  height={32}
                  className="flex-shrink-0"
                />
              ) : (
                <>
                  <Image
                    src="/assets/IsotipoLeovoxverde.svg"
                    alt="Leovox"
                    width={32}
                    height={32}
                    className="flex-shrink-0"
                  />
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-1.5">
                        <Image
                          src="/assets/TipografiaLeovoxverde.svg"
                          alt="Leovox"
                          width={80}
                          height={18}
                        />
                      </div>
                      <p className="text-[0.625rem] text-text-tertiary whitespace-nowrap tracking-[0.1em] uppercase mt-0.5">
                        Orquestrador de Tarefas
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 px-3 py-5 space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                const navLink = (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ x: collapsed ? 0 : 3 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "relative flex items-center gap-3 rounded-[12px] text-sm font-medium transition-all duration-200",
                        collapsed ? "justify-center px-3 py-3" : "px-4 py-3",
                        isActive ? "text-primary" : "text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {/* Active background with left border */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-primary-muted border border-primary/20 rounded-[12px]"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      {/* Active left accent */}
                      {isActive && (
                        <motion.div
                          layoutId="activeAccent"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      {!isActive && (
                        <div className="absolute inset-0 rounded-[12px] bg-surface-hover opacity-0 hover:opacity-100 transition-opacity duration-200" />
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

                      {/* Badge for Chat IA */}
                      {item.badge && !collapsed && (
                        <span className="ml-auto relative z-10 px-1.5 py-0.5 text-[10px] font-bold bg-primary/15 text-primary rounded-full border border-primary/20">
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  </Link>
                );

                if (collapsed) {
                  return (
                    <Tooltip.Root key={item.href}>
                      <Tooltip.Trigger asChild>{navLink}</Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="right"
                          sideOffset={12}
                          className="glass-elevated rounded-[8px] px-3 py-1.5 text-sm font-medium text-text-primary z-50"
                        >
                          {item.label}
                          <Tooltip.Arrow className="fill-surface" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  );
                }

                return navLink;
              })}
            </nav>

            {/* ── Collapse Toggle ── */}
            <div className="px-3 pb-2">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[12px] text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-all duration-200"
              >
                <motion.div
                  animate={{ rotate: collapsed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                </motion.div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs"
                    >
                      Recolher
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* ── Separator ── */}
            <div className="mx-4 h-px bg-border" />

            {/* ── User Section ── */}
            <div className="p-4">
              <div
                className={cn(
                  "flex items-center gap-3 mb-3",
                  collapsed && "justify-center"
                )}
              >
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                  {userInitials}
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
                      <p className="text-sm font-medium text-text-primary truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-text-tertiary truncate">{user?.email}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ x: collapsed ? 0 : 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={logout}
                className={cn(
                  "flex items-center gap-2 w-full rounded-[12px] text-sm text-text-secondary hover:bg-danger/10 hover:text-danger transition-all duration-200",
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
    </Tooltip.Provider>
  );
}
