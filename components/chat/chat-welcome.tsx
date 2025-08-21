import { Hash } from "lucide-react";

interface Props {
    name: string,
    type: "channel" | "conversation"
}
const ChatWelcome = ({
    name,
    type
}: Props) => {
    return (
        <div className="space-y-2 px-4 mb-4">
            {
                type === "channel" && (
                    <div className="h-[75px] w-[75px] rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-center">
                        <Hash className="h-12 w-12 text-zinc-500 dark:text-white" />
                    </div>
                )
            }
            <p className="text-xl md:text-3xl font-bold">{type == "channel" ? "Welcome to #" : ""}{name}</p>
            <p>
                {
                    type === "channel" && (
                        <>
                            This is the beginning of the #{name} channel.
                        </>
                    )
                }
                {
                    type === "conversation" && (
                        <>
                            This is the beginning of your conversation with {name}
                        </>
                    )
                }
            </p>
        </div >
    );
}

export default ChatWelcome;