import { defineStore } from 'pinia'

interface PopoverState {
  showPopover: boolean
  popoverData: any
  placement: 'top' | 'bottom'
}

export const usePopoverStore = defineStore('popover', {
  state: (): PopoverState => ({
    showPopover: false,
    popoverData: null,
    placement: 'bottom'
  }),

  getters: {
    isOpen: (state) => state.showPopover,
    
    hasData: (state) => state.popoverData !== null,
    
    isPromptList: (state) => Array.isArray(state.popoverData),
    
    formattedData: (state) => {
      try {
        return JSON.stringify(state.popoverData, null, 2)
      } catch {
        return String(state.popoverData ?? '')
      }
    }
  },

  actions: {
    openPopover(data?: any, placement: 'top' | 'bottom' = 'bottom') {
      this.popoverData = data || null
      this.placement = placement
      this.showPopover = true
    },

    closePopover() {
      this.showPopover = false
      this.popoverData = null
    },

    setPopoverData(data: any) {
      this.popoverData = data
    },

    setPlacement(placement: 'top' | 'bottom') {
      this.placement = placement
    },

    togglePopover() {
      if (this.showPopover) {
        this.closePopover()
      } else {
        this.openPopover()
      }
    }
  }
})