import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
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

        const { name, type } = await req.json();

        if (name === 'general') {
            return new NextResponse("Name cannot be 'general'", { status: 400 });
        }

        const res = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        });

        return NextResponse.json(res);
    }
    catch (err) {
        console.log("[CHANNELS_POST]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}