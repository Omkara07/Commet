"use client"
import { Member, Message, Profile } from "@/lib/generated/prisma";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";
import ChatItem from "./chat-item";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

interface Props {
    name: string,
    member: Member,
    chatId: string,
    apiUrl: string,
    socketUrl: string,
    socketQuery: Record<string, string>,
    paramKey: "channelId" | "conversationId",
    paramValue: string,
    type: "channel" | "conversation"
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

const DATE_FORMAT = "d MMM yyyy, HH:mm";

const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}: Props) => {
    const queryKey = `chat=${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;

    const chatRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({ apiUrl, queryKey, paramKey, paramValue });

    useChatSocket({ addKey, updateKey, queryKey });
    useChatScroll({ chatRef, bottomRef, shouldLoadMore: !isFetchingNextPage && !!hasNextPage, loadMore: fetchNextPage, count: data?.pages?.[0]?.items?.length ?? 0 });

    if (status === "pending") {
        return (
            <div className="flex-1 flex flex-col justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages...</p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex-1 flex flex-col justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Something went wrong</p>
            </div>
        )
    }
    return (
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col">
            {
                !hasNextPage && <div className="flex-1" />
            }
            {
                !hasNextPage && <ChatWelcome name={name} type={type} />
            }
            {
                hasNextPage && (
                    <div className="flex justify-center">
                        {isFetchingNextPage ? (
                            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
                        ) : (
                            <button
                                onClick={() => fetchNextPage()}
                                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 hover:underline dark:hover:text-zinc-300 transition"
                            >
                                Load previous messages
                            </button>
                        )}
                    </div>
                )
            }
            <div className="flex flex-col-reverse mt-auto">
                {
                    data?.pages?.map((page, i) => (
                        <Fragment key={i}>
                            {
                                page.items.map((message: MessageWithMemberWithProfile) => (
                                    <ChatItem
                                        key={message.id}
                                        id={message.id}
                                        content={message.content}
                                        member={message.member}
                                        currentmember={member}
                                        timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                        fileUrl={message.fileUrl}
                                        deleted={message.deleted}
                                        isUpdated={message.updatedAt !== message.createdAt}
                                        socketUrl={socketUrl}
                                        socketQuery={socketQuery}
                                        bottomRef={bottomRef}
                                    />
                                ))
                            }
                        </Fragment>
                    ))
                }
            </div>
            <div ref={bottomRef} className="" />
        </div >
    );
}

export default ChatMessages;