import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

export default function MetricCard({ title, value, icon: Icon, description, color, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={cn("p-2 rounded-lg bg-opacity-10 transition-transform duration-300 group-hover:scale-110", color.replace("text-", "bg-").replace("500", "100"))}>
            <Icon className={cn("h-4 w-4", color)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
