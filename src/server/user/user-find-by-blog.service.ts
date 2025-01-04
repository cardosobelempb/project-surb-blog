'use server'

import prisma from '@/lib/db'

export const UserFindByBlogService = async ({
    userId,
    blogId,
}: {
    userId: string
    blogId: string
}) => {
    const user = await prisma.blogUser.findFirst({
        where: {
            userId,
            blogId,
        },
        include: {
            user: true,
        },
    })

    return { data: user }
}
