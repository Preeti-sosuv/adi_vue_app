<template>
  <Teleport to="body">
    <div v-if="store.showPromptContentModel" class="prompt-modal-overlay" @click.self="store.closePromptContentModel()">
      <div class="prompt-modal-container">
        <!-- Documents Table -->
        <div v-if="store.isDocumentsData" class="documents-modal">
          <div class="modal-header">
            <div class="header-content">
              <div class="header-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8" fill="none" stroke="white" stroke-width="2"/>
                </svg>
              </div>
              <div class="header-info">
                <h3 class="modal-title">Document Sources</h3>
                <p class="modal-subtitle">{{ store.selectedCount }} of {{ store.totalDocuments }} documents selected</p>
              </div>
            </div>
            <button class="close-button" @click="store.closePromptContentModel()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        
        <div v-if="store.totalDocuments === 0" class="no-data">
          <p>No documents found. Raw API response:</p>
          <pre>{{ formatted }}</pre>
        </div>
        
        <div v-else class="table-container">
          <table class="documents-table">
            <thead>
              <tr>
                <th class="select-col">
                  <input 
                    type="checkbox" 
                    :checked="store.allSelected" 
                    @change="store.toggleAll()"
                    class="select-all-checkbox"
                  />
                </th>
                <th class="sortable" @click="handleSort('dataroom')">
                  <div class="column-header">
                    <span>Data Room</span>
                    <div class="sort-indicator">
                      <svg v-if="sortField === 'dataroom'" :class="{ 'rotated': sortDirection === 'desc' }" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="filter-header">
                    <input 
                      v-model="columnFilters.dataroom" 
                      type="text" 
                      placeholder="Filter data room..." 
                      class="filter-input"
                      @input="applyFilters"
                    />
                  </div>
                </th>
                <th class="sortable" @click="handleSort('classification')">
                  <div class="column-header">
                    <span>Classification</span>
                    <div class="sort-indicator">
                      <svg v-if="sortField === 'classification'" :class="{ 'rotated': sortDirection === 'desc' }" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="filter-header">
                    <input 
                      v-model="columnFilters.classification" 
                      type="text" 
                      placeholder="Filter classification..." 
                      class="filter-input"
                      @input="applyFilters"
                    />
                  </div>
                </th>
                <th class="sortable" @click="handleSort('name')">
                  <div class="column-header">
                    <span>Name</span>
                    <div class="sort-indicator">
                      <svg v-if="sortField === 'name'" :class="{ 'rotated': sortDirection === 'desc' }" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="filter-header">
                    <input 
                      v-model="columnFilters.name" 
                      type="text" 
                      placeholder="Filter name..." 
                      class="filter-input"
                      @input="applyFilters"
                    />
                  </div>
                </th>
                <th class="sortable" @click="handleSort('categorisation')">
                  <div class="column-header">
                    <span>Category</span>
                    <div class="sort-indicator">
                      <svg v-if="sortField === 'categorisation'" :class="{ 'rotated': sortDirection === 'desc' }" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="filter-header">
                    <input 
                      v-model="columnFilters.categorisation" 
                      type="text" 
                      placeholder="Filter category..." 
                      class="filter-input"
                      @input="applyFilters"
                    />
                  </div>
                </th>
                <th class="sortable" @click="handleSort('loaded')">
                  <div class="column-header">
                    <span>Loaded</span>
                    <div class="sort-indicator">
                      <svg v-if="sortField === 'loaded'" :class="{ 'rotated': sortDirection === 'desc' }" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="filter-header">
                    <input 
                      v-model="columnFilters.loaded" 
                      type="text" 
                      placeholder="Filter loaded..." 
                      class="filter-input"
                      @input="applyFilters"
                    />
                  </div>
                </th>
                <th class="sortable" @click="handleSort('source')">
                  <div class="column-header">
                    <span>Source</span>
                    <div class="sort-indicator">
                      <svg v-if="sortField === 'source'" :class="{ 'rotated': sortDirection === 'desc' }" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="filter-header">
                    <input 
                      v-model="columnFilters.source" 
                      type="text" 
                      placeholder="Filter source..." 
                      class="filter-input"
                      @input="applyFilters"
                    />
                  </div>
                </th>
                <th>
                  <div class="column-header">
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in paginatedDocuments" :key="doc.document_id || index">
                <td>
                  <input 
                    type="checkbox" 
                    :checked="store.selectedDocuments.includes(doc.document_id || index)"
                    @change="store.toggleDocument(doc.document_id || index)"
                    class="document-checkbox"
                  />
                </td>
                <td>{{ doc.dataroom || doc.data_room || '-' }}</td>
                <td>{{ doc.classification || '-' }}</td>
                <td>{{ doc.document_name || doc.name || doc.document_id || '-' }}</td>
                <td>{{ doc.categorisation || '-' }}</td>
                <td>{{ doc.loaded || doc.pit || doc.email_when || '-' }}</td>
                <td>{{ doc.source || doc.document_source || '-' }}</td>
                <td>
                  <div class="action-buttons">
                    <button 
                      class="action-btn view-btn" 
                      title="View Document" 
                      @click="handleViewDocument(doc)"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button class="action-btn delete-btn" title="Delete">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                    <button class="action-btn more-btn" title="More options">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="12" cy="5" r="1"/>
                        <circle cx="12" cy="19" r="1"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paginatedDocuments.length === 0" class="no-results">
                <td colspan="8" class="no-results-cell">
                  <div class="no-results-content">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <p>No documents found matching your filters</p>
                    <button @click="clearAllFilters" class="clear-filters-link">Clear all filters</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Filter Controls Bar -->
        <div class="filter-controls-bar">
          <div class="filter-controls-left">
            <div class="global-search">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search all documents..." 
                class="global-search-input"
                @input="handleSearch"
              />
              <button v-if="searchQuery" @click="clearSearch" class="clear-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div class="quick-filters">
              <select v-model="selectedDataRoom" @change="applyFilters" class="quick-filter-select">
                <option value="">All Data Rooms</option>
                <option v-for="room in uniqueDataRooms" :key="room" :value="room">{{ room }}</option>
              </select>
              
              <select v-model="selectedClassification" @change="applyFilters" class="quick-filter-select">
                <option value="">All Classifications</option>
                <option v-for="classification in uniqueClassifications" :key="classification" :value="classification">{{ classification }}</option>
              </select>
            </div>
          </div>
          
          <div class="filter-controls-right">
            <button 
              v-if="hasActiveFilters" 
              @click="clearAllFilters" 
              class="clear-all-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Clear Filters
            </button>
            
            <div class="results-info">
              <span class="results-count">{{ totalFilteredDocuments }} results</span>
              <span v-if="totalFilteredDocuments !== store.documents.length" class="filter-info">
                (filtered from {{ store.documents.length }})
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="totalFilteredDocuments > 0" class="pagination">
          <div class="pagination-info">
            <span>Page Size: 
              <select v-model="pageSize" class="page-size-select" @change="currentPage = 1">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </span>
            <span>{{ ((currentPage - 1) * pageSize) + 1 }} to {{ Math.min(currentPage * pageSize, totalFilteredDocuments) }} of {{ totalFilteredDocuments }}</span>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
          </div>
          <div class="pagination-controls">
            <button 
              @click="currentPage = 1" 
              :disabled="currentPage === 1"
              class="pagination-btn"
              title="First page"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="11,17 6,12 11,7"/>
                <polyline points="18,17 13,12 18,7"/>
              </svg>
            </button>
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="pagination-btn"
              title="Previous page"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
            </button>
            
            <div class="page-numbers">
              <button 
                v-for="page in visiblePageNumbers" 
                :key="page"
                @click="currentPage = page"
                :class="['page-number', { active: page === currentPage }]"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
              class="pagination-btn"
              title="Next page"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </button>
            <button 
              @click="currentPage = totalPages" 
              :disabled="currentPage === totalPages"
              class="pagination-btn"
              title="Last page"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="13,17 18,12 13,7"/>
                <polyline points="6,17 11,12 6,7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Error Display -->
      <div v-else-if="store.promptContentData" class="error-display">
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon error">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <div class="header-info">
              <h3 class="modal-title">Response Data</h3>
              <p class="modal-subtitle">Raw API response data</p>
            </div>
          </div>
          <button class="close-button" @click="store.closePromptContentModel()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="error-content">
          <pre class="json-output">{{ formatted }}</pre>
        </div>
      </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { usePromptListStore } from '../stores/promptList';
