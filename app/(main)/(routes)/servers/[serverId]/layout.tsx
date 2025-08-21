import ServerSidebar from '@/components/server/server-sidebar'
import CurrentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { RedirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

export const dynamic = 'force-dynamic';

const ServerIdLayout = async ({ children, params }: { children: React.ReactNode, params: { serverId: string } }) => {
    const profile = await CurrentProfile();

    if (!profile) {
        return <RedirectToSignIn />;
    }

    const { serverId } = await params;
    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (!server) {
        return redirect("/");
    }

    return (
        <div>
            <div className='hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
                <ServerSidebar serverId={serverId} />
            </div>
            <main className='h-full md:pl-60'>
                {children}
            </main>
        </div>
    )
}

export default ServerIdLayout
