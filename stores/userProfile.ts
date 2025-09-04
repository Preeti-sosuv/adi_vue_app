import { defineStore } from 'pinia'

interface UserProfileState {
  isOpen: boolean
  userEmail: string
  organization: string
  department: string
  serviceStatus: 'online' | 'offline' | 'maintenance'
  systemHealth: 'healthy' | 'degraded' | 'error'
  lastServiceCheck: string
}

export const useUserProfileStore = defineStore('userProfile', {
  state: (): UserProfileState => ({
    isOpen: false,
    userEmail: 'preeti.kushwaha@automated-data.io',
    organization: 'Automated Data Inc.',
    department: 'Engineering',
    serviceStatus: 'online',
    systemHealth: 'healthy',
    lastServiceCheck: new Date().toLocaleTimeString()
  }),

  getters: {
    displayName: (state) => {
      return state.userEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
    },

    isServiceOnline: (state) => state.serviceStatus === 'online',
    
    statusColor: (state) => {
      switch (state.serviceStatus) {
        case 'online': return '#28a745'
        case 'offline': return '#dc3545'
        case 'maintenance': return '#ffc107'
        default: return '#6c757d'
      }
    },

    systemHealthColor: (state) => {
      switch (state.systemHealth) {
        case 'healthy': return '#22c55e'
        case 'degraded': return '#f59e0b'
        case 'error': return '#dc2626'
        default: return '#6b7280'
      }
    },

    systemHealthText: (state) => {
      switch (state.systemHealth) {
        case 'healthy': return 'All Systems Operational'
        case 'degraded': return 'Some Issues Detected'
        case 'error': return 'System Issues'
        default: return 'Status Unknown'
      }
    }
  },

  actions: {
    openProfile() {
      this.isOpen = true
    },

    closeProfile() {
      this.isOpen = false
    },

    toggleProfile() {
      this.isOpen = !this.isOpen
    },

    setUserEmail(email: string) {
      this.userEmail = email
    },

    setOrganization(org: string) {
      this.organization = org
    },

    setDepartment(dept: string) {
      this.department = dept
    },

    setServiceStatus(status: 'online' | 'offline' | 'maintenance') {
      this.serviceStatus = status
      this.lastServiceCheck = new Date().toLocaleTimeString()
    },

    setSystemHealth(health: 'healthy' | 'degraded' | 'error') {
      this.systemHealth = health
      this.lastServiceCheck = new Date().toLocaleTimeString()
    },

    updateServiceCheck() {
      this.lastServiceCheck = new Date().toLocaleTimeString()
    },

    async checkSystemHealth() {
      // This could be expanded to actually check system health via API
      try {
        // Simulate API call - replace with actual service status API
        const response = await fetch('/api/health-check')
        if (response.ok) {
          this.setSystemHealth('healthy')
          this.setServiceStatus('online')
        } else {
          this.setSystemHealth('error')
          this.setServiceStatus('offline')
        }
      } catch (error) {
        // Fallback to current status if API fails
        console.warn('Health check failed, keeping current status')
        this.updateServiceCheck()
      }
    },

    logout() {
      // Handle logout logic
      this.closeProfile()
      // Reset user data or redirect to login
    }
  }
})