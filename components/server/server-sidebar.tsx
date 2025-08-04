import CurrentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType } from '@/lib/generated/prisma';
import { redirect } from 'next/navigation';
import React from 'react'
import ServerHeader from './server-header';

type Props = {
    serverId: string
}
const ServerSidebar = async ({ serverId }: Props) => {
    const profile = await CurrentProfile();

    if (!profile) return redirect('/');

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: 'asc'
                }
            }
        }
    })

    if (!server) return redirect('/');

    const textChannels = server.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const voiceChannels = server.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const VideoChannels = server.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    const members = server.members.filter((member) => member.profileId !== profile.id);

    const role = server.members.find((m) => m.profileId === profile.id)?.role;

    return (
        <div className='flex flex-col h-full text-primary w-full dark:bg-[#101112] bg-[#F2F3F5]'>
            <ServerHeader server={server} role={role} />
        </div>
    )
}

export default ServerSidebar
