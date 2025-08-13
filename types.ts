import { Server, Member, Profile } from "./lib/generated/prisma";
import { Server as NetServer, Socket } from "net";
import { Server as ServerIO } from "socket.io";
import { NextApiResponse } from "next";
export type ServerWithMembersWithProfiles = Server & {
    members: (Member & {
        profile: Profile;
    })[];
};

export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: ServerIO;
        };
    };
};
