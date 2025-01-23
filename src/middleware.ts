import { intl } from '@/config/intl'
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
    locales: intl.locales,
    defaultLocale: intl.defaultLocale,
    localeDetection: true,
})

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'],
}
