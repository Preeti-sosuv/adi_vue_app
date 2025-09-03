import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface ConnectionField {
  field_name: string;
  type: string;
  mandatory: boolean;
  placeholder?: string;
}

interface ConnectionType {
  connection_tech: string;
  fields: ConnectionField[];
}

interface Connection {
  connection_id: string;
  connection_tech: string;
  connection_desc: string;
  connection_data: Record<string, any>;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  org_id?: string;
  dept_id?: string;
  lastConnected?: Date;
  connection_capability?: {
    access: Record<string, boolean>;
  };
}

export const useConnectionStore = defineStore('connection', () => {
  const connections = ref<Connection[]>([]);
  const selectedConnectionIds = ref<string[]>([]);
  const connectionTypes = ref<ConnectionType[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed properties
  const selectedConnections = computed(() => 
    connections.value.filter(conn => selectedConnectionIds.value.includes(conn.connection_id))
  );

  const activeConnections = computed(() => 
    connections.value.filter(conn => conn.status === 'ACTIVE')
  );

  const selectedConnectionNames = computed(() => 
    selectedConnections.value.map(conn => conn.connection_id)
  );

  // Actions
  const addConnection = (connection: Connection) => {
    const existingIndex = connections.value.findIndex(conn => conn.connection_id === connection.connection_id);
    if (existingIndex !== -1) {
      connections.value[existingIndex] = connection;
    } else {
      connections.value.push(connection);
    }
  };

  const removeConnection = (connectionId: string) => {
    const index = connections.value.findIndex(conn => conn.connection_id === connectionId);
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
    const connection = connections.value.find(conn => conn.connection_id === connectionId);
    if (connection) {
      connection.status = status;
      if (status === 'ACTIVE') {
        connection.lastConnected = new Date();
      }
    }
  };

  const setConnectionTypes = (types: ConnectionType[]) => {
    connectionTypes.value = types;
  };

  const getConnectionType = (connectionTech: string) => {
    return connectionTypes.value.find(type => type.connection_tech === connectionTech);
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
    selectedConnectionIds.value = connections.value.map(conn => conn.connection_id);
  };

  const getConnection = (connectionId: string) => {
    return connections.value.find(conn => conn.connection_id === connectionId);
  };

  const getConnectionByName = (name: string) => {
    return connections.value.find(conn => conn.connection_id === name);
  };

  // Get selected connection IDs (for backward compatibility)
  const getConnectionIds = () => {
    return selectedConnectionNames.value.filter(name => name && name !== '-');
  };

  // Test connection
  const testConnection = async (connection: Connection): Promise<{ success: boolean; results?: Record<string, boolean> }> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // This would be replaced with actual API call to test connection
      // For now, simulate a connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults = {
        create: true,
        read: true,
        write: true,
        delete: false,
        schema: true
      };
      
      updateConnectionStatus(connection.connection_id, 'ACTIVE');
      return { success: true, results: mockResults };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      error.value = errorMessage;
      updateConnectionStatus(connection.connection_id, 'ERROR');
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  // Save connection (create or update)
  const saveConnection = async (connectionData: Omit<Connection, 'lastConnected'>, isUpdate: boolean = false): Promise<{ success: boolean; message?: string }> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const connection: Connection = {
        ...connectionData,
        lastConnected: new Date()
      };
      
      addConnection(connection);
      
      return {
        success: true,
        message: isUpdate ? `Updated Connection '${connection.connection_id}'` : `Created new Connection '${connection.connection_id}'`
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save connection';
      error.value = errorMessage;
      return { success: false, message: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };

  // Delete connection
  const deleteConnection = async (connectionId: string): Promise<{ success: boolean; message?: string }> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      removeConnection(connectionId);
      
      return {
        success: true,
        message: `Deleted Connection '${connectionId}'`
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete connection';
      error.value = errorMessage;
      return { success: false, message: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };

  // Fetch connection types from get_connection_type API (following Anvil logic exactly)
  const fetchConnectionTypes = async (): Promise<{ success: boolean; message?: string }> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Get auth token from auth store
      const { useAuthStore } = await import('./auth');
      const authStore = useAuthStore();
      const token = authStore.getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      console.log('🔍 Fetching connection types from API (Anvil logic)...');
      console.log('🔑 Using token:', token.substring(0, 10) + '...');
      
      const response = await fetch('http://34.69.208.233:8040/proxy/get_connection_type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          connection_tech: '',
          token: token
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📄 Raw API response:', JSON.stringify(data, null, 2));
      console.log('📄 Response keys:', Object.keys(data || {}));
      console.log('📄 Response type:', typeof data);
      
      // Let's also log the raw response text to see if there's any parsing issue
      console.log('📄 Response as string:', JSON.stringify(data));
      
      // Parse different possible response formats
      let authed = false;
      let connection_types = [];
      
      if (data && data.result && Array.isArray(data.result) && data.result.length >= 2) {
        console.log('✅ Format 1: Anvil server.call format with result array');
        authed = data.result[0];
        connection_types = data.result[1];
        console.log('📋 Format 1 - Authed:', authed, 'Types array length:', connection_types?.length);
      } else if (data && data.results && Array.isArray(data.results) && data.results.length >= 2) {
        console.log('✅ Format 2: Anvil server.call format with results array');
        authed = data.results[0];
        connection_types = data.results[1];
        console.log('📋 Format 2 - Authed:', authed, 'Types array length:', connection_types?.length);
      } else if (data && data.result && Array.isArray(data.result)) {
        console.log('✅ Format 3: data.result array format (direct)');
        authed = true;
        connection_types = data.result;
      } else if (Array.isArray(data)) {
        console.log('✅ Format 4: Direct array format');
        authed = true;
        connection_types = data;
      } else if (data && data.connection_types && Array.isArray(data.connection_types)) {
        console.log('✅ Format 5: data.connection_types format');
        authed = true;
        connection_types = data.connection_types;
      } else if (data && data.data && Array.isArray(data.data)) {
        console.log('✅ Format 6: data.data format');
        authed = true;
        connection_types = data.data;
      } else if (data && typeof data === 'object') {
        console.log('✅ Format 7: Single object, wrapping in array');
        authed = true;
        connection_types = [data];
      } else {
        console.log('❌ Unhandled response format:', {
          type: typeof data,
          isArray: Array.isArray(data),
          keys: data ? Object.keys(data) : 'null',
          hasResults: !!data?.results,
          hasResult: !!data?.result,
          resultsType: typeof data?.results,
          resultsLength: data?.results?.length,
          resultsIsArray: Array.isArray(data?.results),
          fullResults: data?.results
        });
        // Don't throw error, set empty array and continue
        authed = true;
        connection_types = [];
      }

      console.log('📋 Parsed - Authed:', authed, 'Connection types:', Array.isArray(connection_types), connection_types?.length);

      if (!authed) {
        throw new Error('Not authorized to access connection types');
      }

      if (!Array.isArray(connection_types)) {
        console.log('⚠️ Connection types is not an array, converting...');
        connection_types = connection_types ? [connection_types] : [];
      }

      console.log('📋 Raw connection types from API:', connection_types.length, 'items');

      // Apply Anvil filtering logic:
      // 1. Remove ADI_LocalDB connections
      console.log('📋 Before filtering - connection types:', connection_types.map((c: any) => c?.connection_tech || c?.connection_type || 'no_tech'));
      console.log('📋 Sample connection object:', connection_types[0]);
      
      const valid_connections = connection_types.filter((connection: any) => {
        // Try both possible field names
        const tech = connection?.connection_tech || connection?.connection_type;
        const shouldKeep = connection && tech && tech !== 'ADI_LocalDB';
        console.log('📋 Filtering:', tech, 'Keep?', shouldKeep);
        return shouldKeep;
      });

      console.log('📋 After ADI_LocalDB filtering:', valid_connections.length, 'items');
      console.log('📋 Kept connection types:', valid_connections.map((c: any) => c?.connection_tech));

      // 2. Transform to connection_list format: [(connection_tech, fields), ...]
      const connection_list = valid_connections.map((r: any) => [
        r.connection_tech || r.connection_type,
        r.connection_params?.fields || []
      ]);

      console.log('📋 Connection list format:', connection_list);

      // For now, skip the user permissions filtering (allowed_list logic)
      // In production, you would need to implement this based on your auth system
      const auth_list = connection_list;

      console.log('📋 Final auth_list:', auth_list.length, 'items');

      // Transform to our interface format
      const transformedTypes: ConnectionType[] = auth_list.map(([connection_tech, fields]: [string, any[]]) => {
        const transformedFields: ConnectionField[] = fields.map((field: any[]) => ({
          field_name: field[0] || '',
          type: field[1] === 'secret' ? 'secret' : 'text',
          mandatory: field[2] === 'Mandatory',
          placeholder: field[3] || `Enter ${field[0]?.replace(/_/g, ' ')}`
        }));

        return {
          connection_tech: connection_tech || 'Unknown',
          fields: transformedFields
        };
      });

      connectionTypes.value = transformedTypes;
      console.log(`✅ Successfully loaded ${transformedTypes.length} connection types`);
      console.log('✅ Connection types:', transformedTypes.map(t => t.connection_tech));
      
      return { success: true };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch connection types';
      error.value = errorMessage;
      console.error('❌ Error fetching connection types:', err);
      
      // Don't use fallback - let the user know there's an issue
      connectionTypes.value = [];
      
      return { success: false, message: errorMessage };
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize connection types by fetching from API
  const initializeConnectionTypes = async () => {
    console.log('🏪 STORE - initializeConnectionTypes called');
    console.log('🏪 Current connectionTypes length before fetch:', connectionTypes.value.length);
    
    const result = await fetchConnectionTypes();
    
    console.log('🏪 Fetch result:', result);
    console.log('🏪 Current connectionTypes length after fetch:', connectionTypes.value.length);
    console.log('🏪 connectionTypes content:', connectionTypes.value.map(t => t.connection_tech));
    
    return result;
  };

  // Initialize with existing database connections from documents
  const initializeFromDocuments = (documents: any[]) => {
    // Initialize connection types first
    initializeConnectionTypes();
    
    const databaseDocs = documents.filter(doc => {
      const dataroom = (doc.dataroom || doc.data_room || '').toLowerCase();
      return dataroom === 'database';
    });

    databaseDocs.forEach(doc => {
      if (doc.name && doc.name !== '-') {
        const existingConnection = getConnectionByName(doc.name);
        if (!existingConnection) {
          addConnection({
            connection_id: doc.name,
            connection_tech: 'PostgreSQL - Direct',
            connection_desc: doc.source || 'Database connection',
            connection_data: {},
            status: 'ACTIVE'
          });
        }
      }
    });
  };

  return {
    // State
    connections: computed(() => connections.value),
    selectedConnectionIds: computed(() => selectedConnectionIds.value),
    connectionTypes: computed(() => connectionTypes.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Computed
    selectedConnections,
    activeConnections,
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
    setConnectionTypes,
    getConnectionType,
    testConnection,
    saveConnection,
    deleteConnection,
    initializeFromDocuments,
    initializeConnectionTypes,
    fetchConnectionTypes
  };
});