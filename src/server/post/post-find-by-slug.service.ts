'use server'

import prisma from '@/lib/db'

export const PostFindBySlugService = async ({ slug }: { slug: string }) => {
    const blog = await prisma.blog.findFirst({
        where: {
            slug,
            deletedAt: null,
        },
    })

    return { data: blog }
}
