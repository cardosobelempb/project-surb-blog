import { SignIn } from '@/components/pages/auth/SignIn'
import { Metadata } from 'next'

export const metadate: Metadata = {
    title: 'Faça seu Login',
}

const AuthSignInPage = () => <SignIn />

export default AuthSignInPage
