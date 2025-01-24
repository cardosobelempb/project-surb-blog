import { BlogWithUsers } from '@/types/Blog'
import { Blog } from '@prisma/client'
import { create } from 'zustand'
export type BlogAdminState = {
    blogs: Blog[]
    blogSelected: BlogWithUsers | null
}

export type BlogAdminActions = {
    setBlogs: (blogs: Blog[]) => void
    setBlogSelected: (blog: BlogWithUsers | null) => void
}

export const useBlogAdminStore = create<BlogAdminState & BlogAdminActions>(
    set => ({
        blogs: [],
        blogSelected: null,
        setBlogs: blogs => set({ blogs }),
        setBlogSelected: blogSelected => set({ blogSelected }),
    }),
)
