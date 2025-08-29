import { defineStore } from 'pinia'

interface SidebarState {
  activeNavItem: string
  isOpen: boolean
}

export const useSidebarStore = defineStore('sidebar', {
  state: (): SidebarState => ({
    activeNavItem: 'Ask AI',
    isOpen: true
  }),

  getters: {
    isItemActive: (state) => (itemName: string) => {
      return state.activeNavItem === itemName
    }
  },

  actions: {
    setActiveNavItem(itemName: string) {
      this.activeNavItem = itemName
    },

    toggleSidebar() {
      this.isOpen = !this.isOpen
    },

    closeSidebar() {
      this.isOpen = false
    },

    openSidebar() {
      this.isOpen = true
    }
  }
})