'use client'

import { Link } from '@/lib/navigation'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Result, theme } from 'antd'
import { useTranslations } from 'next-intl'

export const VerifyEmail = () => {
    const {
        token: { colorPrimary },
    } = theme.useToken()
    const VERIFY_EMAIL_TRANSLATIONS = useTranslations('VerifyEmailPage')
    return (
        <Result
            status={'info'}
            icon={<InfoCircleOutlined style={{ color: colorPrimary }} />}
            title={VERIFY_EMAIL_TRANSLATIONS('title')}
            subTitle={VERIFY_EMAIL_TRANSLATIONS('subtitle')}
            className="max-w-3xl"
            extra={
                <Link href={'/auth/signin'}>
                    <Button type="primary">
                        {VERIFY_EMAIL_TRANSLATIONS('btn_label')}
                    </Button>
                </Link>
            }
        />
    )
}

export default VerifyEmail
