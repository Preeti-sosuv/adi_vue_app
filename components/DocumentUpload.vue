<template>
  <div class="document-upload">
    <div class="upload-area" 
         :class="{ 'drag-over': isDragOver }"
         @drop="handleDrop"
         @dragover.prevent="handleDragOver"
         @dragleave="handleDragLeave"
         @click="triggerFileInput">
      <input 
        ref="fileInput"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
        @change="handleFileSelect"
        class="file-input"
      />
      
      <div class="upload-content">
        <svg class="upload-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7,10 12,15 17,10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <h3>Upload Documents</h3>
        <p>Drag and drop files here or click to browse</p>
        <p class="file-types">Supported: PDF, DOC, DOCX, TXT, CSV, XLSX</p>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploadingFiles.length > 0" class="upload-progress">
      <h4>Uploading Files...</h4>
      <div v-for="file in uploadingFiles" :key="file.id" class="progress-item">
        <div class="progress-info">
          <span class="filename">{{ file.name }}</span>
          <span class="progress-percent">{{ file.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: file.progress + '%' }"></div>
        </div>
      </div>
    </div>

    <!-- Document Classification Modal -->
    <HDocClassification
      v-if="showClassificationModal"
      :doc-name="currentDocument?.name || ''"
      :doc-type="currentDocument?.type || ''"
      :doc-classification="documentClassification"
      :doc-comment="documentNotes"
      :doc-categorisation="documentCategorization"
      @close-alert="handleClassificationResult"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDocumentsStore } from '../stores/documents'
import { useAuthStore } from '../stores/auth'
import HDocClassification from './HDocClassification.vue'

const documentsStore = useDocumentsStore()
const authStore = useAuthStore()

// Reactive data
const isDragOver = ref(false)
const uploadingFiles = ref<Array<{id: string, name: string, progress: number}>>([])
const showClassificationModal = ref(false)
const currentDocument = ref<any>(null)
const documentClassification = ref('')
const documentCategorization = ref('')
const documentNotes = ref('')
const newClassification = ref('')
const classifications = ref([
  'Automatic Classification',
  'Financial Report',
  'Legal Document',
  'Technical Specification',
  'Marketing Material',
  'HR Document',
  'Contract',
  'Invoice',
  'Presentation',
  'Spreadsheet'
])

const fileInput = ref<HTMLInputElement>()

// File upload handlers
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  
  const files = Array.from(e.dataTransfer?.files || [])
  processFiles(files)
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)
}

const processFiles = async (files: File[]) => {
  for (const file of files) {
    await uploadFile(file)
  }
}

const uploadFile = async (file: File) => {
  const fileId = generateId()
  const uploadProgress = {
    id: fileId,
    name: file.name,
    progress: 0
  }
  
  uploadingFiles.value.push(uploadProgress)

  try {
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.progress < 90) {
        uploadProgress.progress += Math.random() * 20
      }
    }, 200)

    // Create FormData for file upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', file.name)
    formData.append('document_type', getFileType(file.name))

    // Upload file to server
    const response = await fetch('/api/upload-document', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${authStore.getToken()}`
      }
    })

    clearInterval(progressInterval)
    uploadProgress.progress = 100

    if (response.ok) {
      const result = await response.json()
      
      // Remove from uploading list
      uploadingFiles.value = uploadingFiles.value.filter(f => f.id !== fileId)
      
      // Show classification modal
      currentDocument.value = {
        id: result.document_id,
        name: file.name,
        type: getFileType(file.name),
        size: file.size,
        uploadDate: new Date().toISOString()
      }
      
      showClassificationModal.value = true
    } else {
      throw new Error('Upload failed')
    }
  } catch (error) {
    console.error('Upload error:', error)
    uploadingFiles.value = uploadingFiles.value.filter(f => f.id !== fileId)
    // Show error notification
  }
}

const getFileType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf': return 'PDF Document'
    case 'doc':
    case 'docx': return 'Word Document'
    case 'txt': return 'Text Document'
    case 'csv': return 'CSV File'
    case 'xlsx':
    case 'xls': return 'Excel Spreadsheet'
    default: return 'Document'
  }
}

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

// Handle classification result from HDocClassification component
const handleClassificationResult = async (result: {
  action: 'save' | 'cancel'
  classification: string
  categorisation: string
  notes: string
}) => {
  if (result.action === 'save' && currentDocument.value) {
    const documentData = {
      document_id: currentDocument.value.id,
      document_name: currentDocument.value.name,
      document_type: currentDocument.value.type,
      classification: result.classification,
      categorization: result.categorisation,
      notes: result.notes,
      upload_date: currentDocument.value.uploadDate,
      size: currentDocument.value.size
    }

    try {
      // Save classification to server
      await fetch('/api/classify-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.getToken()}`
        },
        body: JSON.stringify(documentData)
      })

      // Add to documents store
      documentsStore.addDocuments([documentData])
      
    } catch (error) {
      console.error('Classification save error:', error)
    }
  }
  
  // Close modal regardless of save or cancel
  closeClassificationModal()
}

const closeClassificationModal = () => {
  showClassificationModal.value = false
  currentDocument.value = null
  documentClassification.value = ''
  documentCategorization.value = ''
  documentNotes.value = ''
}

onMounted(() => {
  // Load existing classifications from server if needed
})
</script>

<style scoped>
.document-upload {
  width: 100%;
}

.upload-area {
  border: 2px dashed var(--outline-variant);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 200ms ease;
  background: var(--surface-container-lowest);
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: var(--primary);
  background: var(--surface-container-low);
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  color: var(--primary);
  opacity: 0.7;
}

.upload-content h3 {
  margin: 0;
  color: var(--on-surface);
  font-size: 18px;
  font-weight: 600;
}

.upload-content p {
  margin: 0;
  color: var(--on-surface-variant);
  font-size: 14px;
}

.file-types {
  font-size: 12px !important;
  opacity: 0.7;
}

.upload-progress {
  margin-top: 20px;
  padding: 16px;
  background: var(--surface-container-low);
  border-radius: 8px;
}

.upload-progress h4 {
  margin: 0 0 12px 0;
  color: var(--on-surface);
  font-size: 14px;
  font-weight: 600;
}

.progress-item {
  margin-bottom: 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 12px;
}

.filename {
  color: var(--on-surface);
  font-weight: 500;
}

.progress-percent {
  color: var(--on-surface-variant);
}

.progress-bar {
  height: 4px;
  background: var(--outline-variant);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  transition: width 200ms ease;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface-container);
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin: 0 0 20px 0;
  color: var(--on-surface);
  font-size: 18px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: var(--on-surface);
  font-size: 14px;
  font-weight: 500;
}

.doc-type {
  color: var(--on-surface-variant);
  font-size: 14px;
}

.form-group select,
.form-group textarea,
.new-class-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--outline-variant);
  border-radius: 6px;
  background: var(--surface-container-highest);
  color: var(--on-surface);
  font-size: 14px;
}

.form-group select:focus,
.form-group textarea:focus,
.new-class-input:focus {
  outline: none;
  border-color: var(--primary);
}

.new-classification {
  margin-top: 8px;
}

.new-class-input {
  font-size: 12px;
  padding: 6px 10px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-primary {
  background: var(--primary);
  color: var(--on-primary);
}

.btn-primary:hover {
  background: var(--primary-container);
}

.btn-secondary {
  background: var(--surface-container-highest);
  color: var(--on-surface);
  border: 1px solid var(--outline-variant);
}

.btn-secondary:hover {
  background: var(--surface-container-high);
}
</style>
