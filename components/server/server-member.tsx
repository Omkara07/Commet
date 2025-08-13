"use client";

import { Member, MemberRole, Profile } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { ServerWithMembersWithProfiles } from "@/types";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../user-avatar";

interface ServerMemberProps {
    member: Member & { profile: Profile }
    server: ServerWithMembersWithProfiles
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
}
const ServerMember = ({
    member,
    server
}: ServerMemberProps) => {
    const router = useRouter();
    const params = useParams();

    const onClick = () => {
        router.push(`/servers/${server.id}/conversations/${member.id}`);
    }

    return (
        <button onClick={onClick} className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition", params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
            <div className="flex items-center gap-x-2">
                <UserAvatar url={member.profile.imageUrl} fallbackData={member.profile.name} className="h-7 w-7 md:w-7 md:h-7" />
                <div className="flex items-center gap-x-1 gap-y-1">

                    <p className={cn("font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition", params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
                        {member.profile.name}
                    </p>

                    {roleIconMap[member?.role as MemberRole]}
                </div>
            </div>
        </button>
    )
}

export default ServerMember
