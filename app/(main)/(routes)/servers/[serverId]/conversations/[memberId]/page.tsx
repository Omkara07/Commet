import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { getOrCreateConversation } from "@/lib/conversation";
import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string,
        serverId: string
    }
}
const MemberIdPage = async ({ params }: MemberIdPageProps) => {
    const { memberId, serverId } = await params;
    const profile = await CurrentProfile();

    if (!profile) return <RedirectToSignIn />

    const currentMember = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile?.id
        },
        include: {
            profile: true
        }
    })

    if (!currentMember) return redirect("/");

    const conversation = await getOrCreateConversation(currentMember?.id, memberId);

    if (!conversation) {
        return redirect(`/servers/${serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.id === currentMember?.id ? memberTwo : memberOne;

    return (
        <div className="flex flex-col h-screen text-primary w-full dark:bg-[#101112] bg-[#F2F3F5] p-0">
            <ChatHeader
                serverId={serverId}
                name={otherMember.profile.name}
                type="conversation"
                imageUrl={otherMember.profile.imageUrl}
            />
            <ChatMessages
                member={currentMember}
                name={otherMember.profile.name}
                chatId={conversation.id}
                type="conversation"
                apiUrl="/api/direct-messages"
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                    conversationId: conversation.id
                }}
                paramKey="conversationId"
                paramValue={conversation.id}
            />
            <div>
                <ChatInput name={otherMember.profile.name} type="conversation" apiUrl="/api/socket/direct-messages" query={{ conversationId: conversation.id }} />
            </div>
        </div>
    );
}

export default MemberIdPage;