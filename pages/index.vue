<template>
  <div class="app-layout">
    <Sidebar v-if="showSidebar" @close="showSidebar = false" @navigate="handleSidebarNavigation" />
    <div class="main-content" :class="{ 'sidebar-open': showSidebar }">
      <button class="menu-toggle" @click="showSidebar = true" v-if="!showSidebar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div class="container" :class="{ 'chat-mode': chatStore.isChatMode }">
    <div v-if="!chatStore.isChatMode" class="header">
      <div class="ai-icon">
        <img src="/images/favicon.png" alt="AI Icon" width="24" height="24" />
      </div>
      <h3 class="title">Where should we begin?</h3>
    </div>

    <div v-if="!chatStore.isChatMode" class="tags">
      <button
        v-for="tag in tags"
        :key="tag"
        :class="['tag', `tag-${tag.toLowerCase()}`]"
        type="button"
        @click="insertTag(tag)"
      >{{ tag }}</button>
    </div>

    <!-- Chat messages area -->
    <div v-if="chatStore.isChatMode" class="chat-container" ref="chatContainer">
      <div v-for="message in chatStore.messages" :key="message.id" class="message" :class="message.type">
        <div class="message-content">
          <div v-if="message.type === 'user'" class="user-message">
            <span class="user-text">{{ message.content }}</span>
            <button 
              class="bookmark-btn" 
              :class="{ 'bookmarked': message.bookmarked }"
              @click="toggleBookmark(message)"
              title="Bookmark question"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
          <ChatResponse v-else :content="message.content" :loading="message.loading" />
        </div>
      </div>
      
    </div>

    <!-- Input container with toolbar below -->
    <div class="input-container">
      <!-- Input box -->
      <div class="input-box">
        <input v-model="inputText" placeholder="Ask Anything" @keyup.enter="handleSend" />
      </div>

      <!-- Streaming Status Display - Inside input container -->
      <div v-if="chatStore.showStreamingStatus" class="streaming-status-inside-input">
        <div class="streaming-status-content">
          <div class="streaming-indicator">
            <div class="streaming-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <span class="streaming-text">{{ chatStore.streamingStatus || 'Processing your request...' }}</span>
        </div>
      </div>

      <!-- Toolbar row (bookmark, icons, send button) -->
      <div class="toolbar">
        <div class="toolbar-left">
          <!-- <BookmarkIcon @click="handleBookmark" /> -->
          <button class="toolbar-btn" @click="handleBookmark" aria-label="Bookmark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          <button class="toolbar-btn" title="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button class="toolbar-btn" title="Undo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
          </button>
        </div>
        <div class="toolbar-right">
          <div class="sources-dropdown">
            <button class="sources-btn" @click="handleGetDocuments">
              <span>Sources</span>
              <span v-if="store.selectedCount > 0" class="source-count">{{ store.selectedCount }}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </button>
          </div>
          <button class="toolbar-btn" title="Add" @click="showUploadModal = true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14"/>
              <path d="M12 5v14"/>
            </svg>
          </button>
          <button class="toolbar-btn" title="Book" @click="handleGetDocuments">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </button>
          <button class="toolbar-btn" title="Model Selection" @click="handleModelSelection">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </button>
          <button class="send-btn" @click="handleSend" title="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Popover v-if="store.showPopover" placement="top" @promptSelected="handlePromptSelected" />
    <PromptContextModel v-if="store.showPromptContentModel" />
    <ModelSelectionPopover v-if="store.showModelSelection" />
    <!-- Document Upload Modal -->
    <UploadDocument 
      :isVisible="showUploadModal"
      @close="showUploadModal = false"
      @showClassification="handleShowClassification"
    />

    <!-- Document Classification Modal -->
    <DocClassification
      v-if="showClassificationModal && currentUploadedFile"
      :isVisible="showClassificationModal"
      :docName="currentUploadedFile.file.name"
      :docType="getFileType(currentUploadedFile.file.name)"
      @close="handleCloseClassification"
      @save="handleClassificationSave"
    />

    <!-- Connections Manager Modal -->
    <ConnectionsManager
      :isVisible="showConnectionsModal"
      @close="showConnectionsModal = false"
      @addConnection="handleAddConnection"
      @editConnection="handleEditConnection"
      @copyConnection="handleCopyConnection"
      @deleteConnection="handleDeleteConnection"
    />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { useChatStore } from '../stores/chat'
