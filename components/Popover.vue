<template>
  <Teleport to="body">
    <div v-if="store.showPopover" class="popover-overlay">
      <div ref="popoverRef" class="popover-container" :class="placement">
        <slot>
          <!-- Documents Table -->
          <div v-if="store.isDocumentsData" class="documents-modal">
            <div class="modal-header">
              <div class="header-info">
                <h3 class="modal-title">Document Sources</h3>
                <p class="modal-subtitle">{{ store.selectedCount }} of {{ store.totalDocuments }} selected</p>
              </div>
              <button class="close-button" @click="store.closePopover()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          
          <div class="table-container">
            <table class="documents-table">
              <thead>
                <tr>
                  <th class="select-col">
                    <input 
                      type="checkbox" 
                      :checked="store.allSelected" 
                      @change="store.toggleAll()"
                      class="select-all-checkbox"
                    />
                  </th>
                  <th>Data Room</th>
                  <th>Classification</th>
                  <th class="sortable" @click="store.sortBy('name')">
                    Name
                    <span v-if="store.sortField === 'name'" class="sort-indicator">
                      {{ store.sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </th>
                  <th>Categorisation</th>
                  <th>Loaded</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(doc, index) in store.paginatedDocuments" :key="index">
                  <td>
                    <input 
                      type="checkbox" 
                      :checked="store.selectedDocuments.includes(doc.id || index)"
                      @change="store.toggleDocument(doc.id || index)"
                      class="document-checkbox"
                    />
                  </td>
                  <td>{{ doc.data_room || '-' }}</td>
                  <td>{{ doc.classification || '-' }}</td>
                  <td>{{ doc.name || '-' }}</td>
                  <td>{{ doc.categorisation || '-' }}</td>
                  <td>{{ doc.loaded || '-' }}</td>
                  <td>{{ doc.source || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="pagination">
            <div class="pagination-info">
              <span>Page Size: {{ store.pageSize }}</span>
              <span>{{ store.startIndex + 1 }} to {{ store.endIndex }} of {{ store.totalDocuments }}</span>
              <span>Page {{ store.currentPage }} of {{ store.totalPages }}</span>
            </div>
            <div class="pagination-controls">
              <button 
                @click="store.previousPage()" 
                :disabled="store.currentPage === 1"
                class="pagination-btn"
              >
                Previous
              </button>
              <button 
                @click="store.nextPage()" 
                :disabled="store.currentPage === store.totalPages"
                class="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        
        <!-- Prompt List -->
        <div v-else-if="Array.isArray(store.popoverData)" class="prompt-container">
          <div class="prompt-header">
            <div class="prompt-info">
              <h3 class="prompt-title">Bookmark</h3>
            </div>
            <button class="close-button" @click="store.closePopover()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div class="prompt-content">
            <div v-if="store.popoverData && store.popoverData.length > 0" class="prompt-items">
              <div v-for="(item, idx) in store.popoverData" :key="idx" class="prompt-item" @click="handlePromptClick(item)">
                <div class="prompt-item-content">
                  <span class="prompt-text">{{ item }}</span>
                </div>
              </div>
            </div>
            <div v-else class="no-bookmarks">
              <p class="no-bookmarks-text">No bookmarks saved yet. Start by bookmarking a question!</p>
            </div>
          </div>
        </div>
        
        <!-- Error/JSON Preview -->
        <div v-else-if="store.popoverData" class="error-container">
          <div class="error-header">
            <div class="error-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <div class="error-info">
              <h3 class="error-title">Response Data</h3>
              <p class="error-subtitle">Raw API response</p>
            </div>
            <button class="close-button" @click="store.closePopover()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="error-content">
            <pre class="json-preview">{{ formatted }}</pre>
          </div>
        </div>
        </slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { usePromptListStore } from '../stores/promptList';

const props = defineProps<{ placement?: 'top' | 'bottom' }>();
const emit = defineEmits<{
  promptSelected: [prompt: string]
}>();

const store = usePromptListStore();
const popoverRef = ref<HTMLElement | null>(null);

const placement = computed(() => props.placement ?? 'bottom');

const formatted = computed(() => {
  try {
    return JSON.stringify(store.popoverData, null, 2);
  } catch {
    return String(store.popoverData ?? '');
  }
});

// Handle clicking on a prompt item to insert it into input
const handlePromptClick = (prompt: any) => {
  const promptText = typeof prompt === 'string' ? prompt : String(prompt);
  emit('promptSelected', promptText);
  store.closePopover();
};

// Handle copying prompt to clipboard
const copyToClipboard = async (text: any) => {
  try {
    const textToCopy = typeof text === 'string' ? text : String(text);
    await navigator.clipboard.writeText(textToCopy);
    console.log('Copied to clipboard:', textToCopy);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
  }
};

// Handle clicking outside to close popover
const handleClickOutside = (event: Event) => {
  if (popoverRef.value && !popoverRef.value.contains(event.target as Node)) {
    store.closePopover();
  }
};

// Add/remove click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.popover-overlay {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 1000;
  pointer-events: none;
}

.popover-container {
  max-width: 90vw;
  max-height: 85vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: popoverEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: auto;
}

@keyframes popoverEnter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.popover-container.bottom {
  align-self: flex-end;
  margin-bottom: 100px;
}

.popover-container.top {
  position: fixed;
  bottom: 120px;
  left: 70px;
}

/* Documents Modal Styles */
.documents-modal {
  width: 100%;
  max-width: 1000px;
  background: white;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%);
}

.header-info {
  flex: 1;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.modal-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: #f1f5f9;
  color: #334155;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
}

.documents-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.documents-table th,
.documents-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.documents-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 1;
}

.select-col {
  width: 40px;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: #e9ecef;
}

.sort-indicator {
  margin-left: 4px;
  color: #007bff;
}

.select-all-checkbox,
.document-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.pagination-info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.pagination-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Prompt Container Styles */
.prompt-container {
  width: 100%;
  max-width: 400px;
  min-width: 300px;
  background: white;
  overflow: hidden;
  position: relative;
}

.prompt-container::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 40px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid white;
}

