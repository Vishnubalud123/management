import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

const useExpenses = (initialExpenses = []) => {
  const [expenses, setExpenses, removeExpenses] = useLocalStorage('construction-expenses', initialExpenses);

  // Expense statistics
  const expenseStats = useMemo(() => {
    const totalExpenses = expenses.length;
    const paidExpenses = expenses.filter(expense => expense.status === 'paid').length;
    const pendingExpenses = expenses.filter(expense => expense.status === 'pending').length;
    
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalPaid = expenses.reduce((sum, expense) => sum + expense.paid, 0);
    const totalBalance = totalAmount - totalPaid;
    
    // Category breakdown
    const categoryBreakdown = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { 
          total: 0, 
          paid: 0, 
          count: 0,
          balance: 0
        };
      }
      acc[expense.category].total += expense.amount;
      acc[expense.category].paid += expense.paid;
      acc[expense.category].count += 1;
      acc[expense.category].balance += (expense.amount - expense.paid);
      return acc;
    }, {});

    // Monthly expenses
    const monthlyExpenses = expenses.reduce((acc, expense) => {
      const month = expense.date.substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { total: 0, paid: 0, count: 0 };
      }
      acc[month].total += expense.amount;
      acc[month].paid += expense.paid;
      acc[month].count += 1;
      return acc;
    }, {});

    // Recent expenses (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentExpenses = expenses
      .filter(expense => new Date(expense.date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      totalExpenses,
      paidExpenses,
      pendingExpenses,
      totalAmount,
      totalPaid,
      totalBalance,
      categoryBreakdown,
      monthlyExpenses,
      recentExpenses,
      completionPercentage: Math.round((paidExpenses / totalExpenses) * 100) || 0,
      financialProgress: Math.round((totalPaid / totalAmount) * 100) || 0
    };
  }, [expenses]);

  // Add expense
  const addExpense = useCallback((expenseData) => {
    const newExpense = {
      ...expenseData,
      id: Date.now(),
      paid: expenseData.paid || 0,
      status: expenseData.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setExpenses(prev => [...prev, newExpense]);
    return newExpense;
  }, [setExpenses]);

  // Update expense
  const updateExpense = useCallback((expenseId, updatedData) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === expenseId 
        ? { ...expense, ...updatedData, updatedAt: new Date().toISOString() }
        : expense
    ));
  }, [setExpenses]);

  // Delete expense
  const deleteExpense = useCallback((expenseId) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
  }, [setExpenses]);

  // Update expense payment
  const updateExpensePayment = useCallback((expenseId, paymentAmount) => {
    setExpenses(prev => prev.map(expense => {
      if (expense.id === expenseId) {
        const newPaid = expense.paid + paymentAmount;
        const newStatus = newPaid >= expense.amount ? 'paid' : 'pending';
        
        return {
          ...expense,
          paid: newPaid,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return expense;
    }));
  }, [setExpenses]);

  // Get expense by ID
  const getExpenseById = useCallback((expenseId) => {
    return expenses.find(expense => expense.id === expenseId);
  }, [expenses]);

  // Get expenses by category
  const getExpensesByCategory = useCallback((category) => {
    return expenses.filter(expense => expense.category === category);
  }, [expenses]);

  // Get expenses by status
  const getExpensesByStatus = useCallback((status) => {
    return expenses.filter(expense => expense.status === status);
  }, [expenses]);

  // Search expenses
  const searchExpenses = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return expenses.filter(expense => 
      expense.name.toLowerCase().includes(lowerQuery) ||
      expense.category.toLowerCase().includes(lowerQuery) ||
      (expense.notes && expense.notes.toLowerCase().includes(lowerQuery))
    );
  }, [expenses]);

  // Mark expense as paid
  const markAsPaid = useCallback((expenseId) => {
    const expense = getExpenseById(expenseId);
    if (expense) {
      updateExpense(expenseId, { 
        status: 'paid',
        paid: expense.amount
      });
    }
  }, [getExpenseById, updateExpense]);

  // Export expenses
  const exportExpenses = useCallback(() => {
    const data = {
      expenses,
      stats: expenseStats,
      metadata: {
        exportDate: new Date().toISOString(),
        totalExpenses: expenses.length,
        version: '1.0'
      }
    };
    return JSON.stringify(data, null, 2);
  }, [expenses, expenseStats]);

  // Import expenses
  const importExpenses = useCallback((data) => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.expenses && Array.isArray(parsedData.expenses)) {
        setExpenses(parsedData.expenses);
        return { success: true, message: 'Expenses imported successfully' };
      }
      return { success: false, message: 'Invalid expenses data format' };
    } catch (error) {
      console.error('Error importing expenses:', error);
      return { success: false, message: 'Failed to import expenses' };
    }
  }, [setExpenses]);

  // Reset expenses
  const resetExpenses = useCallback(() => {
    setExpenses(initialExpenses);
  }, [setExpenses, initialExpenses]);

  // Get category statistics
  const getCategoryStats = useCallback(() => {
    return expenseStats.categoryBreakdown;
  }, [expenseStats.categoryBreakdown]);

  return {
    // State
    expenses,
    
    // Statistics
    expenseStats,
    
    // Actions
    addExpense,
    updateExpense,
    deleteExpense,
    updateExpensePayment,
    markAsPaid,
    
    // Queries
    getExpenseById,
    getExpensesByCategory,
    getExpensesByStatus,
    searchExpenses,
    getCategoryStats,
    
    // Management
    exportExpenses,
    importExpenses,
    resetExpenses,
    
    // Reset
    removeExpenses
  };
};

export default useExpenses;