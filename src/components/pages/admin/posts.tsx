import { PostDeleteService } from '@/server/post/post-delete.service'
import { PostWithUser } from '@/types/Post'
import { Button, Popconfirm, Space, Table, TableProps, Tag } from 'antd'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { NewBlogPost } from '@/components/new-blog-post'
import { PostEdit } from '@/components/blog-edit'
import { AdminHero } from '@/components/admin-hero'

type Props = {
    posts: PostWithUser[]
}

type DataType = PostWithUser & {
    key: string
}

export const PostsPage: React.FC<Props> = ({ posts }) => {
    const [newBlogPostOpen, setNewBlogPostOpen] = useState(false)
    const [editBlogPostOpen, setEditNewBlogPostOpen] = useState<PostWithUser>(
        {} as PostWithUser,
    )
    const [loading, setLoading] = useState(false)

    const POST_TRANSLATIONS = useTranslations('PostsPage')
    const FORM_TRANSLATIONS = useTranslations('Form')
    const COMMON_TRANSLATIONS = useTranslations('Common')

    const handleDeletePost = async (postId: string) => {
        setLoading(true)
        await PostDeleteService({ postId })
        setLoading(false)
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: FORM_TRANSLATIONS('title_label'),
            dataIndex: ['title'],
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortDirections: ['ascend', 'descend'],
            ellipsis: true,
        },
        {
            title: FORM_TRANSLATIONS('slug_label'),
            dataIndex: ['slug'],
            key: 'slug',
            sorter: (a, b) => a.slug.localeCompare(b.slug),
            sortDirections: ['ascend', 'descend'],
            ellipsis: true,
        },
        {
            title: FORM_TRANSLATIONS('author_label'),
            dataIndex: ['user', 'name'],
            key: 'user.name',
            sorter: (a, b) => a.user.name!.localeCompare(b.user.name!),
            sortDirections: ['ascend', 'descend'],
            ellipsis: true,
            render: (_, record) => (
                <Space>
                    <Tag>{record.user.name}</Tag>
                    <Tag>{record.user.email}</Tag>
                </Space>
            ),
        },
        {
            title: COMMON_TRANSLATIONS('actions'),
            key: 'action',
            width: '8%',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        size="small"
                        className="text-blue-700"
                        onClick={() => setEditNewBlogPostOpen(record)}
                    >
                        <EditOutlined className="text-lg" />
                    </Button>
                    <Popconfirm
                        title={POST_TRANSLATIONS('remove_post_label')}
                        description={POST_TRANSLATIONS(
                            'remove_post_description',
                        )}
                        rootClassName="max-w-72"
                        onConfirm={() => handleDeletePost(record.id)}
                        okText={COMMON_TRANSLATIONS('continue')}
                        cancelText={COMMON_TRANSLATIONS('cancel')}
                    >
                        <Button type="text" size="small" danger>
                            <DeleteOutlined className="text-lg" />
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <>
            <NewBlogPost open={newBlogPostOpen} setOpen={setNewBlogPostOpen} />
            <PostEdit
                open={!!editBlogPostOpen}
                onClose={() => setEditNewBlogPostOpen(undefined!)}
                defaultValues={editBlogPostOpen}
            />

            <div className="">
                <AdminHero
                    title={POST_TRANSLATIONS('title')}
                    description={POST_TRANSLATIONS('descriptio')}
                    extra={
                        <Button
                            type="primary"
                            onClick={() => setNewBlogPostOpen(true)}
                        >
                            {POST_TRANSLATIONS('new_post_label')}
                            <DeleteOutlined className="text-lg" />
                        </Button>
                    }
                />
                <div className="px-4">
                    <Table
                        loading={loading}
                        columns={columns}
                        pagination={false}
                        dataSource={posts.map(item => ({
                            ...item,
                            key: item.id,
                        }))}
                    />
                </div>
            </div>
        </>
    )
}
