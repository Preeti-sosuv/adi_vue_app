<template>
  <div class="chat-banner" :class="bannerTypeClass">
    <div class="banner-content">
      <div class="banner-icon">
        <svg v-if="type === 'analysis'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 3v5h5M9 9l11-11m-8.5 2.5L16 6M21 3v5h-5M15 15l-11 11"/>
        </svg>
        <svg v-else-if="type === 'data'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M1 6v6h6M1 18h6v-6H1zM9 6v6h6M9 18h6v-6H9zM17 6v6h6M17 18h6v-6h-6z"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      </div>
      
      <div class="banner-text">
        <div class="banner-title">{{ title }}</div>
        <div v-if="subtitle" class="banner-subtitle">{{ subtitle }}</div>
      </div>
      
      <button @click="handleClick" class="banner-button" :disabled="loading">
        <span v-if="loading" class="loading-spinner"></span>
        <span v-else>{{ buttonText }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  type?: 'analysis' | 'data' | 'help' | 'info';
  title: string;
  subtitle?: string;
  buttonText?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  buttonText: 'View'
});

const emit = defineEmits<{
  click: [];
}>();

const bannerTypeClass = computed(() => {
  switch (props.type) {
    case 'analysis':
      return 'banner-analysis';
    case 'data':
      return 'banner-data';
    case 'help':
      return 'banner-help';
    default:
      return 'banner-info';
  }
});

const handleClick = () => {
  console.log('ChatBanner: handleClick called, loading:', props.loading);
  if (!props.loading) {
    console.log('ChatBanner: emitting click event');
    emit('click');
  } else {
    console.log('ChatBanner: click ignored due to loading state');
  }
};
</script>

<style scoped>
.chat-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.chat-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.banner-analysis {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.banner-data {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.banner-help {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.banner-info {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
}

.banner-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.banner-text {
  flex: 1;
  min-width: 0;
}

.banner-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
}

.banner-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
  line-height: 1.3;
}

.banner-button {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 80px;
  justify-content: center;
}

.banner-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}

.banner-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .chat-banner {
    padding: 14px;
  }
  
  .banner-content {
    gap: 12px;
  }
  
  .banner-icon {
    width: 36px;
    height: 36px;
  }
  
  .banner-title {
    font-size: 15px;
  }
  
  .banner-subtitle {
    font-size: 13px;
  }
  
  .banner-button {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>