import { useAuthStore } from '../stores/auth';

const store = usePromptListStore();
const authStore = useAuthStore();

// Filtering and Sorting State
const searchQuery = ref('');
const selectedDataRoom = ref('');
const selectedClassification = ref('');
const selectedSource = ref('');
const selectedCategory = ref('');
const sortField = ref('name');
const sortDirection = ref<'asc' | 'desc'>('asc');
const columnFilters = ref<Record<string, string>>({
  dataroom: '',
  classification: '',
  name: '',
  categorisation: '',
  loaded: '',
  source: ''
});

// Computed properties for filter options
const uniqueDataRooms = computed(() => {
  const rooms = store.documents.map(doc => doc.dataroom || doc.data_room || '').filter(Boolean);
  return [...new Set(rooms)].sort();
});

const uniqueClassifications = computed(() => {
  const classifications = store.documents.map(doc => doc.classification || '').filter(Boolean);
  return [...new Set(classifications)].sort();
});

const uniqueSources = computed(() => {
  const sources = store.documents.map(doc => doc.source || doc.document_source || '').filter(Boolean);
  return [...new Set(sources)].sort();
});

const uniqueCategories = computed(() => {
  const categories = store.documents.map(doc => doc.categorisation || '').filter(Boolean);
  return [...new Set(categories)].sort();
});

