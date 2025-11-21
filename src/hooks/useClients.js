import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

const useClients = (initialClients = []) => {
  const [clients, setClients, removeClients] = useLocalStorage('construction-clients', initialClients);

  // Client statistics
  const clientStats = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(client => client.status === 'Active').length;
    const completedClients = clients.filter(client => client.status === 'Completed').length;
    const planningClients = clients.filter(client => client.status === 'Planning').length;

    // Budget analysis
    const totalBudget = clients.reduce((sum, client) => {
      const budget = parseFloat(client.budget.replace(/[^\d.]/g, '')) || 0;
      return sum + budget;
    }, 0);

    // Project type distribution
    const projectTypes = clients.reduce((acc, client) => {
      if (!acc[client.projectType]) {
        acc[client.projectType] = 0;
      }
      acc[client.projectType]++;
      return acc;
    }, {});

    // Recent clients (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const recentClients = clients
      .filter(client => new Date(client.joinDate) >= ninetyDaysAgo)
      .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));

    return {
      totalClients,
      activeClients,
      completedClients,
      planningClients,
      totalBudget,
      projectTypes,
      recentClients,
      activePercentage: Math.round((activeClients / totalClients) * 100) || 0,
      completionRate: Math.round((completedClients / totalClients) * 100) || 0
    };
  }, [clients]);

  // Add client
  const addClient = useCallback((clientData) => {
    const newClient = {
      ...clientData,
      id: Date.now(),
      joinDate: clientData.joinDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setClients(prev => [...prev, newClient]);
    return newClient;
  }, [setClients]);

  // Update client
  const updateClient = useCallback((clientId, updatedData) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, ...updatedData, updatedAt: new Date().toISOString() }
        : client
    ));
  }, [setClients]);

  // Delete client
  const deleteClient = useCallback((clientId) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
  }, [setClients]);

  // Get client by ID
  const getClientById = useCallback((clientId) => {
    return clients.find(client => client.id === clientId);
  }, [clients]);

  // Search clients
  const searchClients = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(lowerQuery) ||
      client.email.toLowerCase().includes(lowerQuery) ||
      client.phone.includes(query) ||
      client.projectType.toLowerCase().includes(lowerQuery) ||
      client.address.toLowerCase().includes(lowerQuery)
    );
  }, [clients]);

  // Get clients by status
  const getClientsByStatus = useCallback((status) => {
    return clients.filter(client => client.status === status);
  }, [clients]);

  // Update client status
  const updateClientStatus = useCallback((clientId, newStatus) => {
    updateClient(clientId, { status: newStatus });
  }, [updateClient]);

  // Export clients
  const exportClients = useCallback(() => {
    const data = {
      clients,
      stats: clientStats,
      metadata: {
        exportDate: new Date().toISOString(),
        totalClients: clients.length,
        version: '1.0'
      }
    };
    return JSON.stringify(data, null, 2);
  }, [clients, clientStats]);

  // Import clients
  const importClients = useCallback((data) => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.clients && Array.isArray(parsedData.clients)) {
        setClients(parsedData.clients);
        return { success: true, message: 'Clients imported successfully' };
      }
      return { success: false, message: 'Invalid clients data format' };
    } catch (error) {
      console.error('Error importing clients:', error);
      return { success: false, message: 'Failed to import clients' };
    }
  }, [setClients]);

  // Reset clients
  const resetClients = useCallback(() => {
    setClients(initialClients);
  }, [setClients, initialClients]);

  // Get client contact information
  const getClientContact = useCallback((clientId) => {
    const client = getClientById(clientId);
    if (!client) return null;
    
    return {
      name: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address
    };
  }, [getClientById]);

  // Generate client report
  const generateClientReport = useCallback(() => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: clientStats,
      clients: clients.map(client => ({
        id: client.id,
        name: client.name,
        status: client.status,
        projectType: client.projectType,
        budget: client.budget,
        joinDate: client.joinDate,
        contact: {
          phone: client.phone,
          email: client.email
        }
      }))
    };

    return report;
  }, [clients, clientStats]);

  return {
    // State
    clients,
    
    // Statistics
    clientStats,
    
    // Actions
    addClient,
    updateClient,
    deleteClient,
    updateClientStatus,
    
    // Queries
    getClientById,
    searchClients,
    getClientsByStatus,
    getClientContact,
    
    // Management
    exportClients,
    importClients,
    resetClients,
    generateClientReport,
    
    // Reset
    removeClients
  };
};

export default useClients;