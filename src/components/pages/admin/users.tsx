import { AdminHero } from '@/components/admin-hero'
import { NewBlogUser } from '@/components/new-blog-user'
import { UserDeleteBlogService } from '@/server/user/user-delete-blog.service'
import { UserUpdateRoleService } from '@/server/user/user-update-role.service'
import { BlogUsersWithUsers } from '@/types/Blog'
import { DeleteOutlined } from '@ant-design/icons'
import { BlogUser } from '@prisma/client'
import { Button, Popconfirm, Select, Table, TableProps, Tag } from 'antd'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Props = {
    users: BlogUsersWithUsers[]
}

type DataType = BlogUsersWithUsers & {
    key: string
}

export const UsersPage: React.FC<Props> = ({ users }) => {
    const [newBlogUserOpen, setNewBlogUserOpen] = useState(false)

    const [loading, setLoading] = useState(false)

    const USER_TRANSLATIONS = useTranslations('UsersPage')
    const FORM_TRANSLATIONS = useTranslations('Form')
    const COMMON_TRANSLATIONS = useTranslations('Common')

    const session = useSession()

    const handleChangeRole = async (
        blogUserId: string,
        role: BlogUser['role'],
    ) => {
        setLoading(true)
        await UserUpdateRoleService({ blogUserId, data: { role } })
        setLoading(false)
    }

    const handleDeleteUser = async (blogUserId: string) => {
        setLoading(true)
        await UserDeleteBlogService({ blogUserId })
        setLoading(false)
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: FORM_TRANSLATIONS('user_name_label'),
            dataIndex: ['user', 'name'],
            key: 'name',
            sorter: (a, b) => a.user.name!.localeCompare(b.user.name!),
            sortDirections: ['ascend', 'descend'],
            ellipsis: true,
        },
        {
            title: FORM_TRANSLATIONS('user_email_label'),
            dataIndex: ['user', 'email'],
            key: 'email',
            sorter: (a, b) => a.user.email.localeCompare(b.user.email),
            sortDirections: ['ascend', 'descend'],
            ellipsis: true,
        },
        {
            title: FORM_TRANSLATIONS('role_label'),
            dataIndex: 'role',
            key: 'role',
            width: '12%',
            render: (_, record) => (
                <div className="px-2">
                    {record.role === 'OWNER' ? (
                        <Tag color="gold">{COMMON_TRANSLATIONS('owner')}</Tag>
                    ) : (
                        <Select
                            defaultValue={record.role}
                            className="w-full"
                            variant="borderless"
                            disabled={session.data?.user.id === record.userId}
                            onChange={newRole =>
                                handleChangeRole(record.id, newRole)
                            }
                            size="small"
                            options={[
                                {
                                    value: 'ADMIN',
                                    label: COMMON_TRANSLATIONS('admin'),
                                },
                                {
                                    value: 'AUTHOR',
                                    label: COMMON_TRANSLATIONS('author'),
                                },
                                {
                                    value: 'EDITOR',
                                    label: COMMON_TRANSLATIONS('editor'),
                                },
                            ]}
                        />
                    )}
                </div>
            ),
        },

        {
            title: COMMON_TRANSLATIONS('actions'),
            key: 'action',
            width: '8%',
            render: (_, record) => (
                <>
                    {record.role === 'OWNER' && session.data?.user.id && (
                        <Popconfirm
                            title={USER_TRANSLATIONS('remove_user_label')}
                            description={USER_TRANSLATIONS(
                                'remove_user_description',
                            )}
                            rootClassName="max-w-72"
                            onConfirm={() => handleDeleteUser(record.id)}
                            okText={COMMON_TRANSLATIONS('continue')}
                            cancelText={COMMON_TRANSLATIONS('cancel')}
                        >
                            <Button type="text" size="small" danger>
                                <DeleteOutlined className="text-lg" />
                            </Button>
                        </Popconfirm>
                    )}
                </>
            ),
        },
    ]

    return (
        <>
            <NewBlogUser open={newBlogUserOpen} setOpen={setNewBlogUserOpen} />
            <div className="">
                <AdminHero
                    title={USER_TRANSLATIONS('title')}
                    description={USER_TRANSLATIONS('descriptio')}
                    extra={
                        <Button
                            type="primary"
                            onClick={() => setNewBlogUserOpen(true)}
                        >
                            {USER_TRANSLATIONS('new_user_label')}
                            <DeleteOutlined className="text-lg" />
                        </Button>
                    }
                />
                <div className="px-4">
                    <Table
                        loading={loading}
                        columns={columns}
                        pagination={false}
                        dataSource={users.map(item => ({
                            ...item,
                            key: item.id,
                        }))}
                    />
                </div>
            </div>
        </>
    )
}
