# Artifact Panel Implementation

Based on the Anvil H_ChatBot artifact panel functionality, this Vue.js implementation provides similar capabilities for displaying data views, help content, and analysis in modal panels.

## Components

### 1. ArtifactPanel.vue
Main modal component that displays:
- **Data tables** from API responses
- **Help content** in markdown format  
- **Analysis results** with formatted content
- **Loading/error states**
- **Export functionality** for data

### 2. ChatBanner.vue
Banner component for displaying clickable call-to-action buttons:
- **View Analysis** banners
- **View Data** buttons
- **Help prompts**
- **Loading states**

### 3. useArtifactPanel.ts
Composable for managing artifact panel state and interactions:
- Opens different types of panels
- Manages panel data
- Provides helper functions for creating buttons

## Usage Patterns

### 1. Help Integration (like Anvil "help" command)

```vue
<template>
  <div>
    <!-- Show help banner when user needs assistance -->
    <ChatBanner
      type="help"
      title="Need Help Understanding Service Status?"
      subtitle="Get detailed analysis and explanations"
      button-text="View Analysis"
      @click="showServiceHelp"
    />
    
    <!-- Artifact Panel -->
    <ArtifactPanel
      :is-open="isOpen"
      :title="currentArtifact.title"
      :help-content="currentArtifact.helpContent"
      @close="closePanel"
    />
  </div>
</template>

<script setup>
import { useArtifactPanel } from '../composables/useArtifactPanel';

const { isOpen, currentArtifact, openHelpViewer, closePanel } = useArtifactPanel();

const showServiceHelp = () => {
  const helpContent = \`
# Service Status Analysis
## System Health Overview
...detailed markdown content...
  \`;
  openHelpViewer(helpContent, 'Service Status Analysis');
};
</script>
```

### 2. Data Viewer Integration (like Anvil sql_results_view_click)

```vue
<template>
  <div>
    <!-- Data results with view button -->
    <div class="data-result">
      <p>Query returned {{ rowCount }} results</p>
      <ChatBanner
        type="data"
        title="View Database Results"
        subtitle="Click to open data in full viewer"
        button-text="View Data"
        @click="openDataViewer"
      />
    </div>
    
    <!-- Artifact Panel -->
    <ArtifactPanel
      :is-open="isOpen"
      :title="currentArtifact.title"
      :connection-id="currentArtifact.connectionId"
      :dataset-id="currentArtifact.datasetId"
      :sql="currentArtifact.sql"
      @close="closePanel"
    />
  </div>
</template>

<script setup>
const { isOpen, currentArtifact, openDataViewer, closePanel } = useArtifactPanel();

const openDataViewer = () => {
  openDataViewer({
    title: 'Query Results',
    connectionId: 'production_db',
    datasetId: 'user_analytics',
    sql: 'SELECT * FROM users WHERE active = true LIMIT 50'
  });
};
</script>
```

### 3. Chat Integration Pattern

In a chat interface, you can conditionally show banners based on content:

```vue
<template>
  <div class="chat-message">
    <div v-if="message.type === 'response'" class="message-content">
      {{ message.text }}
      
      <!-- Show analysis banner for certain responses -->
      <ChatBanner
        v-if="shouldShowAnalysisBanner(message)"
        type="analysis"
        title="View Detailed Analysis"
        subtitle="Get comprehensive insights on this data"
        button-text="View Analysis"
        @click="() => showAnalysis(message)"
      />
      
      <!-- Show data banner for query results -->
      <ChatBanner
        v-if="message.hasData"
        type="data"
        title="View Query Results"
        :subtitle="\`\${message.rowCount} rows available\`"
        button-text="View Data"
        @click="() => viewQueryData(message)"
      />
    </div>
  </div>
</template>
```

## API Integration

The artifact panel expects data from APIs that follow the Anvil pattern:

```javascript
// Example API call for data viewer
const response = await fetch('/api/get_dataviewer_data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    connection_id: 'db_connection',
    dataset_id: 'table_name', 
    rows: 50,
    sql: 'SELECT * FROM table LIMIT 50',
    token: authToken
  })
});

// Expected response format:
{
  "result": [
    true,                    // authenticated
    "base64_encoded_json",   // data as base64 JSON
    50,                      // row count
    1250                     // total row count
  ]
}
```

## Styling

The components use modern CSS with:
- **Glassmorphism effects** for banners
- **Smooth animations** and transitions
- **Responsive design** for mobile
- **Accessible color contrasts**
- **Professional data table styling**

## Customization

### Banner Types
- `analysis`: Purple gradient, chart icon
- `data`: Pink gradient, table icon  
- `help`: Blue gradient, info icon
- `info`: Green gradient, clock icon

### Panel Configuration
```javascript
const artifact = {
  type: 'data|help|analysis',
  title: 'Panel Title',
  connectionId: 'optional_db_connection',
  datasetId: 'optional_table_name',
  sql: 'optional_sql_query',
  helpContent: 'markdown_content',
  maxRows: 50
};
```

This implementation provides the same user experience as Anvil's artifact panels while maintaining Vue.js best practices and modern web standards.