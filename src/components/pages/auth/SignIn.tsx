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
                        <Input
                            className="px-3 py-3 shadow text-lg"
                            placeholder="Ex: email@email.com"
                        />
                    </Form.Item>

                    <Form.Item className="pt-2">
                        <Button
                            type="primary"
                            className="px-3 py-6 bg-slate-800 text-slate-200 dark:bg-slate-200 dark:text-slate-800"
                        >
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
                        className="border dark:border-none flex gap-2 font-semibold px-3 py-6 bg-white text-blue-950 dark:bg-blue-950 dark:text-white"
                        onClick={() => handleSignInProvider('google')}
                    >
                        {signinTranslation('btn_label', { provider: 'Google' })}
                        <Image src={GoogleIcon} alt="Google" width={24} />
                    </Button>
                    <Button
                        block
                        className="flex gap-2 font-semibold px-3 py-6 bg-blue-950 text-white dark:bg-white dark:text-blue-950 "
                        onClick={() => handleSignInProvider('facebbok')}
                    >
                        {signinTranslation('btn_label', {
                            provider: 'Facebook',
                        })}
                        <Image
                            src={FacebookIcon}
                            alt="Facebook"
                            width={24}
                            className=""
                        />
                    </Button>

                    <p className="mt-7 text-center">
                        {signinTranslation('no_account')}
                        <Link href={`/auth/signup`} className="ml-1">
                            {signinTranslation('btn_no_account_label')}
                        </Link>
                    </p>
                </Space>
            </Spin>
        </div>
    )
}
