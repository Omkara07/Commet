import { useEffect, useState } from "react"

type props = {
    chatRef: React.RefObject<HTMLDivElement | null>
    bottomRef: React.RefObject<HTMLDivElement | null>
    shouldLoadMore: boolean
    loadMore: () => void
    count: number
}

export const useChatScroll = ({ chatRef, bottomRef, shouldLoadMore, loadMore, count }: props) => {
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        const topDiv = chatRef?.current;

        const onScroll = () => {
            const scrollTop = topDiv?.scrollTop;

            if (scrollTop === 0 && shouldLoadMore) {
                loadMore();
            }
        };

        topDiv?.addEventListener("scroll", onScroll);

        return () => {
            topDiv?.removeEventListener("scroll", onScroll);
        };
    }, [shouldLoadMore, loadMore, chatRef]);

    useEffect(() => {
        const bottomDiv = bottomRef?.current;
        const topDiv = chatRef?.current;
        const shouldScrollToBottom = () => {
            if (!hasInitialized && bottomDiv) {
                setHasInitialized(true);
                return true;
            }

            if (!topDiv) {
                return false;
            }

            const distanceToBottom =
                topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

            return distanceToBottom < 100;
        };

        if (shouldScrollToBottom()) {
            setTimeout(() => {
                bottomDiv?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        };
    }, [count, chatRef, bottomRef, hasInitialized]);
}