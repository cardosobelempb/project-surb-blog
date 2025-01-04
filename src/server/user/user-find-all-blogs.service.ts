'use server'

import prisma from '@/lib/db'

export const UserFindAllBlogsService = async ({
    blogSlug,
}: {
    blogSlug: string
}) => {
    const users = await prisma.blogUser.findMany({
        where: {
            blog: { slug: blogSlug },
        },
        include: {
            user: true,
        },
    })

    return { data: users }
}
