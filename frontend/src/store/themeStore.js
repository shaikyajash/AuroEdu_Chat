import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      accentColor: 'teal', // New accent color (teal instead of violet)
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setAccentColor: (color) => set({ accentColor: color }),
    }),
    {
      name: 'theme-storage',  
    }
  )
)

export default useThemeStore