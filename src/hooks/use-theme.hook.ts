import { UseThemeStore } from '@/stores/theme.store'

export const useTheme = () => {
    const { theme, setTheme } = UseThemeStore()

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)

        document.body.classList.remove(theme)
        document.body.classList.add(newTheme)
    }

    const getSatedTheme = () => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'light' || savedTheme === 'dark') {
            setTheme(savedTheme)
        }
        if (savedTheme) {
            document.body.classList.add(savedTheme)
        } else {
            document.body.classList.add('light')
        }
    }

    return {
        theme,
        toggleTheme,
        getSatedTheme,
    }
}
