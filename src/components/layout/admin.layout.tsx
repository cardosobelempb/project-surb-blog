'use client'

import Brand from '@/assets/imgs/logo.svg'
import BrandShort from '@/assets/imgs/shortLogo.svg'
import { Link, usePathname, useRouter } from '@/lib/navigation'
import { hasPermission } from '@/lib/permissions'
import { BlogFindAllService } from '@/server/blog/blog-find-all.service'
import { useBlogAdminStore } from '@/stores/blog-admin.store'
import { BlogUsersWithUsers } from '@/types/Blog'
import {
    DashboardOutlined,
    FileTextOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Button, Layout, Menu, MenuProps, Select, Spin } from 'antd'
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb'
import { User } from 'next-auth'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { LocaleDropdown } from './locale.dropdown'
import { ToogleTheme } from './toogle.theme'

type Props = {
    children: React.ReactNode
    blog: BlogUsersWithUsers
    user: User
}

export const AdminLayout: React.FC<Props> = ({ blog, children, user }) => {
    const { Header, Content, Footer, Sider } = Layout
    const [collapsed, setCollapsed] = useState(false)
    const [restricted, setRestricted] = useState(true)
    const [loading, setLoading] = useState(true)

    const router = useRouter()
    const pathname = usePathname()
    const ADMIN_LAYOUT_TRANSLATIONS = useTranslations()
    const { blogs, setBlogs, setBlogSelected } = useBlogAdminStore()

    const handleCollapse = () => setCollapsed(!collapsed)
    const formatedPathname = `/${pathname.split('/').slice(2).join('/')}`
    const handleChangeBlog = (slug: string) => {
        router.replace(`/${slug}/${formatedPathname}`)
    }

    const menuItems: MenuProps['items'] = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => router.push(`/${blog}/admin`),
        },
        {
            key: '/admin/posts',
            icon: <FileTextOutlined />,
            label: ADMIN_LAYOUT_TRANSLATIONS('posts'),
            onClick: () => router.push(`/${blog}/admin/posts`),
        },
        {
            key: '/admin/users',
            icon: <UserOutlined />,
            label: 'Dashboard',
            disabled: !hasPermission({
                blogUsers: blog.users,
                userId: user.id as string,
                roles: ['OWNER', 'ADMIN'],
            }),
            onClick: () => router.push(`/${blog}/admin/users`),
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: ADMIN_LAYOUT_TRANSLATIONS('settings'),
            disabled: !hasPermission({
                blogUsers: blog.users,
                userId: user.id as string,
                roles: ['OWNER', 'ADMIN'],
            }),
            onClick: () => router.push(`/${blog}/admin/settings`),
        },
    ]

    const breadcrumbItems: { pathname: string; items: BreadcrumbItemType[] }[] =
        [
            {
                pathname: '/admin',
                items: [{ title: 'Dashboard', href: '/admin' }],
            },
            {
                pathname: '/admin/users',
                items: [
                    { title: 'Dashboard', href: '/admin' },
                    {
                        title: ADMIN_LAYOUT_TRANSLATIONS('users'),
                        href: '/admin/users',
                    },
                ],
            },
            {
                pathname: '/admin/posts',
                items: [
                    { title: 'Dashboard', href: '/admin' },
                    {
                        title: ADMIN_LAYOUT_TRANSLATIONS('posts'),
                        href: '/admin/posts',
                    },
                ],
            },
            {
                pathname: '/admin/settings',
                items: [
                    { title: 'Dashboard', href: '/admin' },
                    {
                        title: ADMIN_LAYOUT_TRANSLATIONS('settings'),
                        href: '/admin/settings',
                    },
                ],
            },
        ]

    useEffect(() => {
        setBlogSelected(blog)
        const handleGetBlogs = async () => {
            setLoading(true)
            const blogs = await BlogFindAllService()
            setLoading(false)
            setBlogs(blogs.data)
        }
        handleGetBlogs()
    }, [blog, setBlogSelected, setBlogs])

    useEffect(() => {
        if (
            (formatedPathname.includes('/users') ||
                formatedPathname.includes('/settings')) &&
            !hasPermission({
                blogUsers: blog.users,
                userId: user.id as string,
                roles: ['OWNER', 'ADMIN'],
            })
        ) {
            router.replace(`/${blog.slug}/admin`)
        } else {
            setRestricted(false)
        }
    }, [blog, formatedPathname, router, user.id])
    return (
        <Layout className="h-screen overflow-hidden">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="bg-white dark:bg-slate-950"
            >
                <Link
                    href={'/'}
                    className="flex items-center justify-center border-b border-slate-200 dark:border-b-zinc-800 mb-4"
                >
                    <Image
                        src={Brand}
                        alt="Logo - Surb BLOG"
                        width={150}
                        height={150}
                        priority
                        className={`duration-300 absolute ${
                            collapsed ? 'opacity-0' : 'opacity-100'
                        }`}
                    />
                    <Image
                        src={BrandShort}
                        alt="Logo - Surb BLOG"
                        width={40}
                        priority
                        className={`py-[13.5px] transition ${
                            collapsed ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                </Link>
                <div className="px-2 pb-4 border-b border-slate-200 dark:border-zinc-800">
                    <Select
                        showSearch
                        className="w-full"
                        defaultValue={blog.slug}
                        onChange={handleChangeBlog}
                        loading={loading}
                        options={blogs.map(blog => ({
                            value: blog.slug,
                            label: blog.title,
                        }))}
                    />
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[formatedPathname]}
                    selectedKeys={[formatedPathname]}
                    items={menuItems}
                    className="h-full border-r-0 bg-white dark:bg-slate-950"
                />
            </Sider>
            <Layout className="dark:bg-slate-900">
                <Header className="flex justify-between items-center pr-14 gap-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-b-zinc-900">
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={handleCollapse}
                        className="size-16"
                    />
                    <div className="flex items-center gap-5">
                        <LocaleDropdown />
                        <ToogleTheme />
                    </div>
                </Header>
                <Content className="px-4 pb-2 flex flex-col overflow-auto">
                    <Breadcrumb
                        className="my-3"
                        items={
                            breadcrumbItems.find(
                                item => item.pathname === formatedPathname,
                            )?.items || []
                        }
                        itemRender={router => (
                            <Link href={`/${blog.slug}${router.href || ''}`}>
                                {router.title}
                            </Link>
                        )}
                    />
                    <div className="flex-1 relative rounded-lg bg-white dark:bg-slate-950">
                        <Spin
                            className="flex items-center justify-center size-full absolute bg-white dark:bg-slate-950"
                            spinning={restricted}
                        />
                        {!restricted && children}
                    </div>
                </Content>
                <Footer>Footer</Footer>
            </Layout>
        </Layout>
    )
}
