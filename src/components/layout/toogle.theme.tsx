import { Button, Tooltip } from 'antd'
import { useTheme } from '@/hooks/use-theme.hook'
import { useTranslations } from 'next-intl'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'

export const ToogleTheme = () => {
    const { theme, toggleTheme } = useTheme()
    const TOOGLE_THEME_TRANSLATIONS = useTranslations('Layout')
    return (
        <Tooltip title={TOOGLE_THEME_TRANSLATIONS('toggle_theme_label')}>
            <Button onClick={toggleTheme} className="h-9 text-lg" type="text">
                {theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
            </Button>
        </Tooltip>
    )
}
