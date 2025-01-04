import prisma from '@/lib/db'
import { PostFindBySlugService } from './post-find-by-slug.service'

export const PostFindAllBlogsService = async ({
    blogSlug,
    postSlug,
}: {
    blogSlug: string
    postSlug: string
}) => {
    const blog = await PostFindBySlugService({ slug: blogSlug })
    if (!blog.data) return { error: 'BLOG_NOT_FOUND' }

    const post = await prisma.post.findFirst({
        where: {
            slug: postSlug,
            blogId: blog.data.id,
            deletedAt: null,
        },
        include: {
            user: true,
        },
    })

    return { data: post }
}
