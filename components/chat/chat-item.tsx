'use client';

import { Member, MemberRole, Profile } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import UserAvatar from "../user-avatar";
import ActionTooltip from "../action-tooltip";
import { ShieldAlert, ShieldCheck, File, Trash, Check, X, Edit2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface Props {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentmember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const RoleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentmember,
    isUpdated,
    socketUrl,
    socketQuery,
}: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingContent, setEditingContent] = useState(content);
    const [fileType, setFileType] = useState<"image" | "pdf" | "unknown" | null>(null);
    const [fileName, setFileName] = useState(fileUrl ? fileUrl.split("/").pop() || "file" : "");
    const [fileSize, setFileSize] = useState("");

    const isAdmin = currentmember.role === MemberRole.ADMIN;
    const isModerator = currentmember.role === MemberRole.MODERATOR;
    const isOwner = currentmember.id === member.id;
    const canEdit = !fileUrl && !deleted && isOwner;
    const canDelete = !deleted && (isOwner || isAdmin || isModerator);

    useEffect(() => {
        if (fileUrl) {
            fetch(fileUrl, { method: "HEAD" })
                .then((res) => {
                    const type = res.headers.get("content-type")?.toLowerCase();
                    if (type?.startsWith("image/")) {
                        setFileType("image");
                    } else if (type === "application/pdf") {
                        setFileType("pdf");
                    } else {
                        setFileType("unknown");
                    }

                    const disposition = res.headers.get("content-disposition");
                    if (disposition && disposition.includes("filename=")) {
                        let fn = disposition.split("filename=")[1].replace(/"/g, "").trim();
                        setFileName(fn);
                    }

                    const size = res.headers.get("content-length");
                    if (size) {
                        const bytes = parseInt(size);
                        if (bytes > 1024 * 1024) {
                            setFileSize(`${(bytes / 1024 / 1024).toFixed(1)} MB`);
                        } else if (bytes > 1024) {
                            setFileSize(`${(bytes / 1024).toFixed(1)} KB`);
                        } else {
                            setFileSize(`${bytes} B`);
                        }
                    }
                })
                .catch(() => setFileType("unknown"));
        }
    }, [fileUrl]);

    const handleUpdate = async () => {
        try {
            await axios.patch(`${socketUrl}/messages/${id}`, { content: editingContent }, { params: socketQuery });
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            await axios.delete(`${socketUrl}/messages/${id}`, { params: socketQuery });
        } catch (error) {
            console.error(error);
        }
    };

    const renderContent = () => {
        if (deleted) {
            return (
                <p className="italic text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    {fileUrl ? "Attachment removed" : "Message deleted"}
                </p>
            );
        }

        if (fileUrl) {
            if (fileType === null) {
                return <p className="text-xs sm:text-sm w-full max-w-[90vw] aspect-video border max-sm:aspect-square sm:max-w-[400px] max-h-64 sm:max-h-96 rounded-lg object-cover flex justify-center items-center text-zinc-500 dark:text-zinc-400">Loading attachment...</p>;
            }

            if (fileType === "image") {
                return (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="relative block">
                        <Image
                            src={fileUrl}
                            alt={fileName}
                            width={400}
                            height={300}
                            className="w-full max-w-[65vw] max-sm:aspect-square sm:max-w-[400px] max-h-64 sm:max-h-96 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        />
                    </a>
                );
            }

            return (
                <a
                    href={fileUrl}
                    download={fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 sm:p-3 gap-x-2 sm:gap-x-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition w-fit max-w-[90vw] sm:max-w-md"
                >
                    <File className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-500" />
                    <div className="flex flex-col">
                        <p className="font-medium text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 truncate max-w-[50vw] sm:max-w-xs">
                            {fileName}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{fileSize}</p>
                    </div>
                </a>
            );
        }

        if (isEditing) {
            return (
                <div className="flex items-center gap-x-2 w-full">
                    <Input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-700 dark:text-zinc-200"
                        autoFocus
                    />
                    <Button
                        size="sm"
                        onClick={handleUpdate}
                        variant="ghost"
                        className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        variant="ghost"
                        className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            );
        }

        return (
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 break-words">
                {content}
                {isUpdated && <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>}
            </p>
        );
    };

    return (
        <div className="relative group flex items-start hover:bg-black/5 p-2 sm:p-3 md:p-4 transition w-full rounded-lg">
            <div className="flex gap-x-2 w-full">
                <UserAvatar
                    url={member.profile.imageUrl}
                    className="h-6 w-6 sm:h-8 sm:w-8"
                    fallbackData={member.profile.name}
                />
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center gap-x-1 sm:gap-x-2">
                            <p className="font-semibold text-xs sm:text-sm hover:underline cursor-pointer dark:text-zinc-200">
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role} side="top" align="start">
                                {RoleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</span>
                    </div>
                    <div className={cn("px-1 py-2", deleted && "mt-1")}>{renderContent()}</div>
                </div>
            </div>
            {
                canDelete && (
                    <div className="hidden group-hover:flex items-center gap-x-2 absolute top-2 right-5 text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-xs">
                        {
                            canEdit && (
                                <div className="hidden group-hover:flex items-center gap-x-1 text-zinc-500 dark:text-zinc-400 text-[10px] sm:text-xs">
                                    <ActionTooltip label="Edit" side="top" >
                                        <Edit2 className="h-4 w-4" onClick={() => setIsEditing(true)} />
                                    </ActionTooltip>
                                </div>
                            )
                        }
                        <div className="flex items-center gap-x-1">
                            <ActionTooltip label="Delete" side="top" >
                                <Trash className="h-4 w-4" onClick={handleDelete} />
                            </ActionTooltip>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ChatItem;