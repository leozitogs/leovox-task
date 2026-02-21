"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ActivityChartProps {
  data?: { day: string; completed: number }[];
}

const defaultData = [
  { day: "Seg", completed: 3 },
  { day: "Ter", completed: 5 },
  { day: "Qua", completed: 2 },
  { day: "Qui", completed: 7 },
  { day: "Sex", completed: 4 },
  { day: "Sáb", completed: 1 },
  { day: "Dom", completed: 0 },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-elevated rounded-[10px] px-4 py-2.5 text-sm">
      <p className="font-medium text-text-primary">{label}</p>
      <p className="text-primary font-bold">
        {payload[0].value} tarefa{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export function ActivityChart({ data }: ActivityChartProps) {
  const chartData = data || defaultData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-[12px] p-6 noise-overlay relative"
    >
      <div className="relative z-10">
        <h3 className="text-[1.25rem] font-bold font-heading mb-6 text-text-primary">
          Atividade da Semana
        </h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-text-tertiary)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0, 255, 65, 0.05)" }}
              />
              <Bar
                dataKey="completed"
                fill="var(--color-primary)"
                radius={[6, 6, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
