import { SignUp } from '@/components/pages/auth/SignUp'
import { Metadata } from 'next'

export const metadate: Metadata = {
    title: 'Faça seu Login',
}

const AuthSignUpPage = () => <SignUp />

export default AuthSignUpPage
