'use client'

import { sendPromptToGemini } from '@/lib/gemini'
import { BlogCreateUserService } from '@/server/blog/blog-create-user.service'
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
    Select,
    Space,
    Spin,
    theme,
    Tooltip,
} from 'antd'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
}

type FieldType = {
    email: string
    role: Prisma.BlogUserUncheckedCreateInput['role']
}

export const NewBlogUser: React.FC<Props> = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const { blogSelected } = UseBlogAdminStore()

    const newBlogUserTranslations = useTranslations('NewBlogUser')
    const formTranslations = useTranslations('Form')
    const commonTranslations = useTranslations('Common')
    const errorsTranslations = useTranslations('Errors')

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

    const onFinish: FormProps<Prisma.BlogUserUncheckedCreateInput>['onFinish'] =
        async values => {
            if (!blogSelected) return

            setLoading(true)
            const blogUser = await BlogCreateUserService({
                ...values,
                blogId: blogSelected.id,
            })
            setLoading(false)

            if (blogUser?.error) {
                message.error(errorsTranslations(`blog/${blogUser.error}`))
            } else {
                message.success(newBlogUserTranslations('success'))
                setOpen(false)
            }
        }

    useEffect(() => {
        const handleResetFields = () => {
            form.resetFields()
        }
        handleResetFields()
    }, [form])

    return (
        <Drawer
            title={newBlogUserTranslations('title')}
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
                    <Tooltip
                        title={newBlogUserTranslations('ai_tooltip')}
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
                            <Form.Item<FieldType>
                                name="email"
                                label={formTranslations('user_email_label')}
                                rules={[{ required: true, max: 191 }]}
                            >
                                <Input
                                    showCount
                                    maxLength={100}
                                    placeholder="Ex: email@email.com"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item<FieldType>
                                name="role"
                                label={formTranslations('subtitle_label')}
                                rules={[{ max: 191 }]}
                            >
                                <Select
                                    placeholder="Ex: Editor"
                                    options={[
                                        {
                                            value: 'ADMIN',
                                            label: commonTranslations('admin'),
                                        },
                                        {
                                            value: 'AUTHOR',
                                            label: commonTranslations('author'),
                                        },
                                        {
                                            value: 'EDITOR',
                                            label: commonTranslations('editor'),
                                        },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Drawer>
    )
}
