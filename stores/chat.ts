import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import { usePromptListStore } from './promptList';
import { useAuthStore } from './auth';
import { useConnectionStore } from './connection';

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  loading?: boolean;
  timestamp: Date;
  bookmarked?: boolean;
  userQuery?: string; // Store the user query that triggered this AI response
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const currentPollInterval = ref<NodeJS.Timeout | null>(null);
  const statusPollInterval = ref<NodeJS.Timeout | null>(null);
  const taskResultInterval = ref<NodeJS.Timeout | null>(null);
  const isRequestCompleted = ref(false);
  const lastResultText = ref<string | null>(null);
  const streamingStatus = ref<string>('');
  const showStreamingStatus = ref(false);

  // Get selected document IDs from promptList store
  const getSelectedDocumentIds = () => {
    const promptListStore = usePromptListStore();
    return promptListStore.getDocumentContextIds();
  };

  // Get selected connection IDs for database documents
  const getSelectedConnectionIds = () => {
    const connectionStore = useConnectionStore();
    return connectionStore.getConnectionIds();
  };

  // Get selected model from promptList store
  const getSelectedModel = () => {
    const promptListStore = usePromptListStore();
    return promptListStore.selectedModel.toLowerCase();
  };

  // Generate unique ID for messages
  const generateMessageId = (): string => {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  };

  // Add user message
  const addUserMessage = (content: string): string => {
    const messageId = generateMessageId();
    messages.value.push({
      id: messageId,
      type: 'user',
      content,
      timestamp: new Date()
    });
    return messageId;
  };

  // Add AI message
  const addAIMessage = (content: string, loading = false, userQuery?: string): string => {
    const messageId = generateMessageId();
    messages.value.push({
      id: messageId,
      type: 'ai',
      content,
      loading,
      timestamp: new Date(),
      userQuery
    });
    return messageId;
  };

  // Update message content
  const updateMessage = (messageId: string, content: string, loading = false) => {
    const messageIndex = messages.value.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
      messages.value[messageIndex].content = content;
      messages.value[messageIndex].loading = loading;
    }
  };

  // Remove message
  const removeMessage = (messageId: string) => {
    const messageIndex = messages.value.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
      messages.value.splice(messageIndex, 1);
    }
  };

  // Clear all messages
  const clearMessages = () => {
    messages.value = [];
    error.value = null;
    isRequestCompleted.value = false;
    lastResultText.value = null;
    streamingStatus.value = '';
    showStreamingStatus.value = false;
    stopPolling();
  };

  // Stop current polling
  const stopPolling = () => {
    console.log('Stopping all polling intervals...');
    
    if (currentPollInterval.value) {
      clearInterval(currentPollInterval.value);
      currentPollInterval.value = null;
      console.log('Cleared currentPollInterval');
    }
    if (statusPollInterval.value) {
      clearInterval(statusPollInterval.value);
      statusPollInterval.value = null;
      console.log('Cleared statusPollInterval');
    }
    if (taskResultInterval.value) {
      clearInterval(taskResultInterval.value);
      taskResultInterval.value = null;
      console.log('Cleared taskResultInterval');
    }
    
    isLoading.value = false;
    isRequestCompleted.value = true;
    // Don't hide streaming status immediately - let the completion handler do it
    
    // Force remove loading state from all messages
    messages.value.forEach(msg => {
      if (msg.loading) {
        msg.loading = false;
      }
    });
    
    console.log('All polling stopped and cleanup completed');
  };

  // Handle help request
  const handleHelpRequest = async (userInput: string): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    // Add loading message with userQuery
    const loadingMessageId = addAIMessage('', true, userInput);

    try {
      const response = await fetch('http://34.69.208.233:8040/proxy/get_ai_help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Remove loading message and add actual response
      removeMessage(loadingMessageId);
      addAIMessage(data, false, userInput);
    } catch (err) {
      // Remove loading message and add error
      removeMessage(loadingMessageId);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      addAIMessage('Sorry, I encountered an error while fetching help information. Please try again.', false, userInput);
      error.value = errorMessage;
    } finally {
      isLoading.value = false;
    }
  };

  // Handle regular chat message
  const handleChatMessage = async (userInput: string): Promise<void> => {
    // Add user message
    addUserMessage(userInput);

    // Check if user typed "help"
    if (userInput.toLowerCase().trim() === 'help') {
      await handleHelpRequest(userInput);
    } else {
      // Handle async query
      await handleAsyncQuery(userInput);
    }
  };

  // Helper function to extract text from API response (like React version)
  const extractText = (data: any): string => {
    if (data && data.result && typeof data.result === 'object' && 'text' in data.result) {
      return data.result.text;
    }
    return typeof data.result === 'string' ? data.result : '';
  };

  // Handle async query with React-style polling logic
  const handleAsyncQuery = async (question: string): Promise<void> => {
    console.log('Starting async query for question:', question);
    isLoading.value = true;
    error.value = null;
    lastResultText.value = null;
    streamingStatus.value = '';
    showStreamingStatus.value = true;

    // Add loading AI message
    const loadingMessageId = addAIMessage('', true, question);

    try {
      // Get auth store and token
      const authStore = useAuthStore();
      const userToken = authStore.getToken();
      
      if (!userToken) {
        throw new Error('No authentication token available. Please log in again.');
      }
      
      // Step 1: Start async query
      console.log('Sending start_async_query request...');
      
      // Get selected documents and connection IDs
      const selectedDocumentIds = getSelectedDocumentIds();
      const selectedConnectionIds = getSelectedConnectionIds();
      
      // Get full document details for debugging
      const promptListStore = usePromptListStore();
      const selectedDocDetails = promptListStore.getSelectedDocumentDetails();
      
      console.log('=== SELECTED DOCUMENTS DEBUG ===');
      console.log('Selected document details:', selectedDocDetails);
      selectedDocDetails.forEach(doc => {
        console.log(`Document: ${doc.name}, Dataroom: "${doc.dataroom}", Data_room: "${doc.data_room}"`);
      });
      console.log('Database documents:', promptListStore.getSelectedDatabaseDocuments());
      console.log('Non-database documents:', promptListStore.getSelectedNonDatabaseDocuments());
      console.log('Connection IDs (database names):', selectedConnectionIds);
      console.log('Document context IDs (non-database):', selectedDocumentIds);
      console.log('================================');
      
      // Get selected model
      const selectedModel = getSelectedModel();
      
      // Build API payload based on selection type
      // If database documents are selected, use connection_id and empty document_context
      // If non-database documents are selected, use document_context and empty connection_id
      const hasDatabase = selectedConnectionIds.length > 0;
      const hasDocuments = selectedDocumentIds.length > 0;
      
      const apiPayload = {
        model_id: selectedModel,
        question: question,
        connection_id: hasDatabase ? selectedConnectionIds.join(',') : "",
        document_context: hasDatabase ? [] : selectedDocumentIds,
        token: userToken
      };
      
      console.log('API PAYLOAD LOGIC:');
      console.log('Has database documents:', hasDatabase);
      console.log('Has non-database documents:', hasDocuments);
      console.log('Final connection_id:', apiPayload.connection_id);
      console.log('Final document_context:', apiPayload.document_context);
      
      console.log('DEBUG - API payload:', apiPayload);
      
      const startQueryResponse = await fetch('http://34.69.208.233:8040/proxy/start_async_query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiPayload)
      });

      if (!startQueryResponse.ok) {
        throw new Error(`Failed to start async query: ${startQueryResponse.status}`);
      }

      console.log('start_async_query successful, starting React-style polling...');

      // Stop any existing polling
      stopPolling();

      // Step 2: Start React-style single polling (1 second intervals)
      isRequestCompleted.value = false;
      startReactStylePolling(loadingMessageId);

      // Set a maximum polling time (e.g., 2 minutes) to prevent infinite polling
      setTimeout(() => {
        if (!isRequestCompleted.value) {
          console.log('Request timed out after 2 minutes');
          isRequestCompleted.value = true;
          stopPolling();
          removeMessage(loadingMessageId);
          addAIMessage('Request timed out. Please try again.', false, question);
        }
      }, 120000); // 2 minutes timeout

    } catch (error) {
      console.error('Async query error:', error);
      stopPolling();
      removeMessage(loadingMessageId);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addAIMessage('Sorry, I encountered an error processing your request. Please try again.', false, question);
      error.value = errorMessage;
    }
  };

  // React-style polling that combines status and result checking (like the React version)
  const startReactStylePolling = (loadingMessageId: string) => {
    console.log('Starting React-style polling (1 second intervals)...');
    
    // Clear existing intervals but don't set isRequestCompleted to true
    if (currentPollInterval.value) {
      clearInterval(currentPollInterval.value);
      currentPollInterval.value = null;
    }
    if (statusPollInterval.value) {
      clearInterval(statusPollInterval.value);
      statusPollInterval.value = null;
    }
    if (taskResultInterval.value) {
      clearInterval(taskResultInterval.value);
      taskResultInterval.value = null;
    }
    
    const poll = async () => {
      if (isRequestCompleted.value) {
        console.log('Request completed, stopping polling');
        return;
      }
      
      try {
        // 1. Check streaming status
        const authStore = useAuthStore();
        const userToken = authStore.getToken();
        
        if (!userToken) {
          console.error('No token available for polling');
          stopPolling();
          return;
        }
        
        const statusRes = await fetch('http://34.69.208.233:8040/proxy/get_streaming_status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: userToken
          })
        });

        const statusData = await statusRes.json();
        const statusString = statusData?.result?.toLowerCase() || '';
        console.log('Streaming status:', statusData?.result || '');
        
        // Update streaming status for display
        if (statusData?.result) {
          streamingStatus.value = statusData.result;
        }

        // 2. Get Anvil blob text from get_streaming_status_data
        let anvilText = '';
        try {
          const blobRes = await fetch('http://34.69.208.233:8040/proxy/get_streaming_status_data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token: userToken
            })
          });
          
          if (blobRes.ok) {
            const blobData = await blobRes.json();
            if (blobData && typeof blobData === 'object') {
              if (typeof blobData.text === 'string') {
                anvilText = blobData.text;
              } else if (blobData.result && typeof blobData.result.text === 'string') {
                anvilText = blobData.result.text;
              }
            }
          }
        } catch (e) {
          console.log('No Anvil blob data available');
        }

        // 3. Check if request is completed
        if (statusString.includes('request completed')) {
          // Request completed - get final result and stop polling immediately
          console.log('Request completed detected, getting final result and stopping all polling...');
          
          // Update streaming status to show completion
          streamingStatus.value = 'Request completed - finalizing response...';
          
          // Stop polling immediately
          isRequestCompleted.value = true;
          isLoading.value = false;
          stopPolling();
          
          // Get final result
          const res = await fetch('http://34.69.208.233:8040/proxy/get_task_result', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          });
          
          const data = await res.json();
          let resultText = extractText(data);
          
          // Concatenate Anvil text if present
          if (anvilText && !resultText.includes(anvilText)) {
            resultText = resultText ? resultText + '\n' + anvilText : anvilText;
          }
          
          // Display final result in ChatResponse
          if (resultText && resultText.trim()) {
            console.log('Displaying final result in ChatResponse:', resultText);
            updateMessage(loadingMessageId, resultText, false);
          } else {
            // Use existing content if available
            const currentMessage = messages.value.find(msg => msg.id === loadingMessageId);
            if (currentMessage && currentMessage.content) {
              updateMessage(loadingMessageId, currentMessage.content, false);
            } else {
              updateMessage(loadingMessageId, 'Response completed', false);
            }
          }
          
          // Hide streaming status after 5 seconds to give user time to see completion
          setTimeout(() => {
            showStreamingStatus.value = false;
            streamingStatus.value = '';
          }, 5000);
          
          return; // Exit polling loop
        } else {
          // Request still pending - get task result more frequently for faster updates
          try {
            const res = await fetch('http://34.69.208.233:8040/proxy/get_task_result', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({})
            });
            
            const data = await res.json();
            let resultText = extractText(data);
            
            // Concatenate Anvil text if present and not already included
            if (anvilText && !resultText.includes(anvilText)) {
              resultText = resultText ? resultText + '\n' + anvilText : anvilText;
            }
            
            // Update message immediately if we have any content (faster display)
            if (resultText && resultText.trim() && resultText !== lastResultText.value) {
              lastResultText.value = resultText;
              console.log('Fast updating ChatResponse with result:', resultText);
              updateMessage(loadingMessageId, resultText, true);
            }
          } catch (error) {
            console.error('Error fetching task result:', error);
          }
        }
      } catch (error) {
        console.error('React-style polling error:', error);
      }
    };

    // Start polling immediately, then every 500ms for faster ChatResponse updates
    poll();
    currentPollInterval.value = setInterval(poll, 500);
  };

  // Function to poll get_task_result every 1 second (only when request is pending)
  const startTaskResultPolling = (loadingMessageId: string) => {
    console.log('Starting get_task_result polling every 1 second...');
    
    const checkTaskResult = async () => {
      // CRITICAL: Only poll if request is not completed yet
      if (isRequestCompleted.value) {
        console.log('Request completed flag detected, stopping get_task_result polling immediately');
        if (taskResultInterval.value) {
          clearInterval(taskResultInterval.value);
          taskResultInterval.value = null;
        }
        return;
      }
      
      try {
        console.log('Polling get_task_result (request still pending)...');
        const taskResultResponse = await fetch('http://34.69.208.233:8040/proxy/get_task_result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });

        if (taskResultResponse.ok) {
          const resultData = await taskResultResponse.json();
          console.log('get_task_result response:', resultData);
          
          // Double-check: Only update if request is still pending
          if (resultData && resultData.result && !isRequestCompleted.value) {
            let responseText = '';
            
            // Handle different response formats
            if (typeof resultData.result === 'object' && resultData.result.text) {
              responseText = resultData.result.text;
            } else if (typeof resultData.result === 'string') {
              responseText = resultData.result;
            }
            
            // Clean up the response text
            if (responseText) {
              responseText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
            }
            
            if (responseText && responseText.trim()) {
              console.log('Updating message with streaming result:', responseText);
              updateMessage(loadingMessageId, responseText, true);
            }
          } else if (isRequestCompleted.value) {
            console.log('Request completed during get_task_result call, stopping polling');
            if (taskResultInterval.value) {
              clearInterval(taskResultInterval.value);
              taskResultInterval.value = null;
            }
          }
        }
      } catch (error) {
        console.error('get_task_result polling error:', error);
      }
    };

    // Start polling immediately, then every 1000ms (1 second)
    checkTaskResult();
    taskResultInterval.value = setInterval(checkTaskResult, 1000);
  };

  // Get and display the final LLM result when request is completed
  const getAndShowFinalResult = async (loadingMessageId: string) => {
    try {
      console.log('Getting final LLM result...');
      
      // Check if current message already has content from streaming
      const currentMessage = messages.value.find(msg => msg.id === loadingMessageId);
      if (currentMessage && currentMessage.content && currentMessage.content.trim()) {
        // Use existing streaming content and just remove loading state
        console.log('Using existing streaming content as final result');
        updateMessage(loadingMessageId, currentMessage.content, false);
        return;
      }

      // If no streaming content, fetch final result
      const taskResultResponse = await fetch('http://34.69.208.233:8040/proxy/get_task_result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (taskResultResponse.ok) {
        const resultData = await taskResultResponse.json();
        console.log('Final LLM result:', resultData);
        
        let finalResponse = '';
        if (resultData && resultData.result) {
          // Handle different response formats
          if (typeof resultData.result === 'object' && resultData.result.text) {
            finalResponse = resultData.result.text;
          } else if (typeof resultData.result === 'string') {
            finalResponse = resultData.result;
          }
        }

        // Clean up the response text
        if (finalResponse) {
          finalResponse = finalResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
        }

        // Display the final LLM response
        if (finalResponse && finalResponse.trim()) {
          console.log('Displaying final LLM response:', finalResponse);
          updateMessage(loadingMessageId, finalResponse, false);
        } else {
          // Last fallback
          removeMessage(loadingMessageId);
          addAIMessage('No response received from the AI model.', false);
        }
      } else {
        console.error('Failed to get final result:', taskResultResponse.status);
        removeMessage(loadingMessageId);
        addAIMessage('Failed to retrieve the AI response.', false);
      }
    } catch (error) {
      console.error('Error getting final result:', error);
      // Try to use existing content if available
      const currentMessage = messages.value.find(msg => msg.id === loadingMessageId);
      if (currentMessage && currentMessage.content && currentMessage.content.trim()) {
        updateMessage(loadingMessageId, currentMessage.content, false);
      } else {
        removeMessage(loadingMessageId);
        addAIMessage('Error retrieving the AI response.', false);
      }
    }
  };



  // Get chat mode status
  const isChatMode = computed(() => messages.value.length > 0);

  return {
    // State
    messages: readonly(messages),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isChatMode,
    isRequestCompleted: readonly(isRequestCompleted),
    streamingStatus: readonly(streamingStatus),
    showStreamingStatus: readonly(showStreamingStatus),

    // Actions
    addUserMessage,
    addAIMessage,
    updateMessage,
    removeMessage,
    clearMessages,
    stopPolling,
    handleHelpRequest,
    handleChatMessage,
    handleAsyncQuery
  };
});