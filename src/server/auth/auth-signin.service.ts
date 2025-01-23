'use server'

import { signIn } from '@/lib/auth'
import prisma from '@/lib/db'
import { redirect } from '@/lib/navigation'

export type AuthSignInProps = {
    email: string
}

export const AuthSignInService = async ({ email }: AuthSignInProps) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    })

    if (!user) return { error: 'ACCOUNT_NOT_FOUND' }

    // Send email verification link
    await signIn('nodemailer', {
        email,
        redirect: false,
    })

    redirect({ href: '/auth/verify-email', locale: 'pt-BR' })
}
