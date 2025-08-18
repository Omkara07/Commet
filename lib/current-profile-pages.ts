import { getAuth } from "@clerk/nextjs/server"
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export default async function CurrentProfilePages(req: NextApiRequest) {
    const { userId } = await getAuth(req);
    if (!userId) return null;

    const currentProfile = await db.profile.findUnique({
        where: {
            userId
        }
    });
    return currentProfile
}