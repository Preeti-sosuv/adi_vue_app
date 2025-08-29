import { defineStore } from 'pinia'
import axios from 'axios'
import { useConnectionStore } from './connection'

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

export const usePromptListStore = defineStore('promptList', {
  state: () => ({
    prompts: [],
    documents: [] as Document[],
    selectedDocuments: [] as (string | number)[],
    showPopover: false,
    showPromptContentModel: false,
    showModelSelection: false,
    selectedModel: 'Gemini',
    popoverData: null as ApiResponse | Document[] | null,
    promptContentData: null as ApiResponse | Document[] | null,
    loading: false,
    error: null as string | null,
    // Pagination state
    currentPage: 1,
    pageSize: 10,
    // Sorting state
    sortField: 'name',
    sortDirection: 'asc' as 'asc' | 'desc'
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

    // Check if data is documents format
    isDocumentsData: (state) => {
      if (!state.promptContentData || typeof state.promptContentData !== 'object') return false
      const data = state.promptContentData as any
      // Check if it's an array of documents
      if (Array.isArray(data.documents || data.data || data)) return true
      // Check if it's a single document object with document_id
      if (data.document_id || data.result) return true
      return false
    }
  },

  actions: {
    // API Actions
    async addToPromptList(payload: any) {
      const baseURL = 'http://34.69.208.233:8040/proxy'
      const response = await axios.post(`${baseURL}/add_to_prompt_list`, payload)
      this.prompts.push(response.data)
      return response.data
    },

    async getPromptList(baseURL: string, token: string) {
      this.loading = true
      this.error = null
      
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }

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
        const body = { token }
        
        console.log('Fetching prompt list:', { 
          url: `${resolvedBaseURL}/get_prompt_list`,
          token: token ? token.substring(0, 10) + '...' : 'No token'
        })
        
        const response = await axios.post(`${resolvedBaseURL}/get_prompt_list`, body, { headers })
        
        // Extract prompts from the API response
        const data = response.data as any
        let extractedPrompts: string[] = []
        
        // Handle null or undefined response
        if (!data) {
          console.warn('API returned null/undefined response for getPromptList')
          this.popoverData = []
          this.showPopover = true
          return
        }
        
        if (data.result && Array.isArray(data.result)) {
          // If result is an array, extract prompt strings
          extractedPrompts = data.result
            .map((item: any) => item?.prompt || item)
            .filter((p: unknown) => typeof p === 'string' && (p as string).trim().length > 0)
        } else if (data.prompts && Array.isArray(data.prompts)) {
          // If prompts is an array
          extractedPrompts = data.prompts
            .map((item: any) => item?.prompt || item)
            .filter((p: unknown) => typeof p === 'string' && (p as string).trim().length > 0)
        } else if (Array.isArray(data)) {
          // If the response itself is an array
          extractedPrompts = data
            .map((item: any) => item?.prompt || item)
            .filter((p: unknown) => typeof p === 'string' && (p as string).trim().length > 0)
        }
        
        // Remove duplicates
        extractedPrompts = [...new Set(extractedPrompts)]
        
        console.log('Extracted prompts:', extractedPrompts)
        
        this.popoverData = extractedPrompts.length > 0 ? extractedPrompts : (data || [])
        this.showPopover = true
        
      } catch (error: any) {
        this.error = 'Failed to get prompt list.'
        this.popoverData = {
          error: 'Failed to get prompt list.',
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data || error?.message || String(error)
        }
        this.showPopover = true
      } finally {
        this.loading = false
      }
    },

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
        this.promptContentData = response.data
        this.showPromptContentModel = true
        
        // Extract documents array from response
        const data = response.data as any
        console.log('API Response:', data) // Debug log
        console.log('Response type:', typeof data) // Debug log
        console.log('Is array:', Array.isArray(data)) // Debug log
        
        let extractedDocs: any[] = []
        
        if (data.result && Array.isArray(data.result) && data.result.length === 2) {
          // If result is [true, [array_of_documents]], extract the documents array
          if (data.result[0] === true && Array.isArray(data.result[1])) {
            extractedDocs = data.result[1]
            console.log('Extracted from result[1] (documents array):', extractedDocs)
          } else if (data.result[1] && !Array.isArray(data.result[1])) {
            // If result is [true, single_document], extract the single document
            extractedDocs = [data.result[1]]
            console.log('Extracted from result[1] (single document):', extractedDocs)
          }
        } else if (data.result && Array.isArray(data.result) && data.result.length > 2) {
          // If result is [true, doc1, doc2, ...], extract all documents after the first element
          extractedDocs = data.result.slice(1)
          console.log('Extracted from result slice:', extractedDocs)
        } else if (data.result && Array.isArray(data.result)) {
          // If result is an array of documents (without the true flag)
          extractedDocs = data.result
          console.log('Extracted from result array:', extractedDocs)
        } else if (data.documents && Array.isArray(data.documents)) {
          // If documents is an array
          extractedDocs = data.documents
          console.log('Extracted from documents array:', extractedDocs)
        } else if (data.data && Array.isArray(data.data)) {
          // If data is an array
          extractedDocs = data.data
          console.log('Extracted from data array:', extractedDocs)
        } else if (data.document_id || (data.result && !Array.isArray(data.result))) {
          // If it's a single document object
          extractedDocs = [data]
          console.log('Extracted as single document:', extractedDocs)
        } else if (Array.isArray(data)) {
          // If the response itself is an array
          extractedDocs = data
          console.log('Extracted from direct array:', extractedDocs)
        } else {
          // Try to extract from documents or data arrays
          extractedDocs = data.documents || data.data || data || []
          console.log('Extracted from fallback:', extractedDocs)
        }
        
        // Ensure we have an array of objects with proper structure
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
              ...doc // Include all other properties
            }
          } else {
            // If it's not an object, create a basic structure
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
        
        console.log('Final processed documents:', this.documents) // Debug log
        
        // Initialize connection store with database documents
        const connectionStore = useConnectionStore()
        connectionStore.initializeFromDocuments(this.documents)
        
      } catch (error: any) {
        this.error = 'Failed to get documents.'
        this.promptContentData = {
          error: 'Failed to get documents.',
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data || error?.message || String(error)
        }
        this.showPromptContentModel = true
      } finally {
        this.loading = false
      }
    },

    async addPromptToBookmark(baseURL: string, token: string, inputText: string) {
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
          prompt: inputText,
          model: 'Claude',
          prompt_type: 'DOC_SEARCH',
          token
        }

        const response = await axios.post(`${resolvedBaseURL}/add_to_prompt_list`, body, { headers })
        const results = Array.isArray((response.data as any)?.result)
          ? (response.data as any).result
          : []
        const promptsOnly = results
          .map((item: any) => item?.prompt)
          .filter((p: unknown) => typeof p === 'string' && (p as string).trim().length > 0)
        
        this.popoverData = promptsOnly
        this.showPopover = true
        
      } catch (error: any) {
        this.error = 'Failed to add to prompt list.'
        this.popoverData = {
          error: 'Failed to add to prompt list.',
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data || error?.message || String(error)
        }
        this.showPopover = true
      } finally {
        this.loading = false
      }
    },

    // UI Actions
    closePopover() {
      this.showPopover = false
      this.popoverData = null
    },

    closePromptContentModel() {
      this.showPromptContentModel = false
      this.promptContentData = null
    },

    closeModelSelection() {
      this.showModelSelection = false
    },

    setSelectedModel(model: string) {
      this.selectedModel = model
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

    // Sorting Actions
    sortBy(field: string) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortDirection = 'asc'
      }
    },

    // Selection Actions
    toggleDocument(id: string | number) {
      const index = this.selectedDocuments.indexOf(id)
      const connectionStore = useConnectionStore()
      
      if (index > -1) {
        this.selectedDocuments.splice(index, 1)
        
        // If it's a database document, deselect from connection store
        const doc = this.documents.find(d => (d.id || d.document_id) === id)
        if (doc && (doc.dataroom || doc.data_room || '').toLowerCase() === 'database') {
          const connectionId = `db_${doc.id || doc.document_id}`
          connectionStore.deselectConnection(connectionId)
        }
      } else {
        this.selectedDocuments.push(id)
        
        // If it's a database document, select in connection store
        const doc = this.documents.find(d => (d.id || d.document_id) === id)
        if (doc && (doc.dataroom || doc.data_room || '').toLowerCase() === 'database') {
          const connectionId = `db_${doc.id || doc.document_id}`
          connectionStore.selectConnection(connectionId)
        }
      }
      
      // Debug logging
      console.log('Selected documents:', this.selectedDocuments)
      console.log('Selected document details:', this.documents.filter(doc => 
        this.selectedDocuments.includes(doc.id || doc.document_id || 0)
      ))
    },

    toggleAll() {
      const pageDocs = this.paginatedDocuments
      const pageIds = pageDocs.map(doc => doc.id || pageDocs.indexOf(doc))
      
      if (this.allSelected) {
        // Deselect all on current page
        this.selectedDocuments = this.selectedDocuments.filter(id => !pageIds.includes(id))
      } else {
        // Select all on current page
        const newSelected = [...this.selectedDocuments]
        pageIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id)
          }
        })
        this.selectedDocuments = newSelected
      }
    },

    clearSelection() {
      this.selectedDocuments = []
      
      // Also clear connection selection
      const connectionStore = useConnectionStore()
      connectionStore.clearSelection()
    },

    // Get selected documents with their details
    getSelectedDocumentDetails() {
      return this.documents.filter(doc => 
        this.selectedDocuments.includes(doc.id || doc.document_id || 0)
      )
    },

    // Get database documents (dataroom === "database")
    getSelectedDatabaseDocuments() {
      const selectedDocs = this.getSelectedDocumentDetails()
      return selectedDocs.filter(doc => {
        const dataroom = (doc.dataroom || doc.data_room || '').toLowerCase()
        return dataroom === "database"
      })
    },

    // Get non-database documents
    getSelectedNonDatabaseDocuments() {
      const selectedDocs = this.getSelectedDocumentDetails()
      return selectedDocs.filter(doc => {
        const dataroom = (doc.dataroom || doc.data_room || '').toLowerCase()
        return dataroom !== "database"
      })
    },

    // Get connection IDs for database documents
    getConnectionIds() {
      const connectionStore = useConnectionStore()
      return connectionStore.getConnectionIds()
    },

    // Get document IDs for non-database documents
    getDocumentContextIds() {
      const nonDatabaseDocs = this.getSelectedNonDatabaseDocuments()
      return nonDatabaseDocs.map(doc => doc.id || doc.document_id).filter(id => id !== undefined)
    },

    // Legacy method - kept for backward compatibility
    getSelectedDatabaseId() {
      const connectionIds = this.getConnectionIds()
      return connectionIds.length > 0 ? connectionIds[0] : ""
    },

    // Add uploaded document to the documents list
    addUploadedDocument(documentData: any) {
      const doc = {
        id: documentData.document_id,
        document_id: documentData.document_id,
        dataroom: documentData.dataroom || 'General',
        data_room: documentData.dataroom || 'General',
        classification: documentData.classification || 'Document',
        name: documentData.document_name,
        categorisation: documentData.categorization || 'Public',
        loaded: new Date(documentData.upload_date).toLocaleDateString(),
        source: 'File Upload',
        document_source: 'File Upload',
        document_notes: documentData.notes,
        content_type: documentData.document_type,
        size: documentData.size
      }
      
      // Add to beginning of documents array so it appears first
      this.documents.unshift(doc)
      
      console.log('Document added to store:', doc)
    }
  }
})