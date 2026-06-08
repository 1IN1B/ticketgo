import { formatDistanceToNow } from "date-fns";
import { cn, parseDate } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "motion/react";

export default function CommentThread({ comments, currentUserId }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border/50 rounded-lg">
        No conversation yet. Be the first to reply!
      </div>
    );
  }

  return (
    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-border before:content-['']">
      {comments.map((comment, index) => {
        const isSelf = parseInt(currentUserId) === comment.user_id;
        const isAdmin = comment.user_role === 'ADMIN';
        const initials = comment.user_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

        return (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative flex gap-x-4 pl-1"
          >
            {/* Dot/Avatar on the line */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background z-10 border-2 border-border">
               <Avatar className="h-8 w-8">
                 <AvatarFallback className={cn(
                   "text-[10px]",
                   isAdmin ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200" : "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200"
                 )}>
                   {initials}
                 </AvatarFallback>
               </Avatar>
            </div>

            <div className={cn(
              "flex-1 rounded-lg p-4 transition-colors",
              isAdmin ? "bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30" : "bg-muted/30 border border-border/50",
              isSelf && "ring-1 ring-primary/20"
            )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{comment.user_name}</span>
                  {isAdmin && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200 rounded">Agent</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(parseDate(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
