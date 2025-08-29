<template>
  <button 
    class="theme-toggle" 
    @click="themeStore.toggleTheme()"
    :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <div class="toggle-container">
      <transition name="icon-fade" mode="out-in">
        <svg 
          v-if="themeStore.isDark" 
          key="sun"
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
          class="theme-icon sun-icon"
        >
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <svg 
          v-else 
          key="moon"
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2"
          class="theme-icon moon-icon"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </transition>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();
</script>

<style scoped>
.theme-toggle {
  position: relative;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 24px;
  background: var(--surface-container);
  color: var(--on-surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--outline-variant);
}

.theme-toggle:hover {
  background: var(--surface-container-high);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.toggle-container {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-icon {
  position: absolute;
  color: var(--on-surface);
  transition: all 200ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
}

.sun-icon {
  color: var(--warning, #f59e0b);
}

.moon-icon {
  color: var(--info, #3b82f6);
}

/* Icon transition animations */
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 200ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
}

.icon-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}

.icon-fade-enter-to,
.icon-fade-leave-from {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

/* Ripple effect */
.theme-toggle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: var(--primary);
  opacity: 0.1;
  transform: translate(-50%, -50%);
  transition: width 300ms, height 300ms;
  pointer-events: none;
}

.theme-toggle:active::after {
  width: 48px;
  height: 48px;
}
</style>
