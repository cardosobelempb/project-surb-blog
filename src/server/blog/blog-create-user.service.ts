'use server'

import prisma from '@/lib/db'
import { BlogUser } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const BlogCreateUserService = async ({
    data,
}: {
    data: { email: string; blogId: string; role: BlogUser['role'] }
}) => {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
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
