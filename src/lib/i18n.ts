import { intl } from '@/config/intl'
import { getRequestConfig, RequestConfig } from 'next-intl/server'

export default getRequestConfig(
    async ({ requestLocale }): Promise<RequestConfig> => {
        let locale = await requestLocale
        if (!locale || !intl.locales.includes(locale as string)) {
            locale = intl.defaultLocale
        }

        return {
            locale,
            messages: (await import(`../langs/${locale}.json`)).default,
        }
    },
)
