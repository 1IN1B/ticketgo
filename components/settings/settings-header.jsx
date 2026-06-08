"use client";

import { motion } from "motion/react";

export function SettingsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <p className="text-muted-foreground">
        Manage your account profile, theme preferences, and security settings.
      </p>
    </motion.div>
  );
}
