"use client"
import { MemberRole } from '@/lib/generated/prisma'
import { ServerWithMembersWithProfiles } from '@/types'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react'
import { useModal } from '@/hooks/use-model-store'
// import { animate } from 'tailwindcss-animate'

type Props = {
    server: ServerWithMembersWithProfiles,
    role?: MemberRole
}
const ServerHeader = ({ server, role }: Props) => {
    const { onOpen } = useModal();
    const isAdmin = role === MemberRole.ADMIN
    const Moderator = isAdmin || role === MemberRole.MODERATOR
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='focus:outline-none' asChild>
                <button
                    className='w-full text-md font-bold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
                    {server.name}
                    <ChevronDown className='h-5 w-5 ml-auto ' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 text-sm font-medium text-black dark:text-neutral-400 space-y-[2px]'>
                {Moderator && (
                    <DropdownMenuItem onClick={() => onOpen("invite", { server })} className='group text-emerald-600 dark:text-emerald-400 px-3 py-2 text-sm cursor-pointer'>
                        Invite People
                        <UserPlus className='h-4 w-4 ml-auto group-hover:animate-shake duration-300' />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("editServer", { server })} className='group px-3 py-2 text-sm cursor-pointer'>
                        Server Settings
                        <Settings className='h-4 w-4 ml-auto group-hover:animate-wobble duration-300' />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("members", { server })} className='px-3 py-2 text-sm cursor-pointer'>
                        Manage Members
                        <Users className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {Moderator && (
                    <DropdownMenuItem onClick={() => onOpen("createChannel", { server })} className='px-3 py-2 text-sm cursor-pointer'>
                        Create Channels
                        <PlusCircle className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {
                    Moderator && <DropdownMenuSeparator />
                }
                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("deleteServer", { server })} className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
                        Delete server
                        <Trash className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("leaveServer", { server })} className='text-rose-500 px-3 py-2 text-sm cursor-pointer'>
                        Leave server
                        <LogOut className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu >
    )
}

export default ServerHeader
