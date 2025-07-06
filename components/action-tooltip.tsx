"use client"
import React from 'react'
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip"

type Props = {
    label: string,
    children: React.ReactNode,
    side?: "left" | "right" | "top" | "bottom",
    align?: "start" | "center" | "end"
}
const ActionTooltip = ({
    label,
    children,
    side,
    align
}: Props) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold text-sm">
                        {label[0].toUpperCase() + label.slice(1).toLowerCase()}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default ActionTooltip
