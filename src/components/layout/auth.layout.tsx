'use client'

import Brand from '@/assets/imgs/logo.svg'
import { Link } from '@/lib/navigation'
import { Layout } from 'antd'
import Image from 'next/image'
import { LocaleDropdown } from './locale.dropdown'
import { ToogleTheme } from './toogle.theme'

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { Header, Footer, Content } = Layout
    return (
        <Layout className="h-screen overflow-hidden">
            <Layout className="dark:bg-slate-900">
                <Header className="flex justify-between items-center gap-4 xl:px-40 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-b-zinc-900">
                    <Link href={'/auth/signin'}>
                        <Image
                            src={Brand}
                            alt="Logo - Surb BLOG"
                            width={150}
                            priority
                        />
                    </Link>
                    <div className="flex items-center gap-5">
                        <LocaleDropdown />
                        <ToogleTheme />
                    </div>
                </Header>
                <Content className="flex items-center justify-center overflow-auto bg-white dark:bg-slate-950">
                    {children}
                </Content>
                <Footer>Footer</Footer>
            </Layout>
        </Layout>
    )
}
