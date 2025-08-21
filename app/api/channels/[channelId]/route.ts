import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {

        const profile = await CurrentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        const { channelId } = await params;
        if (!channelId) {
            return new NextResponse("Channel ID Missing", { status: 400 });
        }

        const { name, type } = await req.json();

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: channelId,
                            name: {
                                not: "general"
                            }
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        })

        return NextResponse.json(server);
    }
    catch (err) {
        console.log("[CHANNEL_ID_DELETE]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {

        const profile = await CurrentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        const { channelId } = await params;
        if (!channelId) {
            return new NextResponse("Channel ID Missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        })

        return NextResponse.json(server);
    }
    catch (err) {
        console.log("[CHANNEL_ID_DELETE]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}