<template>
  <Teleport to="body">
    <div v-if="isOpen" class="service-status-overlay" @click="closePopup">
      <div class="service-status-popup" @click.stop>
        <div class="popup-header">
          <h2 class="popup-title">Service Status</h2>
          <button class="close-button" @click="closePopup">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="popup-content">
          <ServiceStatus ref="serviceStatusRef" :hide-title="true" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import ServiceStatus from './ServiceStatus.vue';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['close']);

const serviceStatusRef = ref<InstanceType<typeof ServiceStatus> | null>(null);

const closePopup = () => {
  emit('close');
};

// Fetch data when popup opens
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    // Wait for component to be mounted, then fetch data
    await nextTick();
    // Add a small delay to ensure component is fully ready
    setTimeout(() => {
      if (serviceStatusRef.value && typeof serviceStatusRef.value.fetchServiceStatus === 'function') {
        serviceStatusRef.value.fetchServiceStatus();
      } else {
        console.error('ServiceStatus component not ready or fetchServiceStatus method not available');
      }
    }, 100);
  }
});
</script>

<style scoped>
.service-status-overlay {
  position: fixed;
  inset: 0;
  /* background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px); */
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.service-status-popup {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  animation: popupEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes popupEnter {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.popup-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: #e5e7eb;
  color: #374151;
}

.popup-content {
  padding: 0;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}
</style>