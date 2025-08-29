import { defineStore } from 'pinia'

interface UserProfileState {
  isOpen: boolean
  userEmail: string
  organization: string
  department: string
  serviceStatus: 'online' | 'offline' | 'maintenance'
}

export const useUserProfileStore = defineStore('userProfile', {
  state: (): UserProfileState => ({
    isOpen: false,
    userEmail: 'preeti.kushwaha@automated-data.io',
    organization: 'Automated Data Inc.',
    department: 'Engineering',
    serviceStatus: 'online'
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
    },

    logout() {
      // Handle logout logic
      this.closeProfile()
      // Reset user data or redirect to login
    }
  }
})