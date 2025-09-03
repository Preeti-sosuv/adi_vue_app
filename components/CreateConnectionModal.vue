<template>
  <div v-if="isOpen" class="connection-modal-overlay" @click="closeModal">
    <div class="connection-modal-content" @click.stop>
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">Create New Connection</h2>
        <button @click="closeModal" class="modal-close-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <!-- Connection Type Dropdown -->
        <div class="form-group">
          <label class="form-label">
            Connection Type <span class="required-star">*</span>
          </label>
          
          
          <select 
            v-model="selectedConnectionType"
            @change="onConnectionTypeChange"
            class="form-select"
          >
            <option value="">Select Connection Type</option>
            <option v-for="type in availableConnectionTypes" :key="type.connection_tech" :value="type">
              {{ type.connection_tech }}
            </option>
          </select>
        </div>

        <!-- Connection Name -->
        <div class="form-group">
          <label class="form-label">
            Connection Name <span class="required-star">*</span>
          </label>
          <input
            v-model="connectionForm.connection_id"
            type="text"
            placeholder="Connection Name"
            class="form-input"
            :class="{ 'error': errors.connection_id }"
          />
          <p v-if="errors.connection_id" class="error-message">{{ errors.connection_id }}</p>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="form-label">Description</label>
          <input
            v-model="connectionForm.connection_desc"
            type="text"
            placeholder="Description"
            class="form-input"
          />
        </div>

        <!-- Required field indicator -->
        <div class="required-indicator">
          <span class="required-star">*</span> Indicates a required field
        </div>

        <!-- Dynamic Fields -->
        <div v-if="selectedConnectionType && selectedConnectionType.fields" class="dynamic-fields">
          <div v-for="field in selectedConnectionType.fields" :key="field.field_name" class="form-group">
            <label class="form-label">
              {{ formatFieldName(field.field_name) }}
              <span v-if="field.mandatory" class="required-star">*</span>
            </label>
            
            <div class="input-container">
              <input
                v-if="field.type === 'secret'"
                :type="fieldVisibility[field.field_name] ? 'text' : 'password'"
                v-model="connectionForm.connection_data[field.field_name]"
                :placeholder="field.placeholder"
                class="form-input password-input"
                :class="{ 'error': fieldErrors[field.field_name] }"
              />
              <input
                v-else
                type="text"
                v-model="connectionForm.connection_data[field.field_name]"
                :placeholder="field.placeholder"
                class="form-input"
                :class="{ 'error': fieldErrors[field.field_name] }"
              />
              
              <!-- Password toggle button -->
              <button
                v-if="field.type === 'secret'"
                @click="togglePasswordVisibility(field.field_name)"
                type="button"
                class="password-toggle-btn"
              >
                <svg v-if="fieldVisibility[field.field_name]" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M18.364 5.636L8.464 8.464m9.9-2.828L8.464 8.464"></path>
                </svg>
              </button>
            </div>
            
            <p v-if="fieldErrors[field.field_name]" class="error-message">{{ fieldErrors[field.field_name] }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button @click="closeModal" class="btn-secondary">
          Close
        </button>
        <button @click="testConnection" :disabled="isLoading" class="btn-test">
          {{ isLoading ? 'Testing...' : 'Test' }}
        </button>
        <button @click="saveConnection" :disabled="isLoading" class="btn-primary">
          {{ isLoading ? 'Saving...' : 'Save' }}
        </button>
      </div>

      <!-- Test Results -->
      <div v-if="testResults" class="test-results">
        <h3>Test Results:</h3>
        <div class="test-results-list">
          <div v-for="(result, key) in testResults" :key="key" class="test-result-item">
            <span class="test-result-name">{{ formatTestResultName(key) }}</span>
            <span :class="['test-result-status', result ? 'success' : 'error']">
              {{ result ? '✓' : '✗' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Error Messages -->
      <div v-if="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useConnectionStore } from '~/stores/connection';

const props = defineProps<{
  isOpen: boolean;
  action?: 'new' | 'edit' | 'copy';
  connection?: any;
}>();

const emit = defineEmits<{
  close: [];
  saved: [connection: any];
}>();

const connectionStore = useConnectionStore();

// Reactive data
const selectedConnectionType = ref<any>(null);
const isLoading = ref(false);
const errorMessage = ref('');
const testResults = ref<Record<string, boolean> | null>(null);

const connectionForm = reactive({
  connection_id: '',
  connection_tech: '',
  connection_desc: '',
  connection_data: {} as Record<string, any>,
  status: 'INACTIVE' as const
});

const errors = reactive({
  connection_id: ''
});

const fieldErrors = reactive<Record<string, string>>({});
const fieldVisibility = reactive<Record<string, boolean>>({});

// Computed
const availableConnectionTypes = computed(() => {
  const types = connectionStore.connectionTypes;
  console.log('🎯 MODAL COMPUTED - Available connection types:', {
    length: types.length,
    types: types.map(t => t.connection_tech),
    raw: types
  });
  return types;
});

// Methods
const formatFieldName = (fieldName: string) => {
  return fieldName.replace(/_/g, ' ');
};

const formatTestResultName = (key: string) => {
  const names: Record<string, string> = {
    create: 'Create',
    read: 'Read', 
    write: 'Update',
    delete: 'Delete',
    schema: 'Inspect'
  };
  return names[key] || key;
};

const togglePasswordVisibility = (fieldName: string) => {
  fieldVisibility[fieldName] = !fieldVisibility[fieldName];
};

const onConnectionTypeChange = () => {
  if (selectedConnectionType.value) {
    connectionForm.connection_tech = selectedConnectionType.value.connection_tech;
    connectionForm.connection_data = {};
    
    // Initialize field visibility for secret fields
    selectedConnectionType.value.fields.forEach((field: any) => {
      if (field.type === 'secret') {
        fieldVisibility[field.field_name] = false;
      }
    });
    
    // Clear field errors
    Object.keys(fieldErrors).forEach(key => delete fieldErrors[key]);
  }
};

const validateForm = () => {
  let isValid = true;
  
  // Clear previous errors
  errors.connection_id = '';
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key]);
  
  // Validate connection name
  if (!connectionForm.connection_id.trim()) {
    errors.connection_id = 'Connection name is required';
    isValid = false;
  }
  
  // Validate dynamic fields
  if (selectedConnectionType.value?.fields) {
    selectedConnectionType.value.fields.forEach((field: any) => {
      if (field.mandatory && !connectionForm.connection_data[field.field_name]?.trim()) {
        fieldErrors[field.field_name] = `${formatFieldName(field.field_name)} is required`;
        isValid = false;
      }
    });
  }
  
  return isValid;
};

const testConnection = async () => {
  if (!validateForm()) {
    return;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  testResults.value = null;
  
  try {
    const result = await connectionStore.testConnection(connectionForm);
    if (result.success && result.results) {
      testResults.value = result.results;
    } else {
      errorMessage.value = 'Connection test failed';
    }
  } catch (error) {
    console.error('Test connection error:', error);
    errorMessage.value = 'Failed to test connection';
  } finally {
    isLoading.value = false;
  }
};

const saveConnection = async () => {
  if (!validateForm()) {
    return;
  }
  
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const isUpdate = props.action === 'edit';
    const result = await connectionStore.saveConnection(connectionForm, isUpdate);
    
    if (result.success) {
      emit('saved', connectionForm);
      closeModal();
    } else {
      errorMessage.value = result.message || 'Failed to save connection';
    }
  } catch (error) {
    console.error('Save connection error:', error);
    errorMessage.value = 'Failed to save connection';
  } finally {
    isLoading.value = false;
  }
};

const closeModal = () => {
  resetForm();
  emit('close');
};

const resetForm = () => {
  selectedConnectionType.value = null;
  connectionForm.connection_id = '';
  connectionForm.connection_tech = '';
  connectionForm.connection_desc = '';
  connectionForm.connection_data = {};
  connectionForm.status = 'INACTIVE';
  errors.connection_id = '';
  Object.keys(fieldErrors).forEach(key => delete fieldErrors[key]);
  Object.keys(fieldVisibility).forEach(key => delete fieldVisibility[key]);
  testResults.value = null;
  errorMessage.value = '';
};

// Initialize connection types and set default
onMounted(async () => {
  console.log('🚀 MODAL MOUNTED - Starting initialization...');
  console.log('🚀 Store before init:', {
    connectionTypesLength: connectionStore.connectionTypes.length,
    isLoading: connectionStore.isLoading,
    error: connectionStore.error
  });
  
  try {
    console.log('🔄 Calling connectionStore.initializeConnectionTypes()...');
    await connectionStore.initializeConnectionTypes();
    console.log('✅ Initialization completed');
  } catch (err) {
    console.error('❌ Initialization failed:', err);
  }
  
  console.log('🔍 Store after init:', {
    connectionTypesLength: connectionStore.connectionTypes.length,
    isLoading: connectionStore.isLoading,
    error: connectionStore.error,
    availableTypes: availableConnectionTypes.value.length
  });
  
  // Set default connection type to first available after API call completes
  if (availableConnectionTypes.value.length > 0 && !selectedConnectionType.value && props.action !== 'edit') {
    selectedConnectionType.value = availableConnectionTypes.value[0];
    console.log('✅ Set default connection type:', selectedConnectionType.value.connection_tech);
    onConnectionTypeChange();
  } else {
    console.log('⚠️ No connection types available to set as default');
    console.log('⚠️ Debug info:', {
      availableLength: availableConnectionTypes.value.length,
      selectedExists: !!selectedConnectionType.value,
      actionIsEdit: props.action === 'edit'
    });
  }
});

// Watch for modal opening to set default connection type
watch(() => props.isOpen, async (isOpen) => {
  console.log('🔄 MODAL OPEN WATCHER - isOpen:', isOpen, 'hasConnection:', !!props.connection);
  
  if (isOpen && !props.connection) {
    console.log('🔄 Modal opened for new connection, checking types...');
    console.log('🔄 Current available types:', availableConnectionTypes.value.length);
    
    // Ensure connection types are loaded
    if (availableConnectionTypes.value.length === 0) {
      console.log('🔄 No types available, initializing...');
      await connectionStore.initializeConnectionTypes();
      console.log('🔄 After re-initialization:', availableConnectionTypes.value.length);
    }
    
    // Set default to first connection type for new connections
    if (availableConnectionTypes.value.length > 0) {
      selectedConnectionType.value = availableConnectionTypes.value[0];
      console.log('✅ WATCHER - Set default connection type:', selectedConnectionType.value.connection_tech);
      onConnectionTypeChange();
    } else {
      console.log('⚠️ WATCHER - Still no connection types available');
    }
  }
});

// Watch for connection types to become available
watch(availableConnectionTypes, (types) => {
  if (props.isOpen && !selectedConnectionType.value && types.length > 0 && !props.connection) {
    selectedConnectionType.value = types[0];
    onConnectionTypeChange();
  }
});

// Watch for props changes
watch(() => props.connection, (newConnection) => {
  if (newConnection && props.isOpen) {
    // Load existing connection data for edit/copy
    connectionForm.connection_id = newConnection.connection_id;
    connectionForm.connection_tech = newConnection.connection_tech;
    connectionForm.connection_desc = newConnection.connection_desc;
    connectionForm.connection_data = { ...newConnection.connection_data };
    connectionForm.status = newConnection.status;
    
    // Find and set the connection type
    selectedConnectionType.value = availableConnectionTypes.value.find(
      type => type.connection_tech === newConnection.connection_tech
    );
  }
}, { immediate: true });
</script>

<style scoped>
/* Universal box-sizing */
* {
  box-sizing: border-box;
}

/* Modal Overlay */
.connection-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
}

