"use client";

import { Search } from "lucide-react";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
    data: {
        label: string,
        type: "channel" | "member",
        data: {
            icon: React.ReactNode,
            name: string,
            id: string,
        }[] | undefined
    }[]
}

const ServerSearch = ({ data }: ServerSearchProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        }

        document.addEventListener("keydown", down);

        return () => document.removeEventListener("keydown", down);
    }, []);

    const onClick = (id: string, type: "channel" | "member") => {
        setOpen(false);

        if (type === "member") {
            return router.push(`/servers/${params?.serverId}/conversations/${id}`);
        }

        if (type === "channel") {
            return router.push(`/servers/${params?.serverId}/channels/${id}`);
        }
    }
    return (
        <>
            <button onClick={() => setOpen(true)} className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                <Search className="w-4 h-4 mr-1 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">Search</p>

                <kbd className=" ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                    <span className="font-semibold text-xs text-zinc-500 dark:text-zinc-400">Ctrl</span><span className="font-semibold text-xs text-zinc-500 dark:text-zinc-400">K</span>
                </kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command className="p-0">
                    <CommandInput placeholder="Search all channels and members" />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {data.map((group) => (
                            <CommandGroup key={group.label} heading={group.label}>
                                {group.data?.map(({ icon, name, id }) => (
                                    <CommandItem key={id} onSelect={() => onClick(id, group.type)}>
                                        {icon}
                                        <span>{name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    )
}

export default ServerSearch
