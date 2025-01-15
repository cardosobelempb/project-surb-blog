import { VerifyEmail } from '@/components/pages/auth/VerifyEmail'
import { Metadata } from 'next'

export const metadate: Metadata = {
    title: 'Verifique sua caixa de entrada',
}

const VerifyEmailPage = () => <VerifyEmail />

export default VerifyEmailPage
