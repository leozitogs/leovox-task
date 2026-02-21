"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Sparkles, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tasksApi } from "@/lib/api";

interface CreateTaskDialogProps {
  onTaskCreated: () => void;
  children?: React.ReactNode;
}

export function CreateTaskDialog({ onTaskCreated, children }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [aiInput, setAiInput] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
    category: "General",
    tags: "",
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setIsLoading(true);
    try {
      await tasksApi.create({
        title: form.title,
        description: form.description || null,
        due_date: form.due_date || null,
        priority: form.priority,
        category: form.category || "General",
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      });
      resetForm();
      setOpen(false);
      onTaskCreated();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    setIsLoading(true);
    try {
      await tasksApi.parseWithAI(aiInput);
      setAiInput("");
      setOpen(false);
      onTaskCreated();
    } catch (error) {
      console.error("Erro ao criar tarefa com IA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      due_date: "",
      priority: "medium",
      category: "General",
      tags: "",
    });
    setAiInput("");
  };

  const inputClasses =
    "flex h-11 w-full rounded-[10px] bg-surface border border-border px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-300 font-sans focus:outline-none focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(0,255,65,0.08),0_0_20px_rgba(0,255,65,0.05)] hover:border-border-hover";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {children || (
          <Button>
            <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Nova Tarefa
          </Button>
        )}
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg glass-panel rounded-[16px] p-7 noise-overlay relative"
              >
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-[1.5rem] font-bold font-heading text-text-primary">
                      Nova Tarefa
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-text-tertiary hover:text-text-primary transition-colors p-1.5 rounded-[8px] hover:bg-surface-hover"
                      >
                        <X className="w-5 h-5" strokeWidth={1.5} />
                      </motion.button>
                    </Dialog.Close>
                  </div>

                  {/* Mode Toggle */}
                  <div className="flex gap-2 mb-6 p-1 bg-surface rounded-[10px] border border-border">
                    <button
                      onClick={() => setMode("manual")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[8px] text-sm font-medium transition-all duration-200 ${
                        mode === "manual"
                          ? "bg-primary-muted text-primary border border-primary/20"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <PenLine className="w-4 h-4" strokeWidth={1.5} />
                      Manual
                    </button>
                    <button
                      onClick={() => setMode("ai")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[8px] text-sm font-medium transition-all duration-200 ${
                        mode === "ai"
                          ? "bg-primary-muted text-primary border border-primary/20"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                      Com IA
                    </button>
                  </div>

                  {/* AI Mode */}
                  {mode === "ai" && (
                    <form onSubmit={handleAiSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.05em]">
                          Descreva sua tarefa
                        </label>
                        <textarea
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          placeholder="Ex: Reunião com o time de design amanhã às 14h, prioridade alta"
                          className={`${inputClasses} min-h-[120px] resize-none py-3 h-auto`}
                        />
                        <p className="text-xs text-text-tertiary">
                          A IA vai extrair título, data, prioridade e categoria automaticamente.
                        </p>
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <Dialog.Close asChild>
                          <Button variant="outline" type="button">
                            Cancelar
                          </Button>
                        </Dialog.Close>
                        <Button type="submit" disabled={isLoading || !aiInput.trim()}>
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                              Processando...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                              Criar com IA
                            </span>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Manual Mode */}
                  {mode === "manual" && (
                    <form onSubmit={handleManualSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.05em]">
                          Título *
                        </label>
                        <input
                          value={form.title}
                          onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                          }
                          placeholder="Ex: Entregar relatório mensal"
                          required
                          className={inputClasses}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.05em]">
                          Descrição
                        </label>
                        <textarea
                          value={form.description}
                          onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                          }
                          placeholder="Detalhes adicionais..."
                          className={`${inputClasses} min-h-[80px] resize-none py-3 h-auto`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.05em]">
                            Vencimento
                          </label>
                          <input
                            type="datetime-local"
                            value={form.due_date}
                            onChange={(e) =>
                              setForm({ ...form, due_date: e.target.value })
                            }
                            className={inputClasses}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.05em]">
                            Prioridade
                          </label>
                          <select
                            value={form.priority}
                            onChange={(e) =>
                              setForm({ ...form, priority: e.target.value })
                            }
                            className={inputClasses}
                          >
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                            <option value="urgent">Urgente</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.05em]">
                            Categoria
                          </label>
                          <input
                            value={form.category}
                            onChange={(e) =>
                              setForm({ ...form, category: e.target.value })
                            }
                            placeholder="Ex: Trabalho"
                            className={inputClasses}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.05em]">
                            Tags
                          </label>
                          <input
                            value={form.tags}
                            onChange={(e) =>
                              setForm({ ...form, tags: e.target.value })
                            }
                            placeholder="Ex: urgente, reunião"
                            className={inputClasses}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <Dialog.Close asChild>
                          <Button variant="outline" type="button">
                            Cancelar
                          </Button>
                        </Dialog.Close>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                              Criando...
                            </span>
                          ) : (
                            "Criar Tarefa"
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
