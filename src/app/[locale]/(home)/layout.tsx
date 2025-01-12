import { HomeLayout } from '@/components/layout/home.layout'
import { isAuthenticated } from '@/lib/isAuthenticated'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

const Layout = async ({ children }: { children: ReactNode }) => {
    const session = await isAuthenticated()

    return (
        <SessionProvider session={session}>
            <HomeLayout>{children}</HomeLayout>
        </SessionProvider>
    )
}

export default Layout
