'use server'

import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const BlogCreateUserService = async (
    data: Prisma.BlogUserUncheckedCreateInput,
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: data.userId,
        },
    })

    if (!user) return { error: 'USER_EMAIL_NOT_FOUND' }

    const blogUserExists = await prisma.blogUser.count({
        where: {
            blogId: data.blogId,
            userId: user.id,
        },
    })

    if (blogUserExists > 0) return { error: 'USER_ALREADY_IN_BLOG' }

    await prisma.blogUser.create({
        data: {
            blogId: data.blogId,
            role: data.role,
            userId: user.id,
        },
    })

    revalidatePath('/admin/users')
}
