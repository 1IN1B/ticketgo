import { Badge } from "@/components/ui/badge";

const statusMap = {
  OPEN: { label: "Open", color: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200" },
  IN_PROGRESS: { label: "In Progress", color: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200" },
  RESOLVED: { label: "Resolved", color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200" },
  CLOSED: { label: "Closed", color: "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200" },
};

export default function StatusBadge({ status }) {
  const config = statusMap[status] || statusMap.OPEN;
  
  return (
    <Badge variant="outline" className={config.color}>
      {config.label}
    </Badge>
  );
}
