import { defineStore } from 'pinia'
import { usePromptListStore } from './promptList'
import axios from 'axios'

interface Document {
  id?: string | number
  document_id?: string | number
  data_room?: string
  dataroom?: string
  classification?: string
  name?: string
  categorisation?: string
  loaded?: string
  source?: string
  document_source?: string
  pit?: string
  email_when?: string
  document_external_id?: string
  document_summary?: string
  from_email?: string
  to_email?: string
  status?: string
  content_type?: string
  keywords?: string
  short_pit?: string
  document_notes?: string
  transform_version_id?: string
  add_docs?: boolean
  linked_docs?: number
  connection_tech?: string
  org_id?: number
  dept_id?: number
  source_reference?: string
}

interface ApiResponse {
  documents?: Document[]
  data?: Document[]
  result?: any[]
  error?: string
  status?: number
  statusText?: string
}

interface DocumentsState {
  documents: Document[]
  selectedDocuments: (string | number)[]
  loading: boolean
  error: string | null
  // Pagination state
  currentPage: number
  pageSize: number
  // Sorting state
  sortField: string
  sortDirection: 'asc' | 'desc'
}

export const useDocumentsStore = defineStore('documents', {
  state: (): DocumentsState => ({
    documents: [],
    selectedDocuments: [],
    loading: false,
    error: null,
    // Pagination state
    currentPage: 1,
    pageSize: 10,
    // Sorting state
    sortField: 'name',
    sortDirection: 'asc'
  }),

  getters: {
    // Pagination getters
    totalDocuments: (state) => state.documents.length,
    totalPages: (state) => Math.ceil(state.documents.length / state.pageSize),
    startIndex: (state) => (state.currentPage - 1) * state.pageSize,
    endIndex: (state) => Math.min((state.currentPage - 1) * state.pageSize + state.pageSize, state.documents.length),
    
    // Sorted documents
    sortedDocuments: (state) => {
      const docs = [...state.documents]
      if (state.sortField && docs.length > 0) {
        docs.sort((a, b) => {
          const aVal = a[state.sortField as keyof Document] || ''
          const bVal = b[state.sortField as keyof Document] || ''
          const comparison = String(aVal).localeCompare(String(bVal))
          return state.sortDirection === 'asc' ? comparison : -comparison
        })
      }
      return docs
    },
    
    // Paginated documents
    paginatedDocuments: (state) => {
      const docs = [...state.documents]
      if (state.sortField && docs.length > 0) {
        docs.sort((a, b) => {
          const aVal = a[state.sortField as keyof Document] || ''
          const bVal = b[state.sortField as keyof Document] || ''
          const comparison = String(aVal).localeCompare(String(bVal))
          return state.sortDirection === 'asc' ? comparison : -comparison
        })
      }
      const startIndex = (state.currentPage - 1) * state.pageSize
      const endIndex = Math.min(startIndex + state.pageSize, docs.length)
      return docs.slice(startIndex, endIndex)
    },

    // Selection getters
    allSelected: (state) => {
      const docs = [...state.documents]
      if (state.sortField && docs.length > 0) {
        docs.sort((a, b) => {
          const aVal = a[state.sortField as keyof Document] || ''
          const bVal = b[state.sortField as keyof Document] || ''
          const comparison = String(aVal).localeCompare(String(bVal))
          return state.sortDirection === 'asc' ? comparison : -comparison
        })
      }
      const startIndex = (state.currentPage - 1) * state.pageSize
      const endIndex = Math.min(startIndex + state.pageSize, docs.length)
      const pageDocs = docs.slice(startIndex, endIndex)
      
      return pageDocs.length > 0 && pageDocs.every(doc => 
        state.selectedDocuments.includes(doc.id || pageDocs.indexOf(doc))
      )
    },

    selectedCount: (state) => state.selectedDocuments.length,

    hasDocuments: (state) => state.documents.length > 0
  },

  actions: {
    async getDocuments(baseURL: string, token: string) {
      this.loading = true
      this.error = null
      
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        headers['token'] = token

        function resolveBaseURL(url: string): string {
          if (typeof window === 'undefined') return url
          try {
            const u = new URL(url)
            if (u.hostname === '0.0.0.0') {
              u.hostname = window.location.hostname || 'localhost'
            }
            return u.toString().replace(/\/$/, '')
          } catch {
            return url
          }
        }

        const resolvedBaseURL = resolveBaseURL(baseURL)
        const body = {
          document_id: null,
          document_status: "Active",
          token
        }

        const response = await axios.post(`${resolvedBaseURL}/get_documents`, body, { headers })
        
        // Extract documents array from response
        const data = response.data as any
        let extractedDocs: any[] = []
        
        if (data.result && Array.isArray(data.result) && data.result.length === 2) {
          if (data.result[0] === true && Array.isArray(data.result[1])) {
            extractedDocs = data.result[1]
          } else if (data.result[1] && !Array.isArray(data.result[1])) {
            extractedDocs = [data.result[1]]
          }
        } else if (data.result && Array.isArray(data.result) && data.result.length > 2) {
          extractedDocs = data.result.slice(1)
        } else if (data.result && Array.isArray(data.result)) {
          extractedDocs = data.result
        } else if (data.documents && Array.isArray(data.documents)) {
          extractedDocs = data.documents
        } else if (data.data && Array.isArray(data.data)) {
          extractedDocs = data.data
        } else if (data.document_id || (data.result && !Array.isArray(data.result))) {
          extractedDocs = [data]
        } else if (Array.isArray(data)) {
          extractedDocs = data
        } else {
          extractedDocs = data.documents || data.data || data || []
        }
        
        // Process and normalize documents
        this.documents = extractedDocs.map((doc, index) => {
          if (typeof doc === 'object' && doc !== null) {
            return {
              id: doc.id || doc.document_id || index,
              document_id: doc.document_id || doc.id || index,
              dataroom: doc.dataroom || doc.data_room || '-',
              data_room: doc.data_room || doc.dataroom || '-',
              classification: doc.classification || '-',
              name: doc.name || doc.document_id || '-',
              categorisation: doc.categorisation || '-',
              loaded: doc.loaded || doc.pit || doc.email_when || '-',
              source: doc.source || doc.document_source || '-',
              document_source: doc.document_source || doc.source || '-',
              ...doc
            }
          } else {
            return {
              id: index,
              document_id: index,
              dataroom: '-',
              data_room: '-',
              classification: '-',
              name: String(doc) || '-',
              categorisation: '-',
              loaded: '-',
              source: '-',
              document_source: '-'
            }
          }
        })
        
      } catch (error: any) {
        this.error = 'Failed to get documents.'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Pagination Actions
    setPage(page: number) {
      this.currentPage = page
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    setPageSize(size: number) {
      this.pageSize = size
      this.currentPage = 1 // Reset to first page when changing page size
    },

    // Sorting Actions
    sortBy(field: string) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortDirection = 'asc'
      }
    },

    addDocuments(newDocuments: Document[]) {
      const promptListStore = usePromptListStore()
      
      newDocuments.forEach(doc => {
        // Check if document already exists
        const existingIndex = this.documents.findIndex(
          existing => existing.document_id === doc.document_id || existing.id === doc.id
        )
        
        if (existingIndex >= 0) {
          // Update existing document
          this.documents[existingIndex] = { ...this.documents[existingIndex], ...doc }
        } else {
          // Add new document
          this.documents.push(doc)
        }
        
        // Also add to promptList store for PromptContextModel visibility
        const promptListExistingIndex = promptListStore.documents.findIndex(
          existing => existing.document_id === doc.document_id || existing.id === doc.id
        )
        
        if (promptListExistingIndex >= 0) {
          // Update existing document in promptList store
          promptListStore.documents[promptListExistingIndex] = { 
            ...promptListStore.documents[promptListExistingIndex], 
            ...doc 
          }
        } else {
          // Add new document to promptList store
          promptListStore.documents.push(doc)
        }
      })
    },

    toggleDocument(id: string | number) {
      const index = this.selectedDocuments.findIndex(doc => (doc.document_id || doc.id) === id)
      if (index > -1) {
        this.selectedDocuments.splice(index, 1)
      } else {
        const document = this.documents.find(doc => (doc.document_id || doc.id) === id)
        if (document) {
          this.selectedDocuments.push(document)
        }
      }
    },

    toggleAll() {
      const pageDocs = this.paginatedDocuments
      const pageIds = pageDocs.map(doc => doc.document_id || doc.id)
      
      if (this.allSelected) {
        // Deselect all on current page
        this.selectedDocuments = this.selectedDocuments.filter(id => !pageIds.includes(id))
      } else {
        // Select all on current page
        const newSelected = [...this.selectedDocuments]
        pageDocs.forEach(doc => {
          if (!newSelected.find(selectedDoc => (selectedDoc.document_id || selectedDoc.id) === (doc.document_id || doc.id))) {
            newSelected.push(doc)
          }
        })
        this.selectedDocuments = newSelected
      }
    },

    clearSelection() {
      this.selectedDocuments = []
    },

    selectDocuments(ids: (string | number)[]) {
      this.selectedDocuments = [...ids.map(id => this.documents.find(doc => (doc.document_id || doc.id) === id))]
    },


    clearDocuments() {
      this.documents = []
      this.selectedDocuments = []
      this.currentPage = 1
    },

    removeDocument(id: string | number) {
      this.documents = this.documents.filter(doc => doc.id !== id && doc.document_id !== id)
      this.selectedDocuments = this.selectedDocuments.filter(selectedId => selectedId !== id)
    }
  }
})