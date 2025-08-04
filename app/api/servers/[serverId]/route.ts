import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {

        const { serverId } = await params;
        const profile = await CurrentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }
        const { name, imageUrl } = await req.json();

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                name: name,
                imageUrl: imageUrl
            }
        });
        return NextResponse.json(server);
    }
    catch (err) {
        console.log("[EDIT_SERVER_ID]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}