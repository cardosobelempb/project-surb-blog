'use client'

import {
    Button,
    Col,
    Drawer,
    Form,
    FormProps,
    Input,
    message,
    Row,
    Space,
    Spin,
} from 'antd'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'

import { PostUpdateService } from '@/server/post/post-update.service'
import { useBlogAdminStore } from '@/stores/blog-admin.store'
import { PostWithUser } from '@/types/Post'
import { Prisma } from '@prisma/client'
import ReactQuill from 'react-quill'

type Props = {
    open: boolean
    onClose: () => void
    defaultValues: PostWithUser
}

type FieldType = {
    title: string
    subTitle: string
    slug: string
    content: string
}

export const PostEdit = ({ open, defaultValues, onClose }: Props) => {
    const [loading, setLoading] = React.useState(false)
    const [form] = Form.useForm()
    const { blogSelected } = useBlogAdminStore()

    const EDIT_POST_TRANSLATIONS = useTranslations('EditBlogPost')
    const FORM_TRANSLATIONS = useTranslations('Form')
    const COMMON_TRANSLATIONS = useTranslations('Common')
    const ERRORS_TRANSLATIONS = useTranslations('Errors')

    const onFinish: FormProps<Prisma.BlogPostUncheckedUpdateInput>['onFinish'] =
        async values => {
            if (!blogSelected) return

            setLoading(true)
            const blogPost = await PostUpdateService(
                defaultValues.id as string,
                values,
            )
            setLoading(false)

            if (blogPost?.error) {
                message.error(ERRORS_TRANSLATIONS(`post/${blogPost.error}`))
            } else {
                message.success(EDIT_POST_TRANSLATIONS('success'))
                onClose()
            }
        }

    useEffect(() => {
        form.resetFields()
    }, [form])

    useEffect(() => {
        form.setFieldsValue(defaultValues)
    }, [defaultValues, form, open])

    return (
        <Drawer
            title={EDIT_POST_TRANSLATIONS('title')}
            width={520}
            onClose={onClose}
            open={open}
            styles={{
                body: {
                    paddingBottom: 80,
                },
            }}
            extra={
                <Space>
                    <Button onClick={onClose}>
                        {COMMON_TRANSLATIONS('cancel')}
                    </Button>
                    <Button
                        type="primary"
                        onClick={form.submit}
                        loading={loading}
                    >
                        {COMMON_TRANSLATIONS('save')}
                    </Button>
                </Space>
            }
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    requiredMark="optional"
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                name="title"
                                label={FORM_TRANSLATIONS('title_label')}
                                rules={[{ required: true, max: 100 }]}
                            >
                                <Input
                                    showCount
                                    maxLength={100}
                                    placeholder="Ex: Publicação X"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                name="subTitle"
                                label={FORM_TRANSLATIONS('subtitle_label')}
                                rules={[{ max: 191 }]}
                            >
                                <Input
                                    showCount
                                    maxLength={191}
                                    placeholder="Ex: Uma publicação de teste"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                name="slug"
                                label={FORM_TRANSLATIONS('slug_label')}
                                rules={[
                                    {
                                        required: true,
                                        max: 60,
                                        pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                    },
                                ]}
                            >
                                <Input
                                    showCount
                                    maxLength={60}
                                    addonBefore="/"
                                    placeholder="Ex: publicacao-x"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                name="content"
                                label={FORM_TRANSLATIONS('content_label')}
                                rules={[{ required: true }]}
                            >
                                <ReactQuill
                                    theme="snow"
                                    value={form.getFieldValue('content')}
                                    onChange={valeu =>
                                        form.setFieldsValue({ content: valeu })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Drawer>
    )
}