// Filtered and sorted documents
const filteredDocuments = computed(() => {
  let docs = [...store.documents];
  
  // Apply global search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    docs = docs.filter(doc => 
      (doc.document_name || doc.name || '').toLowerCase().includes(query) ||
      (doc.dataroom || doc.data_room || '').toLowerCase().includes(query) ||
      (doc.classification || '').toLowerCase().includes(query) ||
      (doc.categorisation || '').toLowerCase().includes(query) ||
      (doc.source || doc.document_source || '').toLowerCase().includes(query)
    );
  }
  
  // Apply dropdown filters
  if (selectedDataRoom.value) {
    docs = docs.filter(doc => 
      (doc.dataroom || doc.data_room || '') === selectedDataRoom.value
    );
  }
  
  if (selectedClassification.value) {
    docs = docs.filter(doc => 
      (doc.classification || '') === selectedClassification.value
    );
  }
  
  // Apply column filters
  Object.entries(columnFilters.value).forEach(([field, value]) => {
    if (value) {
      const filterValue = value.toLowerCase();
      docs = docs.filter(doc => {
        const fieldValue = getFieldValue(doc, field).toLowerCase();
        return fieldValue.includes(filterValue);
      });
    }
  });
  
  // Apply sorting
  if (sortField.value) {
    docs.sort((a, b) => {
      const aVal = getFieldValue(a, sortField.value);
      const bVal = getFieldValue(b, sortField.value);
      const comparison = aVal.localeCompare(bVal);
      return sortDirection.value === 'asc' ? comparison : -comparison;
    });
  }
  
  return docs;
});

// Helper function to get field value
const getFieldValue = (doc: any, field: string): string => {
  switch (field) {
    case 'dataroom':
      return doc.dataroom || doc.data_room || '-';
    case 'classification':
      return doc.classification || '-';
    case 'name':
      return doc.document_name || doc.name || doc.document_id || '-';
    case 'categorisation':
      return doc.categorisation || '-';
    case 'loaded':
      return doc.loaded || doc.pit || doc.email_when || '-';
    case 'source':
      return doc.source || doc.document_source || '-';
    default:
      return doc[field] || '-';
  }
};

// Pagination for filtered results
const currentPage = ref(1);
const pageSize = ref(10);

const paginatedDocuments = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredDocuments.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(filteredDocuments.value.length / pageSize.value);
});

const totalFilteredDocuments = computed(() => filteredDocuments.value.length);

// Check if there are any active filters
const hasActiveFilters = computed(() => {
  return searchQuery.value || 
         selectedDataRoom.value || 
         selectedClassification.value ||
         Object.values(columnFilters.value).some(filter => filter);
});

// Visible page numbers for pagination
const visiblePageNumbers = computed(() => {
  const pages = [];
  const maxVisible = 5;
  const half = Math.floor(maxVisible / 2);
  
  let start = Math.max(1, currentPage.value - half);
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  // Adjust start if we're near the end
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const handleSort = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortDirection.value = 'asc';
  }
  currentPage.value = 1; // Reset to first page when sorting
};

const handleSearch = () => {
  currentPage.value = 1; // Reset to first page when searching
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
};

const applyFilters = () => {
  currentPage.value = 1; // Reset to first page when filtering
};

const clearAllFilters = () => {
  searchQuery.value = '';
  selectedDataRoom.value = '';
  selectedClassification.value = '';
  selectedSource.value = '';
  selectedCategory.value = '';
  columnFilters.value = {
    dataroom: '',
    classification: '',
    name: '',
    categorisation: '',
    loaded: '',
    source: ''
  };
  currentPage.value = 1;
};

