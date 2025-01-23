'use client'

import { sendPromptToGemini } from '@/lib/gemini'
import { PostCreateService } from '@/server/post/post-create.service'
import { useBlogAdminStore } from '@/stores/blog-admin.store'
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
import { useEffect, useState } from 'react'
import Quill from 'react-quill'

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
}

export const NewBlogPost: React.FC<Props> = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const { blogSelected } = useBlogAdminStore()

    const NEW_POST_TRANSLATIONS = useTranslations('NewBlogPost')
    const FORM_TRANSLATIONS = useTranslations('Form')
    const COMMON_TRANSLATIONS = useTranslations('Common')
    const ERRORS_TRANSLATIONS = useTranslations('Errors')

    const locale = useLocale()
    const {
        token: { colorPrimary },
    } = theme.useToken()

    const onClose = () => setOpen(false)

    const handleGenerate = async () => {
        setLoading(true)
        const response = await sendPromptToGemini({
            prompt: `
                Escreva um post para um blog, o tema deve ser relacionado as configurações/tema do blog: ${blogSelected?.title}; ${blogSelected?.subTitle}. Crie sempre algo diferente e não repita, na lingua ${locale}, porém responda no formato JSON.
                Siga esse exemplo e respeite as regras abaixo:
                {
                    "title": "Título do post (max. 100 caracteres)",
                    "subTitle": "Descrição do post (max. 191 caracteres)",
                    "slug": "Slug do blog (max. 191 caracteres, siga o regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/)",
                    "body": "Conteúdo do post (Use HTML para formatar o conteúdo - Não use markdown)",
                }
            `,
        })

        form.setFieldsValue(response)
        setLoading(false)
    }

    const onFinish: FormProps<Prisma.BlogPostUncheckedCreateInput>['onFinish'] =
        async values => {
            if (!blogSelected) return

            setLoading(true)
            const blogPost = await PostCreateService({
                ...values,
                blogId: blogSelected.id,
            })
            setLoading(false)

            if (blogPost?.error) {
                message.error(ERRORS_TRANSLATIONS(`post/${blogPost.error}`))
            } else {
                message.success(NEW_POST_TRANSLATIONS('success'))
                setOpen(false)
            }
        }

    useEffect(() => {
        form.resetFields()
    }, [blogSelected, form])

    return (
        <Drawer
            title={NEW_POST_TRANSLATIONS('title')}
            width={600}
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
                        title={NEW_POST_TRANSLATIONS('ai_tooltip')}
                        className="mr-2"
                    >
                        <Button type="text" onClick={handleGenerate}>
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
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<Prisma.BlogPostUncheckedCreateInput>
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
                            <Form.Item<Prisma.BlogPostUncheckedCreateInput>
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
                            <Form.Item<Prisma.BlogPostUncheckedCreateInput>
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
                                    placeholder="Ex: publicacão x"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<Prisma.BlogPostUncheckedCreateInput>
                                name="content"
                                label={FORM_TRANSLATIONS('body_label')}
                                rules={[{ required: true }]}
                            >
                                <Quill
                                    theme="snow"
                                    value={form.getFieldValue('content')}
                                    onChange={(value: string) =>
                                        form.setFieldsValue({ content: value })
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
