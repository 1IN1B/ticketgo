"use client";

import { AlertCircle, CheckCircle2, Circle, Clock, ListTodo } from "lucide-react";
import MetricCard from "./metric-card";
import { Progress } from "@/components/ui/progress";
import { motion } from "motion/react";

export default function StatsGrid({ stats }) {
  const { total = 0, byStatus = {}, avgResolutionHours = 0 } = stats || {};

  const resolved = byStatus.RESOLVED || 0;
  const resolutionPercentage = total > 0 ? (resolved / total) * 100 : 0;

  const metrics = [
    {
      title: "Total Tickets",
      value: total,
      icon: ListTodo,
      color: "text-blue-500",
    },
    {
      title: "Open Tickets",
      value: byStatus.OPEN || 0,
      icon: Circle,
      color: "text-amber-500",
    },
    {
      title: "Resolved",
      value: resolved,
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    {
      title: "Avg. Resolution",
      value: `${Math.round(avgResolutionHours)}h`,
      icon: Clock,
      color: "text-violet-500",
      description: "Average time to resolve",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card p-6 rounded-xl border shadow-sm"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Overall Resolution Rate</h3>
          <span className="text-sm font-bold">{Math.round(resolutionPercentage)}%</span>
        </div>
        <Progress value={resolutionPercentage} className="h-2" />
      </motion.div>
    </div>
  );
}
