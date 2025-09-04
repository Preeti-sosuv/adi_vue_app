<template>
  <div class="service-status-container">
    <!-- Title Section -->
    <div v-if="!hideTitle" class="status-header">
      <h3 class="status-title">Service Status</h3>
    </div>
    
    <!-- Status Info -->
    <div class="status-info">
      <div class="status-item">
        <span class="system-name" v-if="systemName">{{ systemName }}</span>
      </div>
      <div class="status-item">
        <span class="last-updated">Last Updated: {{ lastUpdated }}</span>
      </div>
      <div class="status-item">
        <span class="version">Version: {{ version }}</span>
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="status-actions">
      <button @click="refreshStatus" :disabled="loading" class="refresh-button" :class="{ 'primary': services.length === 0 }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" :class="{ 'animate-spin': loading }">
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
          <path d="M21 21v-5h-5"/>
        </svg>
        <span>{{ services.length === 0 ? 'Load Services' : 'Refresh' }}</span>
      </button>
    </div>

    <!-- Service Status Table -->
    <div class="status-table-container">
      <div v-if="loading && services.length === 0" class="loading-state">
        <div class="loading-spinner"></div>
        <span>Loading service status...</span>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ error }}</div>
        <button @click="refreshStatus" class="retry-button">Retry</button>
      </div>

      <div v-else class="status-table">
        <div class="table-header" :class="{ 'docker-mode': isDockerMode }">
          <div class="table-cell header-cell">Service</div>
          <div class="table-cell header-cell">Status</div>
          <div v-if="!isDockerMode" class="table-cell header-cell">Host</div>
          <div v-if="!isDockerMode" class="table-cell header-cell">Endpoint</div>
          <div v-if="isDockerMode" class="table-cell header-cell">Replicas</div>
          <div v-if="!isDockerMode" class="table-cell header-cell">Started</div>
          <div v-if="!isDockerMode" class="table-cell header-cell">Last Contacted</div>
          <div v-if="!isDockerMode" class="table-cell header-cell">Activity</div>
        </div>

        <div v-if="services.length === 0 && !loading" class="empty-state">
          <span>Click refresh to load service status</span>
        </div>

        <div v-for="service in services" :key="service.service_name" class="table-row" :class="{ 'docker-mode': isDockerMode }">
          <div class="table-cell">{{ service.service_name }}</div>
          <div class="table-cell">
            <div class="status-pill" :class="getStatusClass(service.service_status)">
              {{ service.service_status }}
            </div>
          </div>
          <div v-if="!isDockerMode" class="table-cell">{{ service.hostip || '-' }}</div>
          <div v-if="!isDockerMode" class="table-cell">{{ service.end_point || '-' }}</div>
          <div v-if="isDockerMode" class="table-cell">{{ service.replicas || '-' }}</div>
          <div v-if="!isDockerMode" class="table-cell">{{ formatDate(service.started) }}</div>
          <div v-if="!isDockerMode" class="table-cell">{{ formatDate(service.pingdate) }}</div>
          <div v-if="!isDockerMode" class="table-cell">{{ service.metric_1 || '-' }}</div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';

interface ServiceStatus {
  service_name: string;
  service_status: string;
  hostip?: string;
  end_point?: string;
  replicas?: string;
  started?: string;
  pingdate?: string;
  metric_1?: string;
}

interface Props {
  hideTitle?: boolean;
}

const props = defineProps<Props>();
const authStore = useAuthStore();

const services = ref<ServiceStatus[]>([]);
const loading = ref(false);
const error = ref('');
const lastUpdated = ref('');
const version = ref('');
const isDockerMode = ref(false);
const refreshTimer = ref<NodeJS.Timeout | null>(null);
const systemName = ref('');

const BASE_URL = 'http://34.69.208.233:8040/proxy';