/* Modal Content */
.connection-modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  min-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
}

/* Header */
.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: between;
  background: #f9fafb;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
}

.modal-close-btn:hover {
  color: #374151;
}

/* Body */
.modal-body {
  padding: 24px;
}

/* Form Elements */
.form-group {
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.required-star {
  color: #dc2626;
}

.required-indicator {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 20px;
  font-style: italic;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #dc2626;
}

/* Input Container for password fields */
.input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.password-input {
  padding-right: 40px;
}

.password-toggle-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
}

.password-toggle-btn:hover {
  color: #374151;
}

/* Dynamic Fields */
.dynamic-fields {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

/* Error Messages */
.error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
}

.error-alert {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  margin: 16px 24px;
  font-size: 14px;
}

/* Footer */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  background: #f9fafb;
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-test {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-primary:disabled {
  background: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
}

.btn-test {
  background: white;
  color: #374151;
  border-color: #d1d5db;
}

.btn-test:hover:not(:disabled) {
  background: #f3f4f6;
}

.btn-test:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Test Results */
.test-results {
  margin: 16px 24px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.test-results h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.test-results-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.test-result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.test-result-name {
  font-size: 13px;
  color: #374151;
}

.test-result-status {
  font-weight: 600;
  font-size: 14px;
}

.test-result-status.success {
  color: #059669;
}

.test-result-status.error {
  color: #dc2626;
}
</style>