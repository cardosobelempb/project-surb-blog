'use server'

import prisma from '@/lib/db'

export const PostFindAllService = async ({ blogId }: { blogId: string }) => {
    const posts = await prisma.post.findMany({
        where: {
            blogId,
            deletedAt: null,
        },
    })

    return { data: posts }
}
