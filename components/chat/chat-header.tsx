import { Hash } from "lucide-react";
import ToggleMobile from "../toggle-mobile";
import UserAvatar from "../user-avatar";
import SocketIndicator from "../socket-indicator";
import ChatVideoButton from "./chat-video-button";

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
}

const ChatHeader = ({
    serverId,
    name,
    type,
    imageUrl
}: ChatHeaderProps) => {
    return (
        <div className="w-full text-md font-bold px-3 flex  dark:bg-[#101112] bg-[#F2F3F5] items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            <ToggleMobile serverId={serverId} />
            {
                type === 'channel' && (
                    <Hash className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                )
            }
            {
                type === 'conversation' && (
                    <UserAvatar url={imageUrl || ""} fallbackData={name} className="h-8 w-8 md:w-9 md:h-9 mr-2" />
                )
            }
            <p className="font-semibold text-md text-zinc-700 dark:text-zinc-300">{name}</p>
            <div className="ml-auto flex items-center">
                {
                    type === 'conversation' && (
                        <ChatVideoButton />
                    )
                }
                <SocketIndicator />
            </div>
        </div>
    );
}

export default ChatHeader;