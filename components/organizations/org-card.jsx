"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function OrgCard({ org, index = 0 }) {
  return (
    <motion.div variants={itemVariants}>
      <Link href={`/organizations/${org.id}`}>
        <Card className="group active:scale-[0.98] transition-all duration-200 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20 cursor-pointer border-none ring-1 ring-border/50">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors duration-200">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">{org.name}</h3>
                    <Badge
                      variant={org.user_role === "ORG_ADMIN" ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0 h-4 shrink-0"
                    >
                      {org.user_role === "ORG_ADMIN" ? "Admin" : "Member"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono truncate">{org.slug}</p>
                  {org.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{org.description}</p>
                  )}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200 shrink-0 mt-1" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export { containerVariants, itemVariants };