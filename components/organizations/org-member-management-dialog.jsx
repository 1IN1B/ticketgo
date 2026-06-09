"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import OrgMemberList from "@/components/organizations/org-member-list";
import { Users, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrgMemberManagementDialog({ orgId }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <UserCog className="h-4 w-4" />
          Manage Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-sky-500" />
            Organization Members
          </DialogTitle>
          <DialogDescription>
            View and manage members in this organization.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          <OrgMemberList orgId={orgId} isOrgAdmin={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
}