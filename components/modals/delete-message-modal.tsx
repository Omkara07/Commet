"use client"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import qs from "query-string";
import { useModal } from "@/hooks/use-model-store";
import { Button } from "../ui/button";
import { useState } from "react";
import axios from "axios";
import { DialogDescription } from "@radix-ui/react-dialog";

const DeleteMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { apiUrl, query } = data;
    const [isLoading, setLoading] = useState(false);

    const isModalOpen = isOpen && type === "deleteMessage";

    const onDelete = async () => {
        try {
            setLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            })
            const response = await axios.delete(url);

            onClose();
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
                        Delete Message
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-center text-zinc-400">
                    Are you sure you want to do this? <br />
                    This message will be permanently deleted.
                </DialogDescription>
                <DialogFooter className="bg-zinc-900 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button disabled={isLoading} onClick={onClose} variant="ghost">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={onDelete} variant="delete">
                            Delete
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteMessageModal
