"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tasksApi } from "@/lib/api";

interface CreateTaskDialogProps {
  onTaskCreated: () => void;
}

export function CreateTaskDialog({ onTaskCreated }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
    category: "General",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      });
      setForm({ title: "", description: "", due_date: "", priority: "medium", category: "General", tags: "" });
      setOpen(false);
      onTaskCreated();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "flex h-11 w-full rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] px-4 py-2.5 text-sm text-text placeholder:text-text-muted/50 transition-all duration-300 focus:outline-none focus:bg-white/[0.06] focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(0,255,65,0.08),0_0_20px_rgba(0,255,65,0.05)] hover:border-white/[0.15]";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" strokeWidth={1.5} />
          Nova Tarefa
        </Button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg glass-panel rounded-2xl p-7 noise-overlay relative"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-7">
                    <Dialog.Title className="text-xl font-bold font-heading text-text">
                      Nova Tarefa
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-text-muted hover:text-text transition-colors p-1.5 rounded-lg hover:bg-white/[0.05]"
                      >
                        <X className="w-5 h-5" strokeWidth={1.5} />
                      </motion.button>
                    </Dialog.Close>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Título *
                      </label>
                      <input
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Ex: Entregar relatório mensal"
                        required
                        className={inputClasses}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Descrição
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Detalhes adicionais..."
                        className={`${inputClasses} min-h-[90px] resize-none py-3 h-auto`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Vencimento
                        </label>
                        <input
                          type="datetime-local"
                          value={form.due_date}
                          onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                          className={inputClasses}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Prioridade
                        </label>
                        <select
                          value={form.priority}
                          onChange={(e) => setForm({ ...form, priority: e.target.value })}
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
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Categoria
                        </label>
                        <input
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          placeholder="Ex: Trabalho"
                          className={inputClasses}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Tags
                        </label>
                        <input
                          value={form.tags}
                          onChange={(e) => setForm({ ...form, tags: e.target.value })}
                          placeholder="Ex: urgente, reunião"
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                      <Dialog.Close asChild>
                        <Button variant="outline" type="button">
                          Cancelar
                        </Button>
                      </Dialog.Close>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            Criando...
                          </span>
                        ) : (
                          "Criar Tarefa"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
