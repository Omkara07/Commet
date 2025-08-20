import CurrentProfilePages from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const profile = await CurrentProfilePages(req);
        const { content } = req.body;
        const { directMessageId, conversationId } = req.query;

        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!conversationId) {
            return res.status(401).json({ error: "conversationId missind" });
        }

        if (!content && req.method === "PATCH") {
            return res.status(401).json({ error: "content missing" });
        }

        const conversation = await db.conversations.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id,
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        },
                    },
                ],
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        let directMessage = await db.directMessage.findFirst({
            where: {
                id: req.query.directMessageId as string,
                conversationId: conversationId as string,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        })

        if (!directMessage || directMessage.deleted) {
            return res.status(404).json({ error: "Message not found" });
        }

        const isOwner = directMessage.memberId === member.id;
        const isAdmin = directMessage.member.role === MemberRole.ADMIN;
        const isModerator = directMessage.member.role === MemberRole.MODERATOR;
        const canModify = isOwner || isAdmin || isModerator;

        if (!canModify) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (req.method === "DELETE") {
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    fileUrl: null,
                    content: "This message has been deleted.",
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
        }

        if (req.method === "PATCH") {
            if (!isOwner) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
        }

        const updateKey = `chat:${conversationId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, directMessage);

        return res.status(200).json(directMessage);
    }
    catch (err) {
        console.log("[SOCKET_MESSAGE_ID]", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}