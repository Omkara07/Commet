import CurrentProfile from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { DirectMessage, Message } from "@/lib/generated/prisma"
import { db } from "@/lib/db";

const MESSAGE_BATCH = 10;

export async function GET(req: Request) {
    try {
        const profile = CurrentProfile();
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!conversationId) {
            return new NextResponse("Conversation ID Missing", { status: 400 });
        }

        let directMessages: DirectMessage[] = [];

        if (cursor) {
            directMessages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    conversationId,
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        }
        else {
            directMessages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                where: {
                    conversationId,
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        }

        const nextCursor = directMessages.length === MESSAGE_BATCH ? directMessages[MESSAGE_BATCH - 1].id : undefined;

        return NextResponse.json({ items: directMessages, nextCursor });

    } catch (error) {
        console.log("[DIRECT_MESSAGES_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}