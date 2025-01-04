'use server'

import { signIn } from '@/lib/auth'
import prisma from '@/lib/db'
import { redirect } from '@/lib/navigation'

export const AuthSignInService = async ({
    data,
}: {
    data: { email: string }
}) => {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    })

    if (!user) return { error: 'ACCOUNT_NOT_FOUND' }

    // Send email verification link
    await signIn('nodemailer', {
        email: data.email,
        redirect: false,
    })

    redirect({ href: '/auth/verify-email', locale: 'pt-BR' })
}
