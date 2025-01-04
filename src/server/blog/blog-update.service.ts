'use server'

import prisma from '@/lib/db'
import { redirect } from '@/lib/navigation'
import { getLocale } from 'next-intl/server'
import { revalidatePath } from 'next/cache'

export const BlogUpdateService = async ({
    blogId,
    data,
}: {
    blogId: string
    data: {
        title: string
        subtitle: string
        slug: string
        bgColor: string
        textColor: string
    }
}) => {
    const locale = await getLocale()
    const blog = await prisma.blog.findFirst({
        where: { id: blogId },
        select: { slug: true },
    })

    if (blog?.slug !== data.slug) {
        if ((await prisma.blog.count({ where: { slug: data.slug } })) > 0) {
            return { error: 'SLUG_ALREADY_EXISTS' }
        }
    }

    await prisma.blog.update({
        where: {
            id: blogId,
        },
        data,
    })

    revalidatePath('/admin/settings')

    if (blog?.slug !== data.slug) {
        redirect({ href: `/${data.slug}/admin/settings`, locale })
    }
}
