"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-model-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy, RefreshCcw, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UserAvatar from "../user-avatar";

const IconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
}
const ManageMemberModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const { server } = data as { server: ServerWithMembersWithProfiles };

    const isModalOpen = isOpen && type === "members";

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="overflow-hidden max-w-md border-3">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-400">
                        {server?.members.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] mb-2">
                    {
                        server?.members.map((member) => (
                            <div key={member.id} className="px-6 py-4 my-1 flex items-center gap-x-4 md:mx-8 bg-zinc-900 rounded-2xl">
                                <UserAvatar url={member.profile.imageUrl} fallbackData={member.profile.name} />
                                <div className="flex flex-col gap-y-1">
                                    <div className="text-xs font-semibold flex items-center gap-x-1">
                                        {member.profile.name}
                                        {IconMap[member.role]}
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        {member.profile.email}
                                    </p>
                                </div>
                            </div>
                        ))
                    }

                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default ManageMemberModal
