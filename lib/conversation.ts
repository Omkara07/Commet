import { db } from "./db"

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await getConversation(memberOneId, memberTwoId) || await createConversation(memberOneId, memberTwoId)
    }
    catch {
        return null
    }
}
const getConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversations.findFirst({
            where: {
                OR: [
                    {
                        memberOneId: memberOneId,
                        memberTwoId: memberTwoId
                    },
                    {
                        memberOneId: memberTwoId,
                        memberTwoId: memberOneId
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
    }
    catch {
        return null
    }
}

const createConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversations.create({
            data: {
                memberOneId,
                memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })
    }
    catch {
        return null
    }
}