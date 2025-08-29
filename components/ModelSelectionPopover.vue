<template>
  <Teleport to="body">
    <div class="model-selection-overlay" @click.self="store.closeModelSelection()">
      <div class="model-selection-modal">
        <div class="modal-header">
          <div class="header-content">
            <h2 class="modal-title">Choose AI Model</h2>
            <p class="modal-subtitle">Select the best model for your task</p>
          </div>
          <button class="close-button" @click="store.closeModelSelection()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="models-section">
            <div class="section-header">
              <div class="section-icon external">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 class="section-title">External Models</h3>
              <div class="section-badge">Premium</div>
            </div>
            
            <div class="models-grid">
              <div 
                v-for="model in externalModels" 
                :key="model.name"
                class="model-card"
                :class="{ 'selected': store.selectedModel === model.name }"
                @click="selectModel(model)"
              >
                <div class="model-header">
                  <div class="model-avatar">
                    <span class="model-initial">{{ model.name.charAt(0) }}</span>
                  </div>
                  <div class="model-info">
                    <h4 class="model-name">{{ model.name }}</h4>
                    <p class="model-description">{{ model.description }}</p>
                  </div>
                </div>
                <div class="model-features">
                  <span class="feature-tag">Advanced</span>
                  <span class="feature-tag">Fast</span>
                </div>
                <div class="selection-indicator" v-if="store.selectedModel === model.name">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div class="models-section">
            <div class="section-header">
              <div class="section-icon internal">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 class="section-title">Internal Models</h3>
              <div class="section-badge internal">Local</div>
            </div>
            
            <div class="models-grid">
              <div 
                v-for="model in internalModels" 
                :key="model.name"
                class="model-card"
                :class="{ 'selected': store.selectedModel === model.name }"
                @click="selectModel(model)"
              >
                <div class="model-header">
                  <div class="model-avatar internal">
                    <span class="model-initial">{{ model.name.charAt(0) }}</span>
                  </div>
                  <div class="model-info">
                    <h4 class="model-name">{{ model.name }}</h4>
                    <p class="model-description">{{ model.description }}</p>
                  </div>
                </div>
                <div class="model-features">
                  <span class="feature-tag internal">Private</span>
                  <span class="feature-tag internal">Secure</span>
                </div>
                <div class="selection-indicator" v-if="store.selectedModel === model.name">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { usePromptListStore } from '../stores/promptList';

const store = usePromptListStore();

const externalModels = [
  {
    name: 'ChatGPT',
    description: "OpenAI's advanced model GPT-4o"
  },
  {
    name: 'Claude',
    description: "Anthropic's advanced model Sonnet 3.5"
  },
  {
    name: 'Gemini',
    description: "Google's latest Model 2.5 Pro"
  }
];

const internalModels = [
  {
    name: 'llama3',
    description: 'Meta\'s Solid General Purpose Model'
  },
  {
    name: 'Mistral',
    description: 'Mistral AI Model'
  },
  {
    name: 'Phi4',
    description: 'Microsoft Reasoning Model'
    
  }
];

function selectModel(model: { name: string; description: string }) {
  store.setSelectedModel(model.name);
  store.closeModelSelection();
}
</script>

<style scoped>
.model-selection-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.model-selection-modal {
  width: 100%;
  max-width: 640px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-content {
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

.modal-body {
  padding: 8px 24px 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.models-section {
  margin-bottom: 32px;
}

.models-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.section-icon.external {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.section-icon.internal {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.section-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-badge.internal {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.models-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.model-card {
  position: relative;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.model-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.model-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.model-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.model-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.model-avatar.internal {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.model-initial {
  text-transform: uppercase;
}

.model-info {
  flex: 1;
  min-width: 0;
}

.model-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.model-description {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
  margin: 0;
}

.model-features {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.feature-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.feature-tag.internal {
  background: #fef2f2;
  color: #dc2626;
}

.selection-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: checkmark 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes checkmark {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Scrollbar styling */
.modal-body::-webkit-scrollbar {
  width: 4px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.3);
  border-radius: 2px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.5);
}

@media (min-width: 640px) {
  .models-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