import { useModelSelectionStore } from '../stores/modelSelection'
import { usePopoverStore } from '../stores/popover'
import { usePromptListStore } from '../stores/promptList'
import { useAuthStore } from '../stores/auth';

const inputText = ref('');
const showSidebar = ref(false);
const showUploadModal = ref(false);
const showClassificationModal = ref(false);
const showConnectionsModal = ref(false);
const currentUploadedFile = ref<{ file: File; fileId: string } | null>(null);
const tags = ['Addepar', 'Email', 'Finoptiq', 'General'];
const chatContainer = ref<HTMLElement | null>(null);

// Use Pinia stores
const router = useRouter();
const store = usePromptListStore();
const chatStore = useChatStore();
const authStore = useAuthStore();

// Initialize auth and check authentication
onMounted(() => {
  authStore.initializeAuth();
  
  // Check if session is valid and redirect if not authenticated
  if (!authStore.isAuthenticated || !authStore.isSessionValid()) {
    router.push('/login');
  }

});

// Get base URL from runtime config and token from sessionStorage
const { public: publicConfig } = useRuntimeConfig();
const baseURL = publicConfig.baseURL as string || 'http://34.69.208.233:8040/proxy';
const getToken = () => authStore.getToken() || sessionStorage.getItem('askai_token') || '';

async function handleBookmark() {
  // Use the hardcoded API endpoint as requested
  const apiBaseURL = 'http://34.69.208.233:8040/proxy';
  const token = getToken();
  await store.getPromptList(apiBaseURL, token);
}

async function handleGetDocuments() {
  const token = getToken();
  if (!baseURL || !token) {
    store.error = 'Authentication required. Please log in again.';
    store.promptContentData = {
      error: 'Authentication required. Please log in again.',
      status: 401,
      statusText: 'Unauthorized'
    };
    store.showPromptContentModel = true;
    return;
  }

  await store.getDocuments(baseURL, token);
}

async function handleSend() {
  const userInput = inputText.value.trim();
  if (!userInput) return;

  // Clear input
  inputText.value = '';

  // Handle chat message through store
  await chatStore.handleChatMessage(userInput);

  // Scroll to bottom after adding message
  await nextTick();
  scrollToBottom();
}

function insertTag(tag: string) {
  inputText.value = tag;
}

// Handle when a bookmark prompt is selected from the popover
function handlePromptSelected(prompt: string) {
  inputText.value = prompt;
  console.log('Prompt selected and inserted:', prompt);
}

function handleModelSelection() {
  store.showModelSelection = true;
}

function handleShowClassification(data: { file: File; fileId?: string }) {
  currentUploadedFile.value = {
    file: data.file,
    fileId: data.fileId || `doc_${Date.now()}`
  };
  showClassificationModal.value = true;
  // Keep upload modal open until classification is complete
}

function handleCloseClassification() {
  showClassificationModal.value = false;
  currentUploadedFile.value = null;
  showUploadModal.value = false;
}

function handleClassificationSave(data: {
  action: 'save' | 'cancel';
  classification: string;
  categorisation: string;
  dataroom: string;
  notes: string;
}) {
  if (data.action === 'save' && currentUploadedFile.value) {
    // Create document data to add to PromptContextModel
    const documentData = {
      document_id: currentUploadedFile.value.fileId,
      document_name: currentUploadedFile.value.file.name,
      document_type: getFileType(currentUploadedFile.value.file.name),
      classification: data.classification,
      categorization: data.categorisation,
      dataroom: data.dataroom,
      notes: data.notes,
      upload_date: new Date().toISOString(),
      size: currentUploadedFile.value.file.size
    };

    // Add document to the prompt context store so it appears in PromptContextModel
    store.addUploadedDocument(documentData);
    
    console.log('Document classified and saved:', documentData);
  }
  
  // Close both modals
  handleCloseClassification();
}

