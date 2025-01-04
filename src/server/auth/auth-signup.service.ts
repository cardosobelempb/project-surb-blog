'use server'

import { signIn as authSignIn } from '@/lib/auth'
import prisma from '@/lib/db'
import { redirect } from '@/lib/navigation'

export const AuthSignUpService = async ({
    data,
}: {
    data: { name: string; email: string }
}) => {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    })

    if (user) return { error: 'ACCOUNT_ALREADY_EXISTS' }

    // Create user
    await prisma.user.create({ data })

    // Send email verification link
    await authSignIn('nodemailer', {
        email: data.email,
        redirect: false,
    })

    redirect({ href: '/auth/verify-email', locale: 'pt-BR' })
}
