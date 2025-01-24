'use client'

import { AdminHero } from '@/components/admin-hero'
import { hasPermission } from '@/lib/permissions'
import { BlogDeleteService } from '@/server/blog/blog-delete.service'
import { BlogUpdateService } from '@/server/blog/blog-update.service'
import { useBlogAdminStore } from '@/stores/blog-admin.store'
import {
    Button,
    Col,
    Form,
    FormProps,
    Input,
    message,
    Popconfirm,
    Row,
    Spin,
} from 'antd'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'

type FieldType = {
    title: string
    subtitle: string
    slug: string
    bgColor: string
    textColor: string
}

export const SettingsPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()

    const { blogSelected } = useBlogAdminStore()
    const session = useSession()
    const user = session.data?.user

    const SETTING_TRANSLATIONS = useTranslations('SettingsBlog')
    const FORM_TRANSLATIONS = useTranslations('Form')
    const COMMON_TRANSLATIONS = useTranslations('Common')
    const ERRORS_TRANSLATIONS = useTranslations('Errors')

    const handleDeleteBlog = async () => {
        await BlogDeleteService({ blogId: blogSelected?.id as string })
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async values => {
        if (!blogSelected) return
        setLoading(true)
        const blog = await BlogUpdateService({
            blogId: blogSelected.id,
            data: values,
        })
        setLoading(false)

        if (blog?.error) {
            message.error(ERRORS_TRANSLATIONS(`blog/${blog.error}`), 5)
        }
    }

    return (
        <div>
            <AdminHero
                title={SETTING_TRANSLATIONS('title', {
                    name: user?.name,
                })}
                description={SETTING_TRANSLATIONS('descriptio', {
                    blogName: blogSelected?.title,
                })}
                extra={
                    hasPermission({
                        blogUsers: blogSelected?.users as [],
                        userId: user?.id as string,
                        roles: ['OWNER'],
                    }) ? (
                        <Popconfirm
                            title={SETTING_TRANSLATIONS('delete_blog_label')}
                            description={SETTING_TRANSLATIONS(
                                'delete_blog_description',
                            )}
                            rootClassName="max-w-72"
                            onConfirm={handleDeleteBlog}
                            okText={COMMON_TRANSLATIONS('continue')}
                            cancelText={COMMON_TRANSLATIONS('cancel')}
                        >
                            <Button type="primary" danger>
                                {SETTING_TRANSLATIONS('delete_blog_label')}
                            </Button>
                        </Popconfirm>
                    ) : null
                }
            />
            <div className="py-4 px-9">
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        layout="vertical"
                        requiredMark="optional"
                        onFinish={onFinish}
                        initialValues={{
                            title: blogSelected?.title,
                            subTitle: blogSelected?.subTitle,
                            slug: blogSelected?.slug,
                            bgColor: blogSelected?.bgColor,
                            textColor: blogSelected?.textColor,
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item<FieldType>
                                    name="title"
                                    label={FORM_TRANSLATIONS('title_label')}
                                    rules={[{ required: true, max: 60 }]}
                                >
                                    <Input showCount maxLength={60} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item<FieldType>
                                    name="slug"
                                    label={FORM_TRANSLATIONS('slug_label')}
                                    rules={[
                                        {
                                            required: true,
                                            max: 60,
                                            pattern:
                                                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                        },
                                    ]}
                                >
                                    <Input
                                        style={{ width: '100%' }}
                                        showCount
                                        maxLength={60}
                                        addonBefore="/"
                                        placeholder="Ex: meu-blog"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item<FieldType>
                                    name="bgColor"
                                    label={FORM_TRANSLATIONS('bg_color_label')}
                                    rules={[{ required: true, max: 45 }]}
                                >
                                    <Input
                                        style={{ width: '100%' }}
                                        type="color"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item<FieldType>
                                    name="textColor"
                                    label={FORM_TRANSLATIONS(
                                        'text_color_label',
                                    )}
                                    rules={[{ required: true, max: 45 }]}
                                >
                                    <Input
                                        style={{ width: '100%' }}
                                        type="color"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item<FieldType>
                                    name="subtitle"
                                    label={FORM_TRANSLATIONS('subtitle_label')}
                                    rules={[{ max: 191 }]}
                                >
                                    <Input.TextArea
                                        showCount
                                        rows={4}
                                        maxLength={191}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {COMMON_TRANSLATIONS('save')}
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </div>
    )
}
