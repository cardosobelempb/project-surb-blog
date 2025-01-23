'use client'

import { Link } from '@/lib/navigation'
import { CloseCircleFilled } from '@ant-design/icons'
import { Button, Result, theme } from 'antd'
import { useTranslations } from 'next-intl'

export const AuthError = () => {
    const {
        token: { red5 },
    } = theme.useToken()
    const AUTH_TRANSLATION = useTranslations('AuthErrorPage')
    return (
        <Result
            status={'error'}
            icon={<CloseCircleFilled style={{ color: red5 }} />}
            title={AUTH_TRANSLATION('title')}
            subTitle={AUTH_TRANSLATION('subtitle')}
            className="max-w-3xl"
            extra={
                <Link href={'/auth/signin'}>
                    <Button type="primary">
                        {AUTH_TRANSLATION('btn_label')}
                    </Button>
                </Link>
            }
        />
    )
}

export default AuthError
