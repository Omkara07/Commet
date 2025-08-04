import { Server, Member, Profile } from "./lib/generated/prisma";

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & {
        profile: Profile;
    })[];
};