'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { redirect } from '@/lib/navigation'
import { Prisma } from '@prisma/client'
import { getLocale } from 'next-intl/server'
import { revalidatePath } from 'next/cache'

export const BlogCreateService = async ({
    data,
}: {
    data: Prisma.BlogUncheckedCreateInput
}) => {
    const user = await auth()
    const locale = await getLocale()

    const slugExists = await prisma.blog.findFirst({
        where: { slug: data.slug },
    })
    if (slugExists) return { error: 'SLUG_ALREADY_EXISTS' }

    const blog = await prisma.blog.create({
        data: {
            ...data,
            users: {
                create: [{ role: 'OWNER', userId: user?.user.id }],
            },
        },
    })

    revalidatePath('/')
    redirect({ href: `/${blog.slug}/admin`, locale })
}
