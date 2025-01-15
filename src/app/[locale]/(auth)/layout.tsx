import { AuthLayout } from '@/components/layout/auth.layout'
import { isNotAuthenticated } from '@/lib/isNotAuthenticated'
import { ReactNode } from 'react'

const Layout = async ({ children }: { children: ReactNode }) => {
    await isNotAuthenticated()

    return <AuthLayout>{children}</AuthLayout>
}

export default Layout
