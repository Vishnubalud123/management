import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

const useStages = (initialStages = []) => {
  const [stages, setStages, removeStages] = useLocalStorage('construction-stages', initialStages);

  // Stage statistics
  const stageStats = useMemo(() => {
    const totalStages = stages.length;
    const completedStages = stages.filter(stage => stage.status === 'completed').length;
    const inProgressStages = stages.filter(stage => stage.status === 'in-progress').length;
    const pendingStages = stages.filter(stage => stage.status === 'pending').length;
    
    const totalCost = stages.reduce((sum, stage) => sum + stage.amount, 0);
    const totalPaid = stages.reduce((sum, stage) => sum + stage.paid, 0);
    const totalBalance = totalCost - totalPaid;
    
    const overallProgress = stages.reduce((sum, stage) => {
      return stage.status === 'completed' ? sum + stage.percentage : sum;
    }, 0);

    const currentStage = stages.find(stage => stage.status === 'in-progress') || 
                        stages.find(stage => stage.status === 'completed');

    // Timeline analysis
    const startedStages = stages.filter(stage => stage.date && stage.status !== 'pending');
    const averageDuration = startedStages.length > 0 
      ? startedStages.reduce((sum, stage) => {
          const startDate = new Date(stage.date);
          const endDate = stage.status === 'completed' ? new Date() : new Date(stage.updatedAt || stage.date);
          return sum + (endDate - startDate);
        }, 0) / startedStages.length
      : 0;

    return {
      totalStages,
      completedStages,
      inProgressStages,
      pendingStages,
      totalCost,
      totalPaid,
      totalBalance,
      overallProgress,
      currentStage: currentStage?.name || 'Not Started',
      completionPercentage: Math.round((completedStages / totalStages) * 100) || 0,
      financialProgress: Math.round((totalPaid / totalCost) * 100) || 0,
      averageDuration: averageDuration / (1000 * 60 * 60 * 24) // Convert to days
    };
  }, [stages]);

  // Add stage
  const addStage = useCallback((stageData) => {
    const newStage = {
      ...stageData,
      id: `stage-${Date.now()}`,
      paid: stageData.paid || 0,
      status: stageData.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setStages(prev => [...prev, newStage]);
    return newStage;
  }, [setStages]);

  // Update stage
  const updateStage = useCallback((stageId, updatedData) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId 
        ? { ...stage, ...updatedData, updatedAt: new Date().toISOString() }
        : stage
    ));
  }, [setStages]);

  // Delete stage
  const deleteStage = useCallback((stageId) => {
    setStages(prev => prev.filter(stage => stage.id !== stageId));
  }, [setStages]);

  // Update stage payment
  const updateStagePayment = useCallback((stageId, paymentAmount) => {
    setStages(prev => prev.map(stage => {
      if (stage.id === stageId) {
        const newPaid = stage.paid + paymentAmount;
        const newStatus = newPaid >= stage.amount ? 'completed' : 
                         newPaid > 0 ? 'in-progress' : 'pending';
        
        return {
          ...stage,
          paid: newPaid,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return stage;
    }));
  }, [setStages]);

  // Get stage by ID
  const getStageById = useCallback((stageId) => {
    return stages.find(stage => stage.id === stageId);
  }, [stages]);

  // Reorder stages
  const reorderStages = useCallback((startIndex, endIndex) => {
    setStages(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, [setStages]);

  // Bulk update stages
  const bulkUpdateStages = useCallback((updates) => {
    setStages(prev => prev.map(stage => {
      const update = updates.find(u => u.id === stage.id);
      return update ? { ...stage, ...update, updatedAt: new Date().toISOString() } : stage;
    }));
  }, [setStages]);

  // Mark stage as completed
  const completeStage = useCallback((stageId) => {
    updateStage(stageId, { 
      status: 'completed',
      paid: getStageById(stageId)?.amount || 0
    });
  }, [updateStage, getStageById]);

  // Start stage
  const startStage = useCallback((stageId) => {
    updateStage(stageId, { 
      status: 'in-progress',
      date: new Date().toISOString().split('T')[0]
    });
  }, [updateStage]);

  // Export stages
  const exportStages = useCallback(() => {
    const data = {
      stages,
      stats: stageStats,
      metadata: {
        exportDate: new Date().toISOString(),
        totalStages: stages.length,
        version: '1.0'
      }
    };
    return JSON.stringify(data, null, 2);
  }, [stages, stageStats]);

  // Import stages
  const importStages = useCallback((data) => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.stages && Array.isArray(parsedData.stages)) {
        setStages(parsedData.stages);
        return { success: true, message: 'Stages imported successfully' };
      }
      return { success: false, message: 'Invalid stages data format' };
    } catch (error) {
      console.error('Error importing stages:', error);
      return { success: false, message: 'Failed to import stages' };
    }
  }, [setStages]);

  // Reset stages
  const resetStages = useCallback(() => {
    setStages(initialStages);
  }, [setStages, initialStages]);

  // Search stages
  const searchStages = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return stages.filter(stage => 
      stage.name.toLowerCase().includes(lowerQuery) ||
      (stage.notes && stage.notes.toLowerCase().includes(lowerQuery))
    );
  }, [stages]);

  return {
    // State
    stages,
    
    // Statistics
    stageStats,
    
    // Actions
    addStage,
    updateStage,
    deleteStage,
    updateStagePayment,
    completeStage,
    startStage,
    
    // Queries
    getStageById,
    searchStages,
    
    // Management
    reorderStages,
    bulkUpdateStages,
    exportStages,
    importStages,
    resetStages,
    
    // Reset
    removeStages
  };
};

export default useStages;