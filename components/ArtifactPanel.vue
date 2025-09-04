<template>
  <div v-if="isOpen" class="artifact-panel-slide" :class="{ 'resizing': isResizing }">
    <!-- Resize Handle -->
    <div 
      class="resize-handle"
      :class="{ 'active': isResizing }"
      @mousedown="startResize"
      @touchstart="startResize"
    >
      <div class="resize-handle-line"></div>
    </div>
    
    <div class="panel-header">
      <h2 class="panel-title">{{ title }}</h2>
      <button @click="closePanel" class="close-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
    
    <div class="panel-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <span>Loading data...</span>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ error }}</div>
        <button @click="retryLoad" class="retry-button">Retry</button>
      </div>
      
      <!-- Data Table -->
      <div v-else-if="data && data.length > 0" class="data-container">
        <div class="data-info">
          <span class="data-count">{{ data.length }} rows</span>
          <span v-if="totalRows && totalRows > data.length" class="total-count">
            of {{ totalRows }} total
          </span>
        </div>
        
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="column in columns" :key="column.key">
                  {{ column.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in data" :key="index">
                <td v-for="column in columns" :key="column.key">
                  {{ formatCellValue(row[column.key]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- SQL Display -->
        <div v-if="sql" class="sql-container">
          <div class="sql-header">
            <span class="sql-label">SQL Query:</span>
          </div>
          <pre class="sql-code">{{ sql }}</pre>
        </div>
      </div>
      
      <!-- Help Content -->
      <div v-else-if="helpContent" class="help-container">
        <div v-html="helpContent" class="help-content"></div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="empty-container">
        <span>No data available</span>
      </div>
    </div>
    
    <div class="panel-footer">
      <button @click="closePanel" class="footer-button secondary">Close</button>
      <button v-if="data && data.length > 0" @click="exportData" class="footer-button primary">
        Export Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';

interface DataRow {
  [key: string]: any;
}

interface Column {
  key: string;
  label: string;
}

interface Props {
  isOpen?: boolean;
  title?: string;
  connectionId?: string;
  datasetId?: string;
  sql?: string;
  helpContent?: string;
  maxRows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  title: 'Data Viewer',
  maxRows: 50
});

const emit = defineEmits<{
  close: [];
}>();

const authStore = useAuthStore();

const data = ref<DataRow[]>([]);
const columns = ref<Column[]>([]);
const loading = ref(false);
const error = ref('');
const totalRows = ref(0);

// Resize functionality
const panelWidth = ref(600); // Default width
const isResizing = ref(false);
const minWidth = 400;
const maxWidth = ref(1200);

const BASE_URL = 'http://34.69.208.233:8040/proxy';

const fetchData = async () => {
  if (!props.connectionId || !props.datasetId) return;
  
  try {
    loading.value = true;
    error.value = '';
    
    const token = authStore.getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${BASE_URL}/get_dataviewer_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        connection_id: props.connectionId,
        dataset_id: props.datasetId,
        rows: props.maxRows,
        sql: props.sql || '',
        predicate: '',
        token: token
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Handle Anvil response format: [authed, blob_content, rc, trc]
    if (result && Array.isArray(result.result) && result.result.length >= 4) {
      const [authed, blobContent, rowCount, totalRowCount] = result.result;
      
      if (!authed) {
        throw new Error('Not authorized to access data');
      }
      
      if (blobContent) {
        // Parse the blob content (assumes it's JSON)
        const jsonData = JSON.parse(atob(blobContent)); // Decode base64 if needed
        
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          data.value = jsonData;
          totalRows.value = totalRowCount || jsonData.length;
          
          // Generate columns from first row
          const firstRow = jsonData[0];
          columns.value = Object.keys(firstRow).map(key => ({
            key,
            label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          }));
        } else {
          data.value = [];
          columns.value = [];
        }
      }
    } else {
      throw new Error('Unexpected response format');
    }
    
  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = err instanceof Error ? err.message : 'Failed to fetch data';
    data.value = [];
    columns.value = [];
  } finally {
    loading.value = false;
  }
};

const retryLoad = () => {
  fetchData();
};

const closePanel = () => {
  emit('close');
};

const formatCellValue = (value: any) => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const exportData = () => {
  if (!data.value.length) return;
  
  // Convert data to CSV
  const headers = columns.value.map(col => col.label).join(',');
  const rows = data.value.map(row => 
    columns.value.map(col => {
      const value = row[col.key];
      // Escape commas and quotes in CSV
      return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
        ? `"${value.replace(/"/g, '""')}"` 
        : value;
    }).join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${props.datasetId || 'data'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Resize functionality
const startResize = (e: MouseEvent | TouchEvent) => {
  isResizing.value = true;
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'ew-resize';
  
  const startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const startWidth = panelWidth.value;
  
  const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
    if (!isResizing.value) return;
    
    const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
    const diff = startX - currentX; // Reverse direction since we're resizing from the left edge
    const newWidth = Math.max(minWidth, Math.min(maxWidth.value, startWidth + diff));
    
    panelWidth.value = newWidth;
    updateArtifactWidth(newWidth);
  };
  
  const handleMouseUp = () => {
    isResizing.value = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleMouseMove);
    document.removeEventListener('touchend', handleMouseUp);
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('touchmove', handleMouseMove);
  document.addEventListener('touchend', handleMouseUp);
};

// Update artifact container width
const updateArtifactWidth = (width: number) => {
  const artifactContainer = document.querySelector('.artifact-container') as HTMLElement;
  if (artifactContainer) {
    artifactContainer.style.width = `${width}px`;
  }
  
  // Also emit event to parent if needed
  const event = new CustomEvent('artifact-resize', { 
    detail: { width },
    bubbles: true 
  });
  document.dispatchEvent(event);
};

// Initialize panel width and max width based on screen size
const initializeResponsiveSizes = () => {
  const screenWidth = window.innerWidth;
  
  if (screenWidth <= 480) {
    panelWidth.value = screenWidth;
    maxWidth.value = screenWidth;
  } else if (screenWidth <= 768) {
    panelWidth.value = Math.min(screenWidth * 0.85, 600);
    maxWidth.value = screenWidth * 0.9;
  } else if (screenWidth <= 1024) {
    panelWidth.value = Math.min(screenWidth * 0.6, 700);
    maxWidth.value = screenWidth * 0.8;
  } else {
    panelWidth.value = 600;
    maxWidth.value = screenWidth * 0.7;
  }
};

// Handle window resize
const handleWindowResize = () => {
  const screenWidth = window.innerWidth;
  maxWidth.value = screenWidth * 0.8;
  
  // Adjust panel width if it's too large for current screen
  if (panelWidth.value > maxWidth.value) {
    panelWidth.value = maxWidth.value;
  }
  
  // Update artifact container width
  if (props.isOpen) {
    updateArtifactWidth(panelWidth.value);
  }
};

// Lifecycle hooks
onMounted(() => {
  initializeResponsiveSizes();
  window.addEventListener('resize', handleWindowResize);
  
  if (props.isOpen) {
    updateArtifactWidth(panelWidth.value);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleWindowResize);
});

// Watch for panel open/close to update artifact container
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    initializeResponsiveSizes();
    updateArtifactWidth(panelWidth.value);
  }
  // No need to reset anything - container will be removed from DOM when closed
});

// Watch for prop changes to fetch data
watch(() => [props.isOpen, props.connectionId, props.datasetId], () => {
  if (props.isOpen && props.connectionId && props.datasetId) {
    fetchData();
  }
}, { immediate: true });
</script>

<style scoped>
.artifact-panel-slide {
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  animation: slideInFromRight 0.3s ease-out;
  transform: translateX(0);
  width: 100%;
  position: relative;
}

.artifact-panel-slide.resizing {
  user-select: none;
  pointer-events: none;
}

.artifact-panel-slide.resizing * {
  user-select: none;
  pointer-events: none;
}

.artifact-panel-slide.resizing .resize-handle {
  pointer-events: auto;
}

@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.resize-handle {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  cursor: ew-resize;
  background: transparent;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-handle:hover,
.resize-handle.active {
  background: rgba(59, 130, 246, 0.1);
}

.resize-handle:hover .resize-handle-line,
.resize-handle.active .resize-handle-line {
  background: #3b82f6;
  opacity: 1;
}

.resize-handle-line {
  width: 2px;
  height: 40px;
  background: #d1d5db;
  border-radius: 1px;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.panel-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-button {
  padding: 8px;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.close-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.panel-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.loading-container, .error-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-container {
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

.data-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.data-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px 0;
  font-size: 14px;
  color: #6b7280;
}

.data-count {
  font-weight: 500;
  color: #374151;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
  margin: 16px 24px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.data-table tr:hover td {
  background: #f9fafb;
}

.sql-container {
  margin: 0 24px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.sql-header {
  background: #f8fafc;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.sql-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.sql-code {
  padding: 16px;
  background: #1f2937;
  color: #f9fafb;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
  overflow-x: auto;
}

.help-container {
  padding: 24px;
  overflow-y: auto;
}

.help-content {
  color: #374151;
  line-height: 1.6;
}

.panel-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

.footer-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.footer-button.secondary {
  background: white;
  color: #374151;
  border-color: #d1d5db;
}

.footer-button.secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.footer-button.primary {
  background: #3b82f6;
  color: white;
}

.footer-button.primary:hover {
  background: #2563eb;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .artifact-panel-slide {
    min-width: 320px;
  }
  
  .panel-header {
    padding: 16px 20px;
  }
  
  .panel-title {
    font-size: 18px;
  }
  
  .data-info, .table-wrapper, .sql-container {
    margin-left: 20px;
    margin-right: 20px;
  }
  
  .data-table th, .data-table td {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .panel-footer {
    padding: 16px 20px;
    flex-direction: column-reverse;
    gap: 8px;
  }
  
  .footer-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .artifact-panel-slide {
    min-width: 280px;
  }
  
  .resize-handle {
    width: 8px;
  }
  
  .resize-handle-line {
    width: 3px;
    height: 30px;
  }
}
</style>