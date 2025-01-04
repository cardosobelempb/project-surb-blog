'use server'

import prisma from '@/lib/db'
import { BlogUser } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const UserUpdateRoleService = async ({
    blogUserId,
    data,
}: {
    blogUserId: string
    data: { role: BlogUser['role'] }
}) => {
    await prisma.blogUser.update({
        where: {
            id: blogUserId,
        },
        data: {
            role: data.role,
        },
    })

    revalidatePath('/admin/users')
}
