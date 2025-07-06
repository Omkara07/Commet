"use client"
import Image from 'next/image'
import React from 'react'
import ActionTooltip from '../action-tooltip'
import { cn } from '@/lib/utils'
import { useParams, useRouter } from 'next/navigation'

type Props = {
    serverId: string,
    imageUrl: string,
    name: string
}
const NavigationItem = ({ serverId, imageUrl, name }: Props) => {
    const params = useParams();
    const router = useRouter();
    return (
        <ActionTooltip
            label={name}
            side="right"
            align="center"
        >
            <button
                onClick={() => router.push(`/servers/${serverId}`)}
                className='group flex relative items-center'>
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.serverId !== serverId && "group-hover:h-[20px]",
                    params?.serverId === serverId ? "h-[36px]" : "h-[8px]"
                )}>
                </div>
                <div className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === serverId && "bg-primary/10 text-primary rounded-[16px]"
                )} >
                    <Image src={imageUrl} alt={name} fill />
                </div>
            </button>
        </ActionTooltip >
    )
}

export default NavigationItem
