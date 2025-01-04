import { Theme } from '@/types/Theme'
import { create } from 'zustand'

export type ThemeState = {
    theme: Theme
}

export type ThemeActions = {
    setTheme: (theme: Theme) => void
}

export const UseThemeStore = create<ThemeState & ThemeActions>(set => ({
    theme: 'light',
    setTheme: theme => set({ theme }),
}))
