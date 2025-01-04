'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { UserFindByBlogService } from '../user/user-find-by-blog.service'

export const getBlogPosts = async ({ blogSlug }: { blogSlug: string }) => {
    const session = await auth()
    const user = session?.user

    if (!user) return { error: 'UNAUTHORIZED' }

    const blog = await prisma.blog.findUnique({
        where: { slug: blogSlug },
        select: { id: true },
    })

    const blogUser = await UserFindByBlogService({
        userId: user.id!,
        blogId: blog?.id as string,
    })

    let where: Record<string, unknown> = {
        blog: { slug: blogSlug },
        deletedAt: null,
    }

    if (blogUser.data?.role === 'AUTHOR') {
        where = {
            ...where,
            userId: user.id,
        }
    }

    const blogPosts = await prisma.post.findMany({
        where,
        include: {
            user: true,
        },
    })

    return { data: blogPosts }
}
