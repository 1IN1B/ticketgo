import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function parseDate(dateStr) {
  if (!dateStr) return new Date();
  return new Date(dateStr.replace(" ", "T"));
}
