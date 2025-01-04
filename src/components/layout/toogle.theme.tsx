import { Button, Tooltip } from 'antd'
import { useTheme } from '@/hooks/use-theme.hook'
import { useTranslations } from 'next-intl'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'

export const ToogleTheme = () => {
    const { theme, toggleTheme } = useTheme()
    const t = useTranslations('Layout')
    return (
        <Tooltip title={t('toggle_theme_label')}>
            <Button onClick={toggleTheme} className="h-9 text-lg" type="text">
                {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
            </Button>
        </Tooltip>
    )
}
