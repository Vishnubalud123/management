import React, { createContext, useContext, useState, useEffect } from 'react';

// Default data
const PROJECT_DATA = {
  projectName: "PGK Construction",
  engineer: "Er. P. Govindaraj",
  perSqftRate: 1650,
  totalSqft: 625,
  totalCost: 1031250,
  lastUpdated: "2023-10-15"
};

const INITIAL_STAGES = [
  { 
    id: "advance", 
    name: "Advance", 
    percentage: 20, 
    amount: 206250, 
    paid: 206250, 
    status: "completed", 
    date: "2023-09-01", 
    notes: "Initial payment received"
  },
  { 
    id: "basement", 
    name: "Basement", 
    percentage: 15, 
    amount: 154687, 
    paid: 50000, 
    status: "in-progress", 
    date: "2023-09-15", 
    notes: "Excavation completed, foundation work in progress"
  }
];

const INITIAL_EXPENSES = [
  { 
    id: 1, 
    name: "Borewell", 
    amount: 50000, 
    paid: 50000, 
    date: "2023-09-10", 
    category: "borewell", 
    status: "paid", 
    notes: "Completed successfully with good water flow"
  }
];

const CLIENTS_DATA = [
  {
    id: 1,
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    email: "rajesh@example.com",
    address: "123 Main Street, Chennai",
    projectType: "Residential House",
    budget: "₹25,00,000",
    status: "Active",
    joinDate: "2023-08-15"
  }
];

const ConstructionContext = createContext();

export const useConstruction = () => {
  const context = useContext(ConstructionContext);
  if (!context) {
    throw new Error('useConstruction must be used within a ConstructionProvider');
  }
  return context;
};

export const ConstructionProvider = ({ children }) => {
  const [projectData, setProjectData] = useState(PROJECT_DATA);
  const [stages, setStages] = useState(() => {
    const saved = localStorage.getItem('construction-stages');
    return saved ? JSON.parse(saved) : INITIAL_STAGES;
  });
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('construction-expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('construction-clients');
    return saved ? JSON.parse(saved) : CLIENTS_DATA;
  });
  const [payments, setPayments] = useState([]);
  const [expensePayments, setExpensePayments] = useState([]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('construction-stages', JSON.stringify(stages));
  }, [stages]);

  useEffect(() => {
    localStorage.setItem('construction-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('construction-clients', JSON.stringify(clients));
  }, [clients]);

  // Calculate derived data
  const totalConstructionCost = projectData.totalCost;
  const paidConstructionAmount = stages.reduce((sum, stage) => sum + stage.paid, 0);
  const balanceConstructionAmount = totalConstructionCost - paidConstructionAmount;
  
  const totalExpensesAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpensesAmount = expenses.reduce((sum, expense) => sum + expense.paid, 0);
  const balanceExpensesAmount = totalExpensesAmount - paidExpensesAmount;

  const overallProgress = stages.reduce((sum, stage) => {
    return stage.status === 'completed' ? sum + stage.percentage : sum;
  }, 0);

  // Stage management
  const addStage = (newStage) => {
    const stageWithId = {
      ...newStage,
      id: `stage-${Date.now()}`,
      paid: 0,
      status: 'pending'
    };
    setStages(prev => [...prev, stageWithId]);
    return stageWithId;
  };

  const updateStage = (stageId, updatedStage) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId ? { ...stage, ...updatedStage } : stage
    ));
  };

  const deleteStage = (stageId) => {
    setStages(prev => prev.filter(stage => stage.id !== stageId));
  };

  // Expense management
  const addExpense = (newExpense) => {
    const expenseWithId = {
      ...newExpense,
      id: Date.now(),
      paid: 0,
      status: 'pending'
    };
    setExpenses(prev => [...prev, expenseWithId]);
    return expenseWithId;
  };

  const updateExpense = (expenseId, updatedExpense) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === expenseId ? { ...expense, ...updatedExpense } : expense
    ));
  };

  const deleteExpense = (expenseId) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
  };

  // Payment management
  const addPayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    
    if (paymentData.type === 'construction') {
      setPayments(prev => [...prev, newPayment]);
      
      // Update stage payment status
      const stage = stages.find(s => s.id === paymentData.itemId);
      if (stage) {
        const newPaid = stage.paid + paymentData.amount;
        const newStatus = newPaid >= stage.amount ? 'completed' : 
                         newPaid > 0 ? 'in-progress' : 'pending';
        
        updateStage(paymentData.itemId, {
          paid: newPaid,
          status: newStatus
        });
      }
    } else {
      setExpensePayments(prev => [...prev, newPayment]);
      
      // Update expense payment status
      const expense = expenses.find(e => e.id === paymentData.itemId);
      if (expense) {
        const newPaid = expense.paid + paymentData.amount;
        const newStatus = newPaid >= expense.amount ? 'paid' : 'pending';
        
        updateExpense(paymentData.itemId, {
          paid: newPaid,
          status: newStatus
        });
      }
    }

    return newPayment;
  };

  // Get payments for an expense
  const getExpensePayments = (expenseId) => {
    return expensePayments.filter(payment => payment.itemId === expenseId);
  };

  // Delete payment
  const deletePayment = (paymentId, type = 'construction') => {
    if (type === 'construction') {
      setPayments(prev => prev.filter(payment => payment.id !== paymentId));
    } else {
      setExpensePayments(prev => prev.filter(payment => payment.id !== paymentId));
    }
  };

  // Client management
  const addClient = (newClient) => {
    const clientWithId = {
      ...newClient,
      id: Date.now(),
      joinDate: new Date().toISOString().split('T')[0]
    };
    setClients(prev => [...prev, clientWithId]);
    return clientWithId;
  };

  const updateClient = (clientId, updatedClient) => {
    setClients(prev => prev.map(client => 
      client.id === clientId ? { ...client, ...updatedClient } : client
    ));
  };

  const deleteClient = (clientId) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
  };

  const value = {
    // State
    projectData,
    stages,
    expenses,
    clients,
    payments,
    expensePayments,
    
    // Calculated values
    totalConstructionCost,
    paidConstructionAmount,
    balanceConstructionAmount,
    totalExpensesAmount,
    paidExpensesAmount,
    balanceExpensesAmount,
    overallProgress,
    
    // Stage functions
    addStage,
    updateStage,
    deleteStage,
    
    // Expense functions
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Payment functions
    addPayment,
    deletePayment,
    getExpensePayments,
    
    // Client functions
    addClient,
    updateClient,
    deleteClient
  };

  return (
    <ConstructionContext.Provider value={value}>
      {children}
    </ConstructionContext.Provider>
  );
};