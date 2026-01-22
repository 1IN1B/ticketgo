import { Badge } from "@/components/ui/badge";

const priorityMap = {
  LOW: { label: "Low", color: "bg-slate-100 text-slate-800 border-slate-200" },
  MEDIUM: { label: "Medium", color: "bg-blue-100 text-blue-800 border-blue-200" },
  HIGH: { label: "High", color: "bg-orange-100 text-orange-800 border-orange-200" },
  URGENT: { label: "Urgent", color: "bg-red-100 text-red-800 border-red-200" },
};

export default function PriorityBadge({ priority }) {
  const config = priorityMap[priority] || priorityMap.MEDIUM;
  
  return (
    <Badge variant="outline" className={config.color}>
      {config.label}
    </Badge>
  );
}
