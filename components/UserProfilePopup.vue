<template>
  <Teleport to="body">
    <div v-if="isOpen" class="profile-overlay" @click="closePopup">
      <div class="profile-popup" @click.stop>
        <div class="profile-header">
          <div class="user-info">
            <div class="user-avatar">
              <!-- <img src="/api/placeholder/48/48" alt="Profile" class="avatar-image" /> -->
              <div class="status-dot online"></div>
            </div>
            <div class="user-details">
              <div class="user-name">{{ userDisplayEmail.split('@')[0] || 'User' }}</div>
              <div class="user-email">{{ userDisplayEmail }}</div>
              <div class="user-role">Engineering Team</div>
            </div>
          </div>
        </div>
        
        <div class="profile-body">
          <div class="menu-section">
            <div class="menu-item">
              <div class="menu-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="m22 21-3-3m0 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0z"/>
                </svg>
              </div>
              <div class="menu-content">
                <span class="menu-title">Profile Settings</span>
                <span class="menu-subtitle">Manage your account</span>
              </div>
              <div class="menu-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            </div>
            
            <div class="menu-item" @click="handleOrganizationClick" :class="{ 'loading': loadingOrganizations }">
              <div class="menu-icon">
                <svg v-if="!loadingOrganizations" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <polyline points="16,11 18,13 22,9"/>
                </svg>
                <div v-else class="loading-spinner"></div>
              </div>
              <div class="menu-content">
                <span class="menu-title">Organizations</span>
                <span class="menu-subtitle">{{ selectedOrganization || 'Select organization' }}</span>
              </div>
              <div class="menu-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            </div>
            
            <!-- Organizations List - appears when clicked -->
            <div v-if="showOrganizationsList" class="organizations-list">
              <div class="org-header">
                <span class="org-title">Select Organization</span>
                <button class="close-org-btn" @click="closeOrganizations">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div v-if="organizationsError" class="org-error">
                <p>{{ organizationsError }}</p>
                <button @click="fetchOrganizations" class="retry-btn">Retry</button>
              </div>
              <div v-else-if="organizations.length === 0 && !loadingOrganizations" class="org-empty">
                <p>No organizations available</p>
              </div>
              <div v-else class="org-items">
                <div 
                  v-for="org in organizations" 
                  :key="org.org_id"
                  class="org-item"
                  :class="{ 'selected': selectedOrgId === org.org_id }"
                  @click="selectOrganization(org)"
                >
                  <div class="org-info">
                    <div class="org-name">{{ org.name }}</div>
                    <div class="org-details">ID: {{ org.org_id }}</div>
                  </div>
                  <div v-if="selectedOrgId === org.org_id" class="org-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="menu-item">
              <div class="menu-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <div class="menu-content">
                <span class="menu-title">Preferences</span>
                <span class="menu-subtitle">Theme, notifications & more</span>
              </div>
              <div class="menu-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="status-section">
            <div class="status-item">
              <div class="status-indicator">
                <div class="status-dot online"></div>
                <span class="status-text">System Status: Online</span>
              </div>
              <div class="status-badge online">Active</div>
            </div>
          </div>
          
          <div class="actions-section">
            <button class="help-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>Help & Support</span>
            </button>
            
            <button class="logout-button" @click="handleLogout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

interface Props {
  isOpen: boolean;
  userEmail?: string;
}

interface Organization {
  org_id: number;
  name: string;
  description?: string;
}

const props = defineProps<Props>();
const authStore = useAuthStore();

const emit = defineEmits(['close', 'logout', 'organizationSelected']);

// Organizations state
const organizations = ref<Organization[]>([]);
const showOrganizationsList = ref(false);
const loadingOrganizations = ref(false);
const organizationsError = ref('');
const selectedOrgId = ref<number | null>(null);
const selectedOrganization = ref<string>('');

const closePopup = () => {
  emit('close');
};

const handleLogout = () => {
  emit('logout');
  emit('close');
};

const handleOrganizationClick = () => {
  if (organizations.value.length === 0 && !showOrganizationsList.value) {
    fetchOrganizations();
  }
  showOrganizationsList.value = !showOrganizationsList.value;
};

const closeOrganizations = () => {
  showOrganizationsList.value = false;
};

const fetchOrganizations = async () => {
  console.log('🔍 Fetching organizations...');
  loadingOrganizations.value = true;
  organizationsError.value = '';
  
  try {
    const token = authStore.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    console.log('📡 Calling /get_orgs API...');
    console.log('Token (first 10 chars):', token.substring(0, 10) + '...');
    
    const response = await fetch('http://34.69.208.233:8040/proxy/get_orgs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        org: ""
      })
    });

    console.log('📥 API Response status:', response.status);
    console.log('📥 API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📄 Raw API response:', JSON.stringify(data, null, 2));
    console.log('📊 Data type:', typeof data);
    console.log('📊 Is array:', Array.isArray(data));
    
    // Handle different response formats (based on Anvil patterns)
    let extractedOrgs: Organization[] = [];
    
    if (Array.isArray(data)) {
      console.log('✅ Direct array format detected');
      extractedOrgs = data;
    } else if (data && data.organizations && Array.isArray(data.organizations)) {
      console.log('✅ data.organizations format detected');
      extractedOrgs = data.organizations;
    } else if (data && data.result && Array.isArray(data.result)) {
      console.log('✅ data.result format detected');
      extractedOrgs = data.result;
    } else if (data && typeof data === 'object') {
      console.log('⚠️ Single object format detected, wrapping in array');
      extractedOrgs = [data];
    } else {
      console.warn('⚠️ Unexpected response format:', data);
      extractedOrgs = [];
    }

    console.log('📋 Extracted organizations:', extractedOrgs.length, 'items');
    console.log('📋 Organizations details:', JSON.stringify(extractedOrgs, null, 2));
    
    organizations.value = extractedOrgs;
    showOrganizationsList.value = true;
    
    console.log('✅ Organizations loaded successfully:', organizations.value.length, 'items');
    
  } catch (error) {
    console.error('❌ Error fetching organizations:', error);
    organizationsError.value = error instanceof Error ? error.message : 'Failed to fetch organizations';
    organizations.value = [];
  } finally {
    loadingOrganizations.value = false;
  }
};

