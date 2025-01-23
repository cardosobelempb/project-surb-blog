'use client'

import { sendPromptToGemini } from '@/lib/gemini'
import { BlogCreateService } from '@/server/blog/blog-create.service'
import { ThunderboltOutlined } from '@ant-design/icons'
import { Prisma } from '@prisma/client'
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
    theme,
    Tooltip,
} from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import React, { useState } from 'react'

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
}

// type FieldType = {
//     title: string
//     subTitle: string
//     slug: string
//     bgColor: string
//     textColor: string
// }

export const NewBlog: React.FC<Props> = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const locale = useLocale()
    const {
        token: { colorPrimary },
    } = theme.useToken()

    const NEW_BLOG_TRANSLATIONS = useTranslations('NewBlog')
    const FORM_TRANSLATIONS = useTranslations('Form')
    const COMMON_TRANSLATIONS = useTranslations('Common')
    const ERRORS_TRANSLATIONS = useTranslations('Errors')

    const onClose = () => setOpen(false)

    const handleGenerateGemini = async () => {
        setLoading(true)
        const response = await sendPromptToGemini({
            prompt: `
                Escreva um blog sobre qualquer tema de sua escolha. Crie sempre algo diferente e não repita, na lingua ${locale}, porém responda no formato JSON.
                Siga esse exemplo e respeite as regras abaixo:
                {
                    "title": "Título do blog (max. 60 caracteres)",
                    "subtitle": "Descrição do blog (max. 191 caracteres)",
                    "slug": "Slug do blog (max. 191 caracteres, siga o regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/)"
                }
            `,
        })

        form.setFieldsValue(response)
        setLoading(false)
    }

    const onFinish: FormProps<Prisma.BlogUncheckedCreateInput>['onFinish'] =
        async values => {
            setLoading(true)
            const blog = await BlogCreateService({ data: values })
            setLoading(false)

            if (blog?.error) {
                message.error(ERRORS_TRANSLATIONS(`blog/${blog.error}`), 5)
            }
        }

    return (
        <Drawer
            title={NEW_BLOG_TRANSLATIONS('title')}
            width={720}
            onClose={onClose}
            open={open}
            styles={{
                body: {
                    paddingBottom: 80,
                },
            }}
            extra={
                <Space>
                    <Tooltip
                        title={NEW_BLOG_TRANSLATIONS('ai_tooltip')}
                        className="mr-2"
                    >
                        <Button type="text" onClick={handleGenerateGemini}>
                            <ThunderboltOutlined
                                classID="text-xl"
                                style={{ color: colorPrimary }}
                            />
                        </Button>
                    </Tooltip>
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
                    initialValues={{
                        bgColor: '#FFFFFF',
                        textColor: '#000000',
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item<Prisma.BlogUncheckedCreateInput>
                                name="title"
                                label={FORM_TRANSLATIONS('title_label')}
                                rules={[{ required: true, max: 60 }]}
                            >
                                <Input showCount maxLength={60} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<Prisma.BlogUncheckedCreateInput>
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
                            <Form.Item<Prisma.BlogUncheckedCreateInput>
                                name="bgColor"
                                label={FORM_TRANSLATIONS('bg_color_label')}
                                rules={[{ required: true, max: 45 }]}
                            >
                                <Input style={{ width: '100%' }} type="color" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<Prisma.BlogUncheckedCreateInput>
                                name="textColor"
                                label={FORM_TRANSLATIONS('text_color_label')}
                                rules={[{ required: true, max: 45 }]}
                            >
                                <Input style={{ width: '100%' }} type="color" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<Prisma.BlogUncheckedCreateInput>
                                name="subTitle"
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
                </Form>
            </Spin>
        </Drawer>
    )
}