.prompt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 8px;
  border-bottom: 1px solid #e5e7eb;
}

.prompt-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.prompt-info {
  flex: 1;
  min-width: 0;
}

.prompt-title {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin: 0;
}

.prompt-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.prompt-content {
  padding: 8px 16px 16px;
  max-height: 300px;
  overflow-y: auto;
}

.prompt-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.prompt-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: transparent;
  border: none;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
}

.prompt-item:hover {
  background: #f1f5f9;
  border-radius: 6px;
}

.prompt-item:active {
  background: #e2e8f0;
}

.prompt-item-icon {
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
}

.prompt-item-content {
  flex: 1;
  min-width: 0;
}

.prompt-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
  display: block;
  transition: color 0.2s;
}

.prompt-item:hover .prompt-text {
  color: #1e293b;
}

.no-bookmarks {
  text-align: center;
  padding: 24px 16px;
}

.no-bookmarks-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.highlight-link {
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  line-height: 1.4;
}

.highlight-link:hover {
  color: #5a67d8;
  text-decoration: underline;
}

.prompt-item-actions {
  flex-shrink: 0;
}

.action-btn {
  background: none;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #e2e8f0;
  color: #64748b;
}

/* Error Container Styles */
.error-container {
  width: 100%;
  max-width: 600px;
  background: white;
  overflow: hidden;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #fefcfc 0%, #fef7f7 100%);
}

.error-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.error-info {
  flex: 1;
  min-width: 0;
}

.error-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.error-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.error-content {
  padding: 16px 24px 24px;
  max-height: 400px;
  overflow-y: auto;
}

.json-preview {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #374151;
  margin: 0;
  overflow-x: auto;
}
</style>