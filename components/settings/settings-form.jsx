"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Loader2, User, ShieldCheck, Trash2 } from "lucide-react";

export default function SettingsForm({ user }) {
  const router = useRouter();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Profile Form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
    }
  });

  const onProfileSubmit = async (data) => {
    setIsUpdatingProfile(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
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

  const onPasswordSubmit = async (data) => {
    setIsChangingPassword(true);
    try {
      const response = await fetch("/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to change password");
      }

      toast.success("Password changed successfully");
      passwordForm.reset();
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
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-8">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          Security
        </TabsTrigger>
        <TabsTrigger value="danger" className="flex items-center gap-2 text-red-500 data-[state=active]:text-red-500">
          <Trash2 className="h-4 w-4" />
          Danger Zone
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your display name and basic account info.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="profile-form" onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" value={user.email} disabled className="bg-slate-50" />
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
          <CardFooter className="border-t pt-6">
            <Button type="submit" form="profile-form" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Keep your account secure by changing your password regularly.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
          <CardFooter className="border-t pt-6">
            <Button type="submit" form="password-form" disabled={isChangingPassword}>
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="danger" className="space-y-4">
        <Card className="max-w-xl border-red-200 bg-red-50/10">
          <CardHeader>
            <CardTitle className="text-red-600">Delete Account</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-800">
                You will lose access to all your tickets, comments, and history. 
                Please be certain before proceeding.
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-red-100 pt-6">
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete My Account
            </Button>
          </CardFooter>
        </Card>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
      </TabsContent>
    </Tabs>
  );
}
