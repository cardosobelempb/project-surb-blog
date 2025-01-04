'use server'

import prisma from '@/lib/db'

import { revalidatePath } from 'next/cache'

export const PostUpdateService = async ({
    postId,
    data,
}: {
    postId: string
    data: { title: string; subtitle?: string; slug: string; body: string }
}) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
    })

    if (post?.slug !== data.slug) {
        if ((await prisma.post.count({ where: { slug: data.slug } })) > 0) {
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
