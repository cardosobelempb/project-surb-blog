'use client'

import { AuthSignInService } from '@/server/auth/auth-signin.service'
import {
    FormProps,
    message,
    Spin,
    Form,
    Input,
    Button,
    Divider,
    Space,
} from 'antd'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signIn as signInProvider } from 'next-auth/react'
import GoogleIcon from '@/assets/imgs/google-icon.svg'
import FacebookIcon from '@/assets/imgs/facebook-icon.svg'
import Image from 'next/image'
import { Link } from '@/lib/navigation'

type FieldType = {
    email: string
}

export const SignIn: React.FC = () => {
    const signinTranslation = useTranslations('SignInPage')
    const formTranslation = useTranslations('Form')
    const commonTranslation = useTranslations('Common')
    const errorsTranslation = useTranslations('Errors')

    const [loading, setLoading] = useState(false)
    const seacrchParams = useSearchParams()

    const onFinish: FormProps<FieldType>['onFinish'] = async values => {
        setLoading(true)
        const signin = await AuthSignInService({
            data: { email: values.email },
        })
        setLoading(false)

        if (signin?.error) {
            message.error(errorsTranslation(`auth/${signin.error}`))
        }
    }

    const handleSignInProvider = (provider: 'google' | 'facebbok') => {
        setLoading(true)
        signInProvider(provider)
    }

    useEffect(() => {
        if (seacrchParams.get('error') === 'OAuthAccountNotLinked') {
            message.error(errorsTranslation('auth/ACCOUNT_ALREADY_EXISTS'))
        }
    }, [errorsTranslation, seacrchParams])

    return (
        <div className="border space-y-7 border-slate-100 dark:border-zinc-800 p-6 rounded-lg shadow w-full max-w-md">
            <Spin spinning={loading}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label={formTranslation('email_label')}
                        name={'email'}
                        rules={[{ required: true }]}
                        required
                    >
                        <Input placeholder="Ex: email@email.com" />
                    </Form.Item>

                    <Form.Item className="pt-2">
                        <Button type="primary">
                            {signinTranslation('btn_label', {
                                provider: 'email',
                            })}
                        </Button>
                    </Form.Item>
                </Form>

                <Divider plain>{commonTranslation('or')}</Divider>

                <Space className="w-full" direction="vertical" size={16}>
                    <Button
                        block
                        className="font-semibold py-[17px"
                        onClick={() => handleSignInProvider('google')}
                    >
                        {signinTranslation('btn_label', { provider: 'Google' })}
                        <Image src={GoogleIcon} alt="Google" width={18} />
                    </Button>
                    <Button
                        block
                        className="font-semibold py-[17px"
                        onClick={() => handleSignInProvider('facebbok')}
                    >
                        {signinTranslation('btn_label', {
                            provider: 'Facebook',
                        })}
                        <Image src={FacebookIcon} alt="Facebook" width={18} />
                    </Button>

                    <p className="mt-7 text-center">
                        {signinTranslation('no_account')}
                        <Link
                            href={`/auth/signup`}
                            className="text-blue-500 ml-1"
                        >
                            {signinTranslation('btn_no_account_label')}
                        </Link>
                    </p>
                </Space>
            </Spin>
        </div>
    )
}
