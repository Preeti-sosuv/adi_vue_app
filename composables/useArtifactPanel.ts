import { ref, reactive, watch } from 'vue';

interface ArtifactData {
  type: 'data' | 'help' | 'analysis';
  title: string;
  connectionId?: string;
  datasetId?: string;
  sql?: string;
  helpContent?: string;
  maxRows?: number;
}

// Create singleton state outside the composable
const isOpen = ref(false);
const currentArtifact = reactive<ArtifactData>({
  type: 'data',
  title: 'Data Viewer'
});

export const useArtifactPanel = () => {

  const openDataViewer = (data: {
    title?: string;
    connectionId: string;
    datasetId: string;
    sql?: string;
    maxRows?: number;
  }) => {
    Object.assign(currentArtifact, {
      type: 'data',
      title: data.title || `${data.connectionId} :: ${data.datasetId}`,
      connectionId: data.connectionId,
      datasetId: data.datasetId,
      sql: data.sql,
      maxRows: data.maxRows || 50,
      helpContent: undefined
    });
    isOpen.value = true;
  };

  const openHelpViewer = (helpContent: string, title = 'Help & Analysis') => {
    console.log('useArtifactPanel: openHelpViewer called with title:', title);
    Object.assign(currentArtifact, {
      type: 'help',
      title,
      helpContent,
      connectionId: undefined,
      datasetId: undefined,
      sql: undefined
    });
    isOpen.value = true;
    console.log('useArtifactPanel: isOpen set to:', isOpen.value);
    console.log('useArtifactPanel: currentArtifact:', currentArtifact);
  };

  const openAnalysisViewer = (data: {
    title: string;
    content: string;
  }) => {
    Object.assign(currentArtifact, {
      type: 'analysis',
      title: data.title,
      helpContent: data.content,
      connectionId: undefined,
      datasetId: undefined,
      sql: undefined
    });
    isOpen.value = true;
  };

  const closePanel = () => {
    isOpen.value = false;
  };

  // Panel layout is now handled directly by the ArtifactPanel component

  const createViewDataButton = (data: {
    connectionId: string;
    datasetId: string;
    sql?: string;
  }) => {
    return {
      text: 'View Data',
      icon: 'fa:binoculars',
      onClick: () => openDataViewer(data)
    };
  };

  const createViewAnalysisButton = (content: string, title = 'View Analysis') => {
    return {
      text: title,
      icon: 'fa:chart-line',
      onClick: () => openAnalysisViewer({ title, content })
    };
  };

  return {
    isOpen,
    currentArtifact,
    openDataViewer,
    openHelpViewer,
    openAnalysisViewer,
    closePanel,
    createViewDataButton,
    createViewAnalysisButton
  };
};