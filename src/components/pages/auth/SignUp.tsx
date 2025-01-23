'use client'

import FacebookIcon from '@/assets/imgs/facebook-icon.svg'
import GoogleIcon from '@/assets/imgs/google-icon.svg'
import { Link } from '@/lib/navigation'
import {
    AuthSignUpProps,
    AuthSignUpService,
} from '@/server/auth/auth-signup.service'
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

export const SignUp: React.FC = () => {
    const SIGN_UP_TRANSLATIONS = useTranslations('SignUpPage')
    const FORM_TRANSLATIONS = useTranslations('Form')
    const COMMON_TRANSLATIONS = useTranslations('Common')
    const ERRORS_TRANSLATIONS = useTranslations('Errors')

    const [loading, setLoading] = useState(false)
    const seacrchParams = useSearchParams()

    const onFinish: FormProps<AuthSignUpProps>['onFinish'] = async values => {
        console.log('onFinish')
        setLoading(true)
        const signup = await AuthSignUpService({
            name: values.name,
            email: values.email,
        })
        setLoading(false)

        if (signup?.error) {
            message.error(ERRORS_TRANSLATIONS(`auth/${signup.error}`))
        }
    }

    const handleSignInProvider = (provider: 'google' | 'facebbok') => {
        setLoading(true)
        signInProvider(provider)
    }

    useEffect(() => {
        if (seacrchParams.get('error') === 'OAuthAccountNotLinked') {
            message.error(ERRORS_TRANSLATIONS('auth/ACCOUNT_ALREADY_EXISTS'))
        }
    }, [ERRORS_TRANSLATIONS, seacrchParams])

    return (
        <div className="border space-y-7 border-slate-100 dark:border-zinc-800 p-6 rounded-lg shadow w-full max-w-md">
            <Spin spinning={loading}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item<AuthSignUpProps>
                        label={FORM_TRANSLATIONS('name_label')}
                        name={'name'}
                        rules={[{ required: true, max: 70 }]}
                        required
                    >
                        <Input placeholder="Ex: John Doe" />
                    </Form.Item>

                    <Form.Item<AuthSignUpProps>
                        label={FORM_TRANSLATIONS('email_label')}
                        name={'email'}
                        rules={[{ required: true, max: 120 }]}
                        required
                    >
                        <Input placeholder="Ex: email@email.com" />
                    </Form.Item>

                    <Form.Item className="pt-2">
                        <Button type="primary" htmlType="submit">
                            {SIGN_UP_TRANSLATIONS('btn_label', {
                                provider: 'email',
                            })}
                        </Button>
                    </Form.Item>
                </Form>

                <Divider plain>{COMMON_TRANSLATIONS('or')}</Divider>

                <Space className="w-full" direction="vertical" size={16}>
                    <Button
                        block
                        className="font-semibold py-[17px]"
                        onClick={() => handleSignInProvider('google')}
                    >
                        {SIGN_UP_TRANSLATIONS('btn_label', {
                            provider: 'Google',
                        })}
                        <Image
                            src={GoogleIcon}
                            alt="Google"
                            width={18}
                            height={18}
                            priority
                        />
                    </Button>
                    <Button
                        block
                        className="font-semibold py-[17px"
                        onClick={() => handleSignInProvider('facebbok')}
                    >
                        {SIGN_UP_TRANSLATIONS('btn_label', {
                            provider: 'Facebook',
                        })}
                        <Image
                            src={FacebookIcon}
                            alt="Facebook"
                            width={18}
                            height={18}
                            priority
                        />
                    </Button>

                    <p className="mt-7 text-center">
                        {SIGN_UP_TRANSLATIONS('already_have_account')}
                        <Link
                            href={`/auth/signin`}
                            className="text-blue-500 ml-1"
                        >
                            {SIGN_UP_TRANSLATIONS('btn_have_account_label')}
                        </Link>
                    </p>
                </Space>
            </Spin>
        </div>
    )
}
