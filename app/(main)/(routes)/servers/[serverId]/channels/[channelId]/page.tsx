import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";

interface ChannelIdPageProps {
    params: {
        serverId: string,
        channelId: string
    }
}
const ChannelIdPage = async ({
    params
}: ChannelIdPageProps) => {

    const profile = await CurrentProfile();

    if (!profile) {
        return <RedirectToSignIn />;
    }

    const { channelId, serverId } = await params;
    const channel = await db.channel.findUnique({
        where: {
            id: channelId
        }
    });

    const member = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id
        }
    })
    return (
        <div className="flex flex-col h-screen text-primary w-full dark:bg-black bg-white p-0">
            <ChatHeader serverId={channel?.serverId || ""} name={channel?.name || ""} type={"channel"} />
            <ChatMessages
                name={channel?.name || ""}
                member={member!}
                chatId={channel?.id || ""}
                apiUrl="/api/messages"
                socketUrl="/api/socket/messages"
                socketQuery={{
                    channelId: channel?.id || "",
                    serverId: channel?.serverId || ""
                }}
                paramKey="channelId"
                paramValue={channel?.id || ""}
                type="channel"
            />
            <div className="">
                <ChatInput
                    name={channel?.name || ""}
                    apiUrl="/api/socket/messages"
                    query={{
                        channelId: channelId,
                        serverId: serverId
                    }}
                    type="channel"
                />
            </div>
        </div>
    );
}

export default ChannelIdPage;