const selectOrganization = (org: Organization) => {
  console.log('🏢 Organization selected:', org);
  selectedOrgId.value = org.org_id;
  selectedOrganization.value = org.name;
  
  // Emit the selection to parent components
  emit('organizationSelected', org);
  
  // Close the organizations list
  showOrganizationsList.value = false;
  
  console.log(`✅ Successfully selected organization: ${org.name} (ID: ${org.org_id})`);
};

// Computed property to get user email from auth store or props
const userDisplayEmail = computed(() => {
  return authStore.user?.email || props.userEmail || 'user@example.com';
});
</script>

<style scoped>
.profile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  /* backdrop-filter: blur(8px); */
  z-index: 2000;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 20px;
}

.profile-popup {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  width: 320px;
  margin-left: 44px;
  margin-bottom: 80px;
  overflow: hidden;
  animation: profileEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@keyframes profileEnter {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 20px;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-dot.online {
  background: #22c55e;
}

.status-dot.offline {
  background: #64748b;
}

.status-dot.busy {
  background: #f59e0b;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0 0 4px 0;
}

.user-email {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 4px 0;
  word-break: break-word;
}

.user-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.15);
  padding: 4px 8px;
  border-radius: 6px;
  display: inline-block;
  margin: 0;
}

.profile-body {
  padding: 16px 0;
}

.menu-section {
  margin-bottom: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;
}

.menu-item:hover {
  background: #f8fafc;
  color: #1e293b;
}

.menu-icon {
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s;
  flex-shrink: 0;
}

.menu-item:hover .menu-icon {
  background: #e2e8f0;
  color: #475569;
}

.menu-content {
  flex: 1;
  min-width: 0;
}

.menu-title {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
}

.menu-subtitle {
  display: block;
  font-size: 12px;
  color: #64748b;
  line-height: 1.3;
}

.menu-arrow {
  color: #cbd5e1;
  transition: all 0.2s;
  flex-shrink: 0;
}

.menu-item:hover .menu-arrow {
  color: #94a3b8;
  transform: translateX(2px);
}

.status-section {
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  padding: 16px 20px;
  margin: 12px 0;
}

.status-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-text {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.online {
  background: #dcfce7;
  color: #166534;
}

.status-badge.offline {
  background: #f1f5f9;
  color: #475569;
}

.actions-section {
  padding: 8px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.help-button,
.logout-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: none;
  text-align: left;
  width: 100%;
}

.help-button {
  color: #64748b;
  background: #f8fafc;
}

.help-button:hover {
  background: #f1f5f9;
  color: #475569;
}

.logout-button {
  color: #dc2626;
  background: #fef2f2;
}

.logout-button:hover {
  background: #fee2e2;
  color: #b91c1c;
}

.help-button span,
.logout-button span {
  flex: 1;
}

/* Animation for status dot pulse */
.status-dot.online {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

/* Loading spinner */
.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.menu-item.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Organizations List Styles */
.organizations-list {
  margin: 8px 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.org-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #e2e8f0;
}

.org-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.close-org-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #64748b;
  transition: all 0.2s;
}

.close-org-btn:hover {
  background: #e2e8f0;
  color: #374151;
}

.org-error {
  padding: 16px 20px;
  text-align: center;
  color: #dc2626;
}

.org-error p {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #b91c1c;
}

.org-empty {
  padding: 20px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
}

.org-empty p {
  margin: 0;
}

.org-items {
  max-height: 200px;
  overflow-y: auto;
}

.org-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f1f5f9;
}

.org-item:last-child {
  border-bottom: none;
}

.org-item:hover {
  background: #f1f5f9;
}

.org-item.selected {
  background: #dbeafe;
  color: #1e40af;
}

.org-info {
  flex: 1;
  min-width: 0;
}

.org-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
}

.org-item.selected .org-name {
  color: #1e40af;
}

.org-details {
  font-size: 12px;
  color: #64748b;
}

.org-item.selected .org-details {
  color: #3b82f6;
}

.org-check {
  color: #22c55e;
  flex-shrink: 0;
}

/* Custom scrollbar for org items */
.org-items::-webkit-scrollbar {
  width: 4px;
}

.org-items::-webkit-scrollbar-track {
  background: #f8fafc;
}

.org-items::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.org-items::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
