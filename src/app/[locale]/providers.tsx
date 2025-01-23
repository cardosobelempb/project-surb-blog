'use client'

import { useTheme } from '@/hooks/use-theme.hook'
import { StyleProvider } from '@ant-design/cssinjs'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { theme as antdTheme, ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import ptBR from 'antd/locale/pt_BR'
import { useLocale } from 'next-intl'
import { useEffect } from 'react'
import 'quill/dist/quill.snow.css'
import '@ant-design/v5-patch-for-react-19'

const { defaultAlgorithm, darkAlgorithm } = antdTheme

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const { theme, getSatedTheme } = useTheme()
    const locale = useLocale()

    useEffect(() => {
        getSatedTheme()
    }, [])

    return (
        <StyleProvider layer>
            <AntdRegistry>
                <ConfigProvider
                    theme={{
                        algorithm:
                            theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
                    }}
                    locale={locale === 'pt-BR' ? ptBR : enUS}
                >
                    {children}
                </ConfigProvider>
            </AntdRegistry>
        </StyleProvider>
    )
}
