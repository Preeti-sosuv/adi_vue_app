<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed, 'mobile-open': isMobileOpen }" @click="handleSidebarClick">
    <div class="sidebar-header">
      <div class="logo" v-if="!isCollapsed">
        <div class="logo-icon">
          <img src="/images/favicon.png" alt="Logo" class="logo-image" />
        </div>
      </div>
      <button class="collapse-btn" @click="toggleSidebar" :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path :d="isCollapsed ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'"/>
        </svg>
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <div class="nav-section">
        <div class="nav-item" :class="{ active: activeItem === 'Ask AI' }" @click="setActive('Ask AI')">
          <div class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <path d="M8 12h8M8 8h8"/>
            </svg>
          </div>
          <span class="nav-label" v-if="!isCollapsed">Ask AI</span>
        </div>
        
        <div class="nav-item" :class="{ active: activeItem === 'Masters' }" @click="setActive('Masters')">
          <div class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <span class="nav-label" v-if="!isCollapsed">Masters</span>
        </div>
        
        <div class="nav-item" :class="{ active: activeItem === 'Projects' }" @click="setActive('Projects')">
          <div class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2l5 0 2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span class="nav-label" v-if="!isCollapsed">Projects</span>
        </div>
        
        <div class="nav-item" :class="{ active: activeItem === 'Catalog' }" @click="setActive('Catalog')">
          <div class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
          </div>
          <span class="nav-label" v-if="!isCollapsed">Catalog</span>
        </div>
      </div>
      
      
      <div class="nav-section">
        <div class="nav-item" :class="{ active: activeItem === 'Tags' }" @click="setActive('Tags')">
          <div class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </div>
          <span class="nav-label" v-if="!isCollapsed">Tags</span>
        </div>
        
        <div class="nav-item" :class="{ active: activeItem === 'Reporting' }" @click="setActive('Reporting')">
          <div class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </div>
          <span class="nav-label" v-if="!isCollapsed">Reporting</span>
        </div>
        
        <div class="nav-item" :class="{ active: activeItem === 'Tasks' }" @click="setActive('Tasks')">
          <div class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4"/>
              <rect width="18" height="18" x="3" y="3" rx="2"/>
            </svg>
          </div>
          <span class="nav-label" v-if="!isCollapsed">Tasks</span>
        </div>
        
        <div class="nav-item" :class="{ active: activeItem === 'Overrides' }" @click="setActive('Overrides')">
          <div class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12h18m-9-9v18"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <span class="nav-label" v-if="!isCollapsed">Overrides</span>
        </div>
        
        <div class="nav-item" :class="{ active: activeItem === 'Pipelines' }" @click="setActive('Pipelines')">
          <div class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="7" x="3" y="3" rx="1"/>
              <rect width="9" height="7" x="3" y="14" rx="1"/>
              <path d="m14 17 3 3 3-3"/>
              <path d="M17 14v6"/>
            </svg>
          </div>
          <span class="nav-label" v-if="!isCollapsed">Pipelines</span>
        </div>
        
        <div class="nav-item" :class="{ active: activeItem === 'Jobs' }" @click="setActive('Jobs')">
          <div class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="20" height="14" x="2" y="3" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <span class="nav-label" v-if="!isCollapsed">Jobs</span>
        </div>
        
        <div class="nav-item" :class="{ active: activeItem === 'Connections' }" @click="setActive('Connections')">
          <div class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </div>
          <span class="nav-label" v-if="!isCollapsed">Connections</span>
        </div>
        
        <div class="nav-item" :class="{ active: activeItem === 'Manage' }" @click="setActive('Manage')">
          <div class="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <span class="nav-label" v-if="!isCollapsed">Manage</span>
        </div>
      </div>
    </nav>
    
    <div class="sidebar-footer">
      <div class="footer-controls">
        <ThemeToggle />
        <div class="user-avatar" @click="toggleProfilePopup">
          <!-- <img src="/api/placeholder/32/32" alt="User" class="avatar-image" /> -->
          <div class="status-indicator online"></div>
        </div>
      </div>
    </div>
    
    <UserProfilePopup 
      :isOpen="showProfilePopup" 
      :userEmail="authStore.userEmail"
      @close="showProfilePopup = false" 
      @logout="handleLogout"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import UserProfilePopup from './UserProfilePopup.vue';
import ThemeToggle from './ThemeToggle.vue';

const showProfilePopup = ref(false);
const activeItem = ref('Ask AI');
const isCollapsed = ref(false);
const isMobileOpen = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const toggleProfilePopup = () => {
  showProfilePopup.value = !showProfilePopup.value;
};

const emit = defineEmits<{
  close: [];
  navigate: [item: string];
  toggleMobileSidebar: [];
}>();

// Mobile sidebar handling
const handleSidebarClick = (event: Event) => {
  // Close mobile sidebar when clicking on overlay (before sidebar content)
  if (event.target === event.currentTarget) {
    isMobileOpen.value = false;
  }
};

const toggleMobileSidebar = () => {
  isMobileOpen.value = !isMobileOpen.value;
  emit('toggleMobileSidebar');
};

// Expose mobile toggle method for parent components
defineExpose({
  toggleMobileSidebar,
  isMobileOpen
});

const setActive = (item: string) => {
  activeItem.value = item;
  emit('navigate', item);
};

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleLogout = () => {
  showProfilePopup.value = false;
  authStore.logout();
  router.push('/login');
};

