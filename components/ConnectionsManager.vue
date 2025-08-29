<template>
  <div v-if="isVisible" class="connections-modal-overlay" @click="closeModal">
    <div class="connections-modal" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Connections</h2>
        <button class="close-btn" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="action-bar">
        <button class="btn-add" @click="handleAddConnection">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14m-7-7h14"/>
          </svg>
          Add Connection
        </button>
        <button class="btn-refresh" @click="refreshConnections" :disabled="loading">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M3 21v-5h5"/>
          </svg>
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <!-- Search/Filter Row -->
      <div class="filter-row">
        <input 
          v-model="searchTerm" 
          class="search-input"
          type="text"
          placeholder="Search connections..."
        />
        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ error }}
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-container">
        <table class="connections-table">
          <thead>
            <tr>
              <th @click="sortBy('connection_id')" class="sortable">
                Name
                <span v-if="sortField === 'connection_id'" class="sort-icon">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sortBy('connection_tech')" class="sortable">
                Type
                <span v-if="sortField === 'connection_tech'" class="sort-icon">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sortBy('connection_desc')" class="sortable description-col">
                Description
                <span v-if="sortField === 'connection_desc'" class="sort-icon">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sortBy('org_id')" class="sortable">
                Org ID
                <span v-if="sortField === 'org_id'" class="sort-icon">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sortBy('dept_id')" class="sortable">
                Dept ID
                <span v-if="sortField === 'dept_id'" class="sort-icon">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sortBy('status')" class="sortable">
                Status
                <span v-if="sortField === 'status'" class="sort-icon">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th class="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="connection in paginatedConnections" :key="connection.id">
              <td class="name-cell">{{ connection.connection_id }}</td>
              <td class="type-cell">{{ connection.connection_tech }}</td>
              <td class="description-cell">{{ connection.connection_desc }}</td>
              <td class="org-cell">{{ connection.org_id }}</td>
              <td class="dept-cell">{{ connection.dept_id }}</td>
              <td class="status-cell">
                <span :class="['status-badge', getStatusClass(connection.status)]">
                  {{ connection.status }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button 
                    class="action-btn copy-btn" 
                    @click="handleCopyConnection(connection)"
                    title="Copy Connection"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  </button>
                  <button 
                    class="action-btn edit-btn" 
                    @click="handleEditConnection(connection)"
                    title="Edit Connection"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button 
                    class="action-btn delete-btn" 
                    @click="handleDeleteConnection(connection)"
                    title="Delete Connection"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="!loading && filteredConnections.length === 0" class="empty-state">
          <svg v-if="error" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="error-icon">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p v-if="error">Failed to load connections</p>
          <p v-else-if="searchTerm">No connections match your search</p>
          <p v-else>No connections found</p>
          <button v-if="error" class="retry-btn" @click="loadConnections">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
            Retry
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <div class="page-info">
          Page {{ currentPage }} of {{ totalPages }} ({{ totalConnections }} total)
        </div>
        <div class="page-controls">
          <button 
            class="page-btn" 
            @click="previousPage" 
            :disabled="currentPage === 1"
          >
            Previous
          </button>
          <span class="page-numbers">
            <button 
              v-for="page in visiblePages" 
              :key="page"
              class="page-number" 
              :class="{ active: page === currentPage }"
              @click="setPage(page)"
            >
              {{ page }}
            </button>
          </span>
          <button 
            class="page-btn" 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Loading connections...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

interface Connection {
  id: string | number;
  connection_id: string; // Name
  connection_tech: string; // Type
  connection_desc: string; // Description  
  org_id: string | number; // Org ID
  dept_id: string | number; // Dept ID
  status: string; // Status
  // Additional API fields
  mode?: string;
  external_capable?: boolean;
  connection_capability?: string;
  connection_params?: any;
  connection_data?: any;
  created?: string;
  updated?: string;
}

interface Props {
  isVisible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  addConnection: [];
  editConnection: [connection: Connection];
  copyConnection: [connection: Connection];
  deleteConnection: [connection: Connection];
}>();

// Stores
const authStore = useAuthStore();

// Data state
const connections = ref<Connection[]>([]);
const loading = ref(false);
const searchTerm = ref('');
const error = ref<string | null>(null);

// Pagination state
const currentPage = ref(1);
const pageSize = ref(10);

// Sorting state
const sortField = ref<keyof Connection>('connection_id');
const sortDirection = ref<'asc' | 'desc'>('asc');

// API Constants
const API_BASE_URL = 'http://34.69.208.233:8040/proxy';

// Computed properties
const filteredConnections = computed(() => {
  let filtered = connections.value;
  
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(conn => 
      conn.connection_id.toLowerCase().includes(term) ||
      conn.connection_tech.toLowerCase().includes(term) ||
      conn.connection_desc.toLowerCase().includes(term) ||
      String(conn.org_id).toLowerCase().includes(term) ||
      String(conn.dept_id).toLowerCase().includes(term) ||
      conn.status.toLowerCase().includes(term)
    );
  }
  
  // Sort
  filtered.sort((a, b) => {
    const aVal = String(a[sortField.value] || '');
    const bVal = String(b[sortField.value] || '');
    const comparison = aVal.localeCompare(bVal);
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
  
  return filtered;
});

const totalConnections = computed(() => filteredConnections.value.length);
const totalPages = computed(() => Math.ceil(totalConnections.value / pageSize.value));

const paginatedConnections = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredConnections.value.slice(startIndex, endIndex);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const getToken = () => {
  return authStore.getToken() || sessionStorage.getItem('askai_token') || '';
};

const loadConnections = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    console.log('Loading connections with token:', token.substring(0, 10) + '...');
    
    const requestBody = {
      connection: "",
      token: token,
      mode: "",
      external_capable: false,
      org_id: 0,
      dept_id: 0
    };

    console.log('Request body:', requestBody);

    const response = await fetch(`${API_BASE_URL}/get_connections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Process the response data
    let connectionsData: Connection[] = [];
    
    console.log('Processing API response data structure...');
    console.log('Response data:', data);
    
    // Handle the specific API response format: { "result": [true, [connections_array]] }
    if (data && typeof data === 'object' && data.result && Array.isArray(data.result)) {
      if (data.result.length === 2 && data.result[0] === true && Array.isArray(data.result[1])) {
        console.log('Found tuple format [success, data] with', data.result[1].length, 'connections');
        connectionsData = data.result[1];
      } else if (Array.isArray(data.result)) {
        console.log('Found data.result array with', data.result.length, 'items');
        connectionsData = data.result;
      }
    }
    // Fallback to other formats if needed
    else if (data && typeof data === 'object') {
      if (data.data && Array.isArray(data.data)) {
        console.log('Found data.data array with', data.data.length, 'items');
        connectionsData = data.data;
      } else if (data.connections && Array.isArray(data.connections)) {
        console.log('Found data.connections array with', data.connections.length, 'items');
        connectionsData = data.connections;
      } else if (Array.isArray(data)) {
        console.log('Found direct array with', data.length, 'items');
        connectionsData = data;
      } else {
        console.warn('Unexpected response format:', data);
        connectionsData = [];
      }
    } else if (Array.isArray(data)) {
      console.log('Response is direct array with', data.length, 'items');
      connectionsData = data;
    } else {
      console.warn('Unexpected response type:', typeof data, data);
      connectionsData = [];
    }

    console.log('Raw connections data:', connectionsData);

    // Map the API response fields to our component structure
    connections.value = connectionsData.map((conn: any, index: number) => {
      const processed = {
        id: conn.id || `conn_${index}`,
        connection_id: conn.connection_id || 'Unknown', // Name
        connection_tech: conn.connection_tech || 'Unknown', // Type  
        connection_desc: conn.connection_desc || 'No description', // Description
        org_id: conn.org_id || 'All', // Org ID
        dept_id: conn.dept_id || 'All', // Dept ID
        status: conn.status || 'Unknown', // Status
        // Additional fields for completeness
        mode: conn.mode || '',
        external_capable: conn.external_capable || false,
        connection_capability: conn.connection_capability || '',
        connection_params: conn.connection_params || {},
        connection_data: conn.connection_data || {}
      };
      
      console.log(`Processed connection ${index + 1}:`, processed);
      return processed;
    });

    console.log('Processed connections:', connections.value);

  } catch (err) {
    console.error('Failed to load connections:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load connections';
    connections.value = [];
  } finally {
    loading.value = false;
  }
};

const refreshConnections = () => {
  loadConnections();
};

const sortBy = (field: keyof Connection) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  currentPage.value = 1;
};

const setPage = (page: number) => {
  currentPage.value = page;
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const getStatusClass = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === 'active' || normalizedStatus === 'active') {
    return 'status-active';
  }
  return 'status-inactive';
};

const handleAddConnection = () => {
  emit('addConnection');
};

const handleEditConnection = (connection: Connection) => {
  emit('editConnection', connection);
};

const handleCopyConnection = (connection: Connection) => {
  emit('copyConnection', connection);
};

const handleDeleteConnection = (connection: Connection) => {
  if (confirm(`Confirm Delete Connection '${connection.connection_id}' ?`)) {
    emit('deleteConnection', connection);
  }
};

const closeModal = () => {
  emit('close');
};

// Watchers
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    loadConnections();
  }
});

watch(searchTerm, () => {
  currentPage.value = 1;
});

// Initialize
onMounted(() => {
  if (props.isVisible) {
    loadConnections();
  }
});
</script>

<style scoped>
.connections-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.connections-modal {
  background: var(--surface-container, #ffffff);
  border-radius: 16px;
  width: 95%;
  max-width: 1400px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--outline-variant, #e0e0e0);
  display: flex;
  flex-direction: column;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .connections-modal {
    width: 98%;
    max-width: none;
    max-height: 95vh;
    border-radius: 12px;
    margin: 0 4px;
  }
  
  .modal-header {
    padding: 16px 16px 12px;
  }
  
  .modal-title {
    font-size: 18px;
  }
  
  .action-bar {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .btn-add, .btn-refresh {
    padding: 8px 12px;
    font-size: 12px;
    flex: 1;
    min-width: 120px;
  }
  
  .filter-row {
    padding: 12px 16px;
  }
  
  .search-input {
    max-width: 100%;
    width: 100%;
  }
  
  .table-container {
    padding: 0 8px;
    overflow-x: auto;
  }
  
  .connections-table {
    min-width: 800px;
    font-size: 14px;
  }
  
  .connections-table th,
  .connections-table td {
    padding: 8px 4px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 2px;
  }
  
  .action-btn {
    padding: 4px;
  }
  
  .pagination {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .page-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .page-numbers {
    gap: 2px;
  }
  
  .page-number {
    padding: 6px 8px;
    font-size: 12px;
    min-width: 32px;
  }
  
  .page-btn {
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .empty-state {
    padding: 20px;
  }
  
  .error-message {
    font-size: 12px;
    padding: 8px;
  }
}

/* Tablet Responsive Styles */
@media (max-width: 1024px) and (min-width: 769px) {
  .connections-modal {
    width: 96%;
    max-width: 900px;
  }
  
  .modal-header {
    padding: 20px 20px 14px;
  }
  
  .action-bar {
    padding: 14px 20px;
  }
  
  .filter-row {
    padding: 14px 20px;
  }
  
  .table-container {
    padding: 0 20px;
  }
  
  .connections-table {
    font-size: 14px;
  }
  
  .connections-table th,
  .connections-table td {
    padding: 10px 8px;
  }
  
  .pagination {
    padding: 14px 20px;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
  flex-shrink: 0;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--on-surface, #1f1f1f);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: var(--on-surface-variant, #666);
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: var(--surface-container-high, #f0f0f0);
}

.action-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
  flex-shrink: 0;
}

.btn-add, .btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--outline-variant, #e0e0e0);
  background: var(--surface-container, #f8f8f8);
  color: var(--on-surface, #1f1f1f);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add {
  background: var(--primary, #1976d2);
  color: var(--on-primary, #ffffff);
  border-color: var(--primary, #1976d2);
}

.btn-refresh:hover {
  background: var(--surface-container-high, #e8e8e8);
}

.btn-add:hover {
  background: var(--primary-dark, #1565c0);
}

.btn-add:disabled, .btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-row {
  padding: 16px 24px;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid var(--outline-variant, #e0e0e0);
  border-radius: 8px;
  background: var(--surface-container-highest, #ffffff);
  color: var(--on-surface, #1f1f1f);
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary, #1976d2);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 12px;
  background: var(--error-container, #ffebee);
  color: var(--error, #d32f2f);
  border: 1px solid var(--error, #d32f2f);
  border-radius: 8px;
  font-size: 14px;
}

.table-container {
  flex: 1;
  overflow: auto;
  padding: 0 24px;
}

.connections-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.connections-table th {
  background: var(--surface-container-low, #f8f8f8);
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: var(--on-surface, #1f1f1f);
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
  position: sticky;
  top: 0;
  z-index: 1;
}

.connections-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.connections-table th.sortable:hover {
  background: var(--surface-container, #f0f0f0);
}

.sort-icon {
  margin-left: 8px;
  font-size: 12px;
  color: var(--primary, #1976d2);
}

.connections-table td {
  padding: 12px;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
  color: var(--on-surface, #1f1f1f);
}

.description-col {
  width: 300px;
}

.actions-col {
  width: 120px;
}

.description-cell {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-active {
  background: var(--success-container, #e8f5e8);
  color: var(--success, #2e7d32);
}

.status-inactive {
  background: var(--error-container, #ffebee);
  color: var(--error, #d32f2f);
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn {
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  background: transparent;
}

.copy-btn:hover {
  background: var(--info-container, #e3f2fd);
  color: var(--info, #1976d2);
}

.edit-btn:hover {
  background: var(--warning-container, #fff3e0);
  color: var(--warning, #f57c00);
}

.delete-btn:hover {
  background: var(--error-container, #ffebee);
  color: var(--error, #d32f2f);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--on-surface-variant, #666);
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state .error-icon {
  color: var(--error, #d32f2f);
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  margin-top: 16px;
  border: 1px solid var(--primary, #1976d2);
  border-radius: 8px;
  background: var(--surface-container, #f8f8f8);
  color: var(--primary, #1976d2);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: var(--primary-container, #e3f2fd);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid var(--outline-variant, #e0e0e0);
  flex-shrink: 0;
}

.page-info {
  font-size: 14px;
  color: var(--on-surface-variant, #666);
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid var(--outline-variant, #e0e0e0);
  border-radius: 6px;
  background: var(--surface-container, #f8f8f8);
  color: var(--on-surface, #1f1f1f);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background: var(--surface-container-high, #e8e8e8);
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  padding: 8px 12px;
  border: 1px solid var(--outline-variant, #e0e0e0);
  border-radius: 6px;
  background: var(--surface-container, #f8f8f8);
  color: var(--on-surface, #1f1f1f);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 40px;
  text-align: center;
}

.page-number.active {
  background: var(--primary, #1976d2);
  color: var(--on-primary, #ffffff);
  border-color: var(--primary, #1976d2);
}

.page-number:not(.active):hover {
  background: var(--surface-container-high, #e8e8e8);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--on-surface-variant, #666);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--outline-variant, #e0e0e0);
  border-top: 3px solid var(--primary, #1976d2);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .connections-modal {
    background: var(--surface-container, #2c2c2c);
    border-color: var(--outline-variant, #404040);
  }
  
  .modal-title {
    color: var(--on-surface, #ffffff);
  }
  
  .close-btn:hover {
    background: var(--surface-container-high, #404040);
  }
  
  .connections-table th {
    background: var(--surface-container-low, #1e1e1e);
  }
}
</style>