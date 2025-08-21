import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{
        inviteCode: string
    }>
}
const InviteCodePage = async ({ params }: PageProps) => {
    const { inviteCode } = await params;

    const profile = await CurrentProfile();
    if (!profile) {
        return <RedirectToSignIn />;
    }

    if (!inviteCode) {
        return redirect('/');
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (existingServer !== null) {
        return redirect(`/servers/${existingServer?.id}`);
    }

    const server = await db.server.update({
        where: {
            inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    });

    if (server !== null) {
        return redirect(`/servers/${server?.id}`);
    }

    return null
}

export default InviteCodePage
