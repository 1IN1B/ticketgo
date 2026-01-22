"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Trash2, 
  UserCog, 
  Loader2, 
  UserMinus,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
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

export default function UserManagementDialog() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users?mode=all");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      toast.error("Could not load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete user");
      }
      
      toast.success(`User ${userToDelete.name} deleted successfully`);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Dialog onOpenChange={(open) => open && fetchUsers()}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Manage Users
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] gap-0 p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-sky-500" />
              User Management
            </DialogTitle>
            <DialogDescription>
              View and manage all registered users in TicketGo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[350px] border-t">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full py-20 gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                <p className="text-sm text-muted-foreground">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 gap-2">
                <Users className="h-8 w-8 text-slate-200" />
                <p className="text-sm text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                        <AvatarFallback className={user.role === 'ADMIN' ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"}>
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                          <Badge variant={user.role === 'ADMIN' ? "warning" : "secondary"} className="text-[10px] px-1 py-0 h-4 uppercase font-bold">
                            {user.role}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => {
                        setUserToDelete(user);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Total Users: {users.length}
            </span>
            <Button variant="ghost" size="sm" onClick={fetchUsers} disabled={isLoading}>
              Refresh List
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <AlertDialogTitle>Delete User?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-bold text-slate-900">{userToDelete?.name}</span>?
              This will also delete all their tickets and comments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteUser();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
