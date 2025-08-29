import { defineStore } from 'pinia';
import { ref, computed, watch, readonly } from 'vue';

export type Theme = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<Theme>('light');
  
  // Check for saved theme preference or default to light
  const initializeTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme) {
        currentTheme.value = savedTheme;
      } else if (prefersDark) {
        currentTheme.value = 'dark';
      }
      
      applyTheme(currentTheme.value);
    }
  };
  
  // Apply theme to document
  const applyTheme = (theme: Theme) => {
    if (process.client) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  };
  
  // Toggle between themes
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  };
  
  // Set specific theme
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
  };
  
  // Computed properties
  const isDark = computed(() => currentTheme.value === 'dark');
  const isLight = computed(() => currentTheme.value === 'light');
  
  // Watch for theme changes and persist
  watch(currentTheme, (newTheme) => {
    if (process.client) {
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
    }
  });
  
  // Initialize theme on store creation
  if (process.client) {
    initializeTheme();
  }
  
  return {
    // State
    currentTheme: readonly(currentTheme),
    isDark,
    isLight,
    
    // Actions
    toggleTheme,
    setTheme,
    initializeTheme
  };
});