</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 90px;
  height: 100vh;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: width 300ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
}

.sidebar.collapsed {
  width: 50px;
}

.sidebar-header {
  padding: 20px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--sidebar-border);
  min-height: 70px;
  position: relative;
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
}

.collapse-btn {
  background: none;
  border: none;
  color: var(--sidebar-icon);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
  position: absolute;
  right: 8px;
}

.sidebar.collapsed .collapse-btn {
  position: static;
}

.collapse-btn:hover {
  background: var(--sidebar-item-hover);
  color: var(--primary);
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(103, 80, 164, 0.15);
  transition: all 200ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
  overflow: hidden;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.logo-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(103, 80, 164, 0.25);
}

.sidebar-nav {
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0 4px;
}

.sidebar.collapsed .nav-section {
  padding: 0 2px;
}

.nav-divider {
  width: 32px;
  height: 1px;
  background: var(--sidebar-border);
  margin: 12px auto;
  border-radius: 0.5px;
}

.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 4px;
  margin: 0;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
  border-radius: 8px;
  background: transparent;
  min-height: 45px;
  gap: 3px;
}

.sidebar.collapsed .nav-item {
  min-height: 40px;
  padding: 8px 4px;
}

.nav-item:hover {
  background: var(--sidebar-item-hover);
}

.nav-item:hover .nav-icon {
  color: var(--primary);
}

.nav-item.active {
  background: var(--sidebar-item-active);
}

.nav-item.active .nav-icon {
  color: var(--sidebar-icon-active);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: #6750a4;
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sidebar-icon);
  transition: all 200ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
  width: 24px;
  height: 24px;
}

.nav-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--sidebar-icon);
  text-align: center;
  line-height: 1.2;
  transition: all 200ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
}

.nav-item:hover .nav-label {
  color: var(--primary);
}

.nav-item.active .nav-label {
  color: var(--sidebar-icon-active);
}

.sidebar-footer {
  padding: 16px 8px;
  border-top: 1px solid var(--sidebar-border);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70px;
}

.footer-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: var(--surface-container);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
  border: 1px solid var(--outline-variant);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  border-color: var(--primary);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.status-indicator {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.status-indicator.online {
  background: #0f9d58;
}

.status-indicator.offline {
  background: #5f6368;
}

.status-indicator.busy {
  background: #ea4335;
}

/* Hide scrollbar completely */
.sidebar-nav::-webkit-scrollbar {
  display: none;
}

.sidebar-nav {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}

/* Material Design 3 focus states */
.nav-item:focus-visible {
  outline: 2px solid #6750a4;
  outline-offset: 2px;
}

.user-avatar:focus-visible {
  outline: 2px solid #6750a4;
  outline-offset: 2px;
}

/* Ripple effect for Material Design */
.nav-item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(103, 80, 164, 0.1);
  transform: translate(-50%, -50%);
  transition: width 300ms, height 300ms;
  pointer-events: none;
}

.nav-item:active::after {
  width: 48px;
  height: 48px;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -90px;
    top: 0;
    width: 90px;
    height: 100vh;
    z-index: 2000;
    transition: left 300ms cubic-bezier(0.2, 0.0, 0.38, 0.9);
  }
  
  .sidebar.mobile-open {
    left: 0;
  }
  
  .sidebar.collapsed {
    width: 50px;
    left: -50px;
  }
  
  .sidebar.collapsed.mobile-open {
    left: 0;
  }
  
  .sidebar-header {
    padding: 16px 6px;
    min-height: 60px;
  }
  
  .logo-icon {
    width: 32px;
    height: 32px;
  }
  
  .collapse-btn {
    right: 6px;
  }
  
  .nav-item {
    min-height: 42px;
    padding: 5px 3px;
    gap: 2px;
  }
  
  .sidebar.collapsed .nav-item {
    min-height: 38px;
    padding: 6px 3px;
  }
  
  .nav-icon {
    width: 20px;
    height: 20px;
  }
  
  .nav-label {
    font-size: 9px;
  }
  
  .sidebar-footer {
    padding: 12px 6px;
    min-height: 60px;
  }
  
  .footer-controls {
    gap: 8px;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
  }
  
  .status-indicator {
    width: 10px;
    height: 10px;
    border-width: 1px;
  }
}

/* Mobile Overlay for sidebar */
@media (max-width: 768px) {
  .sidebar::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: opacity 300ms, visibility 300ms;
    z-index: -1;
  }
  
  .sidebar.mobile-open::before {
    opacity: 1;
    visibility: visible;
  }
}

/* Tablet Responsive Styles */
@media (max-width: 1024px) and (min-width: 769px) {
  .sidebar {
    width: 80px;
  }
  
  .sidebar.collapsed {
    width: 60px;
  }
  
  .sidebar-header {
    padding: 18px 7px;
    min-height: 65px;
  }
  
  .logo-icon {
    width: 36px;
    height: 36px;
  }
  
  .nav-item {
    min-height: 43px;
    padding: 5px 3px;
  }
  
  .sidebar.collapsed .nav-item {
    min-height: 39px;
    padding: 7px 3px;
  }
  
  .nav-icon {
    width: 22px;
    height: 22px;
  }
  
  .nav-label {
    font-size: 9px;
  }
  
  .sidebar-footer {
    padding: 14px 7px;
    min-height: 65px;
  }
  
  .footer-controls {
    gap: 10px;
  }
  
  .user-avatar {
    width: 36px;
    height: 36px;
  }
}
</style>