const fetchServiceStatus = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const token = authStore.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${BASE_URL}/get_service_status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle the response format: { "result": [boolean, services_array, system_name, mode] }
    let servicesList = [];
    let runMode = '';
    
    if (data && Array.isArray(data.result) && data.result.length >= 4) {
      // Format: { "result": [true, [services...], "Automated Data - Dev", "DOCKER"] }
      const [success, services, system, mode] = data.result;
      
      if (success && Array.isArray(services)) {
        servicesList = services;
        systemName.value = system || '';
        runMode = mode || '';
      }
    } else if (Array.isArray(data) && data.length >= 2 && Array.isArray(data[1])) {
      // Fallback: [true, [services...]]
      servicesList = data[1];
    } else if (Array.isArray(data)) {
      // Fallback: direct array
      servicesList = data;
    } else {
      servicesList = [];
    }
    
    // Map the API response to our expected format
    services.value = servicesList.map((service, index) => {
      return {
        service_name: service.service_name || service.name || `Service ${index + 1}`,
        service_status: service.service_status || service.status || 'Unknown',
        replicas: service.replicas || 'N/A',
        hostip: service.hostip || service.host || service.ip || '-',
        end_point: service.end_point || service.endpoint || service.url || '-',
        started: service.started || service.start_time || service.created || '-',
        pingdate: service.pingdate || service.last_ping || service.last_contacted || service.updated || '-',
        metric_1: service.metric_1 || service.activity || service.metrics || '-'
      };
    });
    
    // Set docker mode detection based on API response
    isDockerMode.value = runMode === 'DOCKER' || (servicesList.length > 0 && servicesList[0].replicas !== undefined);
    
    updateLastUpdated();
    
  } catch (err) {
    console.error('Error fetching service status:', err);
    error.value = err instanceof Error ? err.message : 'Failed to fetch service status';
    services.value = [];
  } finally {
    loading.value = false;
  }
};

const refreshStatus = () => {
  fetchServiceStatus();
};

const updateLastUpdated = () => {
  const now = new Date();
  lastUpdated.value = now.toLocaleTimeString();
};

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleString();
  } catch {
    return dateStr;
  }
};

const getStatusClass = (status: string) => {
  const normalizedStatus = status?.toLowerCase();
  if (normalizedStatus === 'good' || normalizedStatus === 'up' || normalizedStatus === 'online' || normalizedStatus === 'running') {
    return 'status-good';
  } else if (normalizedStatus === 'down' || normalizedStatus === 'offline' || normalizedStatus === 'error' || normalizedStatus === 'failed') {
    return 'status-error';
  } else if (normalizedStatus === 'warning' || normalizedStatus === 'degraded' || normalizedStatus === 'partial') {
    return 'status-warning';
  }
  return 'status-unknown';
};


onMounted(() => {
  // Don't auto-fetch on mount, only when explicitly requested
  // Set version (you can adjust this based on your needs)
  version.value = 'Release_1_10_0';
  // Initialize with a loading message
  if (services.value.length === 0) {
    loading.value = false; // Don't show loading initially
  }
});

// Expose the fetch function so parent can trigger it
defineExpose({
  fetchServiceStatus
});
</script>

<style scoped>
.service-status-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.status-header {
  margin-bottom: 20px;
}

.status-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.status-info {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.status-item {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.status-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-button:hover:not(:disabled) {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-button.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.refresh-button.primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.status-table-container {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

.error-state {
  color: #dc2626;
}

.error-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.error-message {
  margin-bottom: 16px;
  font-size: 14px;
}

.retry-button {
  padding: 8px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-button:hover {
  background: #b91c1c;
}

.status-table {
  display: flex;
  flex-direction: column;
}

.table-header {
  display: grid;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  font-size: 12px;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-header.docker-mode {
  grid-template-columns: 1fr 120px 100px;
}

.table-header:not(.docker-mode) {
  grid-template-columns: 1fr 120px 120px 150px 120px 140px 100px;
}

.table-row {
  display: grid;
  border-bottom: 1px solid #f3f4f6;
}

.table-row.docker-mode {
  grid-template-columns: 1fr 120px 100px;
}

.table-row:not(.docker-mode) {
  grid-template-columns: 1fr 120px 120px 150px 120px 140px 100px;
}

.table-row:hover {
  background: #f9fafb;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
  min-height: 48px;
}

.header-cell {
  padding: 12px 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;
  min-width: 70px;
  justify-content: flex-start;
}

.status-pill::before {
  content: '✓';
  display: inline-block;
  font-weight: bold;
}

.status-good {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.status-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.status-error::before {
  content: '✗';
}

.status-warning {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.status-warning::before {
  content: '⚠';
}

.status-unknown {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.status-unknown::before {
  content: '?';
}

.empty-state {
  color: #6b7280;
  font-style: italic;
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .status-info {
    flex-direction: column;
    gap: 8px;
  }
  
  .table-header,
  .table-row {
    font-size: 12px;
  }
  
  .table-cell {
    padding: 8px 12px;
    min-height: 40px;
  }
}
</style>