import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

const usePayments = (initialPayments = [], initialExpensePayments = []) => {
  const [payments, setPayments, removePayments] = useLocalStorage('construction-payments', initialPayments);
  const [expensePayments, setExpensePayments, removeExpensePayments] = useLocalStorage('expense-payments', initialExpensePayments);
  const [paymentIdCounter, setPaymentIdCounter] = useLocalStorage('payment-id-counter', 1000);

  // Get next payment ID
  const getNextPaymentId = useCallback(() => {
    const nextId = paymentIdCounter;
    setPaymentIdCounter(prev => prev + 1);
    return nextId;
  }, [paymentIdCounter, setPaymentIdCounter]);

  // Add payment
  const addPayment = useCallback((paymentData) => {
    const newPayment = {
      ...paymentData,
      id: getNextPaymentId(),
      date: paymentData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      status: 'completed'
    };

    if (paymentData.type === 'construction') {
      setPayments(prev => [...prev, newPayment]);
    } else {
      setExpensePayments(prev => [...prev, newPayment]);
    }

    return newPayment;
  }, [getNextPaymentId, setPayments, setExpensePayments]);

  // Update payment
  const updatePayment = useCallback((paymentId, updatedData, type = 'construction') => {
    const updateFn = type === 'construction' ? setPayments : setExpensePayments;
    
    updateFn(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, ...updatedData, updatedAt: new Date().toISOString() }
        : payment
    ));
  }, [setPayments, setExpensePayments]);

  // Delete payment
  const deletePayment = useCallback((paymentId, type = 'construction') => {
    const updateFn = type === 'construction' ? setPayments : setExpensePayments;
    
    updateFn(prev => prev.filter(payment => payment.id !== paymentId));
  }, [setPayments, setExpensePayments]);

  // Get payments by item
  const getPaymentsByItem = useCallback((itemId, type = 'construction') => {
    const paymentList = type === 'construction' ? payments : expensePayments;
    return paymentList
      .filter(payment => payment.itemId === itemId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [payments, expensePayments]);

  // Get total paid for item
  const getTotalPaidForItem = useCallback((itemId, type = 'construction') => {
    const itemPayments = getPaymentsByItem(itemId, type);
    return itemPayments.reduce((total, payment) => total + payment.amount, 0);
  }, [getPaymentsByItem]);

  // Payment statistics
  const paymentStats = useMemo(() => {
    const totalConstructionPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalExpensePayments = expensePayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPayments = totalConstructionPayments + totalExpensePayments;

    // Monthly breakdown
    const monthlyPayments = {};
    const allPayments = [...payments, ...expensePayments];
    
    allPayments.forEach(payment => {
      const month = payment.date.substring(0, 7); // YYYY-MM
      if (!monthlyPayments[month]) {
        monthlyPayments[month] = { construction: 0, expense: 0, total: 0 };
      }
      
      if (payment.type === 'construction') {
        monthlyPayments[month].construction += payment.amount;
      } else {
        monthlyPayments[month].expense += payment.amount;
      }
      monthlyPayments[month].total += payment.amount;
    });

    // Recent payments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPayments = allPayments
      .filter(payment => new Date(payment.date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      totalConstructionPayments,
      totalExpensePayments,
      totalPayments,
      monthlyPayments,
      recentPayments,
      totalPaymentCount: allPayments.length,
      averagePayment: allPayments.length > 0 ? totalPayments / allPayments.length : 0
    };
  }, [payments, expensePayments]);

  // Export payments
  const exportPayments = useCallback(() => {
    const data = {
      constructionPayments: payments,
      expensePayments: expensePayments,
      metadata: {
        exportDate: new Date().toISOString(),
        totalPayments: paymentStats.totalPayments,
        version: '1.0'
      }
    };
    return JSON.stringify(data, null, 2);
  }, [payments, expensePayments, paymentStats]);

  // Import payments
  const importPayments = useCallback((data) => {
    try {
      const parsedData = JSON.parse(data);
      
      if (parsedData.constructionPayments && Array.isArray(parsedData.constructionPayments)) {
        setPayments(parsedData.constructionPayments);
      }
      
      if (parsedData.expensePayments && Array.isArray(parsedData.expensePayments)) {
        setExpensePayments(parsedData.expensePayments);
      }
      
      return { success: true, message: 'Payments imported successfully' };
    } catch (error) {
      console.error('Error importing payments:', error);
      return { success: false, message: 'Failed to import payments' };
    }
  }, [setPayments, setExpensePayments]);

  // Clear all payments
  const clearAllPayments = useCallback(() => {
    setPayments([]);
    setExpensePayments([]);
  }, [setPayments, setExpensePayments]);

  // Generate payment report
  const generatePaymentReport = useCallback((startDate, endDate) => {
    const allPayments = [...payments, ...expensePayments];
    const filteredPayments = allPayments.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
    });

    const report = {
      period: { startDate, endDate },
      summary: {
        totalAmount: filteredPayments.reduce((sum, payment) => sum + payment.amount, 0),
        constructionAmount: filteredPayments
          .filter(p => p.type === 'construction')
          .reduce((sum, payment) => sum + payment.amount, 0),
        expenseAmount: filteredPayments
          .filter(p => p.type === 'expense')
          .reduce((sum, payment) => sum + payment.amount, 0),
        paymentCount: filteredPayments.length
      },
      payments: filteredPayments.sort((a, b) => new Date(b.date) - new Date(a.date))
    };

    return report;
  }, [payments, expensePayments]);

  return {
    // State
    payments,
    expensePayments,
    
    // Actions
    addPayment,
    updatePayment,
    deletePayment,
    
    // Queries
    getPaymentsByItem,
    getTotalPaidForItem,
    
    // Statistics
    paymentStats,
    
    // Management
    exportPayments,
    importPayments,
    clearAllPayments,
    generatePaymentReport,
    
    // Reset
    removePayments,
    removeExpensePayments
  };
};

export default usePayments;