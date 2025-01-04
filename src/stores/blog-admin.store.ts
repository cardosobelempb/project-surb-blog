import { BlogUsersWithUsers } from '@/types/Blog'
import { Blog } from '@prisma/client'
import { create } from 'zustand'
export type BlogAdminState = {
    blogs: Blog[]
    blogSelected: BlogUsersWithUsers | null
}

export type BlogAdminActions = {
    setBlogs: (blogs: Blog[]) => void
    setBlogSelected: (blog: BlogUsersWithUsers | null) => void
}

export const UseBlogAdminStore = create<BlogAdminState & BlogAdminActions>(
    set => ({
        blogs: [],
        blogSelected: null,
        setBlogs: blogs => set({ blogs }),
        setBlogSelected: blogSelected => set({ blogSelected }),
    }),
)
