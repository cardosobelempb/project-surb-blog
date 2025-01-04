'use server'

import { auth } from '@/lib/auth'

import prisma from '@/lib/db'

export const BlogFindAllService = async () => {
    const user = await auth()

    const blogs = await prisma.blog.findMany({
        where: {
            users: { some: { userId: user?.user?.id } },
            deletedAt: null,
        },
    })

    return { data: blogs }
}
