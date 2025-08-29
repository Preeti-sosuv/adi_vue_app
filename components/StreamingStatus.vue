<template>
  <div v-if="isVisible" class="streaming-status">
    <div class="status-content">
      <div class="status-icon">
        <div class="spinner"></div>
      </div>
      <div class="status-text">
        {{ statusMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';

interface Props {
  isActive: boolean;
  token: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  requestCompleted: [];
}>();

const statusMessage = ref('Initializing...');
const isVisible = ref(false);
let statusInterval: NodeJS.Timeout | null = null;

const startStatusPolling = () => {
  console.log('Starting streaming status polling...');
  isVisible.value = true;
  
  const pollStatus = async () => {
    try {
      const response = await fetch('http://34.69.208.233:8040/proxy/get_streaming_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: props.token
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Streaming status:', data);
        
        if (data && data.result) {
          statusMessage.value = data.result;
          
          // Check if the request is completed
          if (data.result.toLowerCase().includes('request completed') || 
              data.result.toLowerCase().includes('completed')) {
            console.log('Request completed detected in StreamingStatus component');
            // Emit event immediately to parent to stop all polling
            emit('requestCompleted');
            // Stop this component's polling immediately
            stopStatusPolling();
            return; // Exit polling loop immediately
          }
        }
      } else {
        console.error('Streaming status API error:', response.status);
      }
    } catch (error) {
      console.error('Streaming status polling error:', error);
    }
  };

  // Poll immediately, then every 500ms for more responsive updates
  pollStatus();
  statusInterval = setInterval(pollStatus, 500);
};

const stopStatusPolling = () => {
  console.log('Stopping streaming status polling...');
  if (statusInterval) {
    clearInterval(statusInterval);
    statusInterval = null;
  }
  
  // Keep visible for a moment to show completion, then hide
  setTimeout(() => {
    isVisible.value = false;
    statusMessage.value = 'Initializing...';
  }, 1500);
};

// Watch for changes in isActive prop
watch(() => props.isActive, (newValue) => {
  if (newValue) {
    startStatusPolling();
  } else {
    stopStatusPolling();
  }
}, { immediate: true });

// Cleanup on unmount
onUnmounted(() => {
  stopStatusPolling();
});
</script>

<style scoped>
.streaming-status {
  background: var(--surface-container-low, #f5f5f5);
  border-top: 1px solid var(--outline-variant, #e0e0e0);
  padding: 12px 20px;
  font-size: 13px;
  color: var(--on-surface-variant, #666);
  border-radius: 0 0 12px 12px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--outline-variant, #e0e0e0);
  border-top: 2px solid var(--primary, #1976d2);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.status-text {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  line-height: 1.4;
  flex: 1;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .streaming-status {
    background: var(--surface-container-low, #2c2c2c);
    border-top-color: var(--outline-variant, #404040);
    color: var(--on-surface-variant, #999);
  }
  
  .spinner {
    border-color: var(--outline-variant, #404040);
    border-top-color: var(--primary, #64b5f6);
  }
}
</style>