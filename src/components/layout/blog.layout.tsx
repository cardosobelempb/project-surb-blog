'use client'

import { Link } from '@/lib/navigation'
import { Layout } from 'antd'
import Image from 'next/image'
import Brand from '@/assets/imgs/logo.svg'
import { LocaleDropdown } from './locale.dropdown'
import { ToogleTheme } from './toogle.theme'
import { Blog } from '@prisma/client'
import { UseBlogStore } from '@/stores/blog.store'
import { useEffect } from 'react'

type Props = { children: React.ReactNode; blog: Blog }

export const BlogLayout: React.FC<Props> = ({ children, blog }) => {
    const { Header, Footer, Content } = Layout

    const { setBlog } = UseBlogStore()

    useEffect(() => {
        setBlog(blog)
    }, [blog, setBlog])

    return (
        <Layout className="h-screen overflow-hidden">
            <Header className="flex justify-between bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-b-zinc-900">
                <div className="flex items-center justify-between container px-8">
                    <Link href={`/${blog.slug}`}>
                        <Image
                            src={Brand}
                            alt="Logo - Surb BLOG"
                            width={150}
                            priority
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-8">
                    <LocaleDropdown />
                    <ToogleTheme />
                </div>
            </Header>
            <Content>
                <div className="size-full flex items-center justify-center overflow-auto container px-8 mx-auto">
                    {children}
                </div>
            </Content>
            <Footer>Footer</Footer>
        </Layout>
    )
}
