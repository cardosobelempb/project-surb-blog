import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import prisma from './db'
import Nodemailer from 'next-auth/providers/nodemailer'
import Google from 'next-auth/providers/google'
import Facebbok from 'next-auth/providers/facebook'

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Nodemailer({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
        }),
        Google,
        Facebbok,
    ],
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signup',
        error: '/auth/error',
    },
    callbacks: {
        async session({ session }) {
            return session
        },
    },
})
