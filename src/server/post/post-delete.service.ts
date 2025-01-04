'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export const PostDeleteService = async ({ postId }: { postId: string }) => {
    await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            deletedAt: new Date(),
        },
    })

    revalidatePath('/admin/posts')
}
