<template>
  <div class="chat-response">
    <div class="ai-avatar">
      <img src="/images/favicon.png" alt="AI" width="20" height="20" />
    </div>
    <div class="ai-text">
      <div v-if="loading" class="loading-dots">
        <span></span><span></span><span></span>
      </div>
      <div v-else>
        <div class="rich-text-content" v-html="formattedContent"></div>
        
        <!-- Show help banner if this is a help response -->
        <div v-if="showHelpBanner" class="banner-container">
          <ChatBanner
            type="help"
            title="View Analysis"
            subtitle="Get detailed help and analysis for your query"
            button-text="View Analysis"
            @click="openHelpPanel"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useArtifactPanel } from '../composables/useArtifactPanel';
import ArtifactPanel from './ArtifactPanel.vue';
import ChatBanner from './ChatBanner.vue';

interface Props {
  content: string;
  loading?: boolean;
  userQuery?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  userQuery: ''
});

const { isOpen, currentArtifact, openHelpViewer, closePanel } = useArtifactPanel();

// Check if this response should show a help banner
const showHelpBanner = computed(() => {
  return props.userQuery?.toLowerCase().trim() === 'help' && !props.loading;
});

const openHelpPanel = () => {
  const helpContent = generateHelpContent();
  openHelpViewer(helpContent, 'Help & Analysis');
};

const generateHelpContent = () => {
  return `
# Help & Analysis

## Welcome to Your AI Assistant

This AI-powered system helps you with various tasks including document search, data analysis, and intelligent responses.

### Available Commands & Features

#### **Chat Mode**
- **Ask Questions**: Type natural language questions about your documents or data
- **Get Insights**: Ask for analysis, summaries, or explanations
- **Search Content**: Find specific information across your document library

#### **Search Commands**
- **Document Search**: The AI will search through your uploaded documents to find relevant information
- **Database Queries**: Ask questions about data in connected databases
- **Cross-Reference**: Find relationships between different data sources

#### **Special Commands**
- **help**: Show this help panel with detailed guidance
- **#company:[name]**: Search for specific company information
- **#category:[type]**: Filter by document categories
- **#classification:[level]**: Filter by classification levels

#### **Data Analysis**
- Ask for **summaries** of complex documents
- Request **trend analysis** from data sets
- Get **comparative analysis** between different metrics
- Generate **reports** based on your data

### Tips for Better Results

#### **Be Specific**
Instead of: *"Tell me about finances"*  
Try: *"What are the key financial metrics for Q3 2024?"*

#### **Use Context**
- Reference specific documents: *"Based on the quarterly report..."*
- Mention timeframes: *"Show me trends from last month"*
- Specify data sources: *"From the customer database..."*

#### **Ask Follow-up Questions**
- *"Can you provide more details about..."*
- *"How does this compare to..."*
- *"What are the implications of..."*

### Document Management

#### **Upload Documents**
1. Click the **+** button in the toolbar
2. Select files to upload
3. Choose appropriate classification and categorization
4. Documents become searchable immediately

#### **Source Selection**
- Use the **Sources** dropdown to select specific documents
- Filter by categories, classifications, or data rooms
- Mix document types for comprehensive analysis

### Data Connections

#### **Database Integration**
- Connect to external databases through the **Connections** menu
- Query structured data alongside document content
- Get real-time insights from live data sources

#### **Supported Formats**
- **Documents**: PDF, Word, Excel, PowerPoint, Text files
- **Data**: CSV, JSON, Database connections
- **Classifications**: Company Confidential, Public, User Confidential

### Troubleshooting

#### **If You're Not Getting Results**
- Check your **source selection** - ensure relevant documents are selected
- Try **rephrasing** your question with different keywords
- Use more **specific terms** rather than general concepts
- Verify your documents are **properly uploaded** and classified

#### **For Technical Issues**
- Refresh the page if responses seem slow
- Check your network connection
- Contact support if problems persist

### Advanced Features

#### **Bookmarking**
- Click the bookmark icon on any question to save it
- Access saved questions from the bookmark menu
- Build a library of frequently used queries

#### **Model Selection**
- Choose different AI models for various tasks
- Some models excel at analysis, others at creative tasks
- Experiment to find the best model for your needs

### Privacy & Security

- All conversations are **encrypted** and secure
- Document access is controlled by **your permissions**
- Classifications ensure **appropriate data handling**
- Your data is **never shared** with unauthorized parties

---

**Need more specific help?** Try asking about particular features or document types. For example:
- *"How do I analyze financial statements?"*
- *"What's the best way to search legal documents?"*
- *"Show me how to connect to my database"*

*Last updated: ${new Date().toLocaleDateString()}*
  `;
};

