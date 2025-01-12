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
import { UseBlogAdminStore } from '@/stores/blog-admin.store'
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
    const { blogSelected } = UseBlogAdminStore()

    const editPostTranslations = useTranslations('EditBlogPost')
    const formTranslations = useTranslations('Form')
    const commonTranslations = useTranslations('Common')
    const errorsTranslations = useTranslations('Errors')

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
                message.error(errorsTranslations(`post/${blogPost.error}`))
            } else {
                message.success(editPostTranslations('success'))
                onClose()
            }
        }

    useEffect(() => {
        const handleResetFields = () => {
            form.resetFields()
        }
        handleResetFields()
    }, [form])

    useEffect(() => {
        const handleSetFields = () => {
            form.setFieldsValue(defaultValues)
        }
        handleSetFields()
    }, [defaultValues, form, open])

    return (
        <Drawer
            title={editPostTranslations('title')}
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
                        {commonTranslations('cancel')}
                    </Button>
                    <Button
                        type="primary"
                        onClick={form.submit}
                        loading={loading}
                    >
                        {commonTranslations('save')}
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
                                label={formTranslations('title_label')}
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
                                label={formTranslations('subtitle_label')}
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
                                label={formTranslations('slug_label')}
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
                                label={formTranslations('content_label')}
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
