"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { 
  profileSchema, 
  passwordChangeSchema, 
  accountDeletionSchema 
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2, User, ShieldCheck, Trash2, AlertCircle } from "lucide-react";

export default function SettingsForm({ user }) {
  const router = useRouter();
  const { update } = useSession();
  
  // Loading states for final execution
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // Dialog visibility states
  const [isProfileConfirmOpen, setIsProfileConfirmOpen] = useState(false);
  const [isPasswordConfirmOpen, setIsPasswordConfirmOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Temporary data storage for confirmation
  const [pendingProfileData, setPendingProfileData] = useState(null);
  const [pendingPasswordData, setPendingPasswordData] = useState(null);

  // Profile Form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
    }
  });

  const onProfileSubmit = (data) => {
    setPendingProfileData(data);
    setIsProfileConfirmOpen(true);
  };

  const handleExecuteProfileUpdate = async () => {
    if (!pendingProfileData) return;
    
    setIsUpdatingProfile(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingProfileData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to update profile");
      }

      // Update the client-side session so the TopNav reflects changes
      await update({ name: pendingProfileData.name });
      
      toast.success("Profile updated successfully");
      setIsProfileConfirmOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Password Form
  const passwordForm = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  const onPasswordSubmit = (data) => {
    setPendingPasswordData(data);
    setIsPasswordConfirmOpen(true);
  };

  const handleExecutePasswordChange = async () => {
    if (!pendingPasswordData) return;
    
    setIsChangingPassword(true);
    try {
      const response = await fetch("/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingPasswordData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to change password");
      }

      toast.success("Password changed successfully");
      passwordForm.reset();
      setIsPasswordConfirmOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Delete Form
  const deleteForm = useForm({
    resolver: zodResolver(accountDeletionSchema),
    defaultValues: {
      confirmEmail: "",
    }
  });

  const onDeleteSubmit = async (data) => {
    setIsDeletingAccount(true);
    try {
      const response = await fetch("/api/users/me/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete account");
      }

      toast.success("Account deleted. Redirecting...");
      setTimeout(() => {
        signOut({ callbackUrl: "/signup" });
      }, 2000);
    } catch (err) {
      toast.error(err.message);
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
      {/* Profile Section */}
      <div className="space-y-4 h-full">
        <Card className="h-full flex flex-col shadow-sm border-none ring-1 ring-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <User className="h-5 w-5 text-sky-500" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>
              Update your display name and basic account info.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <form id="profile-form" onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user.email} disabled className="bg-slate-50 border-slate-200" />
                <p className="text-[10px] text-muted-foreground italic">Email change is currently disabled.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input 
                  id="name" 
                  {...profileForm.register("name")} 
                  disabled={isUpdatingProfile}
                />
                {profileForm.formState.errors.name && (
                  <p className="text-xs text-red-500 font-medium">{profileForm.formState.errors.name.message}</p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t pt-6 bg-slate-50/30">
            <Button type="submit" form="profile-form" disabled={isUpdatingProfile} className="w-full">
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Security Section */}
      <div className="space-y-4 h-full">
        <Card className="h-full flex flex-col shadow-sm border-none ring-1 ring-slate-200">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Keep your account secure by changing your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <form id="password-form" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password"
                  {...passwordForm.register("currentPassword")}
                  disabled={isChangingPassword}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-xs text-red-500 font-medium">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password"
                  {...passwordForm.register("newPassword")}
                  disabled={isChangingPassword}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-xs text-red-500 font-medium">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                  disabled={isChangingPassword}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t pt-6 bg-slate-50/30">
            <Button type="submit" form="password-form" disabled={isChangingPassword} className="w-full">
              Update Password
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Danger Zone Section */}
      <div className="md:col-span-2">
        <Card className="shadow-sm border-none ring-1 ring-red-100 bg-red-50/10">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1 text-red-600">
              <Trash2 className="h-5 w-5" />
              <CardTitle>Danger Zone</CardTitle>
            </div>
            <CardDescription>
              Permanently delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-red-50 border border-red-100 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-red-900">Delete My Account</p>
                <p className="text-xs text-red-700">
                  This action is permanent and cannot be undone. All tickets and history will be lost.
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="shrink-0"
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PROFILE CONFIRMATION DIALOG */}
      <Dialog open={isProfileConfirmOpen} onOpenChange={setIsProfileConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-sky-600 mb-2">
              <User className="h-5 w-5" />
              <DialogTitle>Update Profile?</DialogTitle>
            </div>
            <DialogDescription>
              Confirm your new display name. This changes how you appear to other team members and admins.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 px-1">
             <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
               <span className="text-xs uppercase text-muted-foreground font-semibold">New Name</span>
               <p className="text-lg font-medium text-slate-900 mt-1">{pendingProfileData?.name}</p>
             </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isUpdatingProfile}>Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleExecuteProfileUpdate}
              disabled={isUpdatingProfile}
              className="bg-sky-600 hover:bg-sky-700"
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PASSWORD CONFIRMATION DIALOG */}
      <Dialog open={isPasswordConfirmOpen} onOpenChange={setIsPasswordConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <ShieldCheck className="h-5 w-5" />
              <DialogTitle>Confirm password change?</DialogTitle>
            </div>
            <DialogDescription>
              Your security is important. Please confirm that you want to update your access credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-md text-sm border border-emerald-100">
             <p className="flex items-center gap-2 font-medium">
               <ShieldCheck className="h-4 w-4" />
               Security requirement
             </p>
             <p className="mt-1 text-xs opacity-80">You will need to use your new password next time you sign in.</p>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={isChangingPassword}>Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleExecutePasswordChange}
              disabled={isChangingPassword}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ACCOUNT DELETION DIALOG */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="h-5 w-5" />
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              This action is permanent and will delete your entire support history. 
              To confirm, please type your account email: <span className="font-bold text-slate-900">{user.email}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <form id="delete-form" onSubmit={deleteForm.handleSubmit(onDeleteSubmit)}>
              <Input 
                 placeholder="Enter your email" 
                 {...deleteForm.register("confirmEmail")}
                 disabled={isDeletingAccount}
              />
              {deleteForm.formState.errors.confirmEmail && (
                <p className="text-xs text-red-500 font-medium mt-1">{deleteForm.formState.errors.confirmEmail.message}</p>
              )}
            </form>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAccount}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              asChild
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeletingAccount}
            >
              <button type="submit" form="delete-form">
                {isDeletingAccount ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