const formattedContent = computed(() => {
  if (props.loading || !props.content) return '';
  
  let content = '';
  
  // Handle JSON response with "result" key
  const data = props.content;
  if (typeof data === 'object' && data !== null) {
    if ((data as any).result) {
      content = (data as any).result;
    } else if ((data as any).message) {
      content = (data as any).message;
    } else if ((data as any).help) {
      content = (data as any).help;
    } else {
      content = JSON.stringify(data, null, 2);
    }
  } else if (typeof data === 'string') {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(data);
      if (parsed.result) {
        content = parsed.result;
      } else {
        content = data;
      }
    } catch {
      content = data;
    }
  } else {
    content = String(data);
  }
  
  // Convert Markdown to HTML format
  return content
    // Convert headings
    .replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>')
    // Convert bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="md-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="md-italic">$1</em>')
    // Convert inline code
    .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
    // Convert bullet points
    .replace(/^(\s*)[-•*]\s+(.*$)/gim, (match, indent, text) => {
      const level = Math.floor(indent.length / 2);
      return `<li class="md-li level-${level}">${text}</li>`;
    })
    // Wrap consecutive list items in ul tags
    .replace(/(<li class="md-li[^>]*>.*?<\/li>[\s\n]*)+/gs, '<ul class="md-ul">$&</ul>')
    // Convert line breaks
    .replace(/\n\n/g, '</p><p class="md-p">')
    .replace(/\n/g, '<br>')
    // Wrap in paragraph tags
    .replace(/^(?!<[hul])/gm, '<p class="md-p">')
    .replace(/(?<!>)$/gm, '</p>')
    // Clean up malformed paragraphs
    .replace(/<p class="md-p">\s*<\/p>/g, '')
    .replace(/<p class="md-p">\s*(<[hul])/g, '$1')
    .replace(/(<\/[hul][^>]*>)\s*<\/p>/g, '$1');
});
</script>

<style scoped>
.chat-response {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 100%;
}

.ai-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.ai-text {
  background: #f1f3f4;
  padding: 12px 16px;
  border-radius: 18px;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
}

.loading-dots {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.loading-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #999;
  animation: loading-bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Rich text content styling */
.rich-text-content {
  white-space: pre-wrap;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.5;
  color: #333;
  font-size: 14px;
}

/* Markdown styling for rich text */
.rich-text-content :deep(.md-h1) {
  font-size: 24px;
  font-weight: 600;
  margin: 20px 0 16px 0;
  color: #1a1a1a;
  border-bottom: 1px solid #e1e4e8;
  padding-bottom: 8px;

}

.rich-text-content :deep(.md-h2) {
  font-size: 20px;
  font-weight: 600;
  margin: 16px 0 12px 0;
  color: #1a1a1a;
  
}

.rich-text-content :deep(.md-h3) {
  font-size: 16px;
  font-weight: 600;
  margin: 12px 0 8px 0;
  color: #1a1a1a;
  line-height: 1.5;
}

.rich-text-content :deep(.md-bold) {
  font-weight: 600;
  color: #1a1a1a;
  
}

.rich-text-content :deep(.md-italic) {
  font-style: italic;
  color: #555;
  
}

.rich-text-content :deep(.md-code) {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 3px;
  padding: 2px 4px;
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', monospace;
  font-size: 12px;
  color: #d73a49;
  
}

.rich-text-content :deep(.md-ul) {
  margin: 12px 0;
  padding-left: 0;
  list-style: none;
  line-height: 0;
}

.rich-text-content :deep(.md-li) {
  margin: 4px 0;
  padding-left: 20px;
  position: relative;
  line-height: 1.5;
}

.rich-text-content :deep(.md-li:before) {
  content: '•';
  position: absolute;
  left: 8px;
  color: #666;
  font-weight: bold;
}

.rich-text-content :deep(.md-li.level-1) {
  padding-left: 40px;
}

.rich-text-content :deep(.md-li.level-2) {
  padding-left: 60px;
}

.rich-text-content :deep(.md-p) {
    margin: 8px 0;          /* spacing between paragraphs */
    line-height: 1.5;       /* normal spacing */
    color: #333;

}

.banner-container {
  margin-top: 16px;
}


</style>
