"use client"

import { Channel, ChannelType, MemberRole } from "@/lib/generated/prisma"
import { cn } from "@/lib/utils"
import { ServerWithMembersWithProfiles } from "@/types"
import { Edit2, Hash, Lock, Mic, Trash, Video } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import ActionTooltip from "../action-tooltip"
import { useModal } from "@/hooks/use-model-store"

interface ServerChannelProps {
    channel: Channel,
    role: MemberRole | undefined,
    server: ServerWithMembersWithProfiles
}

const IconMap = {
    [ChannelType.TEXT]: <Hash className='flex-shirnk-0 h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2' />,
    [ChannelType.AUDIO]: <Mic className='flex-shirnk-0 h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2' />,
    [ChannelType.VIDEO]: <Video className='flex-shirnk-0 h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2' />
}
const ServerChannel = ({ channel, role, server }: ServerChannelProps) => {
    const router = useRouter();
    const params = useParams();
    const { onOpen } = useModal();

    return (
        <button className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            {
                IconMap[channel.type]
            }
            <p className={cn("line-clamp-1 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition", params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
                {channel.name}
            </p>
            {
                channel.name !== "general" && role !== MemberRole.GUEST && (
                    <div className="ml-auto flex items-center gap-x-2">
                        <ActionTooltip label="Edit">
                            <Edit2 onClick={() => onOpen("editChannel", { channel, server })} className="hidden group-hover:block h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                        </ActionTooltip>
                        <ActionTooltip label="Delete">
                            <Trash onClick={() => onOpen("deleteChannel", { channel, server })} className="hidden group-hover:block h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                        </ActionTooltip>
                    </div>
                )
            }
            {
                channel.name === "general" && (
                    <Lock className="ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                )
            }
        </button>
    )
}

export default ServerChannel