const updateColumnFilter = (field: string, value: string) => {
  columnFilters.value[field] = value;
  currentPage.value = 1;
};

// Watch for store changes to reset pagination
watch(() => store.documents, () => {
  currentPage.value = 1;
});

// Original computed properties
const formatted = computed(() => {
  try {
    return JSON.stringify(store.promptContentData, null, 2);
  } catch {
    return String(store.promptContentData ?? '');
  }
});

const documentData = computed(() => {
  if (!store.promptContentData || typeof store.promptContentData !== 'object') return {}
  
  const data = store.promptContentData as any
  // If it's a result array like [true, {document_data}], extract the document
  if (data.result && Array.isArray(data.result) && data.result.length > 1) {
    return data.result[1] || {}
  }
  // If it's a direct document object
  return data
});

const formatFieldName = (key: string) => {
  const fieldNames: Record<string, string> = {
    'document_id': 'Document ID',
    'document_external_id': 'External ID',
    'document_source': 'Source',
    'dataroom': 'Data Room',
    'source_reference': 'Source Reference',
    'org_id': 'Organization ID',
    'categorisation': 'Categorisation',
    'dept_id': 'Department ID',
    'connection_tech': 'Connection Technology',
    'linked_docs': 'Linked Documents',
    'from_email': 'From Email',
    'document_summary': 'Summary',
    'short_pit': 'Short Date',
    'keywords': 'Keywords',
    'classification': 'Classification',
    'content_type': 'Content Type',
    'status': 'Status',
    'pit': 'Date',
    'to_email': 'To Email',
    'document_notes': 'Notes',
    'email_when': 'Email Date',
    'transform_version_id': 'Transform Version ID',
    'add_docs': 'Add Documents'
  }
  return fieldNames[key] || key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
};

const formatFieldValue = (value: any) => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object' && value !== null) return JSON.stringify(value)
  return String(value)
};

