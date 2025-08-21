"use client"
import { useSocket } from "./providers/socket-provider";
import { Badge } from "./ui/badge";

const SocketIndicator = () => {
    const { isConnected } = useSocket();

    if (!isConnected) {
        return (
            <Badge variant="outline" className="relative h-3 w-3 rounded-full p-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-100 animate-ping-limited"></span>
            </Badge>

        )
    }
    return (
        <Badge variant="outline" className="relative flex items-center h-3 w-3 rounded-full p-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-100 animate-ping-limited"></span>
        </Badge>

    )
}

export default SocketIndicator;