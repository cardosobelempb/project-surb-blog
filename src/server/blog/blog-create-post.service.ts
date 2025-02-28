import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export const BlogCreatePostService = async (
    data: Prisma.PostUncheckedCreateInput,
) => {
    const session = await auth()
    const user = session?.user

    if (!user) return { error: 'UNAUTHORIZED' }

    const postExists = await prisma.post.count({ where: { slug: data.slug } })
    if (postExists) return { error: 'SLUG_ALREADY_EXISTS' }

    await prisma.post.create({
        data: {
            ...data,
            userId: user.id!,
        },
    })

    revalidatePath('/admin/posts')
}
