import CurrentProfile from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@/lib/generated/prisma';
import { redirect } from 'next/navigation';
import React from 'react'
import ServerHeader from './server-header';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import ServerSearch from './server-search';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { Separator } from '../ui/separator';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import ServerMember from './server-member';

type Props = {
    serverId: string
}

const IconMap = {
    [ChannelType.TEXT]: <Hash className='h-4 w-4 mr-2' />,
    [ChannelType.AUDIO]: <Mic className='h-4 w-4 mr-2' />,
    [ChannelType.VIDEO]: <Video className='h-4 w-4 mr-2' />
}
const RoleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500' />,
    [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-2 text-rose-500' />
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
    const videoChannels = server.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    const members = server.members.filter((member) => member.profileId !== profile.id);

    const role = server.members.find((m) => m.profileId === profile.id)?.role;

    return (
        <div className='flex flex-col h-full text-primary w-full max-md:z-10 dark:bg-[#101112] bg-[#F2F3F5]'>
            <ServerHeader server={server} role={role} />
            <ScrollArea className='flex-1 px-3'>
                <div className='mt-2'>
                    <ServerSearch data={[
                        {
                            label: 'Text Channels',
                            type: 'channel',
                            data: textChannels.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: IconMap[channel.type]
                            }))
                        },
                        {
                            label: 'Voice Channels',
                            type: 'channel',
                            data: voiceChannels.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: IconMap[channel.type]
                            }))
                        },
                        {
                            label: 'Video Channels',
                            type: 'channel',
                            data: videoChannels.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: IconMap[channel.type]
                            }))
                        },
                        {
                            label: 'Members',
                            type: 'member',
                            data: members.map((mem) => ({
                                id: mem.id,
                                name: mem?.profile.name,
                                icon: RoleIconMap[mem.role]
                            }))
                        },
                    ]} />
                </div>
                <Separator className='my-2 bg-zinc-200 rounded-md dark:bg-zinc-800' />

                {
                    !!textChannels.length &&
                    <div className='mb-2'>
                        <ServerSection sectionType='channels' channelType={ChannelType.TEXT} label='Text Channels' role={role} />
                        <div className='space-y-[1px]'>
                            {
                                textChannels.map((channel) => (
                                    <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                                ))
                            }
                        </div>
                    </div>
                }
                {
                    !!voiceChannels.length &&
                    <div className='mb-2'>
                        <ServerSection sectionType='channels' channelType={ChannelType.AUDIO} label='Voice Channels' role={role} />
                        <div className='space-y-[1px]'>
                            {
                                voiceChannels.map((channel) => (
                                    <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                                ))
                            }
                        </div>
                    </div>
                }
                {
                    !!videoChannels.length &&
                    <div className='mb-2'>
                        <ServerSection sectionType='channels' channelType={ChannelType.VIDEO} label='Video Channels' role={role} />
                        <div className='space-y-[1px]'>
                            {

                                videoChannels.map((channel) => (
                                    <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                                ))
                            }
                        </div>
                    </div>
                }
                {
                    !!members.length &&
                    <div className='mb-2'>
                        <ServerSection sectionType='members' label='Members' role={role} server={server} />
                        <div className='space-y-[1px]'>
                            {
                                members.map((member) => (
                                    <ServerMember key={member.id} member={member} server={server} />
                                ))
                            }
                        </div>
                    </div>
                }

            </ScrollArea>
        </div>
    )
}

export default ServerSidebar
