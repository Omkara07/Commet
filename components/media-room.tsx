"use client"
import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface Props {
    chatId: string;
    video: boolean;
    audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: Props) => {
    const user = useUser();
    const [token, setToken] = useState("");
    useEffect(() => {
        if (!user?.user?.firstName || !user?.user?.lastName) {
            return;
        }

        const name = `${user.user.firstName} ${user.user.lastName}`;

        (async () => {
            try {
                const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
                const data = await res.json();
                setToken(data.token);
            }
            catch (err) {
                console.log(err);
            }
        })()
    }, [chatId, user, user?.user?.firstName, user?.user?.lastName]);

    if (token === "") {
        return (
            <div className="flex-1 flex flex-col justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading messages...</p>
            </div>
        )
    }
    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL!}
            token={token}
            connect={true}
            video={video}
            audio={audio}
        >
            <div className="w-full h-full max-h-[100vh] overflow-hidden">
                <VideoConference />
            </div>
        </LiveKitRoom>
    )
}