// Handle viewing document via external link API
const handleViewDocument = async (doc: any) => {
  try {
    const token = authStore.getToken() || sessionStorage.getItem('askai_token');
    
    if (!token) {
      alert('Authentication required. Please log in again.');
      return;
    }

    // Get document_id from the document object
    const documentId = doc.document_id || doc.id;
    
    if (!documentId) {
      alert('Document ID not found for this document.');
      return;
    }

    console.log('Getting external document link for:', { documentId, token: token.substring(0, 10) + '...' });

    const response = await fetch('http://34.69.208.233:8040/proxy/get_external_document_link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        document_id: documentId,
        token: token
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to get document link: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Handle the response - the link is in the "result" key
    if (data.result) {
      // The result contains the document viewer URL
      const documentLink = data.result;
      console.log('Opening document link:', documentLink);
      // Open the document in a new tab
      window.open(documentLink, '_blank');
    } else if (data.link || data.url || data.external_link) {
      const documentLink = data.link || data.url || data.external_link;
      // Open the document in a new tab
      window.open(documentLink, '_blank');
    } else {
      // If no direct link, show the response data
      console.log('Document link response:', data);
      alert(`Document response received. Check console for details.`);
    }

  } catch (error) {
    console.error('Error getting document link:', error);
    alert('Failed to get document link. Please try again.');
  }
};
</script>

<style scoped>
.prompt-modal-overlay {
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

.prompt-modal-container {
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Documents Modal Styles */
.documents-modal {
  width: 100%;
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.header-icon.error {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.header-info {
  flex: 1;
  min-width: 0;
}

.modal-title {
  font-size: 22px;
  font-weight: 600;
  color: white;
  margin: 0 0 4px 0;
}

.modal-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.close-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.table-container {
  max-height: 500px;
  overflow-y: auto;
}

.documents-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.documents-table th,
.documents-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.documents-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 1;
}

.select-col {
  width: 40px;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-input {
  flex: 1;
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  background: #fff;
}

.filter-input:focus {
  outline: none;
  border-color: #007bff;
}

.filter-icon,
.sort-icon {
  font-size: 10px;
  color: #666;
  cursor: pointer;
  user-select: none;
}

.sort-icon:hover {
  color: #007bff;
}

.select-all-checkbox,
.document-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 3px;
  font-size: 12px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background: #f0f0f0;
}

.view-btn {
  color: #007bff;
}

.view-btn:hover {
  background: #e3f2fd;
}

.delete-btn {
  color: #dc3545;
}

.more-btn {
  color: #666;
}

.page-size-select {
  padding: 2px 4px;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  background: #fff;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: #e9ecef;
}

.sort-indicator {
  margin-left: 4px;
  color: #007bff;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.pagination-info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.pagination-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error Display */
.error-display {
  width: 100%;
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.error-content {
  padding: 24px;
  max-height: 500px;
  overflow-y: auto;
  background: #fafbfc;
  flex: 1;
}

.json-output {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #374151;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* No Data Display */
.no-data {
  padding: 40px 24px;
  text-align: center;
  background: #fafbfc;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.no-data p {
  margin-bottom: 24px;
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
}

.no-data pre {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  max-height: 300px;
  overflow-y: auto;
  text-align: left;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: #374151;
  line-height: 1.5;
  max-width: 600px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Filter Controls Bar */
.filter-controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #fafbfc;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-controls-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.filter-controls-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.global-search {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 0 12px;
  min-width: 280px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.global-search:focus-within {
  border-color: #6750a4;
  box-shadow: 0 0 0 3px rgba(103, 80, 164, 0.1);
}

.search-icon {
  color: #64748b;
  margin-right: 8px;
  flex-shrink: 0;
}

.global-search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 0;
  font-size: 14px;
  color: #374151;
  background: transparent;
}

.global-search-input::placeholder {
  color: #9ca3af;
}

.clear-search {
  background: none;
  border: none;
  padding: 4px;
  margin-left: 8px;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.clear-search:hover {
  background: #f3f4f6;
  color: #374151;
}

.quick-filters {
  display: flex;
  gap: 12px;
  align-items: center;
}

.quick-filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 150px;
}

.quick-filter-select:focus {
  outline: none;
  border-color: #6750a4;
  box-shadow: 0 0 0 3px rgba(103, 80, 164, 0.1);
}

.quick-filter-select:hover {
  border-color: #9ca3af;
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.clear-all-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
}

.results-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
}

.results-count {
  font-weight: 600;
  color: #374151;
}

.filter-info {
  color: #9ca3af;
  font-size: 13px;
}

/* Enhanced column headers */
.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 8px;
}

.column-header span {
  font-weight: 600;
  color: #374151;
}

.sort-indicator {
  display: flex;
  align-items: center;
  color: #9ca3af;
  transition: all 0.2s;
}

.sort-indicator svg {
  transition: transform 0.2s;
}

.sort-indicator svg.rotated {
  transform: rotate(180deg);
}

.sortable:hover .sort-indicator {
  color: #6750a4;
}

/* Enhanced filter inputs */
.filter-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  background: white;
  color: #374151;
  transition: all 0.2s;
}

.filter-input:focus {
  outline: none;
  border-color: #6750a4;
  box-shadow: 0 0 0 2px rgba(103, 80, 164, 0.1);
}

.filter-input::placeholder {
  color: #9ca3af;
}

/* No results state */
.no-results-cell {
  padding: 40px 20px;
  text-align: center;
}

.no-results-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #64748b;
}

.no-results-content svg {
  opacity: 0.5;
}

.no-results-content p {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.clear-filters-link {
  background: none;
  border: none;
  color: #6750a4;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.2s;
}

.clear-filters-link:hover {
  color: #5a4fcf;
}

/* Enhanced pagination */
.page-numbers {
  display: flex;
  gap: 4px;
  align-items: center;
}

.page-number {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number:hover {
  background: #f8fafc;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.page-number.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.pagination-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f9fafb;
}

/* Debug Section */
.debug-section {
  padding: 10px 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.debug-section details {
  font-size: 12px;
}

.debug-section summary {
  cursor: pointer;
  color: #007bff;
  font-weight: 500;
  padding: 5px 0;
}

.debug-section summary:hover {
  color: #0056b3;
}

.debug-content {
  margin-top: 10px;
  padding: 10px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.debug-content p {
  margin: 5px 0;
  font-size: 12px;
}

.debug-content pre {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 10px;
  max-height: 200px;
  overflow-y: auto;
  font-size: 11px;
  margin: 5px 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .filter-controls-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .filter-controls-left {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .quick-filters {
    flex-direction: column;
    gap: 8px;
  }
  
  .global-search {
    min-width: auto;
  }
  
  .quick-filter-select {
    min-width: auto;
  }
}
</style>
