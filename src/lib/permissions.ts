import { BlogUser } from '@prisma/client'

export const hasPermission = ({
    blogUsers,
    userId,
    roles = [],
}: {
    blogUsers: BlogUser[]
    userId: string
    roles: BlogUser['role'][]
}) =>
    blogUsers.some(user => user.userId === userId && roles.includes(user.role))
