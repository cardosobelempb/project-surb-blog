import AuthError from '@/components/pages/auth/AuthError'
import { Metadata } from 'next'

export const metadate: Metadata = {
    title: 'Opa! Algo deu errado',
}

const AuthErroPage = () => <AuthError />

export default AuthErroPage
