<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Document Classification</h2>
        <button class="close-btn" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-body">
        <!-- Document Info -->
        <div class="document-info">
          <div class="info-row">
            <label class="info-label">Name:</label>
            <span class="info-value">{{ docName }}</span>
          </div>
          <div class="info-row">
            <label class="info-label">Type:</label>
            <span class="info-value">{{ docType }}</span>
          </div>
        </div>

        <!-- Classification Form -->
        <div class="form-section">
          <div class="form-group">
            <label class="form-label">Classification:</label>
            <select 
              v-model="selectedClassification" 
              class="form-select"
              @change="handleClassificationChange"
            >
              <option v-for="option in classificationOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">New Classification:</label>
            <input 
              v-model="newClassification" 
              class="form-input"
              type="text"
              placeholder="Enter new classification"
              @keyup.enter="addNewClassification"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Categorization:</label>
            <select v-model="selectedCategorization" class="form-select">
              <option value="Public">Public</option>
              <option value="Company Confidential">Company Confidential</option>
              <option value="User Confidential">User Confidential</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Data Room:</label>
            <select v-model="selectedDataRoom" class="form-select">
              <option v-for="option in dataRoomOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">New Data Room:</label>
            <input 
              v-model="newDataRoom" 
              class="form-input"
              type="text"
              placeholder="Enter new data room"
              @keyup.enter="addNewDataRoom"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Notes:</label>
            <textarea 
              v-model="notes" 
              class="form-textarea"
              rows="4"
              placeholder="Add any additional notes..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="modal-actions">
        <button class="btn-secondary" @click="handleCancel">Cancel</button>
        <button class="btn-primary" @click="handleSave">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  isVisible: boolean;
  docName: string;
  docType: string;
  docClassification?: string;
  docCategorisation?: string;
  docComment?: string;
}

const props = withDefaults(defineProps<Props>(), {
  docClassification: '',
  docCategorisation: 'Public',
  docComment: ''
});

const emit = defineEmits<{
  close: [];
  save: [data: {
    action: 'save' | 'cancel';
    classification: string;
    categorisation: string;
    dataroom: string;
    notes: string;
  }];
}>();

// Form state
const selectedClassification = ref('');
const newClassification = ref('');
const selectedCategorization = ref('Public');
const selectedDataRoom = ref('');
const newDataRoom = ref('');
const notes = ref('');

// Options
const classificationOptions = ref([
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
  'Document'
]);

const dataRoomOptions = ref([
  'Automatic Assignment',
  'General',
  'Financial',
  'Legal',
  'Technical',
  'Marketing'
]);

// Initialize form with props
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    initializeForm();
  }
});

const initializeForm = () => {
  selectedClassification.value = props.docClassification || classificationOptions.value[0];
  selectedCategorization.value = props.docCategorisation || 'Public';
  notes.value = props.docComment || '';
  selectedDataRoom.value = 'Automatic Assignment';
  newClassification.value = '';
  newDataRoom.value = '';
};

const handleClassificationChange = () => {
  // Prevent re-classification to automatic if it was already classified
  if (props.docClassification && selectedClassification.value === 'Automatic Classification') {
    selectedClassification.value = props.docClassification;
  }
};

const addNewClassification = () => {
  const newClass = newClassification.value.trim();
  if (newClass && !classificationOptions.value.includes(newClass)) {
    classificationOptions.value.push(newClass);
    selectedClassification.value = newClass;
    newClassification.value = '';
  }
};

const addNewDataRoom = () => {
  const newRoom = newDataRoom.value.trim();
  if (newRoom && !dataRoomOptions.value.includes(newRoom)) {
    dataRoomOptions.value.push(newRoom);
    selectedDataRoom.value = newRoom;
    newDataRoom.value = '';
  }
};

const handleSave = () => {
  const data = {
    action: 'save' as const,
    classification: selectedClassification.value,
    categorisation: selectedCategorization.value,
    dataroom: selectedDataRoom.value,
    notes: notes.value
  };
  emit('save', data);
};

const handleCancel = () => {
  const data = {
    action: 'cancel' as const,
    classification: '',
    categorisation: '',
    dataroom: '',
    notes: ''
  };
  emit('save', data);
};

const closeModal = () => {
  handleCancel();
};

// Initialize form when component mounts
if (props.isVisible) {
  initializeForm();
}
</script>

<style scoped>
.modal-overlay {
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

.modal-content {
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

.modal-body {
  padding: 24px;
}

.document-info {
  background: var(--surface-container-low, #f8f8f8);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 500;
  color: var(--on-surface-variant, #666);
  min-width: 60px;
}

.info-value {
  color: var(--on-surface, #1f1f1f);
  font-weight: 500;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--on-surface, #1f1f1f);
}

.form-select,
.form-input,
.form-textarea {
  padding: 12px;
  border: 1px solid var(--outline-variant, #e0e0e0);
  border-radius: 8px;
  background: var(--surface-container-highest, #ffffff);
  color: var(--on-surface, #1f1f1f);
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary, #1976d2);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px 24px;
  border-top: 1px solid var(--outline-variant, #e0e0e0);
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary, #1976d2);
  color: var(--on-primary, #ffffff);
}

.btn-primary:hover {
  background: var(--primary-dark, #1565c0);
}

.btn-secondary {
  background: var(--surface-container-highest, #ffffff);
  color: var(--on-surface, #1f1f1f);
  border: 1px solid var(--outline-variant, #e0e0e0);
}

.btn-secondary:hover {
  background: var(--surface-container-high, #f0f0f0);
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .modal-content {
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
  
  .modal-body {
    padding: 16px;
  }
  
  .document-info {
    padding: 12px;
    margin-bottom: 20px;
  }
  
  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 12px;
  }
  
  .info-label {
    min-width: auto;
    font-size: 12px;
  }
  
  .info-value {
    font-size: 14px;
  }
  
  .form-section {
    gap: 16px;
  }
  
  .form-label {
    font-size: 13px;
  }
  
  .form-select,
  .form-input,
  .form-textarea {
    padding: 10px;
    font-size: 14px;
  }
  
  .form-textarea {
    min-height: 60px;
  }
  
  .modal-actions {
    padding: 12px 16px 16px;
    flex-direction: column;
    gap: 8px;
  }
  
  .btn-primary,
  .btn-secondary {
    padding: 12px 16px;
    width: 100%;
    font-size: 14px;
  }
}

/* Tablet Responsive Styles */
@media (max-width: 1024px) and (min-width: 769px) {
  .modal-content {
    width: 92%;
    max-width: 500px;
  }
  
  .modal-header {
    padding: 20px 20px 14px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .document-info {
    padding: 14px;
    margin-bottom: 22px;
  }
  
  .form-section {
    gap: 18px;
  }
  
  .modal-actions {
    padding: 14px 20px 20px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .modal-content {
    background: var(--surface-container, #2c2c2c);
    border-color: var(--outline-variant, #404040);
  }
  
  .modal-title {
    color: var(--on-surface, #ffffff);
  }
  
  .close-btn:hover {
    background: var(--surface-container-high, #404040);
  }
  
  .document-info {
    background: var(--surface-container-low, #1e1e1e);
  }
  
  .form-select,
  .form-input,
  .form-textarea {
    background: var(--surface-container-highest, #383838);
    border-color: var(--outline-variant, #404040);
  }
}
</style>