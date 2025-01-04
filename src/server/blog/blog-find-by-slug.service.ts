'use server'

import prisma from '@/lib/db'
import { User } from 'next-auth'

export const BlogFindBySlugService = async ({
    slug,
    user,
}: {
    slug: string
    user: User
}) => {
    const blog = await prisma.blog.findFirst({
        where: {
            slug,
            deletedAt: null,
        },
        include: {
            users: {
                where: { userId: user.id },
            },
        },
    })

    const blogBelongsToUser = blog?.users.some(data => data.userId === user.id)

    if (!blog || !blogBelongsToUser) return { error: 'BLOG_NOT_FOUND' }

    return { data: blog }
}
