import { auth } from "@/auth";
import { orgMemberDb } from "@/lib/db";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireOrgMember(orgId) {
  const user = await requireAuth();
  const userId = parseInt(user.id);
  const isMember = await orgMemberDb.isMember(orgId, userId);
  if (!isMember) {
    throw new Error("Forbidden: Not a member of this organization");
  }
  return user;
}

export async function requireOrgAdmin(orgId) {
  const user = await requireAuth();
  const userId = parseInt(user.id);
  const isOrgAdmin = await orgMemberDb.isOrgAdmin(orgId, userId);
  if (!isOrgAdmin) {
    throw new Error("Forbidden: Organization admin access required");
  }
  return user;
}

export async function getCurrentOrgId() {
  const user = await getCurrentUser();
  return user?.currentOrgId ? parseInt(user.currentOrgId) : null;
}