function getFileType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return 'PDF Document';
    case 'doc':
    case 'docx': return 'Word Document';
    case 'txt': return 'Text Document';
    case 'csv': return 'CSV File';
    case 'xlsx':
    case 'xls': return 'Excel Spreadsheet';
    case 'ppt':
    case 'pptx': return 'PowerPoint Presentation';
    default: return 'Document';
  }
}

function handleSidebarNavigation(item: string) {
  console.log('Navigating to:', item);
  if (item === 'Connections') {
    showConnectionsModal.value = true;
  }
  // Add other navigation handlers here as needed
}

function handleAddConnection() {
  console.log('Add connection requested');
  // TODO: Implement add connection functionality
  alert('Add Connection functionality - To be implemented');
}

function handleEditConnection(connection: any) {
  console.log('Edit connection requested:', connection);
  // TODO: Implement edit connection functionality
  alert(`Edit Connection: ${connection.connection_id} - To be implemented`);
}

function handleCopyConnection(connection: any) {
  console.log('Copy connection requested:', connection);
  // TODO: Implement copy connection functionality
  alert(`Copy Connection: ${connection.connection_id} - To be implemented`);
}

function handleDeleteConnection(connection: any) {
  console.log('Delete connection requested:', connection);
  // TODO: Implement delete connection functionality
  alert(`Delete Connection: ${connection.connection_id} - To be implemented`);
}


function handleLogout() {
  authStore.logout();
  router.push('/login');
}

// Debug function to test current session
function debugSession() {
  const token = authStore.getToken();
  const sessionToken = sessionStorage.getItem('askai_token');
  console.log('Auth store token:', token ? token.substring(0, 10) + '...' : 'None');
  console.log('Session storage token:', sessionToken ? sessionToken.substring(0, 10) + '...' : 'None');
  console.log('Auth store user:', authStore.user);
  console.log('Is authenticated:', authStore.isAuthenticated);
}

// Make debug function available globally for testing
if (typeof window !== 'undefined') {
  (window as any).debugSession = debugSession;
}

// Bookmark functionality
async function toggleBookmark(message: any) {
  if (message.type !== 'user') return;
  
  // Don't toggle if already bookmarked (we only add bookmarks, not remove them)
  if (message.bookmarked) {
    console.log('Question is already bookmarked');
    return;
  }
  
  try {
    // Toggle bookmark state optimistically
    message.bookmarked = true;
    
    // Call API to save bookmark
    const result = await saveBookmark(message.content);
    console.log('Bookmark saved:', result);
    
    // Show success feedback (you could add a toast notification here)
    console.log('✓ Question bookmarked successfully!');
    
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    // Revert bookmark state on error
    message.bookmarked = false;
    
    // Show error feedback (you could add a toast notification here)
    alert('Failed to bookmark question. Please try again.');
  }
}

