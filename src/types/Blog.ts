import { Blog, Prisma } from '@prisma/client'

export type BlogWithUsers = Prisma.BlogGetPayload<{
    include: {
        users: true
    }
}>

export type BlogUsersWithUsers = Prisma.BlogUserGetPayload<{
    include: {
        user: true
    }
}>

export class PrismaBlogMapper {
    static toPrisma(blog: Blog): Prisma.BlogUncheckedCreateInput {
        return {
            id: blog.id,
            title: blog.title,
            subTitle: blog.subTitle,
            slug: blog.slug,
            bgColor: blog.bgColor,
            textColor: blog.textColor,
            isActive: blog.isActive,
            deletedAt: blog.deletedAt,
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
        }
    }
}
