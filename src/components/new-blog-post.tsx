'use client'

import { sendPromptToGemini } from '@/lib/gemini'
import { PostCreateService } from '@/server/post/post-create.service'
import { UseBlogAdminStore } from '@/stores/blog-admin.store'
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

import { useQuill } from 'react-quilljs'

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
}

export const NewBlogPost: React.FC<Props> = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const { blogSelected } = UseBlogAdminStore()

    const newPostTranslations = useTranslations('NewBlogPost')
    const formTranslations = useTranslations('Form')
    const commonTranslations = useTranslations('Common')
    const errorsTranslations = useTranslations('Errors')

    const { Quill } = useQuill()

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
                    "subtitle": "Descrição do post (max. 191 caracteres)",
                    "slug": "Slug do blog (max. 191 caracteres, siga o regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/)",
                    "body": "Conteúdo do post (Use HTML para formatar o conteúdo - Não use markdown)",
                }
            `,
        })

        form.setFieldsValue(response)
        setLoading(false)
    }

    const onFinish: FormProps<Prisma.PostUncheckedCreateInput>['onFinish'] =
        async values => {
            if (!blogSelected) return

            setLoading(true)
            const blogPost = await PostCreateService({
                ...values,
                blogId: blogSelected.id,
            })
            setLoading(false)

            if (blogPost?.error) {
                message.error(errorsTranslations(`post/${blogPost.error}`))
            } else {
                message.success(newPostTranslations('success'))
                setOpen(false)
            }
        }

    useEffect(() => {
        form.resetFields()
    }, [blogSelected, form])

    return (
        <Drawer
            title={newPostTranslations('title')}
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
                        title={newPostTranslations('ai_tooltip')}
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
                            <Form.Item<Prisma.PostUncheckedCreateInput>
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
                            <Form.Item<Prisma.PostUncheckedCreateInput>
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
                            <Form.Item<Prisma.PostUncheckedCreateInput>
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
                                    placeholder="Ex: publicacão x"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<Prisma.PostUncheckedCreateInput>
                                name="content"
                                label={formTranslations('body_label')}
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
