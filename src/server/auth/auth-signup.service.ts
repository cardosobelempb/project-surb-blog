'use server'

import { signIn as authSignIn } from '@/lib/auth'
import prisma from '@/lib/db'
import { redirect } from '@/lib/navigation'

export type AuthSignUpProps = {
    name: string
    email: string
}

export const AuthSignUpService = async ({ name, email }: AuthSignUpProps) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    })

    if (user) return { error: 'ACCOUNT_ALREADY_EXISTS' }

    // Create user
    await prisma.user.create({ data: { name, email } })

    // Send email verification link
    await authSignIn('nodemailer', {
        email,
        redirect: false,
    })

    redirect({ href: '/auth/verify-email', locale: 'pt-BR' })
}
