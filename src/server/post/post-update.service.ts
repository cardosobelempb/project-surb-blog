'use server'

import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

import { revalidatePath } from 'next/cache'

export const PostUpdateService = async (
    postId: string,
    data: Prisma.PostUncheckedUpdateInput,
) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    })

    if (post?.slug !== data.slug) {
        if (
            (await prisma.post.count({
                where: { slug: data.slug as string },
            })) > 0
        ) {
            return { error: 'SLUG_ALREADY_EXISTS' }
        }
    }

    await prisma.post.update({
        where: {
            id: postId,
        },
        data,
    })

    revalidatePath('/admin/posts')
}
