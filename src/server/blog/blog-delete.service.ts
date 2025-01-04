'use server'

import prisma from '@/lib/db'
import { redirect } from '@/lib/navigation'
import { getLocale } from 'next-intl/server'

export const BlogDeleteService = async ({ blogId }: { blogId: string }) => {
    const locale = await getLocale()
    await prisma.blog.update({
        where: {
            id: blogId,
        },
        data: {
            deletedAt: new Date(),
        },
    })

    redirect({ href: '/', locale })
}
