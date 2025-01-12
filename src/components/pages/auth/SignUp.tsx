'use client'

import FacebookIcon from '@/assets/imgs/facebook-icon.svg'
import GoogleIcon from '@/assets/imgs/google-icon.svg'
import { Link } from '@/lib/navigation'
import { AuthSignUpService } from '@/server/auth/auth-signup.service'
import {
    Button,
    Divider,
    Form,
    FormProps,
    Input,
    message,
    Space,
    Spin,
} from 'antd'
import { signIn as signInProvider } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type FieldType = {
    name: string
    email: string
}

export const SignUp: React.FC = () => {
    const signUpTranslation = useTranslations('SignUpPage')
    const formTranslation = useTranslations('Form')
    const commonTranslation = useTranslations('Common')
    const errorsTranslation = useTranslations('Errors')

    const [loading, setLoading] = useState(false)
    const seacrchParams = useSearchParams()

    const onFinish: FormProps<FieldType>['onFinish'] = async values => {
        setLoading(true)
        const signup = await AuthSignUpService({
            data: values,
        })
        setLoading(false)

        if (signup?.error) {
            message.error(errorsTranslation(`auth/${signup.error}`))
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
                    <Form.Item<FieldType>
                        label={formTranslation('name_label')}
                        name={'name'}
                        rules={[{ required: true, max: 70 }]}
                        required
                    >
                        <Input placeholder="Ex: John Doe" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label={formTranslation('email_label')}
                        name={'email'}
                        rules={[{ required: true, max: 120 }]}
                        required
                    >
                        <Input placeholder="Ex: email@email.com" />
                    </Form.Item>

                    <Form.Item className="pt-2">
                        <Button type="primary">
                            {signUpTranslation('btn_label', {
                                provider: 'email',
                            })}
                        </Button>
                    </Form.Item>
                </Form>

                <Divider plain>{commonTranslation('or')}</Divider>

                <Space className="w-full" direction="vertical" size={16}>
                    <Button
                        block
                        className="font-semibold py-[17px]"
                        onClick={() => handleSignInProvider('google')}
                    >
                        {signUpTranslation('btn_label', { provider: 'Google' })}
                        <Image src={GoogleIcon} alt="Google" width={18} />
                    </Button>
                    <Button
                        block
                        className="font-semibold py-[17px"
                        onClick={() => handleSignInProvider('facebbok')}
                    >
                        {signUpTranslation('btn_label', {
                            provider: 'Facebook',
                        })}
                        <Image src={FacebookIcon} alt="Facebook" width={18} />
                    </Button>

                    <p className="mt-7 text-center">
                        {signUpTranslation('already_have_account')}
                        <Link
                            href={`/auth/signin`}
                            className="text-blue-500 ml-1"
                        >
                            {signUpTranslation('btn_have_account_label')}
                        </Link>
                    </p>
                </Space>
            </Spin>
        </div>
    )
}
