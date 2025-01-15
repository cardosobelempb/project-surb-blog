'use client'

import { Link } from '@/lib/navigation'
import { CloseCircleFilled } from '@ant-design/icons'
import { Button, Result, theme } from 'antd'
import { useTranslations } from 'next-intl'

export const AuthError = () => {
    const {
        token: { red5 },
    } = theme.useToken()
    const t = useTranslations('AuthErrorPage')
    return (
        <Result
            status={'error'}
            icon={<CloseCircleFilled style={{ color: red5 }} />}
            title={t('title')}
            subTitle={t('subtitle')}
            className="max-w-3xl"
            extra={
                <Link href={'/auth/signin'}>
                    <Button type="primary">{t('btn_label')}</Button>
                </Link>
            }
        />
    )
}

export default AuthError
