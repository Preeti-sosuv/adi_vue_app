<template>
  <div v-if="isVisible" class="upload-modal-overlay" @click="closeModal">
    <div class="upload-modal" @click.stop>
      <!-- Header with close button -->
      <div class="modal-header">
        <h2 class="modal-title">Add New Source</h2>
        <button class="close-btn" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button 
          class="tab" 
          :class="{ active: activeTab === 'upload' }" 
          @click="activeTab = 'upload'"
        >
          File Upload
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'connections' }" 
          @click="activeTab = 'connections'"
        >
          Connections
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- File Upload Tab -->
        <div v-if="activeTab === 'upload'" class="upload-tab">
          <div class="upload-section">
            <div class="upload-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <h3 class="upload-title">Upload & Connect File</h3>
            
            <!-- Drag & Drop Area -->
            <div 
              class="drop-zone"
              :class="{ 'drag-over': isDragOver }"
              @drop="handleDrop"
              @dragover.prevent="handleDragOver"
              @dragleave="handleDragLeave"
              @click="triggerFileInput"
            >
              <div class="drop-content">
                <p class="drop-text">Drop a file here, or select a file</p>
                
                <div class="file-types">
                  <p class="file-type-label">Supported Data file types: <span class="file-extensions">.csv, .xls, .xlsx</span></p>
                  <p class="file-type-label">Document types: <span class="file-extensions">.csv, .xls, .xlsx, .pdf, .doc, .docx, .ppt, .pptx, .txt</span></p>
                </div>
                
                <p class="file-limit">1 file per upload, up to 500K rows or 10 MB</p>
                
                <button class="select-file-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17,8 12,3 7,8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Drop a file here, or select a file
                </button>
              </div>
            </div>

            <!-- Hidden file input -->
            <input 
              ref="fileInput"
              type="file" 
              class="hidden-file-input"
              :accept="acceptedFileTypes"
              @change="handleFileSelect"
            />

            <!-- Selected file display -->
            <div v-if="selectedFile" class="selected-file">
              <div class="file-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                <span class="file-name">{{ selectedFile.name }}</span>
                <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
              </div>
              <button class="remove-file-btn" @click="removeFile">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Upload button -->
            <div class="upload-actions">
              <button 
                class="upload-btn" 
                :disabled="!selectedFile || isUploading"
                @click="uploadFile"
              >
                <span v-if="!isUploading">Upload File</span>
                <span v-else>Uploading...</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Connections Tab -->
        <div v-if="activeTab === 'connections'" class="connections-tab">
          <p class="coming-soon">Connections feature coming soon...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  isVisible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  fileUploaded: [file: File];
  showClassification: [data: { file: File; fileId?: string }];
}>();

const activeTab = ref<'upload' | 'connections'>('upload');
const isDragOver = ref(false);
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const acceptedFileTypes = computed(() => {
  return '.csv,.xls,.xlsx,.pdf,.doc,.docx,.ppt,.pptx,.txt';
});

const closeModal = () => {
  emit('close');
  resetForm();
};

const resetForm = () => {
  selectedFile.value = null;
  isUploading.value = false;
  isDragOver.value = false;
  activeTab.value = 'upload';
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = () => {
  isDragOver.value = false;
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragOver.value = false;
  
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    handleFileSelection(files[0]);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    handleFileSelection(files[0]);
  }
};

const handleFileSelection = (file: File) => {
  // Validate file type
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];

  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['csv', 'xls', 'xlsx', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'];

  if (!allowedExtensions.includes(fileExtension || '')) {
    alert('Please select a supported file type.');
    return;
  }

  // Validate file size (10 MB limit)
  const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
  if (file.size > maxSize) {
    alert('File size must be less than 10 MB.');
    return;
  }

  selectedFile.value = file;
};

const removeFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const uploadFile = async () => {
  if (!selectedFile.value) return;

  isUploading.value = true;
  
  try {
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock file ID for the uploaded file
    const fileId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Emit showClassification event to trigger the classification modal
    emit('showClassification', { 
      file: selectedFile.value,
      fileId: fileId
    });
    
    // Keep the modal open until classification is complete
    // closeModal();
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Upload failed. Please try again.');
  } finally {
    isUploading.value = false;
  }
};
</script>

