import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Connection {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file';
  status: 'active' | 'inactive' | 'error';
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  lastConnected?: Date;
  metadata?: Record<string, any>;
}

export const useConnectionStore = defineStore('connection', () => {
  const connections = ref<Connection[]>([]);
  const selectedConnectionIds = ref<string[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const selectedConnections = computed(() => 
    connections.value.filter(conn => selectedConnectionIds.value.includes(conn.id))
  );

  const activeConnections = computed(() => 
    connections.value.filter(conn => conn.status === 'active')
  );

  const databaseConnections = computed(() => 
    connections.value.filter(conn => conn.type === 'database')
  );

  const selectedConnectionNames = computed(() => 
    selectedConnections.value.map(conn => conn.name)
  );

  // Actions
  const addConnection = (connection: Connection) => {
    const existingIndex = connections.value.findIndex(conn => conn.id === connection.id);
    if (existingIndex !== -1) {
      connections.value[existingIndex] = connection;
    } else {
      connections.value.push(connection);
    }
  };

  const removeConnection = (connectionId: string) => {
    const index = connections.value.findIndex(conn => conn.id === connectionId);
    if (index !== -1) {
      connections.value.splice(index, 1);
      // Also remove from selected if it was selected
      const selectedIndex = selectedConnectionIds.value.indexOf(connectionId);
      if (selectedIndex !== -1) {
        selectedConnectionIds.value.splice(selectedIndex, 1);
      }
    }
  };

  const updateConnectionStatus = (connectionId: string, status: Connection['status']) => {
    const connection = connections.value.find(conn => conn.id === connectionId);
    if (connection) {
      connection.status = status;
      if (status === 'active') {
        connection.lastConnected = new Date();
      }
    }
  };

  const toggleConnectionSelection = (connectionId: string) => {
    const index = selectedConnectionIds.value.indexOf(connectionId);
    if (index !== -1) {
      selectedConnectionIds.value.splice(index, 1);
    } else {
      selectedConnectionIds.value.push(connectionId);
    }
  };

  const selectConnection = (connectionId: string) => {
    if (!selectedConnectionIds.value.includes(connectionId)) {
      selectedConnectionIds.value.push(connectionId);
    }
  };

  const deselectConnection = (connectionId: string) => {
    const index = selectedConnectionIds.value.indexOf(connectionId);
    if (index !== -1) {
      selectedConnectionIds.value.splice(index, 1);
    }
  };

  const clearSelection = () => {
    selectedConnectionIds.value = [];
  };

  const selectAll = () => {
    selectedConnectionIds.value = connections.value.map(conn => conn.id);
  };

  const getConnection = (connectionId: string) => {
    return connections.value.find(conn => conn.id === connectionId);
  };

  const getConnectionByName = (name: string) => {
    return connections.value.find(conn => conn.name === name);
  };

  // Get selected connection IDs (for backward compatibility)
  const getConnectionIds = () => {
    return selectedConnectionNames.value.filter(name => name && name !== '-');
  };

  // Test connection
  const testConnection = async (connection: Connection): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // This would be replaced with actual connection testing logic
      // For now, simulate a connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateConnectionStatus(connection.id, 'active');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      error.value = errorMessage;
      updateConnectionStatus(connection.id, 'error');
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize with existing database connections from documents
  const initializeFromDocuments = (documents: any[]) => {
    const databaseDocs = documents.filter(doc => {
      const dataroom = (doc.dataroom || doc.data_room || '').toLowerCase();
      return dataroom === 'database';
    });

    databaseDocs.forEach(doc => {
      if (doc.name && doc.name !== '-') {
        const existingConnection = getConnectionByName(doc.name);
        if (!existingConnection) {
          addConnection({
            id: `db_${doc.id || doc.document_id}`,
            name: doc.name,
            type: 'database',
            status: 'active',
            metadata: {
              documentId: doc.id || doc.document_id,
              source: doc.source || doc.document_source
            }
          });
        }
      }
    });
  };

  return {
    // State
    connections: computed(() => connections.value),
    selectedConnectionIds: computed(() => selectedConnectionIds.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Computed
    selectedConnections,
    activeConnections,
    databaseConnections,
    selectedConnectionNames,

    // Actions
    addConnection,
    removeConnection,
    updateConnectionStatus,
    toggleConnectionSelection,
    selectConnection,
    deselectConnection,
    clearSelection,
    selectAll,
    getConnection,
    getConnectionByName,
    getConnectionIds,
    testConnection,
    initializeFromDocuments
  };
});