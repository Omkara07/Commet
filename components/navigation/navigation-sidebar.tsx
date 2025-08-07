import CurrentProfile from '@/lib/current-profile'
import { db } from '@/lib/db';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'
import NavigationAction from './navigation-action';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import NavigationItem from './navigation-item';
import { cn } from '@/lib/utils';
import { ModeToggle } from '../toggleModeButton';
import { UserButton } from '@clerk/nextjs';

const NavigationSidebar = async () => {
    const profile = await CurrentProfile();
    if (!profile) return redirect('/');

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    return (
        <div className='space-y-4 flex flex-col h-full items-center py-8 bg-[#E3E5E8] dark:bg-black w-full text-primary'>
            <NavigationAction />
            <div className='flex w-10'>
                <Separator className="border-b-[2px] bg-zinc-300 rounded-md dark:bg-zinc-700 mx-auto" />
            </div>
            <ScrollArea className='h-full'>
                {
                    servers.map((server) => (
                        <div key={server.id} className='w-full mb-4 flex justify-center'>
                            <NavigationItem serverId={server.id} name={server.name} imageUrl={server.imageUrl} />
                        </div>
                    ))
                }
            </ScrollArea>
            <div className='flex flex-col w-full gap-y-4 pb-3 items-center mx-auto'>
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            userButtonAvatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default NavigationSidebar