<style scoped>
.upload-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.upload-modal {
  background: var(--surface-container, #ffffff);
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--outline-variant, #e0e0e0);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
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

.tabs {
  display: flex;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
}

.tab {
  background: none;
  border: none;
  padding: 16px 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface-variant, #666);
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab.active {
  color: var(--primary, #1976d2);
  border-bottom-color: var(--primary, #1976d2);
}

.tab:hover:not(.active) {
  background: var(--surface-container-high, #f0f0f0);
}

.tab-content {
  padding: 24px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-icon {
  display: flex;
  justify-content: center;
  color: var(--on-surface-variant, #666);
}

.upload-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--on-surface, #1f1f1f);
  margin: 0;
}

.drop-zone {
  border: 2px dashed var(--outline-variant, #e0e0e0);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--surface-container-low, #f8f8f8);
}

.drop-zone:hover,
.drop-zone.drag-over {
  border-color: var(--primary, #1976d2);
  background: var(--primary-container, #e3f2fd);
}

.drop-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.drop-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--on-surface, #1f1f1f);
  margin: 0;
}

.file-types {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}

.file-type-label {
  font-size: 13px;
  color: var(--on-surface-variant, #666);
  margin: 0;
}

.file-extensions {
  font-weight: 500;
  color: var(--on-surface, #1f1f1f);
}

.file-limit {
  font-size: 12px;
  color: var(--on-surface-variant, #666);
  margin: 0;
}

.select-file-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-container, #f0f0f0);
  border: 1px solid var(--outline-variant, #e0e0e0);
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  color: var(--on-surface-variant, #666);
  transition: all 0.2s;
}

.select-file-btn:hover {
  background: var(--surface-container-high, #e8e8e8);
  border-color: var(--outline, #ccc);
}

.hidden-file-input {
  display: none;
}

.selected-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface-container-low, #f8f8f8);
  border: 1px solid var(--outline-variant, #e0e0e0);
  border-radius: 8px;
  padding: 12px 16px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--on-surface, #1f1f1f);
}

.file-name {
  font-weight: 500;
}

.file-size {
  color: var(--on-surface-variant, #666);
  font-size: 13px;
}

.remove-file-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: var(--error, #d32f2f);
  transition: background-color 0.2s;
}

.remove-file-btn:hover {
  background: var(--error-container, #ffebee);
}

.upload-actions {
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.upload-btn {
  background: var(--primary, #1976d2);
  color: var(--on-primary, #ffffff);
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 120px;
}

.upload-btn:hover:not(:disabled) {
  background: var(--primary-dark, #1565c0);
}

.upload-btn:disabled {
  background: var(--surface-container-high, #e0e0e0);
  color: var(--on-surface-variant, #666);
  cursor: not-allowed;
}

.connections-tab {
  text-align: center;
  padding: 40px 20px;
}

.coming-soon {
  font-size: 16px;
  color: var(--on-surface-variant, #666);
  margin: 0;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .upload-modal {
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
  
  .tabs {
    overflow-x: auto;
  }
  
  .tab {
    padding: 12px 16px;
    font-size: 13px;
    white-space: nowrap;
    min-width: 100px;
  }
  
  .tab-content {
    padding: 16px;
  }
  
  .upload-section {
    gap: 16px;
  }
  
  .upload-title {
    font-size: 16px;
  }
  
  .drop-zone {
    padding: 24px 12px;
    border-radius: 8px;
  }
  
  .drop-text {
    font-size: 14px;
  }
  
  .file-type-label {
    font-size: 11px;
  }
  
  .file-extensions {
    font-size: 11px;
  }
  
  .file-limit {
    font-size: 10px;
  }
  
  .select-file-btn {
    padding: 10px 16px;
    font-size: 12px;
  }
  
  .selected-file {
    padding: 10px 12px;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .file-info {
    width: 100%;
  }
  
  .file-name {
    font-size: 14px;
    word-break: break-all;
  }
  
  .file-size {
    font-size: 12px;
  }
  
  .remove-file-btn {
    align-self: flex-end;
  }
  
  .upload-btn {
    padding: 12px 24px;
    font-size: 14px;
    width: 100%;
  }
  
  .connections-tab {
    padding: 24px 16px;
  }
  
  .coming-soon {
    font-size: 14px;
  }
}

/* Tablet Responsive Styles */
@media (max-width: 1024px) and (min-width: 769px) {
  .upload-modal {
    width: 92%;
    max-width: 500px;
  }
  
  .modal-header {
    padding: 20px 20px 14px;
  }
  
  .tab-content {
    padding: 20px;
  }
  
  .drop-zone {
    padding: 32px 16px;
  }
  
  .upload-title {
    font-size: 17px;
  }
  
  .drop-text {
    font-size: 15px;
  }
  
  .file-type-label {
    font-size: 12px;
  }
  
  .connections-tab {
    padding: 32px 20px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .upload-modal {
    background: var(--surface-container, #2c2c2c);
    border-color: var(--outline-variant, #404040);
  }
  
  .modal-title {
    color: var(--on-surface, #ffffff);
  }
  
  .close-btn:hover {
    background: var(--surface-container-high, #404040);
  }
  
  .drop-zone {
    background: var(--surface-container-low, #1e1e1e);
    border-color: var(--outline-variant, #404040);
  }
  
  .drop-zone:hover,
  .drop-zone.drag-over {
    background: var(--primary-container, #1e3a5f);
  }
}
</style>
