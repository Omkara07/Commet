"use client"
import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

interface QueryProps {
    apiUrl: string;
    queryKey: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
}

export const useChatQuery = ({ apiUrl, queryKey, paramKey, paramValue }: QueryProps) => {
    const { isConnected } = useSocket();

    const fetchMessages = async ({ pageParam = null }) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query: {
                    cursor: pageParam,
                    [paramKey]: paramValue,
                }
            }, { skipNull: true });

            const res = await fetch(url);
            return res.json();
        } catch (err) {
            console.log(err);
        }
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
        initialPageParam: null,
    });

    return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
}