async function saveBookmark(prompt: string) {
  const token = authStore.getToken();
  
  if (!token) {
    throw new Error('No authentication token available. Please log in again.');
  }
  
  console.log('Saving bookmark:', { prompt, token: token.substring(0, 10) + '...' });
  
  try {
    const response = await fetch('http://34.69.208.233:8040/proxy/add_to_prompt_list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        model: "Claude",
        prompt_type: "DOC_SEARCH",
        token: token
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Bookmark saved successfully:', data);
    
    // Check if the response is null or empty
    if (data === null || data === undefined) {
      console.warn('API returned null response, but request was successful');
      return { success: true, message: 'Bookmark saved (null response)' };
    }
    
    return data;
  } catch (error) {
    console.error('Error saving bookmark:', error);
    throw error;
  }
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

function handleStreamingCompleted() {
  console.log('Streaming completed - stopping all polling and finalizing ChatResponse');
  chatStore.stopPolling();
  
  // Force completion of any loading messages
  const loadingMessages = chatStore.messages.filter(msg => msg.loading);
  loadingMessages.forEach(msg => {
    if (msg.content && msg.content.trim()) {
      // Remove loading state from existing content
      chatStore.updateMessage(msg.id, msg.content, false);
    } else {
      // Add completion message if no content
      chatStore.updateMessage(msg.id, 'Response completed', false);
    }
  });
}

// Add cleanup for event listeners
onUnmounted(() => {
  window.removeEventListener('resize', checkMobileView);
});

</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background: var(--background);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.main-content.sidebar-open {
  margin-left: 90px;
}

.mobile-menu-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: var(--surface-container, #ffffff);
  border: 1px solid var(--outline-variant, #e0e0e0);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: var(--on-surface, #1f1f1f);
  transition: all 0.2s;
}

.mobile-menu-btn:hover {
  background: var(--surface-container-high, #f0f0f0);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-toggle {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: var(--surface-container);
  border: 1px solid var(--outline-variant);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: var(--on-surface);
}

.menu-toggle:hover {
  background: var(--surface-container-high);
  color: var(--on-surface);
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  background: var(--background);
  color: var(--on-background);
}

@media (max-width: 768px) {
  .container {
    padding: 20px 16px;
    min-height: calc(100vh - 60px);
  }
}

.container.chat-mode {
  justify-content: flex-start;
  padding-top: 20px;
  padding-bottom: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.ai-icon {
  color: var(--on-background);
}

.title {
  font-size: 18px;
  color: var(--on-background);
  margin: 0;
  font-weight: 500;
}

.tags {
  margin-bottom: 32px;
}

.tag {
  border-radius: 16px;
  padding: 8px 16px;
  margin: 0 8px 0 0;
  font-size: 14px;
  color: var(--on-surface);
  cursor: pointer;
  border: none;
  transition: background-color 120ms ease, box-shadow 120ms ease, transform 120ms ease;
  font-weight: 500;
}

.tag-addepar {
  background: #e3f2fd;
  color: #1976d2;
}

.tag-email {
  background: #e8f5e8;
  color: #2e7d32;
}

.tag-finoptiq {
  background: #f3e5f5;
  color: #7b1fa2;
}

.tag-general {
  background: #fff3e0;
  color: #f57c00;
}

.tag:hover {
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.tag:active {
  transform: translateY(0);
}

.tag:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.3) inset;
}

.input-container {
  background: var(--surface-container);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  position: sticky;
  bottom: 0;
  z-index: 10;
  border: 1px solid var(--outline-variant);
  overflow: hidden; /* Ensure streaming status rounds corners properly */
}

@media (max-width: 768px) {
  .input-container {
    border-radius: 8px;
    bottom: 16px;
    margin: 0 16px;
    max-width: calc(100% - 32px);
  }
}

.input-box {
  padding: 16px 20px;
  border-bottom: 1px solid var(--outline-variant);
}

.input-box input {
  border: none;
  outline: none;
  font-size: 16px;
  width: 100%;
  background: transparent;
  padding: 8px;
  color: var(--on-surface);
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  font-size: 18px;
  color: var(--on-surface);
}

@media (max-width: 768px) {
  .toolbar {
    padding: 10px 16px;
    font-size: 16px;
  }
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.sources-dropdown {
  position: relative;
}

.sources-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  color: var(--on-surface-variant);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 120ms ease, color 120ms ease;
}

.sources-btn:hover {
  background: var(--surface-container-high);
  color: var(--on-surface);
}

.source-count {
  background: var(--primary);
  color: var(--on-primary);
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 4px;
  min-width: 18px;
  text-align: center;
  line-height: 1.2;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  color: var(--on-surface-variant);
  transition: background-color 120ms ease, color 120ms ease;
}

.toolbar-btn:hover {
  background: var(--surface-container-high);
  color: var(--on-surface);
}

.send-btn {
  background: var(--primary);
  color: var(--on-primary);
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 120ms ease;
}

.send-btn:hover {
  background: var(--primary-container);
  color: var(--on-primary-container);
}

.send-btn .icon {
  width: 18px;
  height: 18px;
}

/* Chat interface styles */
.chat-container {
  width: 100%;
  max-width: 800px;
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  background: var(--chat-container-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 20px;
  min-height: 0;
  border: 1px solid var(--outline-variant);
}

@media (max-width: 768px) {
  .chat-container {
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 8px;
  }
}

.message {
  margin-bottom: 20px;
}

.message:last-child {
  margin-bottom: 0;
}

.user-message {
  background: #007aff;
  color: white;
  padding: 12px 16px;
  border-radius: 18px;
  margin-left: auto;
  max-width: 70%;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.user-text {
  flex: 1;
}

.bookmark-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.bookmark-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.bookmark-btn.bookmarked {
  color: white;
}

.bookmark-btn.bookmarked svg {
  fill: white;
}

/* Smooth scrolling */
.chat-container {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.chat-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Streaming Status Styles - Inside Input Container */
.streaming-status-inside-input {
  padding: 12px 20px;
  background: var(--surface-container-low);
  border-top: 1px solid var(--outline-variant);
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

.streaming-status-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.streaming-indicator {
  display: flex;
  align-items: center;
}

.streaming-dots {
  display: flex;
  gap: 4px;
}

.streaming-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
  animation: streaming-pulse 1.4s infinite ease-in-out;
}

.streaming-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.streaming-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

.streaming-dots span:nth-child(3) {
  animation-delay: 0s;
}

@keyframes streaming-pulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.streaming-text {
  font-size: 14px;
  color: var(--on-surface-variant);
  font-style: italic;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .app-layout {
    display: block;
  }
  
  .main-content {
    margin-left: 0 !important;
  }
  
  .container {
    padding: 20px 16px;
    min-height: calc(100vh - 60px);
  }
  
  .header {
    margin-bottom: 24px;
    text-align: center;
  }
  
  .title {
    font-size: 20px;
    margin: 12px 0;
  }
  
  .tags {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 24px;
  }
  
  .tag {
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 6px;
  }
  
  .chat-container {
    margin-bottom: 16px;
    max-height: calc(100vh - 200px);
  }
  
  .message {
    margin-bottom: 12px;
  }
  
  .message-content {
    font-size: 14px;
  }
  
  .user-message {
    padding: 10px 12px;
  }
  
  .bookmark-btn {
    width: 32px;
    height: 32px;
  }
  
  .input-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--surface-container, #ffffff);
    border-top: 1px solid var(--outline-variant, #e0e0e0);
    padding: 12px 16px 16px;
    z-index: 100;
  }
  
  .input-box {
    margin-bottom: 8px;
  }
  
  .input-box input {
    font-size: 16px; /* Prevent zoom on iOS */
    padding: 12px 16px;
  }
  
  .toolbar {
    gap: 8px;
  }
  
  .toolbar-left {
    gap: 6px;
  }
  
  .toolbar-right {
    gap: 6px;
  }
  
  .toolbar-btn {
    width: 36px;
    height: 36px;
    padding: 8px;
  }
  
  .sources-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .source-count {
    font-size: 10px;
    min-width: 16px;
    height: 16px;
  }
  
  .send-btn {
    width: 40px;
    height: 40px;
  }
  
  .mobile-menu-btn {
    top: 16px;
    left: 16px;
    padding: 10px;
  }
  
  .streaming-status-inside-input {
    padding: 8px 12px;
    margin-bottom: 8px;
  }
  
  .streaming-text {
    font-size: 12px;
  }
}

/* Tablet Responsive Styles */
@media (max-width: 1024px) and (min-width: 769px) {
  .main-content.sidebar-open {
    margin-left: 80px;
  }
  
  .container {
    padding: 32px 24px;
  }
  
  .header {
    margin-bottom: 28px;
  }
  
  .title {
    font-size: 22px;
  }
  
  .tags {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 28px;
  }
  
  .tag {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .chat-container {
    margin-bottom: 20px;
  }
  
  .input-container {
    padding: 16px 24px;
  }
  
  .toolbar {
    gap: 10px;
  }
  
  .toolbar-left {
    gap: 8px;
  }
  
  .toolbar-right {
    gap: 8px;
  }
}

/* Desktop adjustments for sidebar */
@media (min-width: 1025px) {
  .mobile-menu-btn {
    display: none;
  }
}

</style>