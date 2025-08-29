import { defineStore } from 'pinia'

interface ModelOption {
  name: string
  description: string
}

interface ModelSelectionState {
  selectedModel: string
  showModelSelection: boolean
  externalModels: ModelOption[]
  internalModels: ModelOption[]
}

export const useModelSelectionStore = defineStore('modelSelection', {
  state: (): ModelSelectionState => ({
    selectedModel: 'Gemini',
    showModelSelection: false,
    externalModels: [
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
    ],
    internalModels: [
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
    ]
  }),

  getters: {
    allModels: (state) => [...state.externalModels, ...state.internalModels],
    
    selectedModelInfo: (state) => {
      return [...state.externalModels, ...state.internalModels]
        .find(model => model.name === state.selectedModel)
    },

    isModelSelected: (state) => (modelName: string) => {
      return state.selectedModel === modelName
    }
  },

  actions: {
    setSelectedModel(modelName: string) {
      this.selectedModel = modelName
    },

    openModelSelection() {
      this.showModelSelection = true
    },

    closeModelSelection() {
      this.showModelSelection = false
    },

    toggleModelSelection() {
      this.showModelSelection = !this.showModelSelection
    },

    selectModel(model: ModelOption) {
      this.setSelectedModel(model.name)
      this.closeModelSelection()
    }
  }
})