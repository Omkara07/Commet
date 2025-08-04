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
import { Check, Copy, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

const InviteMemberModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();

    const { server } = data;
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const [copied, setCopied] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }
    const isModalOpen = isOpen && type === "invite";

    const onNew = async () => {
        try {
            setLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

            onOpen("invite", { server: response.data });
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="p-0 overflow-hidden max-w-md border-3">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-10">
                    <Label className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold">Server Invite link</Label>
                    <div className="flex items-center mt-3 gap-x-2">
                        <Input value={inviteUrl} onChange={() => { }}></Input>
                        <Button onClick={onCopy} size="icon">
                            {
                                copied ?
                                    <Check className="h-4 w-4" />
                                    :
                                    <Copy className="h-4 w-4" />
                            }
                        </Button>
                    </div>
                    <div className="flex items-left mt-3">
                        <Button onClick={onNew} variant="link" size="sm">
                            Generate a new Link
                            <RefreshCcw className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default InviteMemberModal
