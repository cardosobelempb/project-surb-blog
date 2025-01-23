'use client'

import {
    AuthSignInProps,
    AuthSignInService,
} from '@/server/auth/auth-signin.service'
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

export const SignIn: React.FC = () => {
    const SIGNIN_TRANSLATIONS = useTranslations('SignInPage')
    const FORM_TRANSLATIONS = useTranslations('Form')
    const COMMON_TRANSLATIONS = useTranslations('Common')
    const ERRORS_TRANSLATIONS = useTranslations('Errors')

    const [loading, setLoading] = useState(false)
    const seacrchParams = useSearchParams()

    const onFinish: FormProps<AuthSignInProps>['onFinish'] = async values => {
        console.log('onFinish')
        setLoading(true)
        const signin = await AuthSignInService({ email: values.email })
        setLoading(false)

        if (signin?.error) {
            message.error(ERRORS_TRANSLATIONS(`auth/${signin.error}`))
        }
    }

    const handleSignInProvider = (provider: 'google' | 'facebbok') => {
        setLoading(true)
        signInProvider(provider)
        console.log('handleSignInProvider')
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
                    <Form.Item
                        label={FORM_TRANSLATIONS('email_label')}
                        name={'email'}
                        rules={[{ required: true }]}
                        required
                    >
                        <Input
                            className="px-3 py-3 shadow text-lg"
                            placeholder="Ex: email@email.com"
                        />
                    </Form.Item>

                    <Form.Item className="pt-2">
                        <Button
                            type="primary"
                            className="px-3 py-6 bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800"
                            htmlType="submit"
                        >
                            {SIGNIN_TRANSLATIONS('btn_label', {
                                provider: 'email',
                            })}
                        </Button>
                    </Form.Item>
                </Form>

                <Divider plain>{COMMON_TRANSLATIONS('or')}</Divider>

                <Space className="w-full" direction="vertical" size={16}>
                    <Button
                        block
                        className="border dark:border-none flex gap-2 font-semibold px-3 py-6 bg-white text-blue-950 dark:bg-blue-950 dark:text-white"
                        onClick={() => handleSignInProvider('google')}
                    >
                        {SIGNIN_TRANSLATIONS('btn_label', {
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
                        className="flex gap-2 font-semibold px-3 py-6 bg-blue-950 text-white dark:bg-white dark:text-blue-950 "
                        onClick={() => handleSignInProvider('facebbok')}
                    >
                        {SIGNIN_TRANSLATIONS('btn_label', {
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
                        {SIGNIN_TRANSLATIONS('no_account')}
                        <Link href={`/auth/signup`} className="ml-1">
                            {SIGNIN_TRANSLATIONS('btn_no_account_label')}
                        </Link>
                    </p>
                </Space>
            </Spin>
        </div>
    )
}
