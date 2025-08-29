<template>
  <div class="doc-classification-modal">
    <div class="modal-overlay" @click="handleCancel">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Document Classification</h3>
          <button @click="handleCancel" class="close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Document Name -->
          <div class="form-group">
            <label class="form-label">Document Name:</label>
            <div class="doc-name">{{ docName }}</div>
          </div>

          <!-- Document Type -->
          <div class="form-group">
            <label class="form-label">Content Type:</label>
            <div class="doc-type">{{ docType }}</div>
          </div>

          <!-- Classification Dropdown -->
          <div class="form-group">
            <label for="classification" class="form-label">Classification:</label>
            <select 
              id="classification"
              v-model="selectedClassification"
              @change="handleClassificationChange"
              class="form-select"
            >
              <option value="">Select Classification</option>
              <option 
                v-for="classification in classifications" 
                :key="classification" 
                :value="classification"
              >
                {{ classification }}
              </option>
            </select>
          </div>

          <!-- New Classification Input -->
          <div class="form-group">
            <label for="newClassification" class="form-label">Add New Classification:</label>
            <input
              id="newClassification"
              v-model="newClassification"
              @keyup.enter="handleNewClassificationEnter"
              placeholder="Enter new classification..."
              class="form-input"
            />
          </div>

          <!-- Categorization Dropdown -->
          <div class="form-group">
            <label for="categorization" class="form-label">Categorization:</label>
            <select 
              id="categorization"
              v-model="selectedCategorization"
              class="form-select"
            >
              <option value="">Select Category</option>
              <option value="Financial">Financial</option>
              <option value="Legal">Legal</option>
              <option value="Technical">Technical</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Database">Database</option>
              <option value="Report">Report</option>
              <option value="Contract">Contract</option>
              <option value="Invoice">Invoice</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Comments/Notes -->
          <div class="form-group">
            <label for="comments" class="form-label">Comments:</label>
            <textarea
              id="comments"
              v-model="comments"
              placeholder="Add any comments or notes about this document..."
              rows="4"
              class="form-textarea"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="handleSave" class="btn-save" :disabled="!canSave">
            Save
          </button>
          <button @click="handleCancel" class="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props
interface Props {
  docName?: string
  docType?: string
  docClassification?: string
  docComment?: string
  docCategorisation?: string
}

const props = withDefaults(defineProps<Props>(), {
  docName: '',
  docType: '',
  docClassification: '',
  docComment: '',
  docCategorisation: ''
})

// Emits
const emit = defineEmits<{
  'close-alert': [value: {
    action: 'save' | 'cancel'
    classification: string
    categorisation: string
    notes: string
  }]
}>()

// Reactive data
const selectedClassification = ref(props.docClassification)
const selectedCategorization = ref(props.docCategorisation)
const comments = ref(props.docComment)
const newClassification = ref('')
const originalClassification = ref(props.docClassification)

// Classifications list - similar to server.call("get_document_classifications")
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
  'Spreadsheet',
  'Database Schema',
  'API Documentation',
  'User Manual',
  'Policy Document',
  'Meeting Minutes',
  'Research Paper',
  'Compliance Document',
  'Audit Report',
  'Budget Plan',
  'Project Plan'
])

// Computed
const canSave = computed(() => {
  return selectedClassification.value && selectedClassification.value.trim() !== ''
})

// Methods
const handleSave = async () => {
  if (!canSave.value) return

  const data = {
    action: 'save' as const,
    classification: selectedClassification.value,
    categorisation: selectedCategorization.value,
    notes: comments.value
  }

  // Save classifications to server (similar to server.call("save_document_classifications"))
  try {
    await saveDocumentClassifications()
    emit('close-alert', data)
  } catch (error) {
    console.error('Error saving document classification:', error)
  }
}

const handleCancel = () => {
  const data = {
    action: 'cancel' as const,
    classification: '',
    categorisation: '',
    notes: ''
  }
  emit('close-alert', data)
}

const handleNewClassificationEnter = () => {
  const newClass = newClassification.value.trim()
  if (newClass) {
    if (!classifications.value.includes(newClass)) {
      classifications.value.push(newClass)
      selectedClassification.value = newClass
      newClassification.value = ''
      
      // Save updated classifications list
      saveDocumentClassifications()
    }
  }
}

const handleClassificationChange = () => {
  // Similar to doc_classification_dd_change in original code
  if (originalClassification.value !== '') {
    // This was an Update. Cannot re-classify automatically
    if (selectedClassification.value === 'Automatic Classification') {
      selectedClassification.value = originalClassification.value
    }
  }
}

const saveDocumentClassifications = async () => {
  try {
    // This would be equivalent to server.call("save_document_classifications", classifications=classifications.value)
    await fetch('/api/save-document-classifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classifications: classifications.value
      })
    })
  } catch (error) {
    console.error('Error saving classifications:', error)
  }
}

// Initialize component
onMounted(() => {
  // Load document classifications from server if needed
  // This would be equivalent to server.call("get_document_classifications")
  loadDocumentClassifications()
})

const loadDocumentClassifications = async () => {
  try {
    const response = await fetch('/api/get-document-classifications')
    if (response.ok) {
      const serverClassifications = await response.json()
      if (Array.isArray(serverClassifications) && serverClassifications.length > 0) {
        classifications.value = serverClassifications
      }
    }
  } catch (error) {
    console.error('Error loading classifications:', error)
    // Use default classifications if server call fails
  }
}
</script>

<style scoped>
.doc-classification-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background: var(--surface-container);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid var(--outline-variant);
  padding-bottom: 16px;
  margin-bottom: 0;
}

.modal-header h3 {
  margin: 0;
  color: var(--on-surface);
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: var(--on-surface-variant);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
}

.close-btn:hover {
  background: var(--surface-container-high);
  color: var(--on-surface);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: var(--on-surface);
  font-size: 14px;
  font-weight: 500;
}

.doc-name,
.doc-type {
  color: var(--on-surface-variant);
  font-size: 14px;
  padding: 8px 0;
  font-weight: 500;
}

.form-select,
.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--outline-variant);
  border-radius: 8px;
  background: var(--surface-container-highest);
  color: var(--on-surface);
  font-size: 14px;
  font-family: inherit;
  transition: all 200ms ease;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(103, 80, 164, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px 24px 24px;
  border-top: 1px solid var(--outline-variant);
}

.btn-save,
.btn-cancel {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
  min-width: 80px;
}

.btn-save {
  background: var(--primary);
  color: var(--on-primary);
}

.btn-save:hover:not(:disabled) {
  background: var(--primary-container);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(103, 80, 164, 0.3);
}

.btn-save:disabled {
  background: var(--surface-container-high);
  color: var(--on-surface-variant);
  cursor: not-allowed;
}

.btn-cancel {
  background: var(--surface-container-highest);
  color: var(--on-surface);
  border: 1px solid var(--outline-variant);
}

.btn-cancel:hover {
  background: var(--surface-container-high);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive design */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-content {
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .modal-footer {
    flex-direction: column-reverse;
  }
  
  .btn-save,
  .btn-cancel {
    width: 100%;
  }
}
</style>
