"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { orgSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function OrgForm({ initialData = null }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const isEditing = initialData !== null;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
    },
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (!slugManuallyEdited && nameValue) {
      const autoSlug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", autoSlug);
    }
  }, [nameValue, slugManuallyEdited, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      const url = isEditing ? `/api/orgs/${initialData.id}` : "/api/orgs";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to create organization");
      }

      const result = await response.json();

      if (!isEditing) {
        await fetch("/api/auth/switch-org", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orgId: result.org.id }),
        });
      }

      router.push(`/organizations/${result.org.id}`);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-2xl mx-auto border-none shadow-sm ring-1 ring-border/50">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Organization" : "Create Organization"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your organization details."
              : "Set up a new organization for your team."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="e.g. Acme Corp"
                {...register("name")}
                disabled={isLoading}
                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="e.g. acme-corp"
                {...register("slug", {
                  onChange: () => setSlugManuallyEdited(true),
                })}
                disabled={isLoading}
                className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Used for identification. Auto-generated from name, but you can customize it.
              </p>
              {errors.slug && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.slug.message}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this organization is about..."
                className="min-h-[100px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                {...register("description")}
                disabled={isLoading}
              />
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.description.message}
                </motion.p>
              )}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg overflow-hidden"
                >
                  <p className="text-sm text-destructive text-center">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  isEditing ? "Save Changes" : "Create Organization"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}