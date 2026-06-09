"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  UserPlus,
  Trash2,
  Loader2,
  AlertCircle,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function OrgMemberList({ orgId, isOrgAdmin }) {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState("ORG_MEMBER");
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orgs/${orgId}/members`);
      if (!response.ok) throw new Error("Failed to fetch members");
      const data = await response.json();
      setMembers(data.members);
    } catch (error) {
      toast.error("Could not load members");
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchMembers();
  }, [orgId, fetchMembers]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const response = await fetch(`/api/orgs/${orgId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addEmail, role: addRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add member");
      }

      const data = await response.json();
      setMembers(data.members);
      setAddEmail("");
      setAddRole("ORG_MEMBER");
      toast.success("Member added successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/orgs/${orgId}/members/${memberToDelete.user_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to remove member");
      }

      const data = await response.json();
      setMembers(data.members);
      toast.success("Member removed successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
      setMemberToDelete(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setIsChangingRole(true);
    try {
      const response = await fetch(`/api/orgs/${orgId}/members/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update role");

      const data = await response.json();
      setMembers(data.members);
      toast.success("Role updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsChangingRole(false);
    }
  };

  const getInitials = (name) => name?.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2) || "U";

  return (
    <div className="space-y-6">
      {isOrgAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-none shadow-sm ring-1 ring-border/50">
            <CardContent className="p-5">
              <h4 className="text-sm font-medium flex items-center gap-2 mb-4">
                <UserPlus className="h-4 w-4 text-primary" />
                Invite Member
              </h4>
              <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    disabled={isAdding}
                    className="h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Select value={addRole} onValueChange={setAddRole} disabled={isAdding}>
                  <SelectTrigger className="h-10 w-full sm:w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ORG_MEMBER">Member</SelectItem>
                    <SelectItem value="ORG_ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={isAdding || !addEmail} className="h-10 sm:w-auto">
                  {isAdding ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</>
                  ) : (
                    <><UserPlus className="mr-2 h-4 w-4" />Add</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="hidden md:block rounded-xl ring-1 ring-border/50 overflow-hidden">
          <div className="bg-muted/30 px-5 py-3 flex items-center gap-4 border-b">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex-1 min-w-0">Member</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[120px]">Role</span>
            {isOrgAdmin && <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[80px] text-right">Actions</span>}
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No members yet</p>
            </div>
          ) : (
            <AnimatePresence>
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className="px-5 py-3 flex items-center gap-4 hover:bg-muted/20 transition-colors border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-8 w-8 border-2 border-background shadow-sm shrink-0">
                      <AvatarFallback className={cn(
                        "text-xs font-semibold",
                        member.role === "ORG_ADMIN"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200"
                          : "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200"
                      )}>
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <span className="text-sm font-medium truncate block">{member.name}</span>
                      <span className="text-xs text-muted-foreground truncate block">{member.email}</span>
                    </div>
                  </div>
                  <div className="w-[120px]">
                    {isOrgAdmin ? (
                      <Select
                        value={member.role}
                        onValueChange={(v) => handleRoleChange(member.user_id, v)}
                        disabled={isChangingRole}
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ORG_MEMBER">Member</SelectItem>
                          <SelectItem value="ORG_ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant={member.role === "ORG_ADMIN" ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0 h-4"
                      >
                        {member.role === "ORG_ADMIN" ? "Admin" : "Member"}
                      </Badge>
                    )}
                  </div>
                  {isOrgAdmin && (
                    <div className="w-[80px] text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7 transition-colors"
                        onClick={() => {
                          setMemberToDelete(member);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="grid gap-3 md:hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-muted/50 rounded-xl border border-dashed"
            >
              <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No members yet</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className="bg-card rounded-xl p-4 ring-1 ring-border/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-9 w-9 border-2 border-background shadow-sm shrink-0">
                        <AvatarFallback className={cn(
                          "text-xs font-semibold",
                          member.role === "ORG_ADMIN"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200"
                            : "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200"
                        )}>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{member.name}</span>
                          <Badge
                            variant={member.role === "ORG_ADMIN" ? "default" : "secondary"}
                            className="text-[10px] px-1.5 py-0 h-4 shrink-0"
                          >
                            {member.role === "ORG_ADMIN" ? "Admin" : "Member"}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground truncate block">{member.email}</span>
                      </div>
                    </div>
                    {isOrgAdmin && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Select
                          value={member.role}
                          onValueChange={(v) => handleRoleChange(member.user_id, v)}
                          disabled={isChangingRole}
                        >
                          <SelectTrigger className="h-7 text-xs w-[90px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ORG_MEMBER">Member</SelectItem>
                            <SelectItem value="ORG_ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                          onClick={() => {
                            setMemberToDelete(member);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
              <AlertDialogTitle>Remove Member?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to remove <span className="font-bold">{memberToDelete?.name}</span> from this organization?
              They will no longer be able to view or create tickets here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRemoveMember();
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Removing...</>
              ) : (
                "Remove Member"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}