'use client'

import { useTheme } from '@/hooks/use-theme.hook'
import { StyleProvider } from '@ant-design/cssinjs'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { theme as antdTheme, ConfigProvider } from 'antd'
import { useLocale } from 'next-intl'
import { useEffect } from 'react'
import ptBr from 'antd/locale/pt_BR'
import enUs from 'antd/locale/en_US'
import 'quill/dist/quill.snow.css'

const { defaultAlgorithm, darkAlgorithm } = antdTheme

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const { theme, getSatedTheme } = useTheme()
    const locale = useLocale()
    useEffect(() => {
        getSatedTheme()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <StyleProvider layer>
            <AntdRegistry>
                <ConfigProvider
                    theme={{
                        algorithm:
                            theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
                    }}
                    locale={locale === 'pt-BR' ? ptBr : enUs}
                >
                    {children}
                </ConfigProvider>
            </AntdRegistry>
        </StyleProvider>
    )
}
