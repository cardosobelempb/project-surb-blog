'use server'

import prisma from '@/lib/db'

import { revalidatePath } from 'next/cache'

export const UserDeleteBlogService = async ({
    blogUserId,
}: {
    blogUserId: string
}) => {
    await prisma.blogUser.delete({
        where: {
            id: blogUserId,
        },
    })

    revalidatePath('/admin/